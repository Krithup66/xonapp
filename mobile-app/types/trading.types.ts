/**
 * Trading Service Type Definitions
 * Type definitions สำหรับ Trading Service
 */

/**
 * Trading Pair Type
 */
export type TradingPair = 'XAUUSD' | 'BTCUSD';

/**
 * Trading Order Type
 */
export type OrderType = 'BUY' | 'SELL';

/**
 * Trading Card Status
 */
export type CardStatus = 'online' | 'offline' | 'error';

/**
 * Toggle State
 */
export type ToggleState = 'ON' | 'OFF';

/**
 * Trading Card Data
 */
export interface TradingCard {
  id: string;
  orderType: OrderType;
  status: CardStatus;
  toggleState: ToggleState;
  pair: TradingPair;
  
  // Trading Details
  orderNumber: string; // e.g., "#258113198"
  timestamp: string; // e.g., "30/10 20:00PM"
  openPrice: number;
  currentPrice: number;
  volume: number;
  swap: number;
  takeProfit: number;
  stopLoss: number;
  profit: number; // P&L
  mdlPercent: number; // % MDL
  rptPercent: number; // % RPT
  
  // Broker Info
  broker: string; // e.g., "Forex | XM"
  
  // Chart (optional - for future implementation)
  chartUrl?: string;
}

/**
 * Balance Data
 */
export interface BalanceData {
  balance: number;
  profit: number;
  profitPercent: number;
}

/**
 * Chart Bar Data (for simple bar chart)
 */
export interface ChartBar {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}