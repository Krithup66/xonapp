/**
 * Request Summary Form Component
 * Component สำหรับฟอร์มขอสรุปรายการ
 * Design from Figma: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3152-6304
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TRANSACTION_COLORS, TRANSACTION_SIZES } from '../../config/transaction-design.config';
import { scaleWidth, scaleFont } from '../../utils/dimensions';

interface RequestSummaryFormProps {
  selectedYear: number; // พ.ศ.
  onYearChange?: (year: number) => void;
}

// ชื่อเดือนภาษาไทย (สั้น)
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const RequestSummaryForm: React.FC<RequestSummaryFormProps> = ({
  selectedYear: initialYear = 2569,
  onYearChange,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | null>('email');
  const [emailAddress, setEmailAddress] = useState<string>(''); // อีเมลที่ผู้ใช้กรอก
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const yearScrollViewRef = useRef<ScrollView>(null);

  // สร้างปี list (พ.ศ.) - แสดงแค่ 3 ปีล่าสุด (ปีปัจจุบัน, 2 ปีที่ผ่านมา)
  const currentYear = new Date().getFullYear() + 543; // แปลงเป็น พ.ศ.
  const years = [];
  for (let i = currentYear - 2; i <= currentYear; i++) {
    years.push(i);
  }

  // Auto-scroll to selected year when modal opens
  useEffect(() => {
    if (yearPickerVisible && yearScrollViewRef.current) {
      const selectedIndex = years.findIndex(year => year === selectedYear);
      if (selectedIndex >= 0) {
        // Scroll to selected year - each item is approximately 56px (16 padding + 16 padding + 16 line height + 8 margin)
        const itemHeight = scaleWidth(56);
        const scrollOffset = selectedIndex * itemHeight;
        
        setTimeout(() => {
          yearScrollViewRef.current?.scrollTo({
            y: Math.max(0, scrollOffset - itemHeight * 2), // Scroll 2 items above for better visibility
            animated: true,
          });
        }, 100);
      }
    }
  }, [yearPickerVisible, selectedYear, years]);

  // Update selectedYear when initialYear prop changes
  useEffect(() => {
    setSelectedYear(initialYear);
  }, [initialYear]);

  const handleMonthToggle = (monthIndex: number) => {
    setSelectedMonths(prev => {
      if (prev.includes(monthIndex)) {
        return prev.filter(m => m !== monthIndex);
      } else {
        return [...prev, monthIndex];
      }
    });
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
    setYearPickerVisible(false);
  };

  // แบ่งเดือนเป็น 3 แถว
  const monthRows = [
    [0, 1, 2, 3, 4], // ม.ค. - พ.ค.
    [5, 6, 7, 8, 9], // มิ.ย. - ต.ค.
    [10, 11], // พ.ย. - ธ.ค.
  ];

  const insets = useSafeAreaInsets();

  // Check if form is complete (delivery method selected, email filled if email selected, and at least one month selected)
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isFormComplete = 
    deliveryMethod !== null && 
    selectedMonths.length > 0 &&
    (deliveryMethod !== 'email' || (emailAddress.trim() !== '' && isValidEmail(emailAddress.trim())));

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Delivery Method Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>เลือช่องทางรับเอกสาร</Text>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setDeliveryMethod('email')}
          activeOpacity={0.7}
        >
          <View style={styles.radioButton}>
            {deliveryMethod === 'email' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.radioLabel}>อีเมล</Text>
        </TouchableOpacity>

        {/* Email Input Field - แสดงเมื่อเลือกอีเมล */}
        {deliveryMethod === 'email' && (
          <View style={styles.emailInputContainer}>
            <TextInput
              style={styles.emailInput}
              placeholder="กรุณากรอกอีเมลของคุณ"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={emailAddress}
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />
          </View>
        )}
      </View>

      {/* Month Selection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>เลือกเดือนที่ต้องการ</Text>
        
        {/* Year Selector - กดเพื่อเลือกปี */}
        <TouchableOpacity
          style={styles.yearSelector}
          onPress={() => setYearPickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.yearText}>{selectedYear}</Text>
        </TouchableOpacity>

        {/* Month Grid */}
        {monthRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.monthRow}>
            {row.map((monthIndex) => (
              <TouchableOpacity
                key={monthIndex}
                style={styles.monthOption}
                onPress={() => handleMonthToggle(monthIndex)}
                activeOpacity={0.7}
              >
                <View style={styles.monthRadioButton}>
                  {selectedMonths.includes(monthIndex) && <View style={styles.monthRadioButtonInner} />}
                </View>
                <Text style={[
                  styles.monthLabel,
                  selectedMonths.includes(monthIndex) && styles.monthLabelSelected
                ]}>
                  {THAI_MONTHS_SHORT[monthIndex]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      </ScrollView>

      {/* Submit Button - ส่งคำขอ (Fixed at bottom) */}
      <TouchableOpacity
        style={[styles.submitButton, { bottom: scaleWidth(60) + insets.bottom }]}
        onPress={() => {
          if (!isFormComplete) return; // Disable if form is not complete
          
          // TODO: Handle submit action
          console.log('Submit request:', {
            deliveryMethod,
            selectedMonths,
            selectedYear,
          });
        }}
        activeOpacity={isFormComplete ? 0.8 : 1}
        disabled={!isFormComplete}
      >
        <Text style={[
          styles.submitButtonText,
          isFormComplete ? styles.submitButtonTextActive : styles.submitButtonTextInactive
        ]}>
          ส่งคำขอ
        </Text>
      </TouchableOpacity>

      {/* Year Picker Modal */}
      <Modal
        visible={yearPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setYearPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearPickerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setYearPickerVisible(false)}>
                  <Text style={styles.modalCancelButton}>ยกเลิก</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>เลือกปี (พ.ศ.)</Text>
                <View style={styles.modalSpacer} />
              </View>

              {/* Year List - Scroll with auto-scroll to selected year */}
              <ScrollView
                ref={yearScrollViewRef}
                style={styles.yearScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.yearScrollContent}
                scrollEnabled={true}
                nestedScrollEnabled={true}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={styles.yearOption}
                    onPress={() => handleYearSelect(year)}
                    activeOpacity={0.7}
                  >
                    {selectedYear === year ? (
                      <LinearGradient
                        colors={['#141414', '#F70000']} // RGB(20,20,20) to RGB(247,0,0)
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.yearOptionGradient}
                      >
                        <Text style={styles.yearOptionTextSelected}>{year}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.yearOptionText}>{year}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: TRANSACTION_SIZES.contentPadding,
    paddingTop: scaleWidth(20),
    paddingBottom: scaleWidth(160), // Extra space for fixed button
  },

  section: {
    marginBottom: scaleWidth(20),
  },

  sectionTitle: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: TRANSACTION_COLORS.textWhite,
    marginBottom: scaleWidth(16),
    minWidth: '100%',
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(5),
    marginBottom: scaleWidth(16),
  },

  radioButton: {
    width: scaleWidth(16),
    height: scaleWidth(16),
    borderRadius: scaleWidth(16) / 2,
    borderWidth: 1,
    borderColor: TRANSACTION_COLORS.textWhite,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioButtonInner: {
    width: scaleWidth(10),
    height: scaleWidth(10),
    borderRadius: scaleWidth(10) / 2,
    backgroundColor: TRANSACTION_COLORS.textWhite,
  },

  radioLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(12),
    color: TRANSACTION_COLORS.textWhite,
  },

  emailInputContainer: {
    marginTop: scaleWidth(12),
    width: '100%',
  },

  emailInput: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: TRANSACTION_COLORS.textWhite,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scaleWidth(8),
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(10),
    minHeight: scaleWidth(40),
  },

  yearSelector: {
    marginBottom: scaleWidth(16),
    minWidth: '100%',
  },

  yearText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(14),
    color: TRANSACTION_COLORS.textWhite,
  },

  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(16),
    marginBottom: scaleWidth(16),
  },

  monthOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(6),
    borderRadius: scaleWidth(8),
    overflow: 'hidden',
  },

  monthRadioButton: {
    width: scaleWidth(16),
    height: scaleWidth(16),
    borderRadius: scaleWidth(16) / 2,
    borderWidth: 1,
    borderColor: TRANSACTION_COLORS.textWhite,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthRadioButtonInner: {
    width: scaleWidth(10),
    height: scaleWidth(10),
    borderRadius: scaleWidth(10) / 2,
    backgroundColor: TRANSACTION_COLORS.textWhite,
  },

  monthLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: TRANSACTION_COLORS.textWhite,
  },

  monthLabelSelected: {
    fontFamily: 'Prompt-Bold',
  },

  // Submit Button Styles - Fixed at bottom
  submitButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: scaleWidth(311),
    height: scaleWidth(50),
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleWidth(10),
    // bottom: scaleWidth(60) + insets.bottom - will be set inline
  },

  submitButtonText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(16),
    lineHeight: scaleWidth(24),
  },

  submitButtonTextInactive: {
    color: 'rgba(255, 255, 255, 0.5)', // สีอ่อนเมื่อยังไม่เลือก
  },

  submitButtonTextActive: {
    fontFamily: 'Prompt-Bold', // ฟอนต์ขาว (Bold) เมื่อเลือกแล้ว
    color: TRANSACTION_COLORS.textWhite, // สีขาว
  },

  // Year Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: scaleWidth(20),
    borderTopRightRadius: scaleWidth(20),
    maxHeight: Dimensions.get('window').height * 0.5,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  modalCancelButton: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: TRANSACTION_COLORS.textGray,
  },

  modalTitle: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(16),
    color: TRANSACTION_COLORS.textWhite,
  },

  modalSpacer: {
    width: scaleWidth(60), // Balance cancel button width
  },

  yearScrollView: {
    maxHeight: Dimensions.get('window').height * 0.4,
  },

  yearScrollContent: {
    paddingVertical: scaleWidth(10),
  },

  yearOption: {
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(8),
    overflow: 'hidden',
  },

  yearOptionGradient: {
    width: '100%',
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(8),
  },

  yearOptionText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(16),
    color: TRANSACTION_COLORS.textWhite,
  },

  yearOptionTextSelected: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(16),
    color: TRANSACTION_COLORS.textWhite,
  },
});
