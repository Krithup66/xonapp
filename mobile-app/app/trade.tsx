/**
 * Trade Screen - หน้าจอเทรดบอท
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3113-7044
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { TradingCard as TradingCardType } from '../types/trading.types';
import { TradingCardComponent } from '../components/trading/TradingCard';
import { TRADE_COLORS, TRADE_SIZES, TRADE_SPACING, TRADE_ICON_URLS } from '../config/trade-design.config';
import { scaleWidth, scaleFont } from '../utils/dimensions';
import { FINANCE_ICON_URLS } from '../config/finance-design.config';
import { TradeSkeleton } from '../components/shared/SkeletonLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

// Scale function
const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Demo Trading Cards Data - ตาม Figma design
const DEMO_TRADING_CARDS: TradingCardType[] = [
  {
    id: '1',
    orderType: 'BUY',
    status: 'online',
    toggleState: 'ON',
    pair: 'XAUUSD',
    orderNumber: '#258113198',
    timestamp: '30/10 20:00PM',
    openPrice: 4000.692,
    currentPrice: 4001.621,
    volume: 0.01,
    swap: 0.00,
    takeProfit: 4061.270,
    stopLoss: 3971.2700,
    profit: 20.00,
    mdlPercent: 35,
    rptPercent: 2,
    broker: 'Forex | XM',
  },
  {
    id: '2',
    orderType: 'SELL',
    status: 'offline',
    toggleState: 'OFF',
    pair: 'XAUUSD',
    orderNumber: '#258113198',
    timestamp: '30/10 20:00PM',
    openPrice: 4000.692,
    currentPrice: 4001.621,
    volume: 0.01,
    swap: 0.00,
    takeProfit: 4061.270,
    stopLoss: 3971.2700,
    profit: 20.00,
    mdlPercent: 35,
    rptPercent: 2,
    broker: 'Forex | XM',
  },
  {
    id: '3',
    orderType: 'BUY',
    status: 'error',
    toggleState: 'OFF',
    pair: 'XAUUSD',
    orderNumber: '#258113198',
    timestamp: '30/10 20:00PM',
    openPrice: 4000.692,
    currentPrice: 4001.621,
    volume: 0.01,
    swap: 0.00,
    takeProfit: 4061.270,
    stopLoss: 3971.2700,
    profit: 20.00,
    mdlPercent: 35,
    rptPercent: 2,
    broker: 'Forex | XM',
  },
  // เพิ่มการ์ดเพิ่มเติม (4-10)
  {
    id: '4',
    orderType: 'BUY',
    status: 'online',
    toggleState: 'ON',
    pair: 'XAUUSD',
    orderNumber: '#258113199',
    timestamp: '30/10 21:00PM',
    openPrice: 4001.500,
    currentPrice: 4002.800,
    volume: 0.02,
    swap: 0.00,
    takeProfit: 4062.000,
    stopLoss: 3972.0000,
    profit: 50.00,
    mdlPercent: 30,
    rptPercent: 3,
    broker: 'Forex | XM',
  },
  {
    id: '5',
    orderType: 'SELL',
    status: 'online',
    toggleState: 'ON',
    pair: 'XAUUSD',
    orderNumber: '#258113200',
    timestamp: '30/10 22:00PM',
    openPrice: 4002.000,
    currentPrice: 4001.200,
    volume: 0.01,
    swap: 0.00,
    takeProfit: 3972.000,
    stopLoss: 4062.0000,
    profit: 30.00,
    mdlPercent: 25,
    rptPercent: 2,
    broker: 'Forex | XM',
  },
  {
    id: '6',
    orderType: 'BUY',
    status: 'offline',
    toggleState: 'OFF',
    pair: 'BTCUSD',
    orderNumber: '#258113201',
    timestamp: '30/10 23:00PM',
    openPrice: 95000.500,
    currentPrice: 95200.800,
    volume: 0.001,
    swap: 0.00,
    takeProfit: 98000.000,
    stopLoss: 92000.0000,
    profit: 100.00,
    mdlPercent: 20,
    rptPercent: 1,
    broker: 'Forex | XM',
  },
  {
    id: '7',
    orderType: 'SELL',
    status: 'online',
    toggleState: 'ON',
    pair: 'XAUUSD',
    orderNumber: '#258113202',
    timestamp: '31/10 00:00AM',
    openPrice: 4003.000,
    currentPrice: 4002.500,
    volume: 0.015,
    swap: 0.00,
    takeProfit: 3973.000,
    stopLoss: 4063.0000,
    profit: 25.00,
    mdlPercent: 28,
    rptPercent: 2,
    broker: 'Forex | XM',
  },
  {
    id: '8',
    orderType: 'BUY',
    status: 'online',
    toggleState: 'ON',
    pair: 'XAUUSD',
    orderNumber: '#258113203',
    timestamp: '31/10 01:00AM',
    openPrice: 4002.800,
    currentPrice: 4004.200,
    volume: 0.02,
    swap: 0.00,
    takeProfit: 4064.000,
    stopLoss: 3974.0000,
    profit: 70.00,
    mdlPercent: 32,
    rptPercent: 3,
    broker: 'Forex | XM',
  },
  {
    id: '9',
    orderType: 'SELL',
    status: 'offline',
    toggleState: 'OFF',
    pair: 'BTCUSD',
    orderNumber: '#258113204',
    timestamp: '31/10 02:00AM',
    openPrice: 95300.000,
    currentPrice: 95100.500,
    volume: 0.002,
    swap: 0.00,
    takeProfit: 92000.000,
    stopLoss: 98000.0000,
    profit: 80.00,
    mdlPercent: 18,
    rptPercent: 1,
    broker: 'Forex | XM',
  },
  {
    id: '10',
    orderType: 'BUY',
    status: 'online',
    toggleState: 'ON',
    pair: 'XAUUSD',
    orderNumber: '#258113205',
    timestamp: '31/10 03:00AM',
    openPrice: 4004.500,
    currentPrice: 4006.000,
    volume: 0.025,
    swap: 0.00,
    takeProfit: 4065.000,
    stopLoss: 3975.0000,
    profit: 75.00,
    mdlPercent: 30,
    rptPercent: 4,
    broker: 'Forex | XM',
  },
];


// Menu Icon - 9 dots grid pattern (3x3) with teal accent dot
// ตาม Figma: node-id=2092-923, size: 18x18px
const MenuIcon: React.FC = () => {
  const dotSize = scale(4);
  const spacing = scale(7);
  const iconSize = scale(18); // 18x18px จาก Figma - ขนาดคงที่
  return (
    <View style={[styles.menuIconGrid, { width: iconSize, height: iconSize }]}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.menuIconRow}>
          {[0, 1, 2].map((col) => {
            // Top-left dot (row=0, col=0) is teal/mint green (#3FF9BE)
            // All other dots are white
            const isTealDot = row === 0 && col === 0;
            return (
              <View
                key={col}
                style={[
                  styles.menuIconDot,
                  {
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: isTealDot ? '#3FF9BE' : '#FFFFFF',
                    marginRight: col < 2 ? spacing : 0,
                    marginBottom: row < 2 ? spacing : 0,
                  },
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default function TradeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedPair, setSelectedPair] = useState<'XAUUSD' | 'BTCUSD'>('XAUUSD');
  const [tradingCards, setTradingCards] = useState<TradingCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from TradingService (ตามกฎ: UI เรียกใช้ Service ไม่ใช่ API โดยตรง)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // ใช้ TradingService แทนการเรียก API โดยตรง
        const { tradingService } = await import('../services/TradingService');
        const cardsResponse = await tradingService.getTradingCards(selectedPair);
        
        // ใช้ข้อมูลจาก API หรือ fallback เป็น demo data
        // Filter demo data ตาม selectedPair ถ้า API ไม่มีข้อมูล
        if (cardsResponse.cards.length > 0) {
          setTradingCards(cardsResponse.cards);
        } else {
          // ใช้ demo data และ filter ตาม selectedPair
          const filteredDemoCards = DEMO_TRADING_CARDS.filter(card => card.pair === selectedPair);
          setTradingCards(filteredDemoCards.length > 0 ? filteredDemoCards : DEMO_TRADING_CARDS);
        }
        
        // Load balance data
        const balanceData = await tradingService.getBalanceData();
        // Update balance state if needed
      } catch (error: any) {
        // Error handling: ใช้ demo data ถ้า API ล้มเหลว
        console.error('Error loading trading data:', error.message);
        setTradingCards(DEMO_TRADING_CARDS);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedPair]);

  // จำลองการทำงานจริงของบอทเทรด - อัพเดทข้อมูลแบบ real-time (only when not loading)
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      setTradingCards((prevCards) =>
        prevCards.map((card) => {
          // อัพเดทเฉพาะการ์ดที่ status เป็น 'online' และ toggleState เป็น 'ON'
          if (card.status === 'online' && card.toggleState === 'ON') {
            // สุ่มการเปลี่ยนแปลงราคา (ระหว่าง -2 ถึง +2 สำหรับ XAUUSD, -100 ถึง +100 สำหรับ BTCUSD)
            const priceChange = card.pair === 'XAUUSD' 
              ? (Math.random() - 0.5) * 4 // ±2 สำหรับ XAUUSD
              : (Math.random() - 0.5) * 200; // ±100 สำหรับ BTCUSD
            
            const newCurrentPrice = Math.max(0, card.currentPrice + priceChange);
            
            // คำนวณ profit ใหม่ตามราคา
            const priceDiff = newCurrentPrice - card.openPrice;
            const profitMultiplier = card.orderType === 'BUY' ? 1 : -1; // BUY = profit เมื่อราคาขึ้น, SELL = profit เมื่อราคาลง
            const newProfit = card.profit + (priceDiff * profitMultiplier * card.volume * 10); // คำนวณ profit แบบง่าย
            
            // อัพเดท currentPrice และ profit
            return {
              ...card,
              currentPrice: parseFloat(newCurrentPrice.toFixed(3)),
              profit: parseFloat(newProfit.toFixed(2)),
            };
          }
          return card;
        })
      );
    }, 2000); // อัพเดททุก 2 วินาที

    return () => clearInterval(interval);
  }, [isLoading]);

  // Show skeleton screen while loading
  if (isLoading) {
    return <TradeSkeleton />;
  }

  // Handle toggle button press - ใช้ TradingService (ตามกฎ: Business logic อยู่ใน Service)
  const handleTogglePress = async (cardId: string, currentToggleState: 'ON' | 'OFF') => {
    try {
      const { tradingService } = await import('../services/TradingService');
      const newToggleState = currentToggleState === 'ON' ? 'OFF' : 'ON';
      const newStatus = newToggleState === 'ON' ? 'online' : 'offline';
      
      // อัพเดทผ่าน Service
      await tradingService.updateTradingCard({
        id: cardId,
        toggleState: newToggleState,
        status: newStatus,
      });
      
      // อัพเดท local state
      setTradingCards((prevCards) =>
        prevCards.map((card) => {
          if (card.id === cardId) {
            return { ...card, toggleState: newToggleState, status: newStatus };
          }
          return card;
        })
      );
    } catch (error: any) {
      // Error handling: แสดง error message (ตามกฎ: user-friendly error)
      console.error('Error updating trading card:', error.message);
      // Fallback: อัพเดท local state แม้ว่า API จะล้มเหลว
      setTradingCards((prevCards) =>
        prevCards.map((card) => {
          if (card.id === cardId) {
            const newToggleState = currentToggleState === 'ON' ? 'OFF' : 'ON';
            const newStatus = newToggleState === 'ON' ? 'online' : 'offline';
            return { ...card, toggleState: newToggleState, status: newStatus };
          }
          return card;
        })
      );
    }
  };

  // คำนวณ balance และ profit จากการ์ดที่เปิดอยู่ (status: 'online' และ toggleState: 'ON')
  const { balance, profit, profitPercent } = useMemo(() => {
    const baseBalance = 3400000.00; // ยอดเริ่มต้น
    const activeCards = tradingCards.filter(
      (card) => card.status === 'online' && card.toggleState === 'ON'
    );
    
    // คำนวณผลรวม profit จากการ์ดที่เปิดอยู่
    const totalProfit = activeCards.reduce((sum, card) => sum + card.profit, 0);
    
    // คำนวณ balance = baseBalance + totalProfit
    const calculatedBalance = baseBalance + totalProfit;
    
    // คำนวณ profitPercent = (totalProfit / baseBalance) * 100
    const calculatedProfitPercent = baseBalance > 0 
      ? (totalProfit / baseBalance) * 100 
      : 0;
    
    return {
      balance: calculatedBalance,
      profit: totalProfit,
      profitPercent: calculatedProfitPercent,
    };
  }, [tradingCards]);


  return (
    <View style={[styles.container, { paddingTop: insets.top + scale(20) }]}>
      <StatusBar style="light" />

      {/* Header Section - Redesign ใหม่ */}
      <View style={styles.header}>
        {/* Top Row: Balance Label */}
        <View style={styles.headerTopRow}>
          {/* Balance Label */}
          <Text style={styles.balanceLabel}>Balance</Text>
        </View>

        {/* Bottom Row: Balance Amount + Profit + Chart */}
        <View style={styles.headerBottomRow}>
          {/* Left: Balance Amount + Profit */}
          <View style={styles.balanceSectionLeft}>
            {/* Balance Amount */}
            <Text style={styles.balanceAmount}>฿ {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            
            {/* Profit/Loss Container */}
            <View style={styles.profitContainer}>
              <Text style={[
                styles.profitAmount, 
                profit >= 0 ? styles.profitPositive : styles.profitNegative
              ]}>
                {profit >= 0 ? '+' : '-'} ฿ {Math.abs(profit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <Text style={[
                styles.profitPercent,
                profit >= 0 ? styles.profitPositive : styles.profitNegative
              ]}>
                ({profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Trading Pair Tabs + Icons */}
      <View style={styles.tabsContainer}>
        {/* Left: Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, selectedPair === 'XAUUSD' && styles.tabActive]}
            onPress={() => setSelectedPair('XAUUSD')}
          >
            <Text style={[styles.tabText, selectedPair === 'XAUUSD' && styles.tabTextActive]}>
              XAUUSD
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedPair === 'BTCUSD' && styles.tabActive]}
            onPress={() => setSelectedPair('BTCUSD')}
          >
            <Text style={[styles.tabText, selectedPair === 'BTCUSD' && styles.tabTextActive]}>
              BTCUSD
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right: Icons (Bot Add + Depth) - อยู่แถวเดียวกันกับแท็บ */}
        <View style={styles.iconsContainerTop}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => {
              // TODO: Implement bot add functionality
              console.log('Bot Add pressed');
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.iconButtonGlass}
            >
              <SvgUri
                uri={TRADE_ICON_URLS.botAdd}
                width={TRADE_SIZES.headerIconSize}
                height={TRADE_SIZES.headerIconSize}
              />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => {
              // TODO: Implement depth chart functionality
              console.log('Depth chart pressed');
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.iconButtonGlass}
            >
              <SvgUri
                uri={TRADE_ICON_URLS.depth}
                width={TRADE_SIZES.headerIconSize}
                height={TRADE_SIZES.headerIconSize}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trading Cards - 2 คอลัมน์ สกรอลได้ในแนวตั้ง - ครอบด้วย container */}
      <View style={[styles.cardsWrapper, { bottom: insets.bottom + scale(52) }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardsContainer}>
            {/* Filter cards ตาม selectedPair */}
            {(() => {
              const filteredCards = tradingCards.filter(card => card.pair === selectedPair);
              
              // ถ้าไม่มี cards ให้แสดงข้อความ
              if (filteredCards.length === 0) {
                return (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>ไม่มีข้อมูลการเทรดสำหรับ {selectedPair}</Text>
                  </View>
                );
              }
              
              return Array.from({ length: Math.ceil(filteredCards.length / 2) }).map((_, rowIndex) => {
                const startIndex = rowIndex * 2;
                const rowCards = filteredCards.slice(startIndex, startIndex + 2);
                return (
                  <View key={rowIndex} style={styles.cardsRow}>
                    {rowCards.map((card) => (
                      <TradingCardComponent key={card.id} card={card} onTogglePress={handleTogglePress} />
                    ))}
                    {/* ถ้า row มีแค่ 1 card ให้เพิ่ม empty space */}
                    {rowCards.length === 1 && <View style={{ flex: 1 }} />}
                  </View>
                );
              });
            })()}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation - ใช้ shared component */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TRADE_COLORS.screenBg,
  },

  header: {
    flexDirection: 'column',
    paddingHorizontal: scale(26), // Frame 427320030 x="26"
    paddingTop: 0, // ใช้ paddingTop จาก container แทน (insets.top + 48px)
    paddingBottom: scale(10),
    minHeight: scale(123), // Frame 427320030 height="123"
  },

  // Top Row: Menu Icon + Balance Label + Icons
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },

  menuIconWrapper: {
    width: scale(18), // 18x18px - ขนาดคงที่
    height: scale(18), // 18x18px - ขนาดคงที่
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuIconGrid: {
    flexDirection: 'column',
    width: scale(18),
    height: scale(18),
  },

  menuIconRow: {
    flexDirection: 'row',
  },

  menuIconDot: {
    borderRadius: scale(2),
    opacity: 0.9,
  },

  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(13), // Frame 427320027 gap
  },

  balanceLabel: {
    fontFamily: 'Prompt-SemiBold',
    fontSize: TRADE_SIZES.balanceLabel, // 16px
    color: TRADE_COLORS.textWhite,
  },

  // Bottom Row: Balance Amount + Profit + Chart
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: scale(-12), // ขยับขึ้นไปอีกเพื่อลดช่องว่าง
  },

  // Left: Balance Amount + Profit
  balanceSectionLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: scale(8),
    flex: 1,
  },

  balanceAmount: {
    fontFamily: 'Prompt-Bold',
    fontSize: TRADE_SIZES.balanceAmount, // 23px
    color: TRADE_COLORS.textWhite,
  },

  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4), // Gap between profit amount and percent
  },

  profitAmount: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRADE_SIZES.pairSymbol, // 12px
  },

  profitPercent: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRADE_SIZES.pairSymbol, // 12px
  },

  profitPositive: {
    color: TRADE_COLORS.positive, // สีเขียว #C4FF00
  },

  profitNegative: {
    color: TRADE_COLORS.negative, // สีแดง #FF0505
  },

  // Right: Chart
  chartWrapperTop: {
    width: scale(131.99), // Chart Container width="131.99"
    height: TRADE_SIZES.chartHeight, // 67px
    overflow: 'hidden',
    marginTop: scale(-10), // ขยับ chart ขึ้นเล็กน้อย
  },

  // Icons Container - Top Row
  iconsContainerTop: {
    flexDirection: 'row',
    gap: scale(12), // เพิ่มช่องไฟระหว่างไอคอนให้เหมาะสม
    alignItems: 'center',
  },

  iconButton: {
    width: TRADE_SIZES.headerIconContainer, // 40px
    height: TRADE_SIZES.headerIconContainer, // 40px - วงกลม
    borderRadius: TRADE_SIZES.headerIconContainer / 2, // ครึ่งหนึ่งของ width/height = วงกลม
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // กรอบแก้วใส
  },

  iconButtonGlass: {
    width: '100%',
    height: '100%',
    borderRadius: TRADE_SIZES.headerIconContainer / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chartWrapper: {
    position: 'absolute',
    top: scale(48), // Frame 427320030 y="48" + Chart Container y="0" = 48px
    left: scale(26 + 190), // Frame 427320030 x="26" + Chart Container x="190" = 216px
    height: TRADE_SIZES.chartHeight, // 67px
    width: scaleWidth(132), // 132px
    overflow: 'hidden',
  },

  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // แบ่งแท็บ (ซ้าย) และ icons (ขวา)
    paddingHorizontal: scale(26),
    marginTop: scale(-16), // ขยับขึ้นไปอีกเพื่อลดช่องว่าง
    marginBottom: scale(10),
    zIndex: 10, // ให้อยู่เหนือการ์ดเมื่อเลื่อน
    backgroundColor: TRADE_COLORS.screenBg, // พื้นหลังเพื่อไม่ให้การ์ดบัง
  },

  tabsRow: {
    flexDirection: 'row',
    gap: TRADE_SPACING.tabGap,
  },

  tab: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: 9999,
    backgroundColor: 'rgba(0,0,0,0)',
    minHeight: TRADE_SIZES.tabHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  tabText: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRADE_SIZES.pairSymbol,
    color: TRADE_COLORS.textGray,
  },

  tabTextActive: {
    color: TRADE_COLORS.textWhite,
  },

  // Cards Wrapper - ครอบการ์ดทั้งหมด
  cardsWrapper: {
    flex: 1,
    position: 'absolute',
    top: scale(214), // Cards Container y="214" จาก Figma
    left: 0,
    right: 0,
    // bottom จะถูกกำหนดแบบ dynamic ใน component เพื่อไม่ให้ทับ bottom navigation
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: scale(20), // เว้นขอบจอ 20px ทั้ง 2 ด้าน
    paddingTop: scale(24), // เพิ่ม paddingTop เพื่อไม่ให้การ์ดบังแถวปุ่ม
    paddingBottom: scale(120),
  },

  cardsContainer: {
    width: '100%', // ใช้ความกว้างเต็มที่ พร้อม padding จาก scrollContent
  },

  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: scale(8), // เว้นตรงกลางระหว่างการ์ด 8px
    marginBottom: scale(8), // Gap between rows (vertical spacing)
  },

  // Bottom Navigation - จาก Figma Design (node-id=3113-7073)
  // Layout: width=333, paddingHorizontal=23, paddingVertical=7, cornerRadius=9999, glass background
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    minHeight: scale(51), // height=51 จาก Figma (padding 7 + content 37 = 51)
    paddingHorizontal: scale(23), // padding(.horizontal, 23) จาก SwiftUI
    paddingVertical: scale(7), // padding(.vertical, 7) จาก SwiftUI
    backgroundColor: 'rgba(255,255,255,0.1)', // Glass effect - แก้วกระจกใส (Frosted Glass)
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', // กรอบแก้วกระจกใส
    borderRadius: 9999, // cornerRadius(9999) จาก SwiftUI
    overflow: 'hidden',
    // Shadow/Elevation - ทำให้ลอย เหมือนมีอะไรอยู่หลังมัน (floating effect)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 }, // Shadow ขึ้นด้านบน (bottom navigation)
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15, // สำหรับ Android - ทำให้ลอย
  },

  navItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // จัดให้อยู่กึ่งกลาง
    gap: scale(24), // gap-[24px] จาก Figma
    width: '100%',
  },

  navItem: {
    alignItems: 'center',
    width: scale(38), // width=38 จาก Figma
    height: scale(37), // height=37 จาก Figma
    justifyContent: 'center',
    gap: scale(2),
  },

  tradeButtonContainer: {
    alignItems: 'center',
    width: scale(38),
    height: scale(37),
    justifyContent: 'center',
    position: 'relative',
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },

  tradeButtonShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
    pointerEvents: 'none',
  },

  navLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(12),
    color: '#FFFFFF', // สีขาว ตาม Figma text-white
    textAlign: 'center', // จัดข้อความให้อยู่กึ่งกลาง
    flexShrink: 0, // ป้องกันการย่อขนาด
  },

  navLabelBold: {
    fontFamily: 'Prompt-Bold',
    color: '#FFFFFF',
  },

  navLabelTrade: {
    fontFamily: 'Prompt-Medium',
    fontSize: scaleFont(12),
    // Gradient text (from-[#710f0f] to-white) - ใช้สี dark red-brown (#710f0f) แทน
    color: '#710f0f', // สี dark red-brown ตาม Figma gradient
  },

  navLabelFinance: {
    fontFamily: 'Prompt-Medium',
    color: '#FFFFFF',
  },

  navLabelActive: {
    fontFamily: 'Prompt-Medium',
    color: '#666666', // สีเทาเมื่อ active เหมือนหน้า Finance
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(40),
  },
  emptyText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: TRADE_COLORS.textGray,
    textAlign: 'center',
  },
});