/**
 * Swipeable Feed Card Component
 * รองรับ Swipe-to-Dismiss และ Hero Animation
 * พร้อม Haptic Feedback
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import { FeedCard } from './FeedCard';
import { hapticImpact } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface SwipeableFeedCardProps {
  index: number;
  title: string;
  author: string;
  color: string;
  onDelete: () => void;
  onPress: () => void;
}

export const SwipeableFeedCard: React.FC<SwipeableFeedCardProps> = ({
  index,
  title,
  author,
  color,
  onDelete,
  onPress,
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;
  const [isDismissing, setIsDismissing] = React.useState(false);
  const [isSwiping, setIsSwiping] = React.useState(false);

  // Haptic feedback states
  const hapticTriggered = React.useRef(false);
  const heavyHapticTriggered = React.useRef(false);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only allow swipe from right to left (negative dx)
        if (gestureState.dx < 0) {
          setIsSwiping(true);
          translateX.setValue(gestureState.dx);
          
          // Calculate progress (0 to 1)
          const progress = Math.abs(gestureState.dx) / scale(100);
          
          // Light haptic when starting to swipe
          if (progress > 0.1 && progress < 0.12 && !hapticTriggered.current) {
            hapticImpact('light');
            hapticTriggered.current = true;
          }
          
          // Heavy haptic when reaching dismiss threshold
          if (progress > 0.7 && !heavyHapticTriggered.current) {
            hapticImpact('heavy');
            heavyHapticTriggered.current = true;
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const shouldDismiss = Math.abs(gestureState.dx) > scale(80);
        
        if (shouldDismiss) {
          setIsDismissing(true);
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDelete();
          });
        } else {
          // Spring back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start(() => {
            setIsSwiping(false);
          });
        }
        
        // Reset haptic flags
        hapticTriggered.current = false;
        heavyHapticTriggered.current = false;
        if (!shouldDismiss) {
          setIsSwiping(false);
        }
      },
    })
  ).current;

  if (isDismissing) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Delete Background */}
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </View>

      {/* Swipeable Card */}
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [{ translateX }],
            opacity,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // Only trigger if not swiping
            if (!isSwiping) {
              hapticImpact('medium');
              onPress();
            }
          }}
          style={styles.cardTouchable}
          disabled={isSwiping}
        >
          <FeedCard title={title} author={author} color={color} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: scaleWidth(20),
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: scaleWidth(100),
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(20),
  },
  deleteIcon: {
    fontSize: scaleFont(30),
  },
  cardWrapper: {
    backgroundColor: 'transparent',
  },
  cardTouchable: {
    width: '100%',
  },
});
