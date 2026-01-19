/**
 * Trading Card Component
 * แสดงข้อมูลการเทรดในรูปแบบการ์ด ตาม Figma Design (node-id=3238-5473)
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import Svg, { Path, Line, Polyline, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { TradingCard } from '../../types/trading.types';
import { TRADE_COLORS, TRADE_SIZES, TRADE_SPACING, TRADE_ICON_URLS } from '../../config/trade-design.config';
import { scaleWidth, scaleFont } from '../../utils/dimensions';

interface TradingCardProps {
  card: TradingCard;
  onTogglePress?: (cardId: string, currentToggleState: 'ON' | 'OFF') => void;
}

// Figma Asset URLs for new card design
const CHART_IMAGE_URL = 'https://www.figma.com/api/mcp/asset/af6aa8ef-e977-4b96-9bad-7a53d8c0720e';
const ACTION_ICONS_URL = 'https://www.figma.com/api/mcp/asset/8b5778c8-a829-49cb-8654-63af82b3db71';

export const TradingCardComponent: React.FC<TradingCardProps> = ({ card, onTogglePress }) => {
  const { orderType, status, toggleState, pair, orderNumber, timestamp, openPrice, currentPrice, volume, swap, takeProfit, stopLoss, profit, mdlPercent, rptPercent, broker } = card;

  // Format numbers
  const formatPrice = (price: number) => price.toFixed(3);
  const formatCurrency = (amount: number) => `$${Math.abs(amount).toFixed(2)}`; // ใช้ Math.abs เพื่อไม่ให้แสดงเครื่องหมายลบซ้ำ
  const formatPercent = (percent: number) => `${percent}%`;

  // Parse timestamp: "30/10 20:00PM" -> ["30/10", "20:00 PM"]
  const [datePart, timePart] = timestamp.split(' ');
  const fullTime = timePart || '';

  // Generate modern line chart with smooth curves
  // สร้างกราฟเส้นแบบทันสมัยด้วยเส้นโค้งนุ่มนวล
  const chartData = useMemo(() => {
    const chartWidth = 130.28;
    const chartHeight = 67.13;
    const padding = 4;
    const points = 30; // เพิ่มจุดเพื่อให้เส้นนุ่มนวลขึ้น
    
    // สร้างราคาแบบสุ่มระหว่าง openPrice และ currentPrice เพื่อแสดงการเคลื่อนไหว
    const priceRange = Math.abs(currentPrice - openPrice);
    const minPrice = Math.min(openPrice, currentPrice);
    const maxPrice = Math.max(openPrice, currentPrice);
    
    // สร้างจุดกราฟแบบ smooth curve
    const dataPoints: number[] = [];
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      // ใช้ easing function เพื่อให้เส้นโค้งนุ่มนวล
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const randomVariation = (Math.random() - 0.5) * priceRange * 0.2;
      const price = minPrice + (maxPrice - minPrice) * easedProgress + randomVariation;
      dataPoints.push(price);
    }
    
    // Normalize prices to chart coordinates
    const priceMin = Math.min(...dataPoints) - priceRange * 0.15;
    const priceMax = Math.max(...dataPoints) + priceRange * 0.15;
    const priceScale = (priceMax - priceMin) || 1;
    
    // Convert to smooth curve using quadratic bezier curves
    const xStep = (chartWidth - padding * 2) / (points - 1);
    const coordinates = dataPoints.map((price, index) => {
      const x = padding + index * xStep;
      const y = chartHeight - padding - ((price - priceMin) / priceScale) * (chartHeight - padding * 2);
      return { x, y };
    });
    
    // สร้าง smooth path ด้วย quadratic bezier curves
    let pathData = `M ${coordinates[0].x} ${coordinates[0].y}`;
    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      const next = coordinates[i + 1] || curr;
      
      // คำนวณ control point สำหรับ smooth curve
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = curr.x - (next.x - curr.x) * 0.5;
      const cp2y = curr.y;
      
      pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    
    // สร้าง fill path สำหรับ gradient
    const fillPath = `${pathData} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;
    
    return {
      path: pathData,
      fillPath: fillPath,
      width: chartWidth,
      height: chartHeight,
      color: profit >= 0 ? '#C4FF00' : '#991082',
      gradientStart: profit >= 0 ? '#C4FF00' : '#991082',
      gradientEnd: profit >= 0 ? 'rgba(196, 255, 0, 0)' : 'rgba(153, 16, 130, 0)',
    };
  }, [openPrice, currentPrice, profit]);

  return (
    <View style={styles.container}>
      {/* Card Background Gradient */}
      <LinearGradient
        colors={['#2F2C2C', '#141414']}
        style={styles.cardBackground}
      />

      {/* Card Content - Using absolute positioning like Figma */}
      <View style={styles.cardContent}>
        {/* Left Section: Pair Symbol, Date/Time, Order Number, Broker, Chart, Details */}
        <View style={styles.leftSection}>
          {/* Pair Symbol - absolute left=9.75, top=10 */}
          <Text style={styles.pairSymbol}>{pair}</Text>
          
          {/* Date/Time - absolute left=9.75, top=17 (10+7) */}
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateText}>{datePart}</Text>
            <Text style={styles.timeText}>{fullTime}</Text>
          </View>

          {/* Order Number & Broker - absolute left=9.75, top=31 */}
          <View style={styles.orderBrokerRow}>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
            <Text style={styles.brokerText}>{broker}</Text>
          </View>

          {/* Modern Line Chart with Gradient Fill and Glow Effect */}
          <View style={styles.chartContainer}>
            <Svg width={chartData.width} height={chartData.height} style={styles.chartSvg}>
              <Defs>
                {/* Gradient Fill - จากบนลงล่าง */}
                <SvgLinearGradient id={`chartGradient-${card.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={chartData.gradientStart} stopOpacity="0.4" />
                  <Stop offset="30%" stopColor={chartData.gradientStart} stopOpacity="0.2" />
                  <Stop offset="70%" stopColor={chartData.gradientStart} stopOpacity="0.08" />
                  <Stop offset="100%" stopColor={chartData.gradientEnd} stopOpacity="0" />
                </SvgLinearGradient>
              </Defs>
              
              {/* Gradient Fill Area - พื้นหลัง gradient */}
              <Path
                d={chartData.fillPath}
                fill={`url(#chartGradient-${card.id})`}
              />
              
              {/* Glow Effect - เส้นที่เบากว่าเพื่อสร้าง glow */}
              <Path
                d={chartData.path}
                fill="none"
                stroke={chartData.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.3}
              />
              
              {/* Main Chart Line - เส้นหลัก */}
              <Path
                d={chartData.path}
                fill="none"
                stroke={chartData.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={1}
              />
              
              {/* Highlight Line - เส้นที่สว่างกว่าเพื่อเพิ่ม depth */}
              <Path
                d={chartData.path}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.2}
              />
            </Svg>
          </View>

          {/* Trading Details - below chart, #747474 color */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Volume:{volume.toFixed(2)}</Text>
              <Text style={styles.detailText}>Swap:{formatCurrency(swap)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Open Price:{formatPrice(openPrice)}</Text>
              <Text style={styles.detailText}>T/P {formatPrice(takeProfit)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Current Price:{formatPrice(currentPrice)}</Text>
              <Text style={styles.detailText}>S/L {formatPrice(stopLoss)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>% RPT {formatPercent(rptPercent)}</Text>
              <Text style={styles.detailText}>% MDL {formatPercent(mdlPercent)}</Text>
            </View>
          </View>

          {/* Bottom Buttons: Trade + ON + Action Icons */}
          <View style={styles.bottomButtonsRow}>
            <View style={styles.tradeToggleRow}>
              {/* Trade Button */}
              <LinearGradient
                colors={['#3FF9BE', '#08479E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tradeButtonNew}
              >
                <Text style={styles.tradeButtonTextNew}>Trade</Text>
              </LinearGradient>

              {/* ON/OFF Toggle Button - แสดงสำหรับทุกสถานะ (รวมถึง error) เพื่อควบคุมบอทเทรดอัตโนมัติ */}
              <TouchableOpacity
                onPress={() => {
                  if (onTogglePress) {
                    onTogglePress(card.id, toggleState);
                  }
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={toggleState === 'ON' ? ['#3FF9BE', '#C4FF00'] : ['#2F2C2C', '#F70000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.toggleButtonNew}
                >
                  <Text style={[styles.toggleTextNew, toggleState === 'ON' && styles.toggleTextOn]}>
                    {toggleState}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Action Icons (Gear & Trash) */}
            <View style={styles.actionIconsContainer}>
              <Image
                source={{ uri: ACTION_ICONS_URL }}
                style={styles.actionIconsImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* BUY/SELL Button - absolute left=52.25, top=5 */}
        <View style={styles.orderTypeButtonAbsolute}>
          <LinearGradient
            colors={orderType === 'BUY' ? ['#C4FF00', '#769900'] : ['#FF0505', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.orderTypeButtonSmall}
          >
            <Text style={styles.orderTypeTextSmall}>{orderType}</Text>
          </LinearGradient>
        </View>

        {/* Right Section: Status + Profit - absolute left=114.75, top=10 */}
        <View style={styles.rightSection}>
          <View style={styles.statusRow}>
            {/* Status Dot */}
            <View style={[
              styles.statusDotNew,
              status === 'online' && styles.statusDotGreenNew,
              status === 'offline' && styles.statusDotRedNew,
              status === 'error' && styles.statusDotOrangeNew,
            ]} />
            <Text style={styles.statusTextNew}>{status}</Text>
          </View>
          <Text style={[
            styles.profitTextNew,
            profit >= 0 ? styles.profitTextPositive : styles.profitTextNegative
          ]}>
            ${profit >= 0 ? '+' : '-'}{Math.abs(profit).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(163), // 163px จาก Figma (node-id=3238-5473)
    height: scaleWidth(240), // เพิ่มจาก 214px เป็น 240px เพื่อให้สมดุลกับเนื้อหา
    borderRadius: scaleWidth(10), // 10px จาก Figma
    overflow: 'hidden',
    // marginRight removed - using gap from cardsRow instead
  },

  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },

  cardContent: {
    flex: 1,
    position: 'relative',
  },

  // Left Section - absolute left=9.75, top=10
  leftSection: {
    position: 'absolute',
    left: scaleWidth(9.75),
    top: scaleWidth(8), // ลด top เพื่อลดช่องว่างด้านบน
    width: scaleWidth(144), // 144px from Figma
  },

  pairSymbol: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(10), // 10px from Figma
    color: TRADE_COLORS.textWhite,
    marginBottom: scaleWidth(5), // ลด gap เพื่อให้กระชับขึ้น
  },

  dateTimeContainer: {
    flexDirection: 'row',
    gap: scaleWidth(8),
    marginBottom: scaleWidth(1), // ลด gap เพื่อให้กระชับขึ้น
  },

  dateText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8), // 8px from Figma
    color: TRADE_COLORS.textWhite,
  },

  timeText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
    color: TRADE_COLORS.textWhite,
  },

  orderBrokerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleWidth(8), // ลด gap เพื่อให้กราฟอยู่ใกล้ขึ้น
  },

  orderNumber: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
    color: TRADE_COLORS.textWhite,
  },

  brokerText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
    color: TRADE_COLORS.textWhite,
  },

  chartContainer: {
    width: scaleWidth(130.28), // 130.28px from Figma
    height: scaleWidth(67.13), // 67.13px from Figma
    marginBottom: scaleWidth(2), // เพิ่ม marginBottom เล็กน้อยเพื่อไม่ให้ทับ details
    marginLeft: scaleWidth(-2.5), // Adjust position: 7.25 - 9.75 = -2.5
    backgroundColor: 'transparent', // ระบุ background เพื่อให้เห็น container
    overflow: 'hidden', // ป้องกันภาพล้น container
  },

  chartImage: {
    width: '100%',
    height: '100%',
  },
  chartSvg: {
    width: '100%',
    height: '100%',
  },

  detailsContainer: {
    gap: scaleWidth(4),
    marginTop: scaleWidth(2), // ลด marginTop เพื่อให้กระชับขึ้น
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
    color: '#747474', // #747474 from Figma
  },

  bottomButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scaleWidth(12), // เพิ่ม gap จาก details เป็น 12px เพื่อให้สมดุลมากขึ้น
  },

  tradeToggleRow: {
    flexDirection: 'row',
    gap: scaleWidth(5), // 5px gap from Figma
  },

  tradeButtonNew: {
    width: scaleWidth(42),
    height: scaleWidth(17),
    borderRadius: scaleWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  tradeButtonTextNew: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
    color: TRADE_COLORS.textWhite,
  },

  toggleButtonNew: {
    width: scaleWidth(42),
    height: scaleWidth(17),
    borderRadius: scaleWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  toggleTextNew: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
    color: TRADE_COLORS.textWhite, // Default: สีขาวสำหรับ OFF
  },

  toggleTextOn: {
    color: TRADE_COLORS.textBlack, // สีดำสำหรับ ON
  },

  actionIconsContainer: {
    width: scaleWidth(36.11),
    height: scaleWidth(15.05),
  },

  actionIconsImage: {
    width: '100%',
    height: '100%',
  },

  // BUY/SELL Button - absolute left=52.25, top=5
  orderTypeButtonAbsolute: {
    position: 'absolute',
    left: scaleWidth(52.25),
    top: scaleWidth(5),
  },

  orderTypeButtonSmall: {
    width: scaleWidth(20.02),
    height: scaleWidth(10.2),
    borderRadius: scaleWidth(5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderTypeTextSmall: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(6), // 6px from Figma
    color: TRADE_COLORS.textBlack,
  },

  // Right Section - absolute left=114.75, top=10
  rightSection: {
    position: 'absolute',
    left: scaleWidth(114.75),
    top: scaleWidth(10),
    width: scaleWidth(38),
    alignItems: 'flex-end',
    gap: scaleWidth(2),
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(4),
  },

  statusDotNew: {
    width: scaleWidth(9),
    height: scaleWidth(9),
    borderRadius: scaleWidth(4.5),
  },

  statusDotGreenNew: {
    backgroundColor: '#C4FF00', // #C4FF00 from Figma
    shadowColor: '#C4FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: scaleWidth(4),
    shadowOpacity: 1,
  },

  statusDotRedNew: {
    backgroundColor: '#FF0505',
  },

  statusDotOrangeNew: {
    backgroundColor: '#FF5000',
  },

  statusTextNew: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
    color: TRADE_COLORS.textWhite,
    textTransform: 'lowercase',
  },

  profitTextNew: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(8),
  },
  profitTextPositive: {
    color: '#C4FF00', // เขียวเมื่อกำไร (บวก)
  },
  profitTextNegative: {
    color: '#FF0505', // แดงเมื่อขาดทุน (ลบ)
  },
});
