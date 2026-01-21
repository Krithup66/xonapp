/**
 * Finance Screen - หน้าจอการเงิน
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3146-6034
 * 
 * Design Specs:
 * - Font: Prompt (Regular, Medium, Bold)
 * - Header Background: #000000
 * - Content Background: #D9D9D9
 * - Icon Container Size: 50x50px
 * - Border Radius: 40px (top corners of content)
 * - Notification Badge: Gradient #DD9B9B → #7B0909
 * - Positive Change Color: #C4FF00
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BottomNavigation } from '../components/shared/BottomNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, G, Rect, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { SvgUri } from 'react-native-svg';
import { FinanceSkeleton } from '../components/shared/SkeletonLoader';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =====================================================
// Responsive Scale Function
// =====================================================
// Base design size is 375px (iPhone X/11/12/13)
const BASE_SCREEN_WIDTH = 375;

// Scale function to make sizes responsive
const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Scale font sizes (smaller scaling factor to maintain readability)
const scaleFont = (size: number) => {
  const ratio = SCREEN_WIDTH / BASE_SCREEN_WIDTH;
  return size * Math.min(ratio, 1.2); // Max 1.2x scaling for fonts
};

// =====================================================
// Design System Constants from Figma (responsive)
// =====================================================
const DESIGN = {
  colors: {
    // Backgrounds
    headerBg: '#000000',
    contentBg: '#D9D9D9',
    iconContainerDark: 'rgba(255,255,255,0.1)',
    iconContainerLight: 'rgba(255,255,255,0.3)', // แก้วใสขุ่น - reduced opacity for frosted glass effect
    
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
  },
  
  sizes: {
    // Icon Containers (responsive)
    iconContainer: scale(50),
    iconContainerSmall: scale(30),
    cryptoIcon: scale(40),
    profileImage: scale(45),
    
    // Border Radius (responsive)
    contentRadius: scale(40),
    iconRadius: 999,
    cardRadius: scale(20),
    badgeRadius: scale(5),
    
    // Font Sizes (responsive, with limited scaling)
    balanceText: scaleFont(24),
    greetingText: scaleFont(14),
    serviceLabelText: scaleFont(12),
    cryptoNameText: scaleFont(12),
    cryptoValueText: scaleFont(14),
    navLabelText: scaleFont(12),
    badgeText: scaleFont(8),
  },
  
  spacing: {
    screenPadding: scale(27),
    contentPadding: scale(21),
    serviceGap: scale(8),
  },
};

// =====================================================
// Data Types & Demo Data
// =====================================================
interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  cost: number;
  value: number;
  change: number;
  quantity: string;
  icon: 'btc' | 'sol' | 'eth';
}

const DEMO_ASSETS: CryptoAsset[] = [
  { id: '1', symbol: 'BTC', name: 'BTC Custom Legac', cost: 100, value: 300, change: 3.17, quantity: 'XXX.XX', icon: 'btc' },
  { id: '2', symbol: 'SOL', name: 'Solana', cost: 100, value: 300, change: 3.17, quantity: 'XXX.XX', icon: 'sol' },
  { id: '3', symbol: 'ETH', name: 'Ethereum', cost: 100, value: 300, change: -3.17, quantity: 'XXX.XX', icon: 'eth' },
];

// Service menu items matching Figma design
interface ServiceItem {
  id: string;
  name: string;
  iconType: 'investment' | 'savings' | 'credit' | 'asset' | 'debt' | 'travel' | 'tax' | 'erp';
}

const SERVICES_ROW1: ServiceItem[] = [
  { id: 'invest', name: 'ลงทุน', iconType: 'investment' },
  { id: 'savings', name: 'บัญชีออม', iconType: 'savings' },
  { id: 'credit', name: 'วงเงิน', iconType: 'credit' },
  { id: 'assets', name: 'สินทรัพย์', iconType: 'asset' },
  { id: 'debt', name: 'หนี้สิน', iconType: 'debt' },
];

const SERVICES_ROW2: ServiceItem[] = [
  { id: 'travel', name: 'ท่องเที่ยว', iconType: 'travel' },
  { id: 'tax', name: 'ภาษี', iconType: 'tax' },
  { id: 'erp', name: 'ERP', iconType: 'erp' },
];

// =====================================================
// SVG Icon Components (ตาม Figma 100%)
// =====================================================

// XON Logo - ใช้ SVG URI จาก Figma Design (ขนาด 57x20px ตาม Design)
const XON_LOGO_URL = 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a5afe849-8437-49e9-9d94-bdde00cafa46';

const XonLogo = () => (
  <SvgUri 
    uri={XON_LOGO_URL}
    width={57}
    height={20}
  />
);

// Icons from Figma - ใช้ SVG URI จาก Figma Design
const ICON_URLS = {
  calendar: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1d4002cf-b85e-4812-b918-48d42dfbfd42',
  notification: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4872a332-00f6-4843-99b0-6ea9d9553a38',
  transfer: 'https://www.figma.com/api/mcp/asset/c448d56b-c1ef-4e48-bd97-0789d06f3f2d', // Transfer Icon from Figma (no background)
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
};

// Calendar Icon
const CalendarIcon = ({ size = 16 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.calendar} width={size} height={size} />
);

// Notification Icon
const NotificationIcon = ({ size = 15 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.notification} width={size} height={size} />
);

// Transfer Icon - สร้างใหม่ด้วย SVG inline (ไอคอนโอนเงิน - Wallet/Purse icon)
const TransferIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Wallet icon */}
    <Path
      d="M19 7H5C3.895 7 3 7.895 3 9V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V9C21 7.895 20.105 7 19 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 10H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle
      cx="17"
      cy="14.5"
      r="1.5"
      fill={color}
    />
  </Svg>
);

// Withdraw Icon
const WithdrawIcon = ({ size = 24 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.withdraw} width={size} height={size} />
);

// Service Icons from Figma - ขนาด 20px ตาม Figma Design (Icon Container 50x50px)
const InvestmentIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.investment} width={size} height={size} />
);

const SavingsIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.savings} width={size} height={size} />
);

const CreditIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.credit} width={size} height={size} />
);

const AssetIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.asset} width={size} height={size} />
);

const DebtIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.debt} width={size} height={size} />
);

const TravelIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.travel} width={50} height={50} />
);

const TaxIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.tax} width={50} height={50} />
);

const ERPIcon = ({ size = 20 }: { size?: number }) => (
  <SvgUri uri={ICON_URLS.erp} width={50} height={50} />
);


// Crypto Icons
const BTCIcon = ({ size = 40 }: { size?: number }) => (
  <View style={[styles.cryptoIconContainer, { width: size, height: size, backgroundColor: DESIGN.colors.btcOrange }]}>
    <Svg width={size * 0.5} height={size * 0.6} viewBox="0 0 20 24" fill="#FFFFFF">
      <Path d="M13.5 9.5C14.5 9 15 8 14.5 6.5C14 5 12.5 4.5 10.5 4.5V2H9V4.5H7.5V2H6V4.5H3V6.5H4.5V17.5H3V19.5H6V22H7.5V19.5H9V22H10.5V19.5C13.5 19.5 15.5 18.5 16 16.5C16.5 14.5 15.5 13 13.5 12.5C14.5 12 15 11 14.5 9.5H13.5ZM6 7H10.5C11.5 7 12.5 7.5 12.5 9C12.5 10.5 11.5 11 10.5 11H6V7ZM11 17H6V13H11C12.5 13 13.5 13.5 13.5 15C13.5 16.5 12.5 17 11 17Z" />
    </Svg>
  </View>
);

