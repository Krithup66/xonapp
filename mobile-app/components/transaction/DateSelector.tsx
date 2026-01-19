/**
 * Date Selector Component
 * Component สำหรับเลือกช่วงเวลา
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { TRANSACTION_COLORS, TRANSACTION_SIZES, TRANSACTION_ICON_URLS } from '../../config/transaction-design.config';
import { scaleWidth } from '../../utils/dimensions';

interface DateSelectorProps {
  selectedDate: string; // e.g., "ตุลาคม 68"
  onPrevious?: () => void;
  onNext?: () => void;
  onPress?: () => void; // เมื่อกดที่ date selector
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onPrevious,
  onNext,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>ช่วงเวลา</Text>
      
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.dateText}>{selectedDate}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.chevronButton}
          onPress={onPrevious}
        >
          <View style={styles.chevronContainer}>
            <SvgUri
              uri={TRANSACTION_ICON_URLS.chevronLeft}
              width={TRANSACTION_SIZES.chevronSize}
              height={TRANSACTION_SIZES.chevronSize}
            />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: TRANSACTION_SIZES.screenPadding,
  },

  label: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRANSACTION_SIZES.dateLabel,
    color: TRANSACTION_COLORS.textGray,
    marginBottom: scaleWidth(10),
  },

  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(31),
    marginBottom: scaleWidth(10),
  },

  dateButton: {
    flex: 1,
  },

  dateText: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRANSACTION_SIZES.dateValue,
    color: TRANSACTION_COLORS.textWhite,
  },

  chevronButton: {
    width: TRANSACTION_SIZES.chevronSize,
    height: TRANSACTION_SIZES.chevronSize,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chevronContainer: {
    transform: [{ rotate: '270deg' }],
  },

  divider: {
    width: scaleWidth(115),
    height: 1,
    backgroundColor: TRANSACTION_COLORS.textGray,
    opacity: 0.3,
  },
});
