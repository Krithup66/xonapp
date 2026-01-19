/**
 * Menu Route - หน้าเมนู (Welcome)
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3036-7030
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
  backButton: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0cc1d913-e5f7-4cf6-916f-05bf3d62bdac',
  logo: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fbad67d1-9ed2-4765-9f0f-6e3f849ca51a',
  aboutUs: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7f55517f-b7dc-4fd7-82aa-829e99c8eb57',
  community: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ba18cd59-3c19-4f14-b42e-19c2e7efd20a',
  helpCenter: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1df4d364-32b0-4dd0-92b3-5df69750e8d4',
  settings: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b89394a3-3b84-4514-8acb-4443702978e3',
};

export default function Menu() {
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

      {/* Welcome Container - ตาม Figma: left-[41px] top-[103px] w-[183px] */}
      <View style={styles.welcomeContainer}>
        {/* Welcome Text Container */}
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>ยินดีต้อนรับสู่</Text>
          <Image 
            source={{ uri: ICON_URLS.logo }} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {/* Description Text */}
        <Text style={styles.descriptionText}>
          สัมผัสประสบการณ์การบริหารการเงิน{'\n'}รูปแบบใหม่ที่รวดเร็วทันใจ
        </Text>
      </View>

      {/* Top Bar Container - ตาม Figma: center, top-[197px] */}
      <View style={styles.topBarContainer}>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.authButtonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton}>
          <Text style={styles.authButtonText}>ลงทะเบียน</Text>
        </TouchableOpacity>
      </View>

      {/* Icon and Text - ตาม Figma: left-[41px] top-[258px] */}
      <View style={styles.iconTextContainer}>
        {/* Community */}
        <View style={styles.iconTextItem}>
          <Image 
            source={{ uri: ICON_URLS.community }} 
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.iconText}>คอมมูนิตี้</Text>
        </View>
        {/* Help Center */}
        <View style={styles.iconTextItem}>
          <Image 
            source={{ uri: ICON_URLS.helpCenter }} 
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.iconText}>ศูนย์ช่วยเหลือ</Text>
        </View>
        {/* Settings */}
        <View style={styles.iconTextItem}>
          <Image 
            source={{ uri: ICON_URLS.settings }} 
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.iconText}>การตั้งค่าระบบ</Text>
        </View>
      </View>

      {/* Footer - ตาม Figma: left-[27px] top-[765px] w-[325px] */}
      <View style={styles.footer}>
        {/* About Us */}
        <View style={styles.footerItem}>
          <Image 
            source={{ uri: ICON_URLS.aboutUs }} 
            style={styles.footerIcon}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>เกี่ยวกับเรา</Text>
        </View>
        {/* Update App */}
        <View style={styles.footerItem}>
          <View style={styles.updateIcon} />
          <Text style={styles.footerText}>Update the app</Text>
        </View>
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

  welcomeContainer: {
    position: 'absolute',
    left: scale(41),
    top: scale(103),
    width: scale(183),
    flexDirection: 'column',
    gap: scale(10),
  },

  welcomeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },

  welcomeText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(16),
    color: '#FFFFFF',
  },

  logo: {
    width: scale(74),
    height: scale(26),
  },

  descriptionText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: 'rgba(255,255,255,0.5)',
    lineHeight: scale(18),
  },

  topBarContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(235)) / 2, // Center
    top: scale(197),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(15),
  },

  authButton: {
    backgroundColor: 'rgba(0,0,0,0)',
    paddingHorizontal: scale(24),
    paddingVertical: 0,
    borderRadius: scale(9999),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: scale(110),
    height: scale(35),
    minHeight: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
  },

  authButtonText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(16),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: scale(20),
    includeFontPadding: false,
  },

  iconTextContainer: {
    position: 'absolute',
    left: scale(41),
    top: scale(258),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(25),
  },

  iconTextItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: scale(4),
    width: scale(73),
  },

  icon: {
    width: scale(24),
    height: scale(24),
  },

  iconText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    textAlign: 'center',
  },

  footer: {
    position: 'absolute',
    left: scale(27),
    top: scale(765),
    width: scale(325),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },

  footerIcon: {
    width: scale(20),
    height: scale(20),
  },

  updateIcon: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#c5ff06',
    shadowColor: '#c4ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: scale(10),
    elevation: 10,
  },

  footerText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
