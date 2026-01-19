/**
 * Design System Utility
 * อ่านและใช้ค่าจาก design-system.json เพื่อให้การออกแบบสอดคล้องกัน
 */

// Import design system JSON
import designSystemData from '../design-system.json';
const designSystem = designSystemData;
import { TextStyle, ViewStyle } from 'react-native';

// Types
export type ThemeMode = 'dark' | 'light';
export type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';
export type FontSize = keyof typeof designSystem.typography.fontSize;
export type Spacing = keyof typeof designSystem.spacing;
export type BorderRadius = keyof typeof designSystem.borderRadius;
export type ShadowSize = keyof typeof designSystem.shadows;

/**
 * Get color from design system
 */
export function getColor(
  mode: ThemeMode,
  category: 'background' | 'text' | 'accent' | 'border' | 'button' | 'card',
  variant: string
): string {
  const colors = designSystem.colors[mode];
  return (colors[category] as any)[variant] || '#000000';
}

/**
 * Get theme colors object
 */
export function getThemeColors(mode: ThemeMode) {
  const colors = designSystem.colors[mode];
  return {
    // Background
    bg: colors.background.primary,
    bgSecondary: colors.background.secondary,
    bgTertiary: colors.background.tertiary,
    card: colors.background.card,
    overlay: colors.background.overlay,
    backdrop: colors.background.backdrop,
    
    // Text
    text: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    textMuted: colors.text.muted,
    
    // Accent
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    success: colors.accent.success,
    warning: colors.accent.warning,
    error: colors.accent.error,
    info: colors.accent.info,
    
    // Border
    border: colors.border.default,
    borderLight: colors.border.light,
    divider: colors.border.divider,
    
    // Button
    button: colors.button.primary,
    buttonText: colors.button.primaryText,
    buttonSecondary: colors.button.secondary,
    buttonSecondaryText: colors.button.secondaryText,
    
    // Card
    cardBg: colors.card.background,
    cardBorder: colors.card.border,
    cardShadow: colors.card.shadow,
    
    // Link
    link: colors.accent.primary,
  };
}

/**
 * Get font family
 */
export function getFontFamily(weight: FontWeight = 'regular'): string {
  return designSystem.typography.fontFamily[weight];
}

/**
 * Get font size
 */
export function getFontSize(size: FontSize | number): number {
  if (typeof size === 'number') return size;
  return designSystem.typography.fontSize[size];
}

/**
 * Get text style from design system
 */
export function getTextStyle(
  styleName: keyof typeof designSystem.typography.textStyles,
  color?: string
): TextStyle {
  const style = designSystem.typography.textStyles[styleName];
  return {
    fontSize: style.fontSize,
    fontFamily: getFontFamily(style.fontWeight as FontWeight),
    lineHeight: style.fontSize * (style.lineHeight || 1.5),
    color: color,
  };
}

/**
 * Create text style with custom values
 */
export function createTextStyle(
  size: FontSize | number,
  weight: FontWeight = 'regular',
  color?: string
): TextStyle {
  return {
    fontSize: getFontSize(size),
    fontFamily: getFontFamily(weight),
    color: color,
  };
}

/**
 * Get spacing value
 */
export function getSpacing(size: Spacing | number): number {
  if (typeof size === 'number') return size;
  return designSystem.spacing[size];
}

/**
 * Get border radius
 */
export function getBorderRadius(size: BorderRadius | number): number {
  if (typeof size === 'number') return size;
  return designSystem.borderRadius[size];
}

/**
 * Get shadow style
 */
export function getShadow(size: ShadowSize): ViewStyle {
  return designSystem.shadows[size] as ViewStyle;
}

/**
 * Get animation duration
 */
export function getAnimationDuration(
  speed: keyof typeof designSystem.animations.duration
): number {
  return designSystem.animations.duration[speed];
}

/**
 * Get spring config
 */
export function getSpringConfig() {
  return designSystem.animations.spring;
}

/**
 * Get component styles
 */
export function getComponentStyle(componentName: keyof typeof designSystem.components) {
  return designSystem.components[componentName];
}

/**
 * Create spacing style (padding/margin)
 */
export function spacing(
  all?: Spacing | number,
  vertical?: Spacing | number,
  horizontal?: Spacing | number,
  top?: Spacing | number,
  right?: Spacing | number,
  bottom?: Spacing | number,
  left?: Spacing | number
): ViewStyle {
  const style: ViewStyle = {};
  
  if (all !== undefined) {
    const value = getSpacing(all);
    style.padding = value;
    style.margin = value;
  }
  if (vertical !== undefined) {
    const value = getSpacing(vertical);
    style.paddingVertical = value;
    style.marginVertical = value;
  }
  if (horizontal !== undefined) {
    const value = getSpacing(horizontal);
    style.paddingHorizontal = value;
    style.marginHorizontal = value;
  }
  if (top !== undefined) {
    const value = getSpacing(top);
    style.paddingTop = value;
    style.marginTop = value;
  }
  if (right !== undefined) {
    const value = getSpacing(right);
    style.paddingRight = value;
    style.marginRight = value;
  }
  if (bottom !== undefined) {
    const value = getSpacing(bottom);
    style.paddingBottom = value;
    style.marginBottom = value;
  }
  if (left !== undefined) {
    const value = getSpacing(left);
    style.paddingLeft = value;
    style.marginLeft = value;
  }
  
  return style;
}

/**
 * Export design system for direct access
 */
export const DesignSystem = designSystem;
