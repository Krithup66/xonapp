/**
 * Finance Service Type Definitions
 * Type definitions สำหรับ Finance Service
 */

/**
 * Crypto Asset Type
 */
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  cost: number;
  value: number;
  change: number;
  quantity: string;
  icon: 'btc' | 'sol' | 'eth';
}

/**
 * Service Item Type
 */
export interface ServiceItem {
  id: string;
  name: string;
  iconType: 'investment' | 'savings' | 'credit' | 'asset' | 'debt' | 'travel' | 'tax' | 'erp';
}

/**
 * Navigation Item Type
 */
export interface NavItem {
  id: string;
  label: string;
  iconType: 'home' | 'finance' | 'community' | 'assistant' | 'trade';
  isActive?: boolean;
}

/**
 * Balance Format Options
 */
export interface BalanceFormatOptions {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
}
