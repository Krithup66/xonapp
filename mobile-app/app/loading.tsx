/**
 * Loading Screen - หน้าโหลดดิ้ง
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3010-7062
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Logo URL จาก Figma (node-id=3010-7064)
const LOGO_URL = 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f301b36b-4856-4238-a1fa-a4f1612d3191';

export default function LoadingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('กำลังโหลด...');

  useEffect(() => {
    // จำลองการโหลด
    const loadingSteps = [
      { progress: 20, status: 'กำลังโหลดข้อมูล...' },
      { progress: 40, status: 'กำลังเตรียมระบบ...' },
      { progress: 60, status: 'กำลังอัพโหลดข้อมูล...' },
      { progress: 80, status: 'กำลังตรวจสอบข้อมูล...' },
      { progress: 100, status: 'พร้อมใช้งาน' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingProgress(step.progress);
        setLoadingStatus(step.status);
        currentStep++;
      } else {
        clearInterval(interval);
        // หลังจากโหลดเสร็จ ให้ redirect ไปหน้า index
        setTimeout(() => {
          router.replace('/');
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      
      {/* Logo Container - กลางจอ */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <SvgUri 
            uri={LOGO_URL} 
            width={scale(169)} 
            height={scale(63)} 
          />
        </View>
      </View>

      {/* Loading Indicator - ด้านล่าง */}
      <View style={styles.loadingContainer}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${loadingProgress}%` }]} />
        </View>

        {/* Loading Status Text */}
        <Text style={styles.loadingStatus}>{loadingStatus}</Text>

        {/* Progress Percentage */}
        <Text style={styles.progressText}>{loadingProgress}%</Text>

        {/* Activity Indicator */}
        <ActivityIndicator 
          size="small" 
          color="#FFFFFF" 
          style={styles.activityIndicator}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  logoWrapper: {
    width: scale(169),
    height: scale(63),
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContainer: {
    position: 'absolute',
    bottom: scale(60),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },

  progressBarContainer: {
    width: '100%',
    maxWidth: scale(335),
    height: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(2),
    overflow: 'hidden',
    marginBottom: scale(12),
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(2),
  },

  loadingStatus: {
    fontSize: scale(14),
    fontFamily: 'Prompt-Regular',
    color: '#FFFFFF',
    marginBottom: scale(8),
    textAlign: 'center',
  },

  progressText: {
    fontSize: scale(12),
    fontFamily: 'Prompt-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: scale(12),
  },

  activityIndicator: {
    marginTop: scale(8),
  },
});
