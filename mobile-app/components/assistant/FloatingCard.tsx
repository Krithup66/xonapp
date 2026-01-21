/**
 * Floating Card Component
 * การ์ดข้อมูลที่ลอยอยู่รอบๆ AI Sphere
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface FloatingCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft' | 'middleRight' | 'middleLeft';
  onPress?: () => void;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  title,
  content,
  icon,
  position = 'topRight',
  onPress,
}) => {
  const getPositionStyle = () => {
    switch (position) {
      case 'topRight':
        return { top: scale(80), right: scale(16) };
      case 'topLeft':
        return { top: scale(80), left: scale(16) };
      case 'bottomRight':
        return { bottom: scale(200), right: scale(16) };
      case 'bottomLeft':
        return { bottom: scale(200), left: scale(16) };
      case 'middleRight':
        return { top: '35%', right: scale(16) };
      case 'middleLeft':
        return { top: '35%', left: scale(16) };
      default:
        return { top: scale(80), right: scale(16) };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, getPositionStyle()]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content} numberOfLines={3}>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: scale(140),
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: scale(16),
    padding: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(12),
    color: '#FFFFFF',
    marginBottom: scale(6),
  },
  content: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(10),
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: scaleFont(14),
  },
});
