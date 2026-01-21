/**
 * IModeSwitchService Interface
 * Interface สำหรับ Mode Switch Service ตามกฎ Interface-First
 * จัดการการสลับระหว่าง 'Standard Mode' และ 'Game Mode' (The Warp System)
 */

/**
 * App Mode Type
 */
export type AppMode = 'standard' | 'game';

/**
 * Mode Transition State
 */
export type ModeTransitionState = 'idle' | 'transitioning' | 'completed';

/**
 * Resource Cleanup Handler
 * ใช้สำหรับ cleanup ทรัพยากรเมื่อสลับโหมด
 */
export interface ResourceCleanupHandler {
  /**
   * ชื่อของ resource handler
   */
  name: string;
  
  /**
   * ฟังก์ชัน cleanup ที่จะถูกเรียกเมื่อสลับโหมด
   */
  cleanup: () => Promise<void> | void;
  
  /**
   * Priority: ตัวเลขที่ต่ำกว่า = cleanup ก่อน (0 = highest priority)
   */
  priority?: number;
}

/**
 * Mode Transition Options
 */
export interface ModeTransitionOptions {
  /**
   * เรียก cleanup handlers หรือไม่ (default: true)
   */
  runCleanup?: boolean;
  
  /**
   * ระยะเวลา transition animation (milliseconds, default: 1000)
   */
  animationDuration?: number;
  
  /**
   * Callback เมื่อ transition เริ่มต้น
   */
  onTransitionStart?: () => void;
  
  /**
   * Callback เมื่อ transition เสร็จสิ้น
   */
  onTransitionComplete?: () => void;
  
  /**
   * Callback เมื่อเกิด error
   */
  onError?: (error: Error) => void;
}

/**
 * Mode Switch Service Interface
 * กำหนด contract สำหรับ Mode Switch Service
 */
export interface IModeSwitchService {
  /**
   * ดึงข้อมูล current mode
   * @returns AppMode
   */
  getCurrentMode(): AppMode;

  /**
   * สลับไปยังโหมดที่กำหนด
   * @param targetMode - โหมดที่ต้องการสลับไป
   * @param options - ตัวเลือกสำหรับ transition
   * @returns Promise<void>
   */
  switchMode(targetMode: AppMode, options?: ModeTransitionOptions): Promise<void>;

  /**
   * สลับโหมด (toggle ระหว่าง standard และ game)
   * @param options - ตัวเลือกสำหรับ transition
   * @returns Promise<void>
   */
  toggleMode(options?: ModeTransitionOptions): Promise<void>;

  /**
   * ลงทะเบียน resource cleanup handler
   * @param handler - Resource cleanup handler
   * @returns Function - Unregister function
   */
  registerCleanupHandler(handler: ResourceCleanupHandler): () => void;

  /**
   * ลงทะเบียน cleanup handler หลายตัวพร้อมกัน
   * @param handlers - Array of resource cleanup handlers
   * @returns Function - Unregister function
   */
  registerCleanupHandlers(handlers: ResourceCleanupHandler[]): () => void;

  /**
   * เรียก cleanup handlers ทั้งหมด (ใช้เมื่อสลับโหมด)
   * @returns Promise<void>
   */
  cleanupResources(): Promise<void>;

  /**
   * ดึงข้อมูล transition state
   * @returns ModeTransitionState
   */
  getTransitionState(): ModeTransitionState;

  /**
   * Subscribe to mode changes
   * @param callback - Callback function ที่จะถูกเรียกเมื่อ mode เปลี่ยน
   * @returns Function - Unsubscribe function
   */
  subscribe(callback: (mode: AppMode) => void): () => void;

  /**
   * Subscribe to transition state changes
   * @param callback - Callback function ที่จะถูกเรียกเมื่อ transition state เปลี่ยน
   * @returns Function - Unsubscribe function
   */
  subscribeToTransition(callback: (state: ModeTransitionState) => void): () => void;
}
