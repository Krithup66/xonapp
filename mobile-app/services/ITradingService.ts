/**
 * ITradingService Interface
 * Interface สำหรับ Trading Service ตามกฎ Interface-First
 * Business logic และ API calls ต้องอยู่ใน Service layer ไม่ใช่ใน UI
 */

import { TradingCard, TradingPair, BalanceData } from '../types/trading.types';

/**
 * Trading Cards Response
 */
export interface TradingCardsResponse {
  cards: TradingCard[];
  total: number;
}

/**
 * Trading Card Request
 */
export interface TradingCardRequest {
  orderType: 'BUY' | 'SELL';
  pair: TradingPair;
  openPrice: number;
  volume: number;
  takeProfit: number;
  stopLoss: number;
  broker: string;
}

/**
 * Update Trading Card Request
 */
export interface UpdateTradingCardRequest {
  id: string;
  toggleState?: 'ON' | 'OFF';
  status?: 'online' | 'offline' | 'error';
  currentPrice?: number;
  profit?: number;
}

/**
 * Trading Service Interface
 * กำหนด contract สำหรับ Trading Service
 */
export interface ITradingService {
  /**
   * ดึงข้อมูล trading cards ทั้งหมด
   * @param pair - Trading pair (optional filter)
   * @returns Promise<TradingCardsResponse>
   */
  getTradingCards(pair?: TradingPair): Promise<TradingCardsResponse>;

  /**
   * ดึงข้อมูล trading card ตาม ID
   * @param id - Trading card ID
   * @returns Promise<TradingCard>
   */
  getTradingCard(id: string): Promise<TradingCard>;

  /**
   * สร้าง trading card ใหม่
   * @param data - ข้อมูล trading card ที่ต้องการสร้าง
   * @returns Promise<TradingCard>
   */
  createTradingCard(data: TradingCardRequest): Promise<TradingCard>;

  /**
   * อัพเดท trading card
   * @param data - ข้อมูล trading card ที่ต้องการอัพเดท
   * @returns Promise<TradingCard>
   */
  updateTradingCard(data: UpdateTradingCardRequest): Promise<TradingCard>;

  /**
   * ลบ trading card
   * @param id - Trading card ID
   * @returns Promise<void>
   */
  deleteTradingCard(id: string): Promise<void>;

  /**
   * ดึงข้อมูล balance และ profit
   * @returns Promise<BalanceData>
   */
  getBalanceData(): Promise<BalanceData>;

  /**
   * อัพเดทราคา real-time สำหรับ trading cards
   * @param pair - Trading pair
   * @returns Promise<TradingCard[]>
   */
  updateRealTimePrices(pair: TradingPair): Promise<TradingCard[]>;
}
