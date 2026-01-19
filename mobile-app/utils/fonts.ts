/**
 * Font Utilities - ใช้ Design System
 * อัปเดตให้ใช้ design-system.json แทน hardcoded values
 */

import { TextStyle } from 'react-native';
import {
  getFontFamily,
  getFontSize,
  createTextStyle,
  getTextStyle,
  FontWeight,
  FontSize,
} from './designSystem';

/**
 * Font weights สำหรับ Prompt (จาก Design System)
 */
export const PROMPT_FONTS = {
  regular: getFontFamily('regular'),
  medium: getFontFamily('medium'),
  semiBold: getFontFamily('semiBold'),
  bold: getFontFamily('bold'),
} as const;

/**
 * Helper function สำหรับสร้าง text style ที่ใช้ Prompt font
 * ใช้ Design System
 */
export const promptText = (
  size: FontSize | number,
  weight: FontWeight = 'regular',
  color?: string
): TextStyle => {
  return createTextStyle(size, weight, color);
};

/**
 * Predefined text styles จาก Design System
 */
export const textStyles = {
  // Headings
  h1: getTextStyle('h1'),
  h2: getTextStyle('h2'),
  h3: getTextStyle('h3'),
  h4: getTextStyle('h4'),
  
  // Body
  body: getTextStyle('body'),
  bodySmall: getTextStyle('bodySmall'),
  
  // Caption
  caption: getTextStyle('caption'),
  
  // Label
  label: getTextStyle('label'),
  
  // Button
  button: getTextStyle('button'),
  
  // Custom sizes
  bodyMedium: promptText('lg', 'medium'),
  bodySmallMedium: promptText('md', 'medium'),
  captionMedium: promptText('base', 'medium'),
  captionBold: promptText('base', 'bold'),
  labelSmall: promptText('base', 'semiBold'),
  buttonMedium: promptText('md', 'medium'),
  buttonBold: promptText('md', 'bold'),
  small: promptText('sm', 'regular'),
  smallMedium: promptText('sm', 'medium'),
  smallBold: promptText('sm', 'bold'),
  xs: promptText('xs', 'regular'),
  xsMedium: promptText('xs', 'medium'),
  xsBold: promptText('xs', 'bold'),
};
