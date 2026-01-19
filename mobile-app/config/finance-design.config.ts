/**
 * Finance Service Design Configuration
 * รูปแบบการออกแบบที่ใช้ใน Finance Service จาก Figma
 * ใช้สำหรับ service อื่นๆ เพื่อความสอดคล้อง
 */

import { scaleWidth, scaleFont } from '../utils/dimensions';

// ============================================
// FIGMA DESIGN SPECIFICATIONS
// ============================================

/**
 * Figma Design URL
 */
export const FIGMA_DESIGN_URL = 'https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3146-6034';

/**
 * Figma Node IDs for Finance Screen
 */
export const FIGMA_NODES = {
  mainContainer: '3146:6034',
  headerContainer: '3146:6035',
  userInfoContainer: '2569:4579',
  profileImageContainer: '2116:1642',
  transferWithdrawContainer: '3152:6186',
  contentContainer: '3150:6185',
  bottomNavigation: '3146:6119',
} as const;

/**
 * Finance Design Colors (from Figma)
 */
export const FINANCE_COLORS = {
  // Backgrounds
  headerBg: '#000000',
  contentBg: '#D9D9D9',
  iconContainerDark: 'rgba(255,255,255,0.1)',
  iconContainerLight: 'rgba(255,255,255,0.3)',
  
  // Text
  textWhite: '#FFFFFF',
  textBlack: '#000000',
  textGray: '#666666',
  
  // Accent
  positive: '#C4FF00',
  notificationBadgeStart: '#DD9B9B',
  notificationBadgeEnd: '#7B0909',
  
  // Crypto
  btcOrange: '#F7931A',
  solPurple: '#9945FF',
  ethBlue: '#627EEA',
  
  // Glass Effect
  glassOverlay: 'rgba(255,255,255,0.4)',
  glassBorder: 'rgba(255,255,255,0.5)',
  glassGradientStart: 'rgba(255,255,255,0.15)',
  glassGradientEnd: 'rgba(0,0,0,0.1)',
} as const;

/**
 * Finance Design Sizes (responsive, from Figma)
 */
export const FINANCE_SIZES = {
  // Icon Containers
  iconContainer: scaleWidth(50),
  iconContainerSmall: scaleWidth(30),
  cryptoIcon: scaleWidth(40),
  profileImage: scaleWidth(45),
  
  // Border Radius
  contentRadius: scaleWidth(40),
  iconRadius: 999,
  cardRadius: scaleWidth(20),
  badgeRadius: scaleWidth(5),
  
  // Font Sizes (with limited scaling)
  balanceText: scaleFont(24),
  greetingText: scaleFont(14),
  serviceLabelText: scaleFont(12),
  cryptoNameText: scaleFont(12),
  cryptoValueText: scaleFont(14),
  navLabelText: scaleFont(12),
  badgeText: scaleFont(8),
  
  // Navigation
  bottomNavWidth: 0.888, // 88.8% of screen width (333/375)
  bottomNavHeight: scaleWidth(52),
  bottomNavPaddingTop: scaleWidth(7),
  bottomNavPaddingHorizontal: scaleWidth(23),
  bottomNavPaddingBottom: scaleWidth(7),
  navItemGap: scaleWidth(24),
  navItemWidth: scaleWidth(38),
  navItemHeight: scaleWidth(37),
} as const;

/**
 * Finance Design Spacing (responsive, from Figma)
 */
export const FINANCE_SPACING = {
  screenPadding: scaleWidth(27),
  contentPadding: scaleWidth(21),
  serviceGap: scaleWidth(8),
  serviceItemWidth: scaleWidth(60),
  quickActionGap: 16, // Fixed 16px
  userInfoGap: scaleWidth(17),
  userDetailsGap: scaleWidth(8),
} as const;

/**
 * Finance Design Layout Specifications
 */
export const FINANCE_LAYOUT = {
  // Screen dimensions
  baseWidth: 375,
  baseHeight: 812,
  
  // Grid layouts
  servicesRow1: 5, // Number of items in row 1
  servicesRow2: 3, // Number of items in row 2
  
  // Card dimensions
  assetCardHeight: scaleWidth(67),
  assetCardPaddingVertical: scaleWidth(12),
  assetCardPaddingHorizontal: scaleWidth(16),
} as const;

/**
 * Finance Icon URLs from Figma
 */
export const FINANCE_ICON_URLS = {
  logo: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a5afe849-8437-49e9-9d94-bdde00cafa46',
  calendar: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1d4002cf-b85e-4812-b918-48d42dfbfd42',
  notification: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4872a332-00f6-4843-99b0-6ea9d9553a38',
  transfer: 'https://www.figma.com/api/mcp/asset/c448d56b-c1ef-4e48-bd97-0789d06f3f2d',
  withdraw: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/492ac417-b799-496c-9324-33429c928078',
  investment: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/08146876-8498-4524-a563-22b301e9b36a',
  savings: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/27a8f13a-9fa2-4697-9367-f37588d277a0',
  credit: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/173c0514-1c2e-455f-b2b8-bc83fb76c529',
  asset: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6c39b280-95ce-4c65-b75e-536f27a59a4e',
  debt: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a6fcaa77-11b5-4ebc-b0d1-7710e02ae83a',
  travel: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/369c5ff1-e152-4d98-aa50-09bfaf53585d',
  tax: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/63812dc2-5c9c-43fc-b8a4-7c2be44af38a',
  erp: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4104c4e5-5e1e-44a0-8820-68fff7b3e38a',
  navTrade: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3e18852d-d516-4351-bcca-e29277c501ce',
  navAssistant: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ceba6c65-e7d9-4a25-8cb7-7a0efa81cad5',
  navCommunity: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/60dc140d-c565-4ada-91f1-e8167477abc6',
  navFinance: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/af3c6e3d-55e6-4fb7-9a07-cbc69806aed0',
  navXon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/590857be-d095-4b19-b353-a92fa05c9b77',
} as const;

/**
 * Finance Design Patterns (for reuse in other services)
 */
export const FINANCE_PATTERNS = {
  // Glass effect gradient colors
  glassGradientDark: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.1)'],
  glassGradientLight: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.15)'],
  
  // Glass effect gradient direction
  glassGradientStart: { x: 0, y: 0 },
  glassGradientEnd: { x: 1, y: 1 },
  
  // Profile image gradient
  profileGradientColors: ['#6366F1', '#8B5CF6', '#EC4899'],
} as const;
