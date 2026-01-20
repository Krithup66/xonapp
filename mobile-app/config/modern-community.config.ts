/**
 * Modern Community Design Configuration
 * ออกแบบ UI ที่ทันสมัย ล้ำสมัย และเป็นเอกลักษณ์
 */

import { scaleWidth, scaleFont } from '../utils/dimensions';

// ============================================
// MODERN COLOR SYSTEM
// ============================================

export const MODERN_COLORS = {
  // Backgrounds - Dark with depth
  background: '#0A0A0F',
  backgroundSecondary: '#121218',
  backgroundTertiary: '#1A1A24',
  
  // Glassmorphism
  glassBackground: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHighlight: 'rgba(255, 255, 255, 0.08)',
  
  // Gradients - Modern vibrant colors
  primaryGradient: ['#FF6B9D', '#C44569', '#8B2E5D'],
  accentGradient: ['#6366F1', '#8B5CF6', '#A855F7'],
  successGradient: ['#10B981', '#059669', '#047857'],
  glowGradient: ['#FF6B9D', '#FF8E9B', '#FFB3C1'],
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B8C8',
  textTertiary: '#6B6B7A',
  textAccent: '#FF6B9D',
  
  // Interactive
  interactive: '#FF6B9D',
  interactiveHover: '#FF8E9B',
  interactiveActive: '#C44569',
  
  // Shadows & Glows
  shadowColor: 'rgba(255, 107, 157, 0.3)',
  glowColor: 'rgba(255, 107, 157, 0.5)',
} as const;

// ============================================
// MODERN SIZES
// ============================================

export const MODERN_SIZES = {
  // Spacing
  spacingXS: scaleWidth(4),
  spacingSM: scaleWidth(8),
  spacingMD: scaleWidth(16),
  spacingLG: scaleWidth(24),
  spacingXL: scaleWidth(32),
  
  // Border Radius - Modern rounded
  radiusSM: scaleWidth(12),
  radiusMD: scaleWidth(16),
  radiusLG: scaleWidth(24),
  radiusXL: scaleWidth(32),
  radiusFull: 9999,
  
  // Story
  storySize: scaleWidth(72),
  storyBorderWidth: 3,
  
  // Avatar
  avatarSize: scaleWidth(48),
  avatarSizeSM: scaleWidth(40),
  
  // Cards
  cardPadding: scaleWidth(20),
  cardGap: scaleWidth(16),
  
  // Icons
  iconSize: scaleWidth(24),
  iconSizeSM: scaleWidth(20),
  iconSizeLG: scaleWidth(32),
} as const;

// ============================================
// MODERN EFFECTS
// ============================================

export const MODERN_EFFECTS = {
  // Shadows
  shadowSM: {
    shadowColor: MODERN_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowMD: {
    shadowColor: MODERN_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  shadowLG: {
    shadowColor: MODERN_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Glows
  glowSM: {
    shadowColor: MODERN_COLORS.glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glowMD: {
    shadowColor: MODERN_COLORS.glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  
  // Glassmorphism
  glass: {
    backgroundColor: MODERN_COLORS.glassBackground,
    borderWidth: 1,
    borderColor: MODERN_COLORS.glassBorder,
    // Note: Backdrop blur requires native modules, using opacity instead
  },
} as const;
