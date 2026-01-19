/**
 * Transaction Summary Screen
 * หน้าสรุปธุรกรรมภายใน - เรียกมาจากการกดยอดเงินในหน้า Finance
 * 
 * Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3152-6187
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { TransactionItem } from '../components/transaction/TransactionItem';
import { DateSelector } from '../components/transaction/DateSelector';
import { DatePickerModal } from '../components/transaction/DatePickerModal';
import { RequestSummaryForm } from '../components/transaction/RequestSummaryForm';
import { Transaction } from '../types/transaction.types';
import { TRANSACTION_COLORS, TRANSACTION_SIZES, TRANSACTION_ICON_URLS } from '../config/transaction-design.config';
import { scaleWidth } from '../utils/dimensions';

// =====================================================
// Demo Transaction Data
// =====================================================
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'debt',
    title: 'สินเชื่อธนาคาร',
    category: 'หนี้สิน',
    amount: -3500.00,
    date: new Date(2025, 0, 10), // 10 ม.ค. 2569
    iconType: 'debt',
  },
  {
    id: '2',
    type: 'trading',
    title: 'BTCUSD',
    category: 'Long บันชีเสี่ยงสูง',
    amount: 200.00,
    date: new Date(2025, 0, 10),
    iconType: 'trading',
  },
  {
    id: '3',
    type: 'expense',
    title: 'ค่าอาหาร',
    category: 'ค่าใช้จ่ายประจำ',
    amount: -500.00,
    date: new Date(2025, 0, 10),
    iconType: 'expense',
  },
  {
    id: '4',
    type: 'deposit',
    title: 'ฝากเงิน',
    category: 'บัญชีเทรดความเสี่ยงสูง',
    amount: 340000.00,
    date: new Date(2025, 0, 10),
    iconType: 'deposit',
  },
  {
    id: '5',
    type: 'profit',
    title: 'กำไรจาก bot A',
    category: 'บัญชี bot',
    amount: 310000.00,
    date: new Date(2025, 0, 10),
    iconType: 'profit',
  },
];

// ชื่อเดือนภาษาไทย (สั้น)
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

// ชื่อเดือนภาษาไทย (ยาว)
const THAI_MONTHS_FULL = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export default function TransactionSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [transactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [selectedTab, setSelectedTab] = useState<'latest' | 'summary'>('latest');
  
  // Date state - เริ่มจากเดือนปัจจุบัน
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear() + 543); // พ.ศ.
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Format date to "ตุลาคม 68"
  const formatDateString = (month: number, year: number): string => {
    const yearShort = year - 2500; // พ.ศ. -> ค.ศ. แล้วแสดงแค่ 2 หลักท้าย
    return `${THAI_MONTHS_FULL[month]} ${yearShort}`;
  };

  const selectedDateString = formatDateString(selectedMonth, selectedYear);

  const handleBack = () => {
    router.back();
  };

  const handlePreviousMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const handleDateSelect = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleOpenDatePicker = () => {
    setDatePickerVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <SvgUri
            uri={TRANSACTION_ICON_URLS.backArrow}
            width={TRANSACTION_SIZES.backButtonIcon}
            height={TRANSACTION_SIZES.backButtonIcon}
          />
        </TouchableOpacity>

        {/* Title - Centered */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>สรุปธุรกรรมภายใน</Text>
        </View>

        {/* Spacer to balance back button */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setSelectedTab('latest')}
          style={styles.tabItem}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'latest' && styles.tabTextActive,
            ]}
          >
            รายการล่าสุด
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab('summary')}
          style={styles.tabItem}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'summary' && styles.tabTextActive,
            ]}
          >
            ขอสรุปรายการ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Content Based on Selected Tab */}
      {selectedTab === 'latest' ? (
        <>
          {/* Date Selector */}
          <DateSelector
            selectedDate={selectedDateString}
            onPrevious={handlePreviousMonth}
            onPress={handleOpenDatePicker}
          />

          {/* Date Picker Modal */}
          <DatePickerModal
            visible={datePickerVisible}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onSelect={handleDateSelect}
            onClose={() => setDatePickerVisible(false)}
          />

          {/* Transactions List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        // Request Summary Form
        <RequestSummaryForm
          selectedYear={selectedYear}
          onYearChange={(year) => setSelectedYear(year)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TRANSACTION_COLORS.screenBg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: TRANSACTION_SIZES.screenPadding,
    paddingTop: scaleWidth(10),
    paddingBottom: scaleWidth(20),
  },

  backButton: {
    width: TRANSACTION_SIZES.backButton,
    height: TRANSACTION_SIZES.backButton,
    borderRadius: 9999,
    backgroundColor: TRANSACTION_COLORS.backButtonBg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontFamily: 'Prompt-Bold',
    fontSize: TRANSACTION_SIZES.headerTitle,
    color: TRANSACTION_COLORS.textWhite,
    textAlign: 'center',
  },

  headerSpacer: {
    width: TRANSACTION_SIZES.backButton, // Same width as back button to balance
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: TRANSACTION_SIZES.screenPadding,
    height: TRANSACTION_SIZES.tabBarHeight,
    marginBottom: scaleWidth(16),
    gap: scaleWidth(32), // Gap between tabs
  },

  tabItem: {
    alignItems: 'center',
  },

  tabText: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRANSACTION_SIZES.tabText,
    color: TRANSACTION_COLORS.textWhite,
  },

  tabTextActive: {
    fontFamily: 'Prompt-Bold',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: TRANSACTION_SIZES.contentPadding,
    paddingTop: scaleWidth(20), // ระยะห่างจาก Date Selector (ตาม Figma: y=189 to y=209 = 20px)
  },

  transactionsList: {
    gap: TRANSACTION_SIZES.transactionGap,
    paddingBottom: scaleWidth(40),
  },
});
