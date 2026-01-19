/**
 * Leaderboard Route - หน้าอันดับนักเทรด
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3142-5972
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Back Arrow Icon URL จาก Figma (figma-alpha-api)
const BACK_ARROW_URL = 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/af4a1b51-259e-4794-a333-fdfbeed8d061';

// Leaderboard Data
const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: 'SniperX Master',
    profit: '+250,000',
    gradientColors: ['#ff5000', '#681212'],
  },
  {
    rank: 2,
    name: 'Mayuuuu',
    profit: '+200,000',
    gradientColors: ['#d61355', '#141414'],
  },
  {
    rank: 3,
    name: 'Trading Legend',
    profit: '+100,000',
    gradientColors: ['#3ff9be', '#999'],
  },
];

export default function Leaderboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Back Button - ตาม Figma: left-[27px] top-[51px] */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: BACK_ARROW_URL }} 
          style={styles.backArrow}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Title - ตาม Figma: center, top-[58px] */}
      <Text style={[styles.title, { top: scale(58) }]}>
        อันดับนักเทรดชั้นนำ
      </Text>

      {/* Leaderboard List - ตาม Figma: left-[27px] top-[103px] gap-[16px] */}
      <View style={[styles.leaderboardList, { top: scale(103) }]}>
        {LEADERBOARD_DATA.map((item, index) => (
          <View key={index} style={styles.leaderboardItem}>
            <Text style={styles.rankName}>
              {item.rank} {item.name}
            </Text>
            <View style={styles.profitContainer}>
              <View style={styles.profitGradient}>
                <LinearGradient
                  colors={item.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.profitText}>
                  {item.profit}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  backArrow: {
    width: scale(12),
    height: scale(6.5),
  },

  title: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(135)) / 2, // Center
    fontFamily: 'Prompt-Regular',
    fontSize: scale(16),
    color: '#FFFFFF',
    textAlign: 'center',
    zIndex: 1,
  },

  leaderboardList: {
    position: 'absolute',
    left: scale(27),
    width: scale(321),
    flexDirection: 'column',
    gap: scale(16),
    zIndex: 1,
  },

  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  rankName: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    flex: 1,
    lineHeight: scale(14.4),
  },

  profitContainer: {
    minWidth: scale(88),
    height: scale(30),
    borderRadius: scale(999),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0)',
  },

  profitGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: 0,
    overflow: 'hidden',
    minHeight: scale(30),
  },

  profitText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: scale(14.4),
    zIndex: 1,
  },
});
