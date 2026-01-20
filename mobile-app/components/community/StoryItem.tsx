/**
 * Story Item Component
 * แสดงสตอรี่ของ user ที่ติดตาม
 * สตอรี่ = โพสต์ล่าสุดของ user
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Story } from '../../types/community.types';
import { COMMUNITY_COLORS, COMMUNITY_SIZES, COMMUNITY_SPACING } from '../../config/community-design.config';
import { scaleWidth } from '../../utils/dimensions';
import Svg, { Circle } from 'react-native-svg';

const scale = (size: number) => {
  const { width: SCREEN_WIDTH } = require('react-native').Dimensions.get('window');
  return (size / 375) * SCREEN_WIDTH;
};

interface StoryItemProps {
  story: Story;
  onPress: () => void;
  isFirst?: boolean;
}

export const StoryItem: React.FC<StoryItemProps> = ({ story, onPress, isFirst = false }) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.storyBorder}>
        <View style={[styles.storyInner, story.hasNewStory && styles.storyNew]}>
          {story.user.avatar ? (
            <Image 
              source={{ uri: story.user.avatar }} 
              style={styles.storyImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.storyImagePlaceholder}>
              <Svg width={COMMUNITY_SIZES.storySize} height={COMMUNITY_SIZES.storySize} viewBox="0 0 60 60">
                <Circle cx="30" cy="24" r="8" fill="#FFFFFF" opacity={0.9} />
                <Circle cx="30" cy="30" r="12" fill="#FFFFFF" opacity={0.9} />
              </Svg>
            </View>
          )}
        </View>
      </View>
      {story.hasNewStory && (
        <View style={styles.newBadge}>
          <View style={styles.newDot} />
        </View>
      )}
      {story.user.name && (
        <Text style={styles.storyName} numberOfLines={1}>
          {story.user.name.length > 8 ? story.user.name.substring(0, 8) + '...' : story.user.name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: COMMUNITY_SIZES.storySize + scale(8),
    marginRight: COMMUNITY_SPACING.storyGap,
  },
  storyBorder: {
    width: COMMUNITY_SIZES.storySize,
    height: COMMUNITY_SIZES.storySize,
    borderRadius: COMMUNITY_SIZES.storyRadius,
    borderWidth: COMMUNITY_SIZES.storyBorderWidth,
    borderColor: COMMUNITY_COLORS.storyBorder,
    padding: scale(2),
    marginBottom: scale(4),
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: COMMUNITY_SIZES.storyRadius - scale(2),
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  storyNew: {
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  newBadge: {
    position: 'absolute',
    top: scale(2),
    right: scale(2),
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: COMMUNITY_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#FF6B9D',
  },
  storyName: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(10),
    color: COMMUNITY_COLORS.textWhite,
    textAlign: 'center',
    marginTop: scale(2),
    maxWidth: COMMUNITY_SIZES.storySize + scale(8),
  },
});
