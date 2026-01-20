/**
 * Topic Circle Component
 * วงกลมแสดงหัวข้อต่างๆ สำหรับ scroll แนวนอน
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';

interface TopicCircleProps {
  label: string;
  color: string;
  icon?: string; // Optional emoji or icon name
  isActive?: boolean;
  onPress?: () => void;
}

// Icon mapping based on label
const getIconForLabel = (label: string): string => {
  const iconMap: { [key: string]: string } = {
    'Rocket': '🚀',
    'Health': '💊',
    'Nature': '🌿',
    'Creative': '🎨',
    'Trading': '📈',
    'Crypto': '₿',
    'Luxury': '💎',
    'Fitness': '💪',
  };
  return iconMap[label] || '📌';
};

export const TopicCircle: React.FC<TopicCircleProps> = ({
  label,
  color,
  icon,
  isActive = false,
  onPress,
}) => {
  const displayIcon = icon || getIconForLabel(label);
  const borderColor = isActive ? color : 'rgba(255, 255, 255, 0.1)';
  const labelColor = isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.54)';
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.circleBorder, { borderColor }]}>
        <View style={styles.circle}>
          <Text style={styles.icon}>{displayIcon}</Text>
        </View>
      </View>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginLeft: scaleWidth(20),
  },
  circleBorder: {
    width: scaleWidth(66), // 30 radius * 2 + 3 padding * 2
    height: scaleWidth(66),
    borderRadius: scaleWidth(33),
    borderWidth: 2,
    padding: scaleWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: scaleWidth(60), // 30 radius * 2
    height: scaleWidth(60),
    borderRadius: scaleWidth(30),
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: scaleFont(24),
  },
  label: {
    marginTop: scaleWidth(5),
    fontSize: scaleFont(12),
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Prompt-Regular',
  },
});
