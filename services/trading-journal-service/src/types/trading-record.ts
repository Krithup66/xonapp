export interface TradingRecord {
  id?: string;
  user_id: string;
  trade_type: 'forex' | 'crypto';
  before_trading: {
    emotional_state: string;
    asset: string;
    lot_size: string;
    take_profit: string;
    stop_loss: string;
    risk_reward: string;
    entry_date: string;
    entry_price: string;
    status: 'Buy' | 'Sell';
    entry_reason: string;
    chart_image?: string;
  };
  after_trading: {
    exit_price: string;
    exit_condition: 'TP' | 'SL' | 'SP';
    result: 'Win' | 'Loss' | 'BreakEven';
    profit: string;
    exit_reason: string;
    days_held: string;
    emotional_state: string;
    grade: 'A+' | 'A' | 'B' | 'C' | 'F';
    notes?: string;
    account_link?: string;
    chart_image?: string;
  };
  created_at?: string;
  updated_at?: string;
}
