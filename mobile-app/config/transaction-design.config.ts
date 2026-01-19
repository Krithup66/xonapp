/**
 * Transaction Summary Design Configuration
 * รูปแบบการออกแบบที่ใช้ใน Transaction Summary Screen จาก Figma
 */

import { scaleWidth, scaleFont } from '../utils/dimensions';

/**
 * Figma Design URL
 */
export const TRANSACTION_FIGMA_URL = 'https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3152-6187';

/**
 * Transaction Design Colors (from Figma)
 */
export const TRANSACTION_COLORS = {
  // Backgrounds
  screenBg: '#000000',
  iconContainerBg: 'rgba(0,0,0,0)',
  
  // Text
  textWhite: '#FFFFFF',
  textGray: '#C2C2C2',
  
  // Transaction amounts
  positive: '#C4FF00', // Green for income
  negative: '#FF0505', // Red for expense
  
  // Buttons
  backButtonBg: 'rgba(255,255,255,0.1)',
} as const;

/**
 * Transaction Design Sizes (responsive, from Figma)
 */
export const TRANSACTION_SIZES = {
  // Header
  headerTitle: scaleFont(16),
  backButton: scaleWidth(30),
  backButtonIcon: scaleWidth(12),
  
  // Tab Bar
  tabBarHeight: scaleWidth(21),
  tabText: scaleFont(14),
  
  // Date Selector
  dateLabel: scaleFont(12),
  dateValue: scaleFont(12),
  dateSelectorHeight: scaleWidth(30),
  chevronSize: scaleWidth(30),
  
  // Transaction Items
  transactionItemHeight: scaleWidth(50),
  transactionIconSize: scaleWidth(50),
  transactionText: scaleFont(12),
  transactionGap: scaleWidth(16),
  
  // Spacing
  screenPadding: scaleWidth(27),
  contentPadding: scaleWidth(27),
  tabBarPadding: scaleWidth(56),
  dateSelectorTop: scaleWidth(138),
  transactionsListTop: scaleWidth(209),
} as const;

/**
 * Transaction Icon URLs from Figma
 * ดึงมาจาก Figma API - ใช้ Image/SvgUri เพื่อโหลดจาก URL
 */
export const TRANSACTION_ICON_URLS = {
  // Navigation Icons
  // 3152:6301 - Back Arrow Icon (ลูกศรย้อนกลับ)
  backArrow: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/493ad258-a079-42c8-bf8a-779c50eee357',
  chevronLeft: 'https://www.figma.com/api/mcp/asset/56308c50-ae67-45a0-8b37-8160997677a8',
  
  // Transaction Icon Containers (วงกลมพร้อมไอคอน) - จาก Figma nodes PNG
  // 3153:6347 - Debt Icon Container (สินเชื่อธนาคาร/หนี้สิน)
  debtIconContainer: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8d198575-622f-4c8a-a4d4-9068c5354f76',
  
  // 3153:6359 - Trading Icon Container (BTCUSD/Long บันชีเสี่ยงสูง)
  tradingIconContainer: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b1e6c872-b14e-4e68-bab2-afb64cb1df45',
  
  // 3153:6375 - Expense Icon Container (ค่าอาหาร/ค่าใช้จ่ายประจำ)
  expenseIconContainer: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ab4e55fd-811d-4e7a-b548-679624324f23',
  
  // 3153:6388 - Deposit Icon Container (ฝากเงิน/บัญชีเทรดความเสี่ยงสูง)
  depositIconContainer: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/44c29fdc-0319-46d5-8dc2-55c29ec3a7ab',
  
  // 3153:6404 - Profit Icon Container (กำไรจาก bot A/บัญชี bot)
  profitIconContainer: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/085c13a9-0a0e-4278-90e5-7278326b1cc6',
  
  // Transaction Icons (SVG) - สำหรับกรณีที่ต้องการใช้เฉพาะ icon
  // 3153:6347 - Debt Icon (สินเชื่อธนาคาร/หนี้สิน)
  debtIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/df87ad6a-031d-490d-8462-c7e369501712',
  
  // 3153:6359 - Trading Icon (BTCUSD/Long บันชีเสี่ยงสูง)
  tradingIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/86545c4b-beb0-45a1-bd07-e263479536d1',
  
  // 3153:6375 - Expense Icon (ค่าอาหาร/ค่าใช้จ่ายประจำ)
  expenseIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/972623f9-e66b-4bde-9e49-6df6953e947e',
  
  // 3153:6388 - Deposit Icon (ฝากเงิน/บัญชีเทรดความเสี่ยงสูง)
  depositIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f7c47774-1498-4bc2-a4bd-4a44673f3f8c',
  
  // 3153:6404 - Profit Icon (กำไรจาก bot A/บัญชี bot)
  profitIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ba4c7776-685a-48df-83e0-e4a8de75dd53',
} as const;
