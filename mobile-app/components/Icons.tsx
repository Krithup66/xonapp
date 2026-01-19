/**
 * Icons Component - ไอคอนทั้งหมดจาก Figma Design
 * อัปเดตตาม Figma: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Rect, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';

// Icon URLs from Figma (these will be replaced with local assets in production)
export const FIGMA_ICONS = {
  logo: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3001720b-0fa1-4309-81f6-1f54b93a7254',
  calendar: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/efe7856e-8df9-42d1-8d80-b3f1dfcf26e8',
  notification: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/76292bd4-da1d-4255-8ad0-45b077980d7c',
  transfer: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d28cc9a3-6b42-4d1e-bd9e-f9f29d2521ff',
  withdraw: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ed3b21c9-858f-42b3-a94f-dd99acd7e4fb',
  investment: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d91109c8-e1ab-40de-bd3f-0a6a97fb402c',
  savings: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fe98a53b-6c48-43a5-a95f-67447c62bc4b',
  credit: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5ba94b9a-67ab-4199-911b-46f374079eae',
  asset: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/896f19b4-44f4-4ff3-90d3-f79a41613077',
  debt: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7bde83a1-44aa-43b5-a718-dc465c2dad1f',
  travel: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/845efd5b-6b2f-4a75-b7fe-afa827a514d9',
  tax: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6cdf401f-0547-4b02-9149-38fc9169202a',
  erp: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3eb20f95-68c2-483d-9ea6-e37e1d9015ca',
  navTrade: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ce51b3e8-4523-4a58-9775-08fb46db8d59',
  navAssistant: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4af085f3-b33a-4945-a548-f2492da00d61',
  navCommunity: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/91277326-f07b-4a6d-a566-b95c3655017f',
  navFinance: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8e1a8d09-426a-4e8d-8eba-7421dc9d3ce1',
  navXon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/dd4a036f-05af-4df0-a7bb-8996d6e78b8e',
};

interface IconProps {
  size?: number;
  color?: string;
}

// XON Logo Component
export const XonLogo: React.FC<IconProps> = ({ size = 57 }) => (
  <Image 
    source={{ uri: FIGMA_ICONS.logo }} 
    style={{ width: size, height: size * 0.35 }}
    resizeMode="contain"
  />
);

// Calendar Icon
export const CalendarIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M12.667 2.667H3.333C2.597 2.667 2 3.264 2 4v9.333c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.667 1.333v2.667M5.333 1.333v2.667M2 6.667h12"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Notification/Bell Icon
export const NotificationIcon: React.FC<IconProps> = ({ size = 15, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <Path
      d="M11.25 5a3.75 3.75 0 10-7.5 0c0 4.375-1.875 5.625-1.875 5.625h11.25S11.25 9.375 11.25 5z"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.581 13.125a1.25 1.25 0 01-2.162 0"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Transfer Icon (Two arrows up/down)
export const TransferIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 10l5-5 5 5M7 14l5 5 5-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Withdraw Icon
export const WithdrawIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth={1.5} />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.5} />
    <Path d="M6 12h.01M18 12h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Investment Icon (Coins stack)
export const InvestmentIcon: React.FC<IconProps> = ({ size = 21, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Circle cx="10.5" cy="7.5" r="5" stroke={color} strokeWidth={1.5} />
    <Path d="M5.5 13.5c0 2.761 2.239 5 5 5s5-2.239 5-5" stroke={color} strokeWidth={1.5} />
    <Path d="M10.5 5.5v4M8.5 7.5h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

// Savings Icon (Wallet with money)
export const SavingsIcon: React.FC<IconProps> = ({ size = 21, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Path
      d="M17.5 7h-14a1 1 0 00-1 1v9a1 1 0 001 1h14a1 1 0 001-1V8a1 1 0 00-1-1z"
      stroke={color}
      strokeWidth={1.5}
    />
    <Path
      d="M14 12.5a.5.5 0 100-1 .5.5 0 000 1z"
      fill={color}
    />
    <Path d="M5.5 7V5a2 2 0 012-2h6a2 2 0 012 2v2" stroke={color} strokeWidth={1.5} />
  </Svg>
);

// Credit/Loan Icon (Stack of bills)
export const CreditIcon: React.FC<IconProps> = ({ size = 21, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Rect x="3" y="5" width="15" height="10" rx="1" stroke={color} strokeWidth={1.5} />
    <Circle cx="10.5" cy="10" r="2.5" stroke={color} strokeWidth={1.5} />
    <Path d="M3 15h15M3 17h15" stroke={color} strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

// Asset/Property Icon (Magnifying glass with house)
export const AssetIcon: React.FC<IconProps> = ({ size = 20, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Circle cx="8.5" cy="8.5" r="5.5" stroke={color} strokeWidth={1.5} />
    <Path d="M13 13l4 4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Path d="M8.5 5.5v3M6.5 7h4" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
  </Svg>
);

// Debt Icon (Chart with dollar)
export const DebtIcon: React.FC<IconProps> = ({ size = 20, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path d="M2 17l5-5 3 3 7-8" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="15" cy="5" r="3" stroke={color} strokeWidth={1.2} />
    <Path d="M15 4v2M14.2 5h1.6" stroke={color} strokeWidth={0.8} strokeLinecap="round" />
  </Svg>
);

// Travel Icon (Airplane)
export const TravelIcon: React.FC<IconProps> = ({ size = 24, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Tax Icon (Document with percent)
export const TaxIcon: React.FC<IconProps> = ({ size = 24, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14 2v6h6M9 15l6-6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx="9.5" cy="9.5" r="1" fill={color} />
    <Circle cx="14.5" cy="14.5" r="1" fill={color} />
  </Svg>
);

// ERP Icon (Bar chart)
export const ERPIcon: React.FC<IconProps> = ({ size = 24, color = 'rgba(0,0,0,0.5)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Home Icon (for navigation)
export const HomeIcon: React.FC<IconProps> = ({ size = 20, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M2.5 7.5l7.5-5 7.5 5v9.167a1.667 1.667 0 01-1.667 1.666H4.167A1.667 1.667 0 012.5 16.667V7.5z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M7.5 18.333V10h5v8.333" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Finance Icon (for navigation)
export const FinanceIcon: React.FC<IconProps> = ({ size = 20, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 1.667L2.5 5v6.667c0 4.166 3.2 8.066 7.5 8.666 4.3-.6 7.5-4.5 7.5-8.666V5L10 1.667z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M7.5 10l2.5 2.5 5-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Community Icon (People)
export const CommunityIcon: React.FC<IconProps> = ({ size = 34, color = '#000000' }) => (
  <Svg width={size} height={size * 0.5} viewBox="0 0 34 17" fill="none">
    <Circle cx="17" cy="5" r="4" stroke={color} strokeWidth={1.5} />
    <Path d="M10 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Circle cx="7" cy="6" r="3" stroke={color} strokeWidth={1.2} />
    <Path d="M2 15c0-2.761 2.239-5 5-5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    <Circle cx="27" cy="6" r="3" stroke={color} strokeWidth={1.2} />
    <Path d="M32 15c0-2.761-2.239-5-5-5" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
  </Svg>
);

// Assistant Icon (Brain/AI)
export const AssistantIcon: React.FC<IconProps> = ({ size = 20, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Circle cx="10" cy="10" r="7" stroke={color} strokeWidth={1.5} />
    <Path
      d="M10 7v3l2 2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="10" cy="3" r="1" fill={color} />
    <Circle cx="10" cy="17" r="1" fill={color} />
    <Circle cx="3" cy="10" r="1" fill={color} />
    <Circle cx="17" cy="10" r="1" fill={color} />
  </Svg>
);

// Trade Icon (Chart with arrow)
export const TradeIcon: React.FC<IconProps> = ({ size = 20, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M18.333 5l-6.666 6.667-4.167-4.167L1.667 13.333"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.333 5h5v5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Crypto Icons
export const BitcoinIcon: React.FC<IconProps> = ({ size = 40 }) => (
  <View style={[styles.cryptoIcon, { width: size, height: size, backgroundColor: '#F7931A' }]}>
    <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 20 20" fill="none">
      <Path
        d="M13.5 8.5c.5-.5.8-1.2.5-2-.4-1-1.5-1.5-3-1.5V3h-1v2H8V3H7v2H4v2h1.5v6H4v2h3v2h1v-2h2v2h1v-2c2 0 3.5-.5 4-2 .4-1.2-.1-2.2-1.5-2.5zM6.5 7h3c1 0 1.5.5 1.5 1s-.5 1-1.5 1h-3V7zm3.5 6h-3.5v-2h3.5c1 0 1.5.5 1.5 1s-.5 1-1.5 1z"
        fill="#FFFFFF"
      />
    </Svg>
  </View>
);

export const SolanaIcon: React.FC<IconProps> = ({ size = 40 }) => (
  <View style={[styles.cryptoIcon, { width: size, height: size, backgroundColor: '#000000' }]}>
    <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <LinearGradient id="solGrad" x1="0" y1="0" x2="24" y2="24">
        <Stop offset="0%" stopColor="#9945FF" />
        <Stop offset="50%" stopColor="#14F195" />
        <Stop offset="100%" stopColor="#00D1FF" />
      </LinearGradient>
      <Path d="M4 17h12l4-4H8l-4 4z" fill="url(#solGrad)" />
      <Path d="M4 7h12l4 4H8L4 7z" fill="url(#solGrad)" />
      <Path d="M4 12h16" stroke="url(#solGrad)" strokeWidth={2} />
    </Svg>
  </View>
);

export const EthereumIcon: React.FC<IconProps> = ({ size = 40 }) => (
  <View style={[styles.cryptoIcon, { width: size, height: size, backgroundColor: '#FFFFFF' }]}>
    <Svg width={size * 0.5} height={size * 0.6} viewBox="0 0 16 24" fill="none">
      <Path d="M8 0l8 12-8 4.8L0 12 8 0z" fill="#627EEA" />
      <Path d="M8 18l8-6-8 12-8-12 8 6z" fill="#627EEA" />
      <Path d="M8 0v9l7 3-7-12z" fill="#C0CBF6" fillOpacity={0.6} />
      <Path d="M8 18v6l8-12-8 6z" fill="#C0CBF6" fillOpacity={0.6} />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  cryptoIcon: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  XonLogo,
  CalendarIcon,
  NotificationIcon,
  TransferIcon,
  WithdrawIcon,
  InvestmentIcon,
  SavingsIcon,
  CreditIcon,
  AssetIcon,
  DebtIcon,
  TravelIcon,
  TaxIcon,
  ERPIcon,
  HomeIcon,
  FinanceIcon,
  CommunityIcon,
  AssistantIcon,
  TradeIcon,
  BitcoinIcon,
  SolanaIcon,
  EthereumIcon,
};
