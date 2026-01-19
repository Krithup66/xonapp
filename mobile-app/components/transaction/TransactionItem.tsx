/**
 * Transaction Item Component
 * Component สำหรับแสดงรายการธุรกรรมแต่ละรายการ
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Transaction } from '../../types/transaction.types';
import { TRANSACTION_COLORS, TRANSACTION_SIZES, TRANSACTION_ICON_URLS } from '../../config/transaction-design.config';
import { scaleWidth } from '../../utils/dimensions';
import { formatBalanceSecure } from '../../utils/security';

interface TransactionItemProps {
  transaction: Transaction;
}

/**
 * Get icon container URL based on transaction type
 * ดึงรูปวงกลมพร้อมไอคอนจาก Figma
 */
const getIconContainerUrl = (transaction: Transaction): string | undefined => {
  if (transaction.iconUrl) {
    return transaction.iconUrl;
  }
  
  switch (transaction.iconType) {
    case 'debt':
      return TRANSACTION_ICON_URLS.debtIconContainer;
    case 'trading':
      return TRANSACTION_ICON_URLS.tradingIconContainer;
    case 'expense':
      return TRANSACTION_ICON_URLS.expenseIconContainer;
    case 'deposit':
      return TRANSACTION_ICON_URLS.depositIconContainer;
    case 'profit':
      return TRANSACTION_ICON_URLS.profitIconContainer;
    default:
      return TRANSACTION_ICON_URLS.expenseIconContainer;
  }
};

/**
 * Format date to Thai format
 */
const formatDate = (date: Date): string => {
  const day = date.getDate();
  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear() + 543; // Convert to Buddhist era
  
  return `${day} ${month} ${year}`;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const iconContainerUrl = getIconContainerUrl(transaction);
  const isPositive = transaction.amount > 0;
  const amountColor = isPositive ? TRANSACTION_COLORS.positive : TRANSACTION_COLORS.negative;
  const formattedAmount = formatBalanceSecure(
    Math.abs(transaction.amount),
    { currency: '', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  const amountPrefix = isPositive ? '+' : '-';

  return (
    <View style={styles.container}>
      {/* Transaction Info (Left) */}
      <View style={styles.transactionInfo}>
        {/* Icon Container - ดึงรูปวงกลมพร้อมไอคอนจาก Figma */}
        {iconContainerUrl && (
          <Image
            source={{ uri: iconContainerUrl }}
            style={styles.iconContainer}
            resizeMode="contain"
          />
        )}

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.titleText}>{transaction.title}</Text>
          <Text style={styles.categoryText}>{transaction.category}</Text>
        </View>
      </View>

      {/* Amount and Date (Right) */}
      <View style={styles.amountDateContainer}>
        <Text style={[styles.amountText, { color: amountColor }]}>
          {amountPrefix}{formattedAmount}
        </Text>
        <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: TRANSACTION_SIZES.transactionItemHeight,
  },

  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(12),
    flex: 1,
  },

  iconContainer: {
    width: TRANSACTION_SIZES.transactionIconSize,
    height: TRANSACTION_SIZES.transactionIconSize,
    borderRadius: TRANSACTION_SIZES.transactionIconSize / 2,
  },

  descriptionContainer: {
    gap: 0,
  },

  titleText: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRANSACTION_SIZES.transactionText,
    color: TRANSACTION_COLORS.textWhite,
    marginBottom: 0,
  },

  categoryText: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRANSACTION_SIZES.transactionText,
    color: TRANSACTION_COLORS.textWhite,
    marginTop: 0,
  },

  amountDateContainer: {
    alignItems: 'flex-end',
    gap: 0,
  },

  amountText: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRANSACTION_SIZES.transactionText,
    marginBottom: 0,
  },

  dateText: {
    fontFamily: 'Prompt-Regular',
    fontSize: TRANSACTION_SIZES.transactionText,
    color: TRANSACTION_COLORS.textWhite,
    marginTop: 0,
  },
});
