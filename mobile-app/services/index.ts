/**
 * Services Index
 * Export all services และ interfaces สำหรับใช้งานใน UI
 * ตาม Clean Architecture: UI เรียกใช้ Services ไม่ใช่ API โดยตรง
 */

// Interfaces
export type { IFinanceService } from './IFinanceService';
export type { ITradingService } from './ITradingService';
export type { ICommunityService } from './ICommunityService';
export type { IModeSwitchService } from './IModeSwitchService';

export type {
  BalanceResponse,
  AssetsResponse,
  TransactionRequest,
  TransactionResponse,
  FinanceSummaryResponse,
} from './IFinanceService';

export type {
  TradingCardsResponse,
  TradingCardRequest,
  UpdateTradingCardRequest,
} from './ITradingService';

export type {
  PostsResponse,
  CommentsResponse,
  StoriesResponse,
  CreatePostRequest,
  CreateCommentRequest,
} from './ICommunityService';

export type {
  AppMode,
  ModeTransitionState,
  ResourceCleanupHandler,
  ModeTransitionOptions,
} from './IModeSwitchService';

// Service Implementations
export { FinanceService, financeService } from './FinanceService';
export { TradingService, tradingService } from './TradingService';
export { CommunityService, communityService } from './CommunityService';
export { ModeSwitchService, modeSwitchService } from './ModeSwitchService';
