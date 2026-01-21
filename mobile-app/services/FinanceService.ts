/**
 * FinanceService Implementation
 * Service layer สำหรับจัดการ Finance data ตาม Clean Architecture
 * Business logic และ API calls อยู่ที่นี่ ไม่ใช่ใน UI
 */

import { api } from '../lib/api';
import { IFinanceService } from './IFinanceService';
import type {
  BalanceResponse,
  AssetsResponse,
  TransactionRequest,
  TransactionResponse,
  FinanceSummaryResponse,
} from './IFinanceService';
import { CryptoAsset } from '../types/finance.types';

/**
 * FinanceService Class
 * Implementation ของ IFinanceService interface
 */
export class FinanceService implements IFinanceService {
  /**
   * ดึงข้อมูล balance ของ user
   */
  async getBalance(): Promise<BalanceResponse> {
    try {
      const response = await api.getBalance();
      return {
        totalBalance: response.totalBalance || 0,
        availableBalance: response.availableBalance || 0,
        lockedBalance: response.lockedBalance || 0,
        currency: response.currency || 'USD',
        updatedAt: response.updatedAt,
      };
    } catch (error: any) {
      // Error handling ตามกฎ: แสดง user-friendly error
      throw new Error(error.message || 'ไม่สามารถดึงข้อมูล balance ได้');
    }
  }

  /**
   * อัพเดท balance ของ user
   */
  async updateBalance(data: {
    totalBalance?: number;
    availableBalance?: number;
    lockedBalance?: number;
    currency?: string;
  }): Promise<BalanceResponse> {
    try {
      const response = await api.updateBalance(data);
      return {
        totalBalance: response.totalBalance || 0,
        availableBalance: response.availableBalance || 0,
        lockedBalance: response.lockedBalance || 0,
        currency: response.currency || 'USD',
        updatedAt: response.updatedAt,
      };
    } catch (error: any) {
      throw new Error(error.message || 'ไม่สามารถอัพเดท balance ได้');
    }
  }

  /**
   * ดึงข้อมูล assets ทั้งหมด
   */
  async getAssets(): Promise<AssetsResponse> {
    try {
      const response = await api.getAssets();
      return {
        assets: response.assets || [],
        total: response.total || 0,
      };
    } catch (error: any) {
      throw new Error(error.message || 'ไม่สามารถดึงข้อมูล assets ได้');
    }
  }

  /**
   * สร้าง asset ใหม่
   */
  async createAsset(data: {
    symbol: string;
    name: string;
    quantity: number;
    currentPrice: number;
    totalValue: number;
    dailyChange: number;
    iconUrl?: string;
  }): Promise<CryptoAsset> {
    try {
      const response = await api.createAsset(data);
      // Transform backend response to CryptoAsset type
      return {
        id: response.id || '',
        symbol: response.symbol || data.symbol,
        name: response.name || data.name,
        cost: response.currentPrice || data.currentPrice,
        value: response.totalValue || data.totalValue,
        change: response.dailyChange || data.dailyChange,
        quantity: response.quantity?.toString() || data.quantity.toString(),
        icon: this.mapSymbolToIcon(response.symbol || data.symbol),
      };
    } catch (error: any) {
      throw new Error(error.message || 'ไม่สามารถสร้าง asset ได้');
    }
  }

  /**
   * ดึงข้อมูล finance summary
   */
  async getFinanceSummary(): Promise<FinanceSummaryResponse> {
    try {
      const response = await api.getFinanceSummary();
      return {
        totalBalance: response.totalBalance || 0,
        totalAssets: response.totalAssets || 0,
        totalLiabilities: response.totalLiabilities || 0,
        netWorth: response.netWorth || 0,
        assets: response.assets || [],
      };
    } catch (error: any) {
      throw new Error(error.message || 'ไม่สามารถดึงข้อมูล finance summary ได้');
    }
  }

  /**
   * ดึงข้อมูล transactions
   */
  async getTransactions(): Promise<{transactions: TransactionResponse[]; total: number}> {
    try {
      const response = await api.getTransactions();
      return {
        transactions: response.transactions || [],
        total: response.total || 0,
      };
    } catch (error: any) {
      throw new Error(error.message || 'ไม่สามารถดึงข้อมูล transactions ได้');
    }
  }

  /**
   * สร้าง transaction ใหม่
   */
  async createTransaction(data: TransactionRequest): Promise<TransactionResponse> {
    try {
      const response = await api.createTransaction(data);
      return {
        id: response.id || '',
        userId: response.userId || '',
        type: response.type || data.type,
        amount: response.amount || data.amount,
        currency: response.currency || data.currency,
        status: response.status || 'pending',
        description: response.description || data.description,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'ไม่สามารถสร้าง transaction ได้');
    }
  }

  /**
   * Helper: Map symbol to icon type
   */
  private mapSymbolToIcon(symbol: string): 'btc' | 'sol' | 'eth' {
    const upperSymbol = symbol.toUpperCase();
    if (upperSymbol.includes('BTC') || upperSymbol.includes('BITCOIN')) {
      return 'btc';
    }
    if (upperSymbol.includes('SOL') || upperSymbol.includes('SOLANA')) {
      return 'sol';
    }
    if (upperSymbol.includes('ETH') || upperSymbol.includes('ETHEREUM')) {
      return 'eth';
    }
    // Default to BTC
    return 'btc';
  }
}

// Export singleton instance
export const financeService = new FinanceService();
