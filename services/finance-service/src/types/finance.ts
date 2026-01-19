export interface Asset {
  id?: string;
  userId: string;
  symbol: string; // BTC, ETH, SOL, etc.
  name: string; // Bitcoin, Ethereum, Solana
  quantity: number;
  currentPrice: number;
  totalValue: number;
  dailyChange: number; // percentage
  iconUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Balance {
  userId: string;
  totalBalance: number;
  currency: string; // USD, THB, etc.
  availableBalance: number;
  lockedBalance: number;
  updatedAt?: string;
}

export interface Transaction {
  id?: string;
  userId: string;
  type: 'transfer' | 'withdraw' | 'deposit' | 'investment';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceSummary {
  totalBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assets: Asset[];
}
