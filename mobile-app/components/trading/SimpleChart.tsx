/**
 * Simple Chart Component - Bar Chart สำหรับแสดงข้อมูลการเงินของพอร์ต
 * แสดงกราฟ portfolio financial chart จาก balance/profit
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TRADE_COLORS, TRADE_SIZES } from '../../config/trade-design.config';
import { scaleWidth } from '../../utils/dimensions';

interface SimpleChartProps {
  containerX?: number; // X position ของ chart container (default: 212 from Figma)
  containerY?: number; // Y position ของ chart container (default: 98 from Figma)
  portfolioData?: number[]; // ข้อมูลพอร์ต (percentage จาก baseBalance) สำหรับแสดงกราฟ
  baseBalance?: number; // ยอดเริ่มต้น
}

export const SimpleChart: React.FC<SimpleChartProps> = ({ 
  containerX = 212, 
  containerY = 98,
  portfolioData = [],
  baseBalance = 3400000.00
}) => {
  const chartWidth = 132;
  const chartHeight = 67;
  const barWidth = 6.857;
  const numBars = 26; // จำนวน bars
  const paddingLeft = 2;
  const paddingRight = 2;
  const paddingTop = 2;
  const paddingBottom = 2;
  
  // คำนวณกราฟจาก portfolioData
  const chartBars = useMemo(() => {
    // ถ้าไม่มีข้อมูล ให้ใช้ข้อมูลเริ่มต้น
    if (!portfolioData || portfolioData.length === 0) {
      // สร้างข้อมูลเริ่มต้น (0%)
      return Array(numBars).fill(0);
    }
    
    // ใช้ข้อมูลล่าสุด numBars จุด
    const dataPoints = portfolioData.slice(-numBars);
    
    // ถ้ามีข้อมูลน้อยกว่า numBars ให้เติมด้วย 0
    while (dataPoints.length < numBars) {
      dataPoints.unshift(0);
    }
    
    return dataPoints;
  }, [portfolioData]);
  
  // คำนวณ min และ max ของข้อมูลเพื่อ normalize
  const { minValue, maxValue } = useMemo(() => {
    const values = chartBars.filter(v => v !== 0);
    if (values.length === 0) {
      return { minValue: 0, maxValue: 0 };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    // เพิ่ม margin 10%
    const range = max - min;
    return {
      minValue: min - range * 0.1,
      maxValue: max + range * 0.1,
    };
  }, [chartBars]);
  
  const valueRange = maxValue - minValue || 1;
  
  // คำนวณสีของ bar ตามค่า (เขียวเมื่อบวก, แดงเมื่อลบ)
  const getBarColor = (value: number) => {
    return value >= 0 ? TRADE_COLORS.positive : '#FF0505';
  };
  
  // คำนวณความสูงของ bar
  const getBarHeight = (value: number) => {
    if (value === 0) return 0;
    const normalizedValue = (value - minValue) / valueRange;
    const availableHeight = chartHeight - paddingTop - paddingBottom;
    return Math.max(2, normalizedValue * availableHeight); // ขั้นต่ำ 2px
  };
  
  return (
    <View style={[styles.container, { left: scaleWidth(containerX - 212), top: scaleWidth(containerY - 98) }]}>
      {chartBars.map((value, index) => {
        const barHeight = getBarHeight(value);
        const x = paddingLeft + index * (barWidth + 0.5); // ระยะห่างระหว่าง bars
        const y = chartHeight - paddingBottom - barHeight; // y position (เริ่มจากด้านล่าง)
        
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                left: scaleWidth(x),
                top: scaleWidth(y),
                width: scaleWidth(barWidth),
                height: scaleWidth(barHeight),
                backgroundColor: getBarColor(value),
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: scaleWidth(132),
    height: scaleWidth(67),
    overflow: 'hidden',
  },

  bar: {
    position: 'absolute',
    backgroundColor: TRADE_COLORS.positive, // #C4FF00
    borderRadius: 1,
    opacity: 0.9, // blur effect simulation
  },
});