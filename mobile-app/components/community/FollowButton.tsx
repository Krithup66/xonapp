/**
 * Follow Button Component
 * ปุ่มติดตาม/เลิกติดตาม user
 * ไม่มีการเพิ่มเพื่อนหรือแชท
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COMMUNITY_COLORS, COMMUNITY_SIZES } from '../../config/community-design.config';
import { scaleWidth, scaleFont } from '../../utils/dimensions';

const scale = (size: number) => {
  const { width: SCREEN_WIDTH } = require('react-native').Dimensions.get('window');
  return (size / 375) * SCREEN_WIDTH;
};

interface FollowButtonProps {
  isFollowing: boolean;
  onPress: () => void;
  isLoading?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  isFollowing, 
  onPress, 
  isLoading = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFollowing ? styles.followingButton : styles.followButton
      ]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={isFollowing ? COMMUNITY_COLORS.textWhite : COMMUNITY_COLORS.background} 
        />
      ) : (
        <Text style={[
          styles.buttonText,
          isFollowing ? styles.followingText : styles.followText
        ]}>
          {isFollowing ? 'กำลังติดตาม' : 'ติดตาม'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    minWidth: scale(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  followButton: {
    backgroundColor: COMMUNITY_COLORS.activeColor,
    borderColor: COMMUNITY_COLORS.activeColor,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    fontFamily: 'Prompt-Medium',
    fontSize: scaleFont(12),
  },
  followText: {
    color: COMMUNITY_COLORS.textWhite,
  },
  followingText: {
    color: COMMUNITY_COLORS.textWhite,
  },
});
