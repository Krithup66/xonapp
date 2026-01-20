/**
 * Post Detail Screen
 * หน้าจอรายละเอียดโพสต์ พร้อม Pull-to-Dismiss
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, PanResponder } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import { hapticImpact } from '../../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          
          // Fade out as user pulls down
          const progress = Math.min(gestureState.dy / SCREEN_HEIGHT, 1);
          opacity.setValue(1 - progress);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const shouldDismiss = gestureState.dy > SCREEN_HEIGHT * 0.3 || gestureState.vy > 0.5;
        
        if (shouldDismiss) {
          hapticImpact('light');
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            router.back();
          });
        } else {
          // Spring back
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          transform: [{ translateY }],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>โพสต์ #{params.id || '1'}</Text>
        <Text style={styles.hintText}>ปัดลงเพื่อปิด</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image Area */}
        <View style={styles.heroImage}>
          <Text style={styles.heroIcon}>🚀</Text>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>กลยุทธ์ AI Trading Bot</Text>
          <Text style={styles.postText}>
            สัมผัสประสบการณ์การอ่านที่ลื่นไหล พร้อมระบบโต้ตอบอัจฉริยะ{'\n\n'}
            เรียนรู้เทคนิคการเทรดด้วย AI Bot ที่มีประสิทธิภาพสูงสุด
            และสามารถปรับแต่งได้ตามสไตล์การลงทุนของคุณ{'\n\n'}
            เริ่มต้นการเทรดอัตโนมัติด้วยปัญญาประดิษฐ์ที่ช่วยให้คุณ
            วิเคราะห์ตลาดและตัดสินใจได้อย่างรวดเร็วและแม่นยำ
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F111A',
  },
  header: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(24),
    color: '#FFFFFF',
    marginBottom: scale(4),
  },
  hintText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(12),
    color: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: scale(300),
    backgroundColor: '#3F51B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: scaleFont(100),
  },
  postContent: {
    padding: scale(20),
  },
  postTitle: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(28),
    color: '#FFFFFF',
    marginBottom: scale(16),
  },
  postText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(18),
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: scaleFont(28),
  },
});
