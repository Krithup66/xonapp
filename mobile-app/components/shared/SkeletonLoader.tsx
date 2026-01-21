/**
 * Skeleton Loader Component
 * ใช้สำหรับแสดง loading state ตามกฎ Lazy Loading ใน .cursorrules
 */

import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

/**
 * Shimmer Animation Component
 */
export const Shimmer = ({ width, height, borderRadius = 0, style }: SkeletonLoaderProps) => {
  const shimmerAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: typeof width === 'number' ? scale(width) : width || '100%',
          height: height ? scale(height) : scale(20),
          borderRadius: borderRadius ? scale(borderRadius) : 0,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Finance Screen Skeleton
 */
export const FinanceSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Shimmer width={45} height={45} borderRadius={22.5} />
          <View style={styles.headerTopRight}>
            <Shimmer width={16} height={16} borderRadius={8} />
            <Shimmer width={16} height={16} borderRadius={8} />
          </View>
        </View>
        <Shimmer width={200} height={24} style={styles.balanceSkeleton} />
        <View style={styles.quickActions}>
          <Shimmer width={60} height={50} borderRadius={25} />
          <Shimmer width={60} height={50} borderRadius={25} />
        </View>
      </View>

      {/* Content Skeleton */}
      <View style={styles.content}>
        {/* Services Grid Skeleton */}
        <View style={styles.servicesRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.serviceItem}>
              <Shimmer width={50} height={50} borderRadius={25} />
              <Shimmer width={40} height={12} style={styles.serviceLabel} />
            </View>
          ))}
        </View>
        <View style={styles.servicesRow}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.serviceItem}>
              <Shimmer width={50} height={50} borderRadius={25} />
              <Shimmer width={40} height={12} style={styles.serviceLabel} />
            </View>
          ))}
        </View>

        {/* Assets Skeleton */}
        <View style={styles.assetsContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.assetCard}>
              <View style={styles.assetLeft}>
                <Shimmer width={40} height={40} borderRadius={20} />
                <View style={styles.assetInfo}>
                  <Shimmer width={120} height={12} style={styles.assetName} />
                  <Shimmer width={80} height={12} />
                </View>
              </View>
              <View style={styles.assetRight}>
                <Shimmer width={80} height={14} style={styles.assetValue} />
                <Shimmer width={60} height={12} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Trade Screen Skeleton
 */
export const TradeSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.tradeHeader}>
        <Shimmer width={100} height={16} style={styles.balanceLabel} />
        <Shimmer width={200} height={23} style={styles.balanceAmount} />
        <Shimmer width={120} height={12} />
      </View>

      {/* Tabs Skeleton */}
      <View style={styles.tabsContainer}>
        <Shimmer width={80} height={30} borderRadius={15} />
        <Shimmer width={80} height={30} borderRadius={15} />
        <View style={styles.tabsIcons}>
          <Shimmer width={40} height={40} borderRadius={20} />
          <Shimmer width={40} height={40} borderRadius={20} />
        </View>
      </View>

      {/* Trading Cards Skeleton */}
      <View style={styles.cardsContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.tradingCard}>
            <Shimmer width="100%" height={200} borderRadius={20} />
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * Community Screen Skeleton
 */
export const CommunitySkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.communityHeader}>
        <Shimmer width={100} height={28} />
        <View style={styles.feedTabs}>
          <Shimmer width={80} height={32} borderRadius={16} />
          <Shimmer width={80} height={32} borderRadius={16} />
        </View>
      </View>

      {/* Threads Skeleton */}
      <View style={styles.threadsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.threadCard}>
            <View style={styles.threadHeader}>
              <Shimmer width={40} height={40} borderRadius={20} />
              <View style={styles.threadInfo}>
                <Shimmer width={100} height={14} />
                <Shimmer width={60} height={12} style={styles.threadMeta} />
              </View>
            </View>
            <Shimmer width="100%" height={60} style={styles.threadContent} />
            <View style={styles.threadActions}>
              <Shimmer width={60} height={16} />
              <Shimmer width={60} height={16} />
              <Shimmer width={60} height={16} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  // Finance Skeleton Styles
  header: {
    paddingHorizontal: scale(27),
    paddingTop: scale(50),
    paddingBottom: scale(20),
    backgroundColor: '#000000',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(30),
  },
  headerTopRight: {
    flexDirection: 'row',
    gap: scale(6),
  },
  balanceSkeleton: {
    marginBottom: scale(20),
    alignSelf: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(16),
  },
  content: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    paddingTop: scale(15),
    paddingHorizontal: scale(21),
  },
  servicesRow: {
    flexDirection: 'row',
    marginBottom: scale(15),
    gap: scale(8),
  },
  serviceItem: {
    alignItems: 'center',
    gap: scale(3),
  },
  serviceLabel: {
    marginTop: scale(3),
  },
  assetsContainer: {
    marginTop: scale(20),
  },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: scale(20),
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    marginBottom: scale(3),
    minHeight: scale(67),
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assetInfo: {
    marginLeft: scale(12),
    gap: scale(2),
  },
  assetName: {
    marginBottom: scale(2),
  },
  assetRight: {
    alignItems: 'flex-end',
    gap: scale(2),
  },
  assetValue: {
    marginBottom: scale(2),
  },
  // Trade Skeleton Styles
  tradeHeader: {
    paddingHorizontal: scale(26),
    paddingTop: scale(50),
    paddingBottom: scale(10),
    gap: scale(8),
  },
  balanceLabel: {
    marginBottom: scale(8),
  },
  balanceAmount: {
    marginBottom: scale(8),
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(26),
    marginBottom: scale(10),
    gap: scale(8),
    alignItems: 'center',
  },
  tabsIcons: {
    flexDirection: 'row',
    gap: scale(12),
    marginLeft: 'auto',
  },
  cardsContainer: {
    paddingHorizontal: scale(20),
    paddingTop: scale(24),
    gap: scale(8),
  },
  tradingCard: {
    marginBottom: scale(8),
  },
  // Community Skeleton Styles
  communityHeader: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    gap: scale(12),
  },
  feedTabs: {
    flexDirection: 'row',
    gap: scale(8),
  },
  threadsContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    gap: scale(16),
  },
  threadCard: {
    paddingVertical: scale(12),
    gap: scale(12),
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  threadInfo: {
    gap: scale(4),
  },
  threadMeta: {
    marginTop: scale(4),
  },
  threadContent: {
    marginTop: scale(8),
  },
  threadActions: {
    flexDirection: 'row',
    gap: scale(16),
    marginTop: scale(8),
  },
});
