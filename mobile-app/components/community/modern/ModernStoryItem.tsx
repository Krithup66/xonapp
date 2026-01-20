/**
 * Modern Story Item Component
 * ออกแบบทันสมัยด้วย glassmorphism และ gradient effects
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Story } from '../../../types/community.types';
import { MODERN_COLORS, MODERN_SIZES, MODERN_EFFECTS } from '../../../config/modern-community.config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface ModernStoryItemProps {
  story: Story;
  onPress: () => void;
  index: number;
}

export const ModernStoryItem: React.FC<ModernStoryItemProps> = ({ story, onPress, index }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Gradient Border */}
      <LinearGradient
        colors={story.hasNewStory ? [...MODERN_COLORS.primaryGradient] : ['#2A2A3A', '#1A1A24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.storyInner}>
          {story.user.avatar ? (
            <Image
              source={{ uri: story.user.avatar }}
              style={styles.storyImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {story.user.name?.charAt(0) || '?'}
              </Text>
            </View>
          )}
          
          {/* Glow effect for new stories */}
          {story.hasNewStory && (
            <View style={styles.glowOverlay} />
          )}
        </View>
      </LinearGradient>
      
      {/* New Story Indicator */}
      {story.hasNewStory && (
        <View style={styles.newBadge}>
          <View style={styles.newDot} />
        </View>
      )}
      
      {/* User Name */}
      <Text style={styles.userName} numberOfLines={1}>
        {story.user.name || 'User'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: MODERN_SIZES.storySize + scale(16),
    marginRight: MODERN_SIZES.spacingMD,
  },
  gradientBorder: {
    width: MODERN_SIZES.storySize,
    height: MODERN_SIZES.storySize,
    borderRadius: MODERN_SIZES.radiusFull,
    padding: MODERN_SIZES.storyBorderWidth,
    marginBottom: scale(8),
    ...MODERN_EFFECTS.glowSM,
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: MODERN_SIZES.radiusFull,
    overflow: 'hidden',
    backgroundColor: MODERN_COLORS.backgroundSecondary,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MODERN_COLORS.backgroundTertiary,
  },
  placeholderText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(24),
    color: MODERN_COLORS.textPrimary,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: MODERN_SIZES.radiusFull,
    backgroundColor: MODERN_COLORS.glowColor,
    opacity: 0.2,
  },
  newBadge: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: MODERN_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...MODERN_EFFECTS.shadowSM,
  },
  newDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: MODERN_COLORS.interactive,
    ...MODERN_EFFECTS.glowSM,
  },
  userName: {
    fontFamily: 'Prompt-Medium',
    fontSize: scale(11),
    color: MODERN_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: scale(4),
    maxWidth: MODERN_SIZES.storySize + scale(16),
  },
});
