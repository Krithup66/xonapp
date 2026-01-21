/**
 * Sidebar Component
 * เมนูด้านซ้ายสำหรับ navigation
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import { hapticImpact } from '../../utils/haptics';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Chevron Right Icon
const ChevronRight = ({ size = 16, color = '#9CA3AF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  hasArrow?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  visible?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, visible = false, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sidebar}>
        <ScrollView style={styles.scrollView}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => {
                hapticImpact('light');
                item.onPress?.();
              }}
              activeOpacity={0.7}
            >
              {item.icon && <View style={styles.iconContainer}>{item.icon}</View>}
              <Text style={styles.label}>{item.label}</Text>
              {item.hasArrow && (
                <View style={styles.arrowContainer}>
                  <ChevronRight size={scale(16)} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: scale(200),
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: scale(60),
  },
  scrollView: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    marginRight: scale(12),
    width: scale(20),
    height: scale(20),
  },
  label: {
    flex: 1,
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: '#FFFFFF',
  },
  arrowContainer: {
    marginLeft: scale(8),
  },
});
