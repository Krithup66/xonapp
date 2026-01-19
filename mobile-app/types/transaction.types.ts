/**
 * Transaction Types
 * Type definitions สำหรับ Transaction/Transaction Summary
 */

export type TransactionType = 'income' | 'expense' | 'transfer' | 'investment' | 'debt' | 'trading';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  category: string;
  amount: number; // Positive for income, negative for expense
  date: Date;
  iconUrl?: string;
  iconType?: 'debt' | 'trading' | 'expense' | 'deposit' | 'profit' | 'credit';
}

export interface TransactionSummary {
  period: string; // e.g., "ตุลาคม 68"
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}
