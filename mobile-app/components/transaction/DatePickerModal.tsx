/**
 * Date Picker Modal Component
 * Modal สำหรับเลือกเดือนและปี
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { TRANSACTION_COLORS, TRANSACTION_SIZES } from '../../config/transaction-design.config';
import { scaleWidth, scaleFont } from '../../utils/dimensions';

interface DatePickerModalProps {
  visible: boolean;
  selectedMonth: number; // 0-11 (0 = January)
  selectedYear: number; // พ.ศ. (Buddhist era)
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}

// ชื่อเดือนภาษาไทย
const THAI_MONTHS = [
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

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  selectedMonth,
  selectedYear,
  onSelect,
  onClose,
}) => {
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempYear, setTempYear] = useState(selectedYear);

  // อัพเดท temp values เมื่อ modal เปิด
  useEffect(() => {
    if (visible) {
      setTempMonth(selectedMonth);
      setTempYear(selectedYear);
    }
  }, [visible, selectedMonth, selectedYear]);

  // สร้างปี list (พ.ศ.) - 5 ปีย้อนหลัง ถึง 2 ปีข้างหน้า
  const currentYear = new Date().getFullYear() + 543; // แปลงเป็น พ.ศ.
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push(i);
  }

  const handleConfirm = () => {
    onSelect(tempMonth, tempYear);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelButton}>ยกเลิก</Text>
              </TouchableOpacity>
              <Text style={styles.title}>เลือกเดือน/ปี</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.confirmButton}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>

            {/* Month and Year Picker */}
            <View style={styles.pickerContainer}>
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>เดือน</Text>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={scaleWidth(50)}
                  decelerationRate="fast"
                >
                  {THAI_MONTHS.map((month, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.pickerItem,
                        tempMonth === index && styles.pickerItemSelected,
                      ]}
                      onPress={() => setTempMonth(index)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempMonth === index && styles.pickerItemTextSelected,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>ปี (พ.ศ.)</Text>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={scaleWidth(50)}
                  decelerationRate="fast"
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        tempYear === year && styles.pickerItemSelected,
                      ]}
                      onPress={() => setTempYear(year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempYear === year && styles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: scaleWidth(20),
    borderTopRightRadius: scaleWidth(20),
    maxHeight: SCREEN_HEIGHT * 0.6,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  cancelButton: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: TRANSACTION_COLORS.textGray,
  },

  title: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(16),
    color: TRANSACTION_COLORS.textWhite,
  },

  confirmButton: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: TRANSACTION_COLORS.positive,
  },

  pickerContainer: {
    flexDirection: 'row',
    paddingVertical: scaleWidth(20),
  },

  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },

  pickerLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(12),
    color: TRANSACTION_COLORS.textGray,
    marginBottom: scaleWidth(10),
  },

  scrollView: {
    maxHeight: scaleWidth(250),
    width: '100%',
  },

  pickerItem: {
    width: '100%',
    height: scaleWidth(50),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },

  pickerItemSelected: {
    backgroundColor: 'rgba(196, 255, 0, 0.2)',
  },

  pickerItemText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(16),
    color: TRANSACTION_COLORS.textWhite,
  },

  pickerItemTextSelected: {
    fontFamily: 'Prompt-Bold',
    color: TRANSACTION_COLORS.positive,
  },
});
