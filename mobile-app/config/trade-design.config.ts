/**
 * Trade Service Design Configuration
 * รูปแบบการออกแบบที่ใช้ใน Trade Service จาก Figma
 */

import { scaleWidth, scaleFont } from '../utils/dimensions';

// ============================================
// FIGMA DESIGN SPECIFICATIONS
// ============================================

/**
 * Figma Design URL
 */
export const FIGMA_DESIGN_URL = 'https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3113-7044';

/**
 * Figma Node IDs for Trade Screen
 */
export const FIGMA_NODES = {
  mainContainer: '3113:7044',
  cardsContainer: '3113:7072',
  buyCard: '2813:7097',
  sellCard: '2813:7151',
  buyErrorCard: '2813:7207',
  profitContainer: '2813:7539',
  chartContainer: '2138:3092',
  iconsContainer: '3113:7066',
  tabsContainer: '3113:7071',
  bottomNavigation: '3113:7073',
} as const;

/**
 * Trade Design Colors (from Figma)
 */
export const TRADE_COLORS = {
  // Backgrounds
  screenBg: '#000000',
  cardBg: '#141414',
  cardBgGradientStart: '#2F2C2C',
  cardBgGradientEnd: '#141414',
  
  // Text
  textWhite: '#FFFFFF',
  textGray: '#747474',
  textBlack: '#000000',
  
  // Status Colors
  positive: '#C4FF00',
  negative: '#FF0505', // Red for offline status
  errorStart: 'rgba(255, 80, 0, 1)',
  errorEnd: 'rgba(116, 116, 116, 1)',
  
  // Button Colors
  buyGradientStart: '#C4FF00',
  buyGradientEnd: '#769900',
  sellGradientStart: 'rgba(255, 5, 5, 1)',
  sellGradientEnd: '#FFFFFF',
  tradeGradientStart: '#3FF9BE',
  tradeGradientEnd: '#002E99',
  onToggleGradientStart: '#2F2C2C',
  onToggleGradientEnd: '#C4FF00',
  offToggleGradientStart: '#2F2C2C',
  offToggleGradientEnd: '#F70000',
} as const;

/**
 * Trade Design Sizes (responsive, from Figma)
 */
export const TRADE_SIZES = {
  // Card dimensions
  cardWidth: scaleWidth(184),
  cardHeight: scaleWidth(251),
  cardBorderRadius: scaleWidth(20),
  cardPadding: '3.75%', // Percentage-based padding from Figma
  
  // Chart
  chartHeight: scaleWidth(67),
  chartWidth: scaleWidth(132),
  
  // Icons
  menuIcon: scaleWidth(18),
  headerIconSize: scaleWidth(20),
  headerIconContainer: scaleWidth(40),
  toggleIconSize: scaleWidth(12),
  
  // Font Sizes
  balanceLabel: scaleFont(16),
  balanceAmount: scaleFont(23),
  pairSymbol: scaleFont(12),
  cardTitle: scaleFont(12),
  cardValue: scaleFont(8),
  buttonText: scaleFont(6),
  statusText: scaleFont(10),
  
  // Tabs
  tabHeight: scaleWidth(28),
  tabPaddingHorizontal: scaleWidth(10),
  
  // Bottom Navigation
  bottomNavWidth: scaleWidth(333),
  bottomNavHeight: scaleWidth(52),
  bottomNavPaddingHorizontal: scaleWidth(23),
  bottomNavPaddingVertical: scaleWidth(7),
  bottomNavItemGap: scaleWidth(24),
  bottomNavItemWidth: scaleWidth(38),
  bottomNavItemHeight: scaleWidth(37),
} as const;

/**
 * Trade Design Spacing (responsive, from Figma)
 */
export const TRADE_SPACING = {
  screenPadding: scaleWidth(27),
  cardGap: scaleWidth(8),
  cardsContainerPadding: scaleWidth(2),
  profitGap: scaleWidth(10),
  iconGap: scaleWidth(8),
  tabGap: scaleWidth(8),
} as const;

/**
 * Trade Icon URLs from Figma
 */
export const TRADE_ICON_URLS = {
  // Header Icons
  menuIndicator: 'https://www.figma.com/api/mcp/asset/4acc188f-b1b4-41f8-99ca-d557d728c484', // 9 dots pattern
  botAdd: 'https://www.figma.com/api/mcp/asset/d1469283-f823-4485-899b-0c8e8eb58d12',
  depth: 'https://www.figma.com/api/mcp/asset/bf8d27fe-9b12-441e-8d3e-81611f6496ea',
  
  // Toggle Icons
  toggleOnCircle: 'https://www.figma.com/api/mcp/asset/82ccf1bd-377c-4b41-9e07-ebe224fcc105',
  toggleOn: 'https://www.figma.com/api/mcp/asset/c48f2e9f-4552-414d-a2c3-0f69dfd61259',
  toggleOn1: 'https://www.figma.com/api/mcp/asset/24dfe7b0-3c20-4501-844e-aa7635da4dce',
  
  // Chart Images
  chartMask: 'https://www.figma.com/api/mcp/asset/7a2da570-a1e0-454c-9537-3822d6542cbf',
  chartShade1: 'https://www.figma.com/api/mcp/asset/f791053c-5b3a-4fc0-8a47-da87982b32e1',
  chartShade2: 'https://www.figma.com/api/mcp/asset/4ceb439c-6771-4d76-acb3-46497a935c3f',
  chartStroke1: 'https://www.figma.com/api/mcp/asset/e8be46de-4379-4d80-8381-f0d1bb684488',
  chartStroke2: 'https://www.figma.com/api/mcp/asset/0319a717-3fdf-4e19-b064-e1e91f20f1e2',
  chartMaskSmall: 'https://www.figma.com/api/mcp/asset/3f929513-cfd5-40c3-8904-e5cd78e1ca3c',
  
  // Trading Cards
  chartPlaceholder: 'https://www.figma.com/api/mcp/asset/a46a00fb-5d91-4994-b579-8b9c1ca9bdb8',
  errorChart: 'https://www.figma.com/api/mcp/asset/ca645e5b-76c6-4463-83a4-f2ac2507f113',
  
  // Bottom Navigation (reuse from finance)
  navTrade: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3e18852d-d516-4351-bcca-e29277c501ce',
  navAssistant: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ceba6c65-e7d9-4a25-8cb7-7a0efa81cad5',
  navCommunity: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/60dc140d-c565-4ada-91f1-e8167477abc6',
  navFinance: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/af3c6e3d-55e6-4fb7-9a07-cbc69806aed0',
  navXon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/590857be-d095-4b19-b353-a92fa05c9b77',
} as const;