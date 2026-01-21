/**
 * Shared Bottom Navigation Component
 * ใช้ร่วมกันทุกหน้า
 * 
 * - หน้าการเงิน (isLightBackground=true): ไอคอน inactive=สีดำ, active=สีแดงเลือดหมู
 * - หน้าอื่นๆ (isLightBackground=false): ไอคอน inactive=สีขาว, active=สีแดงเลือดหมู
 * 
 * ไอคอน URIs จาก Figma: node-id=3238-5558
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Icon URLs จาก Figma - Bottom Navigation
// หน้า xon (node-id=3015-7051), หน้าการเงิน (node-id=3146-6034), หน้า Trade (node-id=3261-4947), หน้าชุมชน (node-id=3121-5729)
const ICON_URLS = {
  // หน้า xon (node-id=3015-7051) - ใช้ figma-alpha-api URLs จาก get_image
  navXonTrade: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/84992ec8-56bf-4c10-8683-188d94fae424',      // Trade (3021:7093)
  navXonAssistant: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e39bc892-5832-4fe8-9466-93393953e453', // ผู้ช่วย (3015:7061)
  navXonCommunity: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8dba3ece-1fb0-44b5-92a1-948336d9e935',  // ชุมชน (3015:7059)
  navXonFinance: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/89819e28-8e5e-42d6-b9dd-f9e5de43973b',   // การเงิน (3015:7057)
  navXonXon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b633367d-0ec9-4e53-9070-076daa59c45f',        // xon (3015:7055)
  
  // หน้า Trade (node-id=3261-4947)
  navTradeTrade: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5c13b84c-725f-4c18-a851-c5702a9651ee',  // Trade (3261:4956)
  navTradeAssistant: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6c1fa1a9-0734-4de8-af8b-0ac027b1ecab', // ผู้ช่วย (3261:4959)
  navTradeCommunity: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3f544a57-73ea-4b36-8693-ebd28a4206e3', // ชุมชน (3261:4962)
  navTradeFinance: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/72f8a8a6-0223-441a-9c73-584b325cc70e',  // การเงิน (3261:4965)
  navTradeXon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fe8a6c2f-9e64-4953-8633-97d2c73eb552',      // xon (3261:4968)
  
  // หน้าการเงิน (node-id=3146-6034)
  navFinanceTrade: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c442fdc4-74b2-4c62-8545-e31e9e274a33',  // Trade (3146:6122)
  navFinanceAssistant: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f603a858-860f-4c8e-8998-b5a5ff942904', // ผู้ช่วย (3146:6125)
  navFinanceCommunity: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/55fed053-5255-4170-8415-4eb6be5b32b9', // ชุมชน (3146:6128)
  navFinanceFinance: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/55f67c52-1bca-40bd-b467-c6effba47369',  // การเงิน (3146:6131)
  navFinanceXon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2b8ded60-60da-4323-97ce-78926af34e1c',      // xon (3146:6134)
  
  // หน้าชุมชน (node-id=3121-5729) - ดึงจาก Figma design context
  navCommunityTrade: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c442fdc4-74b2-4c62-8545-e31e9e274a33',  // Trade - ใช้จาก Finance (จะอัปเดตเมื่อมี URI เฉพาะ)
  navCommunityAssistant: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f603a858-860f-4c8e-8998-b5a5ff942904', // ผู้ช่วย - ใช้จาก Finance (จะอัปเดตเมื่อมี URI เฉพาะ)
  navCommunityCommunity: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/55fed053-5255-4170-8415-4eb6be5b32b9', // ชุมชน - ใช้จาก Finance (จะอัปเดตเมื่อมี URI เฉพาะ)
  navCommunityFinance: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/55f67c52-1bca-40bd-b467-c6effba47369',  // การเงิน - ใช้จาก Finance (จะอัปเดตเมื่อมี URI เฉพาะ)
  navCommunityXon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2b8ded60-60da-4323-97ce-78926af34e1c',      // xon - ใช้จาก Finance (จะอัปเดตเมื่อมี URI เฉพาะ)
};

// สี
const ACTIVE_COLOR = '#7B0909'; // สีแดงเลือดหมู

interface BottomNavigationProps {
  isLightBackground?: boolean; // true = หน้าการเงิน (ไอคอนสีดำ), false = หน้าอื่น (ไอคอนสีขาว)
}

// Icon Components - ใช้ SvgUri เพื่อแสดง SVG จาก Figma ด้วย URI
// รองรับทั้งหน้า xon, Trade, Community และหน้าอื่นๆ
const HomeNavIcon = ({ size = 20, isTradePage = false, isXonPage = false, isCommunityPage = false }: { size?: number; isTradePage?: boolean; isXonPage?: boolean; isCommunityPage?: boolean }) => {
  let uri = ICON_URLS.navFinanceXon;
  if (isXonPage) uri = ICON_URLS.navXonXon;
  else if (isTradePage) uri = ICON_URLS.navTradeXon;
  else if (isCommunityPage) uri = ICON_URLS.navCommunityXon;
  return <SvgUri uri={uri} width={size} height={size} />;
};

const FinanceNavIcon = ({ size = 20, isTradePage = false, isXonPage = false, isCommunityPage = false }: { size?: number; isTradePage?: boolean; isXonPage?: boolean; isCommunityPage?: boolean }) => {
  let uri = ICON_URLS.navFinanceFinance;
  if (isXonPage) uri = ICON_URLS.navXonFinance;
  else if (isTradePage) uri = ICON_URLS.navTradeFinance;
  else if (isCommunityPage) uri = ICON_URLS.navCommunityFinance;
  return <SvgUri uri={uri} width={size} height={size} />;
};

const CommunityNavIcon = ({ size = 34, height = 17, isTradePage = false, isXonPage = false, isCommunityPage = false, isActive = false }: { size?: number; height?: number; isTradePage?: boolean; isXonPage?: boolean; isCommunityPage?: boolean; isActive?: boolean }) => {
  let uri = ICON_URLS.navFinanceCommunity;
  if (isXonPage) uri = ICON_URLS.navXonCommunity;
  else if (isTradePage) uri = ICON_URLS.navTradeCommunity;
  else if (isCommunityPage) uri = ICON_URLS.navCommunityCommunity;
  
  // ใช้ SvgUri สำหรับทั้ง active และ inactive
  // สำหรับ active state icon จะใช้ URI ที่มีสีแดงเลือดหมูอยู่แล้วจาก Figma
  // หรือใช้ overlay เพื่อสร้างสีแดงเลือดหมู
  return (
    <View style={{ position: 'relative', width: size, height: height || size }}>
      <SvgUri uri={uri} width={size} height={height || size} />
      {isActive && (
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: height || size,
            backgroundColor: '#FF6B9D',
            opacity: 0.6,
            borderRadius: 2,
          }}
          pointerEvents="none"
        />
      )}
    </View>
  );
};

const AssistantNavIcon = ({ size = 20, isTradePage = false, isXonPage = false, isCommunityPage = false }: { size?: number; isTradePage?: boolean; isXonPage?: boolean; isCommunityPage?: boolean }) => {
  let uri = ICON_URLS.navFinanceAssistant;
  if (isXonPage) uri = ICON_URLS.navXonAssistant;
  else if (isTradePage) uri = ICON_URLS.navTradeAssistant;
  else if (isCommunityPage) uri = ICON_URLS.navCommunityAssistant;
  return <SvgUri uri={uri} width={size} height={size} />;
};

const TradeNavIcon = ({ size = 20, isTradePage = false, isXonPage = false, isCommunityPage = false }: { size?: number; isTradePage?: boolean; isXonPage?: boolean; isCommunityPage?: boolean }) => {
  let uri = ICON_URLS.navFinanceTrade;
  if (isXonPage) uri = ICON_URLS.navXonTrade;
  else if (isTradePage) uri = ICON_URLS.navTradeTrade;
  else if (isCommunityPage) uri = ICON_URLS.navCommunityTrade;
  return <SvgUri uri={uri} width={size} height={size} />;
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ isLightBackground = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // ตรวจสอบว่าอยู่หน้าไหน
  const isTradePage = pathname === '/trade';
  const isXonPage = pathname === '/';
  const isCommunityPage = pathname === '/community';

  // กำหนดสี text
  const textColor = isLightBackground ? '#000000' : '#FFFFFF';
  const activeTextColor = ACTIVE_COLOR;

  // ฟังก์ชันเลือกสี text ตาม Figma design
  const getTextStyle = (route: string) => {
    const isActive = pathname === route;
    
    // กำหนด font family ตาม Figma
    let fontFamily = 'Prompt-Regular';
    if (route === '/') {
      fontFamily = 'Prompt-Bold'; // xon ใช้ Bold
    } else if (route === '/trade') {
      fontFamily = 'Prompt-Medium'; // Trade ใช้ Medium
    } else if (route === '/finance') {
      fontFamily = isActive ? 'Prompt-Medium' : 'Prompt-Regular'; // การเงิน active ใช้ Medium
    } else if (route === '/community') {
      fontFamily = isActive ? 'Prompt-Medium' : 'Prompt-Regular'; // ชุมชน active ใช้ Medium
    }
    
    return { 
      color: isActive ? activeTextColor : textColor, 
      fontFamily 
    };
  };

  // สำหรับหน้า xon: bottom navigation อยู่ที่ y: 734 จากด้านบน (812 - 734 - 51 = 27px จากด้านล่าง)
  // สำหรับหน้าอื่นๆ: อยู่ที่ด้านล่างสุด
  const bottomPosition = isXonPage 
    ? scale(27) // 27px from bottom for xon page (812 - 734 - 51)
    : 0;

  return (
    <View style={[
      styles.bottomNav, 
      { 
        bottom: isXonPage ? bottomPosition : insets.bottom,
        left: (SCREEN_WIDTH - scale(333)) / 2, // Center 333px width
        width: scale(333),
        paddingHorizontal: scale(23),
        paddingVertical: scale(7),
        gap: scale(24),
        backgroundColor: 'rgba(0,0,0,0)', // Transparent background ตาม Figma
        borderColor: isLightBackground ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)',
      }
    ]}>
      {isXonPage ? (
        // ลำดับสำหรับหน้า xon: xon, การเงิน, ชุมชน, ผู้ช่วย, Trade
        <>
          {/* xon / Home - Active */}
          <TouchableOpacity style={[styles.navItem, pathname === '/' && styles.tradeActiveItem]} onPress={() => router.push('/')}>
            <HomeNavIcon size={scale(20)} isXonPage={true} />
            <Text 
              style={[
                styles.navLabel, 
                pathname === '/' 
                  ? { fontFamily: 'Prompt-Bold', color: '#710f0f' } 
                  : getTextStyle('/')
              ]}
              numberOfLines={1}
            >
              xon
            </Text>
          </TouchableOpacity>

          {/* การเงิน / Finance */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/finance')}>
            <FinanceNavIcon size={scale(20)} isXonPage={true} />
            <Text style={[styles.navLabel, getTextStyle('/finance')]} numberOfLines={1}>การเงิน</Text>
          </TouchableOpacity>

          {/* ชุมชน / Community */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/community')}>
            <CommunityNavIcon 
              size={scale(34)} 
              height={scale(17)} 
              isXonPage={true} 
              isActive={pathname === '/community'}
            />
            <Text style={[styles.navLabel, getTextStyle('/community')]} numberOfLines={1}>ชุมชน</Text>
          </TouchableOpacity>

          {/* ผู้ช่วย / Assistant */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/assistant')}>
            <AssistantNavIcon size={scale(20)} isXonPage={true} />
            <Text style={[styles.navLabel, getTextStyle('/assistant')]} numberOfLines={1}>ผู้ช่วย</Text>
          </TouchableOpacity>

          {/* Trade */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/trade')}>
            <TradeNavIcon size={scale(20)} isXonPage={true} />
            <Text style={[styles.navLabel, getTextStyle('/trade')]} numberOfLines={1}>Trade</Text>
          </TouchableOpacity>
        </>
      ) : isTradePage ? (
        // ลำดับสำหรับหน้า Trade: xon, การเงิน, ชุมชน, ผู้ช่วย, Trade
        <>
          {/* xon / Home */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
            <HomeNavIcon size={scale(20)} isTradePage={true} />
            <Text style={[styles.navLabel, getTextStyle('/')]} numberOfLines={1}>xon</Text>
          </TouchableOpacity>

          {/* การเงิน / Finance */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/finance')}>
            <FinanceNavIcon size={scale(20)} isTradePage={true} />
            <Text style={[styles.navLabel, getTextStyle('/finance')]} numberOfLines={1}>การเงิน</Text>
          </TouchableOpacity>

          {/* ชุมชน / Community */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/community')}>
            <CommunityNavIcon 
              size={scale(34)} 
              height={scale(17)} 
              isTradePage={true} 
              isActive={pathname === '/community'}
            />
            <Text style={[styles.navLabel, getTextStyle('/community')]} numberOfLines={1}>ชุมชน</Text>
          </TouchableOpacity>

          {/* ผู้ช่วย / Assistant */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/assistant')}>
            <AssistantNavIcon size={scale(20)} isTradePage={true} />
            <Text style={[styles.navLabel, getTextStyle('/assistant')]} numberOfLines={1}>ผู้ช่วย</Text>
          </TouchableOpacity>

          {/* Trade - Active */}
          <TouchableOpacity style={[styles.navItem, pathname === '/trade' && styles.tradeActiveItem]} onPress={() => router.push('/trade')}>
            <TradeNavIcon size={scale(20)} isTradePage={true} />
            <Text 
              style={[
                styles.navLabel, 
                pathname === '/trade' 
                  ? { fontFamily: 'Prompt-Medium', color: '#710f0f' } 
                  : getTextStyle('/trade')
              ]}
              numberOfLines={1}
            >
              Trade
            </Text>
          </TouchableOpacity>
        </>
      ) : isCommunityPage ? (
        // ลำดับสำหรับหน้าชุมชน: xon, การเงิน, ชุมชน, ผู้ช่วย, Trade
        <>
          {/* xon / Home */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
            <HomeNavIcon size={scale(20)} isCommunityPage={true} />
            <Text style={[styles.navLabel, getTextStyle('/')]} numberOfLines={1}>xon</Text>
          </TouchableOpacity>

          {/* การเงิน / Finance */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/finance')}>
            <FinanceNavIcon size={scale(20)} isCommunityPage={true} />
            <Text style={[styles.navLabel, getTextStyle('/finance')]} numberOfLines={1}>การเงิน</Text>
          </TouchableOpacity>

          {/* ชุมชน / Community - Active */}
          <TouchableOpacity 
            style={[styles.navItem, pathname === '/community' && styles.communityActiveItem]} 
            onPress={() => router.push('/community')}
          >
            <CommunityNavIcon 
              size={scale(34)} 
              height={scale(17)} 
              isCommunityPage={true} 
              isActive={pathname === '/community'}
            />
            <Text 
              style={[
                styles.navLabel, 
                pathname === '/community' 
                  ? { fontFamily: 'Prompt-Medium', color: '#FF6B9D' } 
                  : getTextStyle('/community')
              ]}
              numberOfLines={1}
            >
              ชุมชน
            </Text>
          </TouchableOpacity>

          {/* ผู้ช่วย / Assistant */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/assistant')}>
            <AssistantNavIcon size={scale(20)} isCommunityPage={true} />
            <Text style={[styles.navLabel, getTextStyle('/assistant')]} numberOfLines={1}>ผู้ช่วย</Text>
          </TouchableOpacity>

          {/* Trade */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/trade')}>
            <TradeNavIcon size={scale(20)} isCommunityPage={true} />
            <Text style={[styles.navLabel, getTextStyle('/trade')]} numberOfLines={1}>Trade</Text>
          </TouchableOpacity>
        </>
      ) : (
        // ลำดับสำหรับหน้าอื่นๆ: xon, การเงิน, ชุมชน, ผู้ช่วย, Trade
        <>
          {/* xon / Home - หน้าแรก */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
            <HomeNavIcon size={scale(20)} isTradePage={false} isXonPage={false} />
            <Text style={[styles.navLabel, getTextStyle('/')]} numberOfLines={1}>xon</Text>
          </TouchableOpacity>

          {/* การเงิน / Finance */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/finance')}>
            <FinanceNavIcon size={scale(20)} isTradePage={false} isXonPage={false} />
            <Text style={[styles.navLabel, getTextStyle('/finance')]} numberOfLines={1}>การเงิน</Text>
          </TouchableOpacity>

          {/* ชุมชน / Community */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/community')}>
            <CommunityNavIcon 
              size={scale(34)} 
              height={scale(17)} 
              isTradePage={false} 
              isXonPage={false}
              isActive={pathname === '/community'}
            />
            <Text style={[styles.navLabel, getTextStyle('/community')]} numberOfLines={1}>ชุมชน</Text>
          </TouchableOpacity>

          {/* ผู้ช่วย / Assistant */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/assistant')}>
            <AssistantNavIcon size={scale(20)} isTradePage={false} isXonPage={false} />
            <Text style={[styles.navLabel, getTextStyle('/assistant')]} numberOfLines={1}>ผู้ช่วย</Text>
          </TouchableOpacity>

          {/* Trade */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/trade')}>
            <TradeNavIcon size={scale(20)} isTradePage={false} isXonPage={false} />
            <Text style={[styles.navLabel, getTextStyle('/trade')]} numberOfLines={1}>Trade</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    height: scale(51), // ตาม Figma h-[51px]
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(38),
    height: scale(37),
    flexDirection: 'column',
    gap: scale(2),
  },

  navLabel: {
    fontSize: scale(12),
    textAlign: 'center',
  },

  tradeActiveItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  communityActiveItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Light background highlight ตาม Figma
    borderRadius: scale(8),
    paddingHorizontal: scale(6),
    paddingVertical: scale(4),
  },
});
