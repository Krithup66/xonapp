/**
 * Feed Card Component
 * การ์ดสำหรับแสดงใน Bento Grid Feed
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import Svg, { Path } from 'react-native-svg';

interface FeedCardProps {
  title: string;
  author: string;
  color: string;
  onPress?: () => void;
}

// Play Icon Component
const PlayIcon = ({ size = 20, color = '#00FFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5V19L19 12L8 5Z"
      fill={color}
    />
  </Svg>
);

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  try {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) {
      return `rgba(255, 255, 255, ${alpha})`; // Fallback to white
    }
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (error) {
    return `rgba(255, 255, 255, ${alpha})`; // Fallback to white
  }
};

export const FeedCard: React.FC<FeedCardProps> = ({
  title,
  author,
  color,
  onPress,
}) => {
  return (
    <View
      style={[styles.card, { backgroundColor: hexToRgba(color, 0.05) }]}
    >
      {/* Image Placeholder */}
      <View style={[styles.imagePlaceholder, { backgroundColor: hexToRgba(color, 0.3) }]}>
        <Text style={styles.imageIcon}>🖼️</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
        </View>
        
        <View style={styles.spacer} />
        
        <View style={styles.footer}>
          <View style={styles.avatar} />
          <Text style={styles.author} numberOfLines={1}>{author}</Text>
        </View>
      </View>

      {/* Like Button Overlay */}
      <View style={styles.likeButton}>
        <Text style={styles.likeIcon}>❤️</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: scaleWidth(24),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    height: scaleWidth(280), // Fixed height for grid consistency (aspectRatio 0.75 from Flutter)
  },
  imagePlaceholder: {
    width: '100%',
    height: scaleWidth(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: scaleFont(32),
    opacity: 0.24,
  },
  content: {
    flex: 1,
    padding: scaleWidth(15),
  },
  header: {
    marginBottom: scaleWidth(12),
  },
  title: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(14),
    color: '#FFFFFF',
    lineHeight: scaleFont(20),
  },
  spacer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: scaleWidth(20),
    height: scaleWidth(20),
    borderRadius: scaleWidth(10),
    backgroundColor: 'rgba(0, 191, 255, 1)', // Blue avatar
    marginRight: scaleWidth(6),
  },
  author: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(10),
    color: 'rgba(255, 255, 255, 0.54)',
  },
  likeButton: {
    position: 'absolute',
    top: scaleWidth(10),
    right: scaleWidth(10),
  },
  likeIcon: {
    fontSize: scaleFont(18),
  },
});
