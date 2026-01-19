/**
 * Responsive Dimensions Utility
 * 
 * ใช้สำหรับจัดการ responsive design
 * - Scale dimensions ตามหน้าจอ
 * - Font scaling
 * - Spacing scaling
 */

import { Dimensions, PixelRatio } from 'react-native';

// ============================================
// DESIGN CONSTANTS
// ============================================

// ขนาดดีไซน์ใน Figma (iPhone standard)
export const DESIGN_WIDTH = 375;
export const DESIGN_HEIGHT = 812; // หรือ 844 สำหรับ iPhone 14/15

// ============================================
// GET SCREEN DIMENSIONS
// ============================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// SCALE FUNCTIONS
// ============================================

/**
 * Scale width ตามหน้าจอ
 * @param size - ขนาดใน Figma (375px width)
 */
export const scaleWidth = (size: number): number => {
  return (size / DESIGN_WIDTH) * SCREEN_WIDTH;
};

/**
 * Scale height ตามหน้าจอ
 * @param size - ขนาดใน Figma (812px height)
 */
export const scaleHeight = (size: number): number => {
  return (size / DESIGN_HEIGHT) * SCREEN_HEIGHT;
};

/**
 * Scale font size
 * @param size - Font size ใน Figma
 */
export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / DESIGN_WIDTH;
  const newSize = size * scale;
  
  // ใช้ PixelRatio เพื่อให้ font ชัดเจน
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Scale spacing (padding, margin, gap)
 * @param size - Spacing ใน Figma
 */
export const scaleSpacing = (size: number): number => {
  return scaleWidth(size);
};

/**
 * Scale border radius
 * @param size - Border radius ใน Figma
 */
export const scaleRadius = (size: number): number => {
  return scaleWidth(size);
};

// ============================================
// PRESET SIZES
// ============================================

export const SIZES = {
  // Spacing
  xs: scaleSpacing(4),
  sm: scaleSpacing(8),
  md: scaleSpacing(16),
  lg: scaleSpacing(24),
  xl: scaleSpacing(32),
  
  // Font sizes
  fontSize: {
    xs: scaleFont(10),
    sm: scaleFont(12),
    md: scaleFont(14),
    lg: scaleFont(16),
    xl: scaleFont(20),
    xxl: scaleFont(24),
    xxxl: scaleFont(32),
  },
  
  // Border radius
  radius: {
    sm: scaleRadius(4),
    md: scaleRadius(8),
    lg: scaleRadius(12),
    xl: scaleRadius(20),
    full: scaleRadius(999),
  },
  
  // Icon sizes
  icon: {
    sm: scaleWidth(16),
    md: scaleWidth(24),
    lg: scaleWidth(32),
    xl: scaleWidth(48),
  },
};

// ============================================
// SCREEN INFO
// ============================================

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale: SCREEN_WIDTH / DESIGN_WIDTH,
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLarge: SCREEN_WIDTH >= 414,
};