const SOLIcon = ({ size = 40 }: { size?: number }) => (
  <View style={[styles.cryptoIconContainer, { width: size, height: size, backgroundColor: '#000000' }]}>
    <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 28 28" fill="none">
      <Defs>
        <SvgLinearGradient id="solGrad1" x1="0" y1="0" x2="28" y2="28">
          <Stop offset="0%" stopColor="#00FFA3" />
          <Stop offset="100%" stopColor="#DC1FFF" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M5 20H20L24 16H9L5 20Z" fill="url(#solGrad1)" />
      <Path d="M5 8H20L24 12H9L5 8Z" fill="url(#solGrad1)" />
      <Path d="M24 8H9L5 12H20L24 8Z" fill="url(#solGrad1)" />
    </Svg>
  </View>
);

const ETHIcon = ({ size = 40 }: { size?: number }) => (
  <View style={[styles.cryptoIconContainer, { width: size, height: size, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0' }]}>
    <Svg width={size * 0.4} height={size * 0.6} viewBox="0 0 16 24" fill="none">
      <Path d="M8 0L0 12L8 16L16 12L8 0Z" fill="#627EEA" />
      <Path d="M8 18L0 14L8 24L16 14L8 18Z" fill="#627EEA" />
      <Path d="M8 0V9L16 12L8 0Z" fill="#C0CBF6" fillOpacity={0.6} />
      <Path d="M8 18V24L16 14L8 18Z" fill="#C0CBF6" fillOpacity={0.6} />
    </Svg>
  </View>
);

// =====================================================
// Service Icon Renderer
// =====================================================
const ServiceIcon = ({ type, size = 20 }: { type: ServiceItem['iconType']; size?: number }) => {
  switch (type) {
    case 'investment': return <InvestmentIcon size={size} />;
    case 'savings': return <SavingsIcon size={size} />;
    case 'credit': return <CreditIcon size={size} />;
    case 'asset': return <AssetIcon size={size} />;
    case 'debt': return <DebtIcon size={size} />;
    case 'travel': return <TravelIcon size={size} />;
    case 'tax': return <TaxIcon size={size} />;
    case 'erp': return <ERPIcon size={size} />;
    default: return null;
  }
};

// =====================================================
// Crypto Icon Renderer
// =====================================================
const CryptoIcon = ({ type, size = 40 }: { type: CryptoAsset['icon']; size?: number }) => {
  switch (type) {
    case 'btc': return <BTCIcon size={size} />;
    case 'sol': return <SOLIcon size={size} />;
    case 'eth': return <ETHIcon size={size} />;
    default: return null;
  }
};

// =====================================================
// Main Component
// =====================================================
export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Real-time balance animation state
  const [balance, setBalance] = useState(123456.78);
  
  // Load data from FinanceService (ตามกฎ: UI เรียกใช้ Service ไม่ใช่ API โดยตรง)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // ใช้ FinanceService แทนการเรียก API โดยตรง
        const { financeService } = await import('../services/FinanceService');
        const assetsResponse = await financeService.getAssets();
        
        // Transform backend assets to CryptoAsset format
        const transformedAssets: CryptoAsset[] = assetsResponse.assets.map((asset: any) => ({
          id: asset.id || '',
          symbol: asset.symbol || '',
          name: asset.name || '',
          cost: asset.currentPrice || 0,
          value: asset.totalValue || 0,
          change: asset.dailyChange || 0,
          quantity: asset.quantity?.toString() || '0',
          icon: mapSymbolToIcon(asset.symbol || ''),
        }));
        
        setAssets(transformedAssets.length > 0 ? transformedAssets : DEMO_ASSETS);
        
        // Load balance
        const balanceResponse = await financeService.getBalance();
        setBalance(balanceResponse.totalBalance || 123456.78);
      } catch (error: any) {
        // Error handling: ใช้ demo data ถ้า API ล้มเหลว
        console.error('Error loading finance data:', error.message);
        setAssets(DEMO_ASSETS);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Helper: Map symbol to icon type
  const mapSymbolToIcon = (symbol: string): 'btc' | 'sol' | 'eth' => {
    const upperSymbol = symbol.toUpperCase();
    if (upperSymbol.includes('BTC') || upperSymbol.includes('BITCOIN')) return 'btc';
    if (upperSymbol.includes('SOL') || upperSymbol.includes('SOLANA')) return 'sol';
    if (upperSymbol.includes('ETH') || upperSymbol.includes('ETHEREUM')) return 'eth';
    return 'btc';
  };
  
  // Update balance with animated numbers (only when not loading)
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      // Generate random balance between 100,000 and 999,999.99
      const minBalance = 100000;
      const maxBalance = 999999.99;
      const newBalance = Math.random() * (maxBalance - minBalance) + minBalance;
      setBalance(newBalance);
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  // Format balance to USD format
  const formatBalance = (amount: number): string => {
    return `USD ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Calculate responsive dimensions
  const BOTTOM_NAV_WIDTH = SCREEN_WIDTH * 0.888; // 333/375 = 0.888 (88.8% of screen width)
  const BOTTOM_NAV_LEFT = (SCREEN_WIDTH - BOTTOM_NAV_WIDTH) / 2; // Center the nav bar
  const SERVICE_ITEM_WIDTH = SCREEN_WIDTH * 0.16; // ~60px on 375px screen, scales proportionally
  const SERVICE_GAP = SCREEN_WIDTH * 0.0213; // ~8px on 375px screen

  // Show skeleton screen while loading
  if (isLoading) {
    return <FinanceSkeleton />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* =====================================================
          Header Section - Black Background
          ===================================================== */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {/* Top Bar - Profile & Notifications */}
        <View style={styles.topBar}>
          {/* User Info Container */}
          <View style={styles.userInfoContainer}>
            {/* Profile Image - Generated Circle with Gradient */}
            <View style={styles.profileImageContainer}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileImageGradient}
              >
                <Svg width={scale(45)} height={scale(45)} viewBox="0 0 45 45">
                  {/* User icon - face circle */}
                  <Circle cx="22.5" cy="16" r="6" fill="#FFFFFF" opacity={0.9} />
                  {/* User icon - body semi-circle */}
                  <Path
                    d="M9 35C9 28.5 15 24 22.5 24C30 24 36 28.5 36 35"
                    fill="#FFFFFF"
                    opacity={0.9}
                  />
                </Svg>
              </LinearGradient>
            </View>
            
            {/* User Details */}
            <View style={styles.userDetails}>
              <XonLogo />
              <Text style={styles.greetingText}>สวัสดีคุณ SniperX</Text>
            </View>
          </View>

          {/* Right Icons - Calendar & Notification */}
          <View style={styles.headerIcons}>
            {/* Calendar Icon */}
            <TouchableOpacity style={styles.iconButton}>
              <View style={styles.iconButtonInner}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.glassGradient}
                />
                <CalendarIcon size={scale(16)} />
              </View>
            </TouchableOpacity>

            {/* Notification Icon with Badge */}
            <View style={styles.notificationContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <View style={styles.iconButtonInner}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.glassGradient}
                  />
                  <NotificationIcon size={scale(15)} />
                </View>
              </TouchableOpacity>
              <LinearGradient
                colors={[DESIGN.colors.notificationBadgeStart, DESIGN.colors.notificationBadgeEnd]}
                style={styles.notificationBadge}
              >
                <Text style={styles.badgeText}>3</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Balance Display */}
        <TouchableOpacity
          style={styles.balanceContainer}
          onPress={() => router.push('/transaction-summary')}
        >
          <Text style={styles.balanceText}>{formatBalance(balance)}</Text>
        </TouchableOpacity>

        {/* Transfer & Withdraw Buttons */}
        <View style={styles.quickActionsContainer}>
          {/* Transfer Button */}
          <TouchableOpacity style={styles.quickActionItem}>
            <View style={styles.quickActionIconContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassGradient}
              />
              <TransferIcon size={scale(24)} />
            </View>
            <Text style={styles.quickActionLabel}>โอน</Text>
          </TouchableOpacity>

          {/* Withdraw Button */}
          <TouchableOpacity style={styles.quickActionItem}>
            <View style={styles.quickActionIconContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassGradient}
              />
              <WithdrawIcon size={scale(24)} />
            </View>
            <Text style={styles.quickActionLabel}>ถอน</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* =====================================================
          Content Container - Gray Background with Rounded Top
          ===================================================== */}
      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Services Grid - Row 1 (5 items) */}
          <View style={styles.servicesRow}>
            {SERVICES_ROW1.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceItem}>
                <View style={styles.serviceIconContainer}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.15)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.glassGradient}
                  />
                  <ServiceIcon type={service.iconType} size={20} />
                </View>
                <Text style={styles.serviceLabel}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Services Grid - Row 2 (3 items) */}
          <View style={styles.servicesRow}>
            {SERVICES_ROW2.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceItem}>
                <View style={styles.serviceIconContainer}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.15)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.glassGradient}
                  />
                  <ServiceIcon type={service.iconType} size={20} />
                </View>
                <Text style={styles.serviceLabel}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Crypto Assets List */}
          <View style={styles.assetsContainer}>
            {assets.map((asset) => (
              <TouchableOpacity key={asset.id} style={styles.assetCard}>
                {/* Left - Icon & Info */}
                <View style={styles.assetLeft}>
                  <CryptoIcon type={asset.icon} size={scale(40)} />
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <View style={styles.assetPriceRow}>
                      <Text style={styles.assetCost}>US $ {asset.cost.toFixed(2)}</Text>
                      <Text style={[styles.assetChange, { color: asset.change >= 0 ? DESIGN.colors.positive : '#FF0000' }]}>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right - Value & Quantity */}
                <View style={styles.assetRight}>
                  <Text style={styles.assetValue}>US $ {asset.value.toFixed(2)}</Text>
                  <Text style={styles.assetQuantity}>{asset.quantity} {asset.symbol}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation - ใช้ shared component */}
        <BottomNavigation isLightBackground={true} />
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.headerBg,
  },

  // Header Section
  header: {
    backgroundColor: DESIGN.colors.headerBg,
    paddingHorizontal: DESIGN.spacing.screenPadding,
    paddingBottom: scale(20),
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(30),
  },

  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(17),
  },

  profileImageContainer: {
    width: DESIGN.sizes.profileImage, // 45px (responsive)
    height: DESIGN.sizes.profileImage, // 45px (responsive)
    borderRadius: DESIGN.sizes.profileImage / 2, // 22.5px (half of width/height) = perfect circle
    overflow: 'hidden', // ครอบรูปภาพให้อยู่ในวงกลม ไม่ให้ล้นขอบ
    backgroundColor: 'transparent', // ไม่มี background
  },

  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // ปรับรูปให้ครอบเต็ม container โดยรักษาสัดส่วน ไม่ล้นขอบ
  },

  profileImageGradient: {
    width: '100%',
    height: '100%',
    borderRadius: DESIGN.sizes.profileImage / 2, // Match container border radius for perfect circle
    justifyContent: 'center',
    alignItems: 'center',
  },

  userDetails: {
    gap: scale(8),
  },

  greetingText: {
    fontFamily: 'Prompt-Bold',
    fontSize: DESIGN.sizes.greetingText,
    color: DESIGN.colors.textWhite,
  },

  headerIcons: {
    flexDirection: 'row',
    gap: scale(6),
  },

  iconButton: {
    width: DESIGN.sizes.iconContainerSmall,
    height: DESIGN.sizes.iconContainerSmall,
    borderRadius: DESIGN.sizes.iconRadius,
    backgroundColor: 'rgba(255,255,255,0.1)', // Glass effect - แก้วใสขุ่น
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // ขอบแก้วใส
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // สำหรับ gradient overlay
  },

  iconButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  glassGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: DESIGN.sizes.iconRadius,
  },

  notificationContainer: {
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: scale(-5),
    right: scale(-5),
    width: scale(17),
    height: scale(15),
    borderRadius: DESIGN.sizes.badgeRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.badgeText,
    color: DESIGN.colors.textWhite,
    textAlign: 'center',
  },

  // Balance
  balanceContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },

  balanceText: {
    fontFamily: 'Prompt-Bold',
    fontSize: DESIGN.sizes.balanceText,
    color: DESIGN.colors.textWhite,
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16, // ระยะห่างระหว่างปุ่มโอนและถอน 16px
  },

  quickActionItem: {
    alignItems: 'center',
    minWidth: scale(60),
    flex: 1,
    maxWidth: scale(80), // Prevent items from being too wide on large screens
    gap: scale(3),
  },

  quickActionIconContainer: {
    width: DESIGN.sizes.iconContainer,
    height: DESIGN.sizes.iconContainer,
    borderRadius: DESIGN.sizes.iconRadius,
    backgroundColor: 'rgba(255,255,255,0.1)', // Glass effect - แก้วใสขุ่น
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // ขอบแก้วใส
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // สำหรับ gradient overlay
    position: 'relative',
  },

  quickActionLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.serviceLabelText,
    color: DESIGN.colors.textWhite,
    textAlign: 'center',
  },

  // Content Container
  contentContainer: {
    flex: 1,
    backgroundColor: DESIGN.colors.contentBg,
    borderTopLeftRadius: DESIGN.sizes.contentRadius,
    borderTopRightRadius: DESIGN.sizes.contentRadius,
    overflow: 'hidden',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: scale(15),
    paddingHorizontal: DESIGN.spacing.contentPadding,
    paddingBottom: scale(120),
  },

  // Services Grid
  servicesRow: {
    flexDirection: 'row',
    marginBottom: scale(15),
    justifyContent: 'flex-start', // Align items to the start
  },

  serviceItem: {
    width: scale(60), // Fixed width to match Figma (60px base)
    alignItems: 'center',
    marginRight: scale(8), // Responsive gap between service items (8px base)
    gap: scale(3),
  },

  serviceIconContainer: {
    width: DESIGN.sizes.iconContainer,
    height: DESIGN.sizes.iconContainer,
    borderRadius: DESIGN.sizes.iconRadius,
    backgroundColor: 'rgba(255,255,255,0.3)', // Glass effect - แก้วใสขุ่น (บนพื้นเทา)
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)', // ขอบแก้วใส
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // สำหรับ gradient overlay
    position: 'relative',
  },

  serviceLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.serviceLabelText, // Use responsive font size
    color: '#000000',
    textAlign: 'center',
    // multilineTextAlignment: center equivalent
    // maxWidth: .infinity equivalent - handled by parent container
  },

  // Assets List
  assetsContainer: {
    marginTop: scale(20),
  },

  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', // Background สีเทาอ่อนตาม Figma
    borderRadius: DESIGN.sizes.cardRadius,
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    marginBottom: scale(3),
    minHeight: scale(67), // Use minHeight instead of fixed height
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Border อ่อนๆ
  },

  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  cryptoIconContainer: {
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },

  assetInfo: {
    marginLeft: scale(12),
    flex: 1,
  },

  assetName: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.cryptoNameText,
    color: DESIGN.colors.textBlack,
    marginBottom: scale(2),
  },

  assetPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  assetCost: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.cryptoNameText,
    color: DESIGN.colors.textBlack,
    marginRight: scale(8),
  },

  assetChange: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.cryptoNameText,
  },

  assetRight: {
    alignItems: 'flex-end',
  },

  assetValue: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.cryptoValueText,
    color: DESIGN.colors.textBlack,
    marginBottom: scale(2),
  },

  assetQuantity: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.cryptoNameText,
    color: DESIGN.colors.textBlack,
  },

  // Bottom Navigation - จะถูก override ด้วย dynamic values ใน JSX
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    height: scale(52), // Responsive height
    flexDirection: 'row',
    justifyContent: 'center', // จัดให้อยู่กึ่งกลาง
    alignItems: 'center',
    paddingTop: scale(7), // Responsive padding
    paddingBottom: scale(7), // Responsive padding
    backgroundColor: 'rgba(0,0,0,0)', // Background transparent ตาม Figma
    borderRadius: 9999, // Fully rounded (pill shape) ตาม Figma rounded-[9999px]
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)', // Border รอบทั้งหมด
  },

  navItem: {
    alignItems: 'center',
    width: scale(38),
    height: scale(37),
    justifyContent: 'center',
    gap: scale(2),
  },

  navLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: DESIGN.sizes.navLabelText,
    color: DESIGN.colors.textBlack,
  },

  navLabelBold: {
    fontFamily: 'Prompt-Bold',
  },

  navLabelActive: {
    fontFamily: 'Prompt-Medium',
    color: '#666666',
  },
});
