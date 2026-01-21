/**
 * Index Route - หน้า xon (Home)
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3015-7051
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BottomNavigation } from '../components/shared/BottomNavigation';
import { ModeSwitchButton } from '../components/shared/ModeSwitchButton';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Icon URLs จาก Figma (node-id=3015-7051) - Latest from figma-alpha-api
const ICON_URLS = {
  menu: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1f05172f-fbdb-477c-80fb-0460891bcfd6', // เมนู (3021:7073)
};

// Profile Images จาก Figma - Latest from design context
const PROFILE_IMAGES = {
  first: 'https://www.figma.com/api/mcp/asset/304c473d-d020-416f-b061-48d237efd89d',
  second: 'https://www.figma.com/api/mcp/asset/a1ac333f-7cca-434a-940f-e6ace81064fc',
  third: 'https://www.figma.com/api/mcp/asset/49dd7269-d359-480a-b20e-6197431b0a75',
  mask: 'https://www.figma.com/api/mcp/asset/3f522239-8340-4aad-a492-38465e62a811',
};

// Leaderboard Data
const LEADERBOARD_DATA = [
  { rank: 1, name: 'SniperX', profit: '฿ +250,000', image: PROFILE_IMAGES.first },
  { rank: 2, name: 'Mayuuuu', profit: '฿ +200,000', image: PROFILE_IMAGES.second },
  { rank: 3, name: 'Trading Legend', profit: '฿ +190,000', image: PROFILE_IMAGES.third },
];

// Lazy load image component with placeholder
const LazyImage = ({ uri, style, resizeMode = 'cover' }: { uri: string; style: any; resizeMode?: 'cover' | 'contain' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Preload image
    Image.prefetch(uri)
      .then(() => setImageLoaded(true))
      .catch(() => setImageError(true));
  }, [uri]);

  if (imageError) {
    return (
      <View style={[style, { backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFFFFF', fontSize: 10 }}>?</Text>
      </View>
    );
  }

  if (!imageLoaded) {
    return <View style={[style, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />;
  }

  return <Image source={{ uri }} style={style} resizeMode={resizeMode} />;
};

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Header - ตาม Figma: left-[27px] top-[51px] w-[321px] items-end justify-between */}
      <View style={[styles.header, { top: scale(51) }]}>
        <TouchableOpacity 
          style={styles.menuButton} 
          activeOpacity={0.7}
          onPress={() => router.push('/menu')}
        >
          <LazyImage 
            uri={ICON_URLS.menu} 
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.themeToggle} activeOpacity={0.7}>
          <Text style={styles.themeToggleText}>Light</Text>
        </TouchableOpacity>
      </View>

      {/* Main Headline - ตาม Figma: top-[120px] center with gradient */}
      <View style={styles.headlineContainer}>
        <Text style={styles.headline}>
          ค้นพบนวัตกรรมใหม่{'\n'}ของการลงทุน
        </Text>
      </View>

      {/* Leaderboard Card - ตาม Figma: top-[221px] center w-[307px] h-[236px] */}
      <View style={styles.leaderboardCard}>
        <Text style={styles.leaderboardTitle}>จัดอันดับนักเก็งกำไร</Text>
        
        {/* First Place */}
        <Text style={[styles.rankNumber, { top: scale(50) }]}>1</Text>
        <View style={[styles.profileImageContainer, { top: scale(44), left: scale(30) }]}>
          <LazyImage 
            uri={PROFILE_IMAGES.first} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
        <Text style={[styles.userName, { top: scale(50) }]}>SniperX</Text>
        <Text style={[styles.profit, { top: scale(50), left: scale(219) }]}>฿ +250,000</Text>

        {/* Second Place */}
        <Text style={[styles.rankNumber, { top: scale(94) }]}>2</Text>
        <View style={[styles.profileImageContainer, { top: scale(88), left: scale(30) }]}>
          <LazyImage 
            uri={PROFILE_IMAGES.second} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
        <Text style={[styles.userName, { top: scale(94) }]}>Mayuuuu</Text>
        <Text style={[styles.profit, { top: scale(94), left: scale(219) }]}>฿ +200,000</Text>

        {/* Third Place */}
        <Text style={[styles.rankNumber, { top: scale(138) }]}>3</Text>
        <View style={[styles.profileImageContainer, { top: scale(132), left: scale(30) }]}>
          <LazyImage 
            uri={PROFILE_IMAGES.third} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
        <Text style={[styles.userName, { top: scale(138) }]}>Trading Legend</Text>
        <Text style={[styles.profit, { top: scale(138), left: scale(218) }]}>฿ +190,000</Text>

        {/* View Ranking Button - top-[182px] left-[103px] */}
        <TouchableOpacity 
          style={styles.viewRankingButton} 
          activeOpacity={0.7}
          onPress={() => router.push('/leaderboard')}
        >
          <Text style={styles.viewRankingText} numberOfLines={1}>ดูอันดับของคุณ</Text>
        </TouchableOpacity>
      </View>

      {/* Auth Buttons - ตาม Figma: center, top-[646px] gap-[15px] */}
      <View style={styles.authButtonsContainer}>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => router.push('/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.authButtonText} numberOfLines={1}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.authButton}
          activeOpacity={0.7}
        >
          <Text style={styles.authButtonText} numberOfLines={1}>ลงทะเบียน</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Mode Switch Button - Sci-fi Warp Animation */}
      <ModeSwitchButton position="top-right" size="medium" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },

  header: {
    position: 'absolute',
    left: scale(27),
    width: scale(321),
    height: scale(27),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 100,
  },

  menuButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  menuIcon: {
    width: scale(24),
    height: scale(24),
  },

  spacer: {
    flex: 1,
  },

  themeToggle: {
    backgroundColor: 'rgba(0,0,0,0)',
    paddingHorizontal: scale(10),
    paddingVertical: 0,
    borderRadius: scale(40),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    width: scale(62),
    height: scale(27),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: scale(27),
  },

  themeToggleText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(12),
    color: '#FFFFFF',
    lineHeight: scale(14.4),
    textAlign: 'center',
  },

  headlineContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(251)) / 2, // Center
    top: scale(120),
    width: scale(251),
    height: scale(84),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    overflow: 'hidden',
  },

  headline: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(28),
    textAlign: 'center',
    lineHeight: scale(33.6), // 28 * 1.2
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  leaderboardCard: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(307)) / 2, // Center
    top: scale(221),
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    width: scale(307),
    height: scale(236),
    zIndex: 1,
  },

  leaderboardTitle: {
    position: 'absolute',
    left: scale(22),
    top: scale(12),
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
  },

  rankNumber: {
    position: 'absolute',
    left: scale(12),
    fontFamily: 'Prompt-SemiBold',
    fontSize: scale(12),
    color: '#FFFFFF',
  },

  profileImageContainer: {
    position: 'absolute',
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  userName: {
    position: 'absolute',
    left: scale(75),
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
  },

  profit: {
    position: 'absolute',
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
  },

  viewRankingButton: {
    position: 'absolute',
    left: scale(90),
    top: scale(182),
    width: scale(127),
    height: scale(28),
    backgroundColor: 'transparent',
    paddingHorizontal: scale(8),
    paddingVertical: scale(6),
    borderRadius: scale(9999),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    overflow: 'visible',
    elevation: 0,
    shadowOpacity: 0,
  },

  viewRankingText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: scale(16),
    includeFontPadding: false,
    flexShrink: 0,
  },

  authButtonsContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(235)) / 2, // Center
    top: scale(646),
    width: scale(235),
    height: scale(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(15),
    zIndex: 1,
  },

  authButton: {
    backgroundColor: 'rgba(0,0,0,0)',
    paddingHorizontal: scale(24),
    paddingVertical: scale(8),
    borderRadius: scale(9999),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: scale(110),
    height: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  authButtonText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(16),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: scale(20),
    includeFontPadding: false,
  },
});
