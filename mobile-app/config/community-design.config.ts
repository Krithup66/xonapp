/**
 * Community Service Design Configuration
 * รูปแบบการออกแบบที่ใช้ใน Community Service จาก Figma
 * Figma Design URL: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3121-5729
 */

import { scaleWidth, scaleFont } from '../utils/dimensions';

// ============================================
// FIGMA DESIGN SPECIFICATIONS
// ============================================

/**
 * Figma Design URL
 */
export const FIGMA_DESIGN_URL = 'https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3121-5729';

/**
 * Figma Node IDs for Community Screen
 */
export const FIGMA_NODES = {
  mainContainer: '3121:5729',
} as const;

/**
 * Community Design Colors (from Figma)
 */
export const COMMUNITY_COLORS = {
  // Backgrounds
  background: '#000000',
  postBackground: '#000000',
  storyBorder: '#FFFFFF',
  
  // Text
  textWhite: '#FFFFFF',
  textGray: '#747474',
  textLightGray: '#949494',
  
  // Accent
  activeColor: '#7B0909', // Red accent for active states
  sendIconGradient: ['#FF6B9D', '#C44569'], // Reddish-pink gradient for send icon
  
  // Interactive
  iconInactive: '#FFFFFF',
  iconActive: '#7B0909',
} as const;

/**
 * Community Design Sizes (responsive, from Figma)
 */
export const COMMUNITY_SIZES = {
  // Navigation
  backButton: scaleWidth(30),
  messageIcon: scaleWidth(20),
  
  // Stories
  storySize: scaleWidth(60),
  storyBorderWidth: 2,
  
  // Post
  avatarSize: scaleWidth(40),
  postMediaHeight: scaleWidth(200),
  postMediaWidth: scaleWidth(375),
  postMediaItemWidth: scaleWidth(171.5), // (375 - 16*2 - 8) / 2 = 171.5
  postMediaGap: scaleWidth(8),
  
  // Icons
  interactionIcon: scaleWidth(24),
  
  // Border Radius
  storyRadius: scaleWidth(30),
  avatarRadius: scaleWidth(20),
  postMediaRadius: scaleWidth(8),
  
  // Font Sizes
  userNameText: scaleFont(14),
  timeText: scaleFont(12),
  postText: scaleFont(14),
} as const;

/**
 * Community Design Spacing (responsive, from Figma)
 */
export const COMMUNITY_SPACING = {
  screenPadding: scaleWidth(16),
  topBarPadding: scaleWidth(16),
  storyGap: scaleWidth(12),
  postPadding: scaleWidth(16),
  postGap: scaleWidth(12),
  interactionGap: scaleWidth(16),
} as const;

/**
 * Community Icon URLs from Figma
 * Node ID: 3121:5729
 */
export const COMMUNITY_ICON_URLS = {
  // Icons จะใช้ SVG inline components แทน
  // เนื่องจาก Figma API อาจไม่ให้ direct access
  // แต่สามารถใช้ SvgUri ถ้ามี URL
  back: '', // Using inline SVG
  message: '', // Using inline SVG
  like: '', // Using inline SVG
  comment: '', // Using inline SVG
  share: '', // Using inline SVG
  send: '', // Using inline SVG with gradient
  emoji: '', // Using inline SVG
} as const;
