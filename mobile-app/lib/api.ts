/**
 * API Client for Xon App
 * จัดการ API calls ไปยัง backend services
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;
  private userId?: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.userId && { 'X-User-Id': this.userId }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: 'Request failed',
        }));
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  // Finance API
  async getBalance() {
    return this.request<any>('/api/finance/balance');
  }

  async updateBalance(data: {
    totalBalance?: number;
    availableBalance?: number;
    lockedBalance?: number;
    currency?: string;
  }) {
    return this.request<any>('/api/finance/balance', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAssets() {
    return this.request<{assets: any[]; total: number}>('/api/finance/assets');
  }

  async createAsset(data: {
    symbol: string;
    name: string;
    quantity: number;
    currentPrice: number;
    totalValue: number;
    dailyChange: number;
    iconUrl?: string;
  }) {
    return this.request<any>('/api/finance/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFinanceSummary() {
    return this.request<any>('/api/finance/summary');
  }

  async getTransactions() {
    return this.request<{transactions: any[]; total: number}>(
      '/api/finance/transactions'
    );
  }

  async createTransaction(data: {
    type: 'transfer' | 'withdraw' | 'deposit' | 'investment';
    amount: number;
    currency: string;
    description?: string;
  }) {
    return this.request<any>('/api/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
