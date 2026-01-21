/**
 * Thinking Indicator Component
 * แสดงสถานะเมื่อ AI กำลังคิด
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface ThinkingIndicatorProps {
  visible: boolean;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ visible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot1, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot2, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot3, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.parallel([
              Animated.timing(dot1, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(dot2, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(dot3, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ])
        ),
      ]).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const dot1Opacity = dot1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const dot2Opacity = dot2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const dot3Opacity = dot3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>กำลังคิด...</Text>
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    alignSelf: 'flex-start',
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: scale(8),
  },
  dots: {
    flexDirection: 'row',
    gap: scale(4),
  },
  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#3B82F6',
  },
});
