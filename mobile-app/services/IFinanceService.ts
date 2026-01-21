/**
 * IFinanceService Interface
 * Interface สำหรับ Finance Service ตามกฎ Interface-First
 * Business logic และ API calls ต้องอยู่ใน Service layer ไม่ใช่ใน UI
 */

import { CryptoAsset } from '../types/finance.types';

/**
 * Balance Response
 */
export interface BalanceResponse {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  currency: string;
  updatedAt?: string;
}

/**
 * Assets Response
 */
export interface AssetsResponse {
  assets: CryptoAsset[];
  total: number;
}

/**
 * Transaction Request
 */
export interface TransactionRequest {
  type: 'transfer' | 'withdraw' | 'deposit' | 'investment';
  amount: number;
  currency: string;
  description?: string;
}

/**
 * Transaction Response
 */
export interface TransactionResponse {
  id: string;
  userId: string;
  type: 'transfer' | 'withdraw' | 'deposit' | 'investment';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Finance Summary Response
 */
export interface FinanceSummaryResponse {
  totalBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assets: CryptoAsset[];
}

/**
 * Finance Service Interface
 * กำหนด contract สำหรับ Finance Service
 */
export interface IFinanceService {
  /**
   * ดึงข้อมูล balance ของ user
   * @returns Promise<BalanceResponse>
   */
  getBalance(): Promise<BalanceResponse>;

  /**
   * อัพเดท balance ของ user
   * @param data - ข้อมูล balance ที่ต้องการอัพเดท
   * @returns Promise<BalanceResponse>
   */
  updateBalance(data: {
    totalBalance?: number;
    availableBalance?: number;
    lockedBalance?: number;
    currency?: string;
  }): Promise<BalanceResponse>;

  /**
   * ดึงข้อมูล assets ทั้งหมด
   * @returns Promise<AssetsResponse>
   */
  getAssets(): Promise<AssetsResponse>;

  /**
   * สร้าง asset ใหม่
   * @param data - ข้อมูล asset ที่ต้องการสร้าง
   * @returns Promise<CryptoAsset>
   */
  createAsset(data: {
    symbol: string;
    name: string;
    quantity: number;
    currentPrice: number;
    totalValue: number;
    dailyChange: number;
    iconUrl?: string;
  }): Promise<CryptoAsset>;

  /**
   * ดึงข้อมูล finance summary
   * @returns Promise<FinanceSummaryResponse>
   */
  getFinanceSummary(): Promise<FinanceSummaryResponse>;

  /**
   * ดึงข้อมูล transactions
   * @returns Promise<{transactions: TransactionResponse[]; total: number}>
   */
  getTransactions(): Promise<{transactions: TransactionResponse[]; total: number}>;

  /**
   * สร้าง transaction ใหม่
   * @param data - ข้อมูล transaction ที่ต้องการสร้าง
   * @returns Promise<TransactionResponse>
   */
  createTransaction(data: TransactionRequest): Promise<TransactionResponse>;
}
