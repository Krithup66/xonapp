/**
 * Select Account Route - หน้าเลือกบัญชี
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3036-7386
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Icon URLs จาก Figma (figma-alpha-api)
const ICON_URLS = {
  backButton: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8bde2a69-9bef-4d70-9016-b493e500d331', // 3036:7387
  dividerLine: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b2885c6c-fa42-4ce9-8810-5cc25539bc48', // 3036:7391
};

export default function SelectAccount() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Back Button - ตาม Figma: left-[27px] top-[51px] size-[30px] */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: ICON_URLS.backButton }} 
          style={styles.backButtonIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Title - ตาม Figma: center, top-[56px] */}
      <Text style={styles.title}>เลือกบัญชี</Text>

      {/* Divider Line 1 - ตาม Figma: top-[107px] */}
      <View style={[styles.dividerContainer, { top: scale(107) }]}>
        <Image 
          source={{ uri: ICON_URLS.dividerLine }} 
          style={styles.dividerLine}
          resizeMode="stretch"
        />
      </View>

      {/* Phone Option - ตาม Figma: left-[92.5px] top-[126px] translate-x-[-50%] */}
      <TouchableOpacity 
        style={[styles.accountOption, { top: scale(126), left: scale(92.5) }]}
        activeOpacity={0.7}
        onPress={() => {
          // Navigate to phone login or continue with phone
          router.push('/login?method=phone');
        }}
      >
        <Text style={styles.accountText}>+66 เบอร์ที่ลงทะเบียน</Text>
      </TouchableOpacity>

      {/* Divider Line 2 - ตาม Figma: top-[162px] */}
      <View style={[styles.dividerContainer, { top: scale(162) }]}>
        <Image 
          source={{ uri: ICON_URLS.dividerLine }} 
          style={styles.dividerLine}
          resizeMode="stretch"
        />
      </View>

      {/* Email Option - ตาม Figma: left-[81px] top-[181px] translate-x-[-50%] */}
      <TouchableOpacity 
        style={[styles.accountOption, { top: scale(181), left: scale(81) }]}
        activeOpacity={0.7}
        onPress={() => {
          // Navigate to email login or continue with email
          router.push('/login?method=email');
        }}
      >
        <Text style={styles.accountText}>อีเมลที่ลงทะเบียน</Text>
      </TouchableOpacity>

      {/* Divider Line 3 - ตาม Figma: top-[217px] */}
      <View style={[styles.dividerContainer, { top: scale(217) }]}>
        <Image 
          source={{ uri: ICON_URLS.dividerLine }} 
          style={styles.dividerLine}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  backButton: {
    position: 'absolute',
    left: scale(27),
    top: scale(51),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  backButtonIcon: {
    width: scale(30),
    height: scale(30),
  },

  title: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(94)) / 2, // Center
    top: scale(56),
    fontFamily: 'Prompt-Bold',
    fontSize: scale(16),
    color: '#FFFFFF',
    textAlign: 'center',
    zIndex: 1,
  },

  dividerContainer: {
    position: 'absolute',
    left: 0,
    width: SCREEN_WIDTH,
    height: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  dividerLine: {
    width: SCREEN_WIDTH,
    height: 1,
  },

  accountOption: {
    position: 'absolute',
    alignItems: 'center',
    paddingVertical: scale(10),
    zIndex: 1,
  },

  accountText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
