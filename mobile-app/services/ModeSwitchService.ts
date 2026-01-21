/**
 * ModeSwitchService Implementation
 * Service layer สำหรับจัดการการสลับระหว่าง 'Standard Mode' และ 'Game Mode'
 * ตามกฎ The Warp System: Centralize mode switching in a Global State Manager
 * Transition logic must handle asset cleanup to prevent RAM spikes
 */

import { IModeSwitchService } from './IModeSwitchService';
import type {
  AppMode,
  ModeTransitionState,
  ResourceCleanupHandler,
  ModeTransitionOptions,
} from './IModeSwitchService';

/**
 * ModeSwitchService Class
 * Implementation ของ IModeSwitchService interface
 * Singleton pattern เพื่อให้มี instance เดียวทั่วทั้งแอป
 */
export class ModeSwitchService implements IModeSwitchService {
  private static instance: ModeSwitchService | null = null;
  
  private currentMode: AppMode = 'standard';
  private transitionState: ModeTransitionState = 'idle';
  private cleanupHandlers: ResourceCleanupHandler[] = [];
  private modeSubscribers: Set<(mode: AppMode) => void> = new Set();
  private transitionSubscribers: Set<(state: ModeTransitionState) => void> = new Set();

  /**
   * Private constructor สำหรับ Singleton pattern
   */
  private constructor() {
    // Load saved mode from storage (if available)
    this.loadSavedMode();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ModeSwitchService {
    if (!ModeSwitchService.instance) {
      ModeSwitchService.instance = new ModeSwitchService();
    }
    return ModeSwitchService.instance;
  }

  /**
   * Load saved mode from storage
   */
  private async loadSavedMode(): Promise<void> {
    try {
      // Try to load from AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const savedMode = await AsyncStorage.getItem('@xonapp:app_mode');
      if (savedMode && (savedMode === 'standard' || savedMode === 'game')) {
        this.currentMode = savedMode as AppMode;
        this.notifyModeSubscribers();
      }
    } catch (error) {
      // Fallback to default mode if storage is not available
      console.warn('Could not load saved mode, using default:', error);
    }
  }

  /**
   * Save mode to storage
   */
  private async saveMode(mode: AppMode): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('@xonapp:app_mode', mode);
    } catch (error) {
      console.warn('Could not save mode to storage:', error);
    }
  }

  /**
   * ดึงข้อมูล current mode
   */
  getCurrentMode(): AppMode {
    return this.currentMode;
  }

  /**
   * สลับไปยังโหมดที่กำหนด
   * จัดการ cleanup ทรัพยากรเพื่อป้องกัน RAM spikes
   */
  async switchMode(
    targetMode: AppMode,
    options: ModeTransitionOptions = {}
  ): Promise<void> {
    // ถ้าเป็นโหมดเดียวกัน ไม่ต้องทำอะไร
    if (this.currentMode === targetMode) {
      return;
    }

    const {
      runCleanup = true,
      animationDuration = 1000,
      onTransitionStart,
      onTransitionComplete,
      onError,
    } = options;

    try {
      // เริ่ม transition
      this.setTransitionState('transitioning');
      onTransitionStart?.();

      // Cleanup resources ก่อนสลับโหมด (ตามกฎ: prevent RAM spikes)
      if (runCleanup) {
        await this.cleanupResources();
      }

      // รอ animation duration (ถ้ามี)
      if (animationDuration > 0) {
        await new Promise(resolve => setTimeout(resolve, animationDuration));
      }

      // สลับโหมด
      this.currentMode = targetMode;
      await this.saveMode(targetMode);
      this.notifyModeSubscribers();

      // Transition เสร็จสิ้น
      this.setTransitionState('completed');
      onTransitionComplete?.();

      // Reset transition state หลังจาก delay สั้นๆ
      setTimeout(() => {
        this.setTransitionState('idle');
      }, 100);

    } catch (error: any) {
      this.setTransitionState('idle');
      const errorObj = error instanceof Error ? error : new Error(String(error));
      onError?.(errorObj);
      throw errorObj;
    }
  }

  /**
   * สลับโหมด (toggle)
   */
  async toggleMode(options?: ModeTransitionOptions): Promise<void> {
    const targetMode: AppMode = this.currentMode === 'standard' ? 'game' : 'standard';
    await this.switchMode(targetMode, options);
  }

  /**
   * ลงทะเบียน resource cleanup handler
   */
  registerCleanupHandler(handler: ResourceCleanupHandler): () => void {
    // เพิ่ม priority ถ้าไม่มี (default: 100)
    const handlerWithPriority: ResourceCleanupHandler = {
      ...handler,
      priority: handler.priority ?? 100,
    };

    this.cleanupHandlers.push(handlerWithPriority);
    
    // เรียงลำดับตาม priority (ต่ำกว่า = cleanup ก่อน)
    this.cleanupHandlers.sort((a, b) => (a.priority || 100) - (b.priority || 100));

    // Return unregister function
    return () => {
      const index = this.cleanupHandlers.findIndex(h => h.name === handler.name);
      if (index !== -1) {
        this.cleanupHandlers.splice(index, 1);
      }
    };
  }

  /**
   * ลงทะเบียน cleanup handlers หลายตัว
   */
  registerCleanupHandlers(handlers: ResourceCleanupHandler[]): () => void {
    const unregisterFunctions = handlers.map(handler => 
      this.registerCleanupHandler(handler)
    );

    // Return function ที่ unregister ทั้งหมด
    return () => {
      unregisterFunctions.forEach(unregister => unregister());
    };
  }

  /**
   * เรียก cleanup handlers ทั้งหมด
   * ตามกฎ: Transition logic must handle asset cleanup to prevent RAM spikes
   */
  async cleanupResources(): Promise<void> {
    const cleanupPromises = this.cleanupHandlers.map(async (handler) => {
      try {
        await handler.cleanup();
      } catch (error) {
        // Log error แต่ไม่ throw เพื่อให้ cleanup handlers อื่นๆ ยังทำงานต่อ
        console.error(`Error in cleanup handler "${handler.name}":`, error);
      }
    });

    await Promise.all(cleanupPromises);
  }

  /**
   * ดึงข้อมูล transition state
   */
  getTransitionState(): ModeTransitionState {
    return this.transitionState;
  }

  /**
   * Set transition state และ notify subscribers
   */
  private setTransitionState(state: ModeTransitionState): void {
    this.transitionState = state;
    this.notifyTransitionSubscribers();
  }

  /**
   * Subscribe to mode changes
   */
  subscribe(callback: (mode: AppMode) => void): () => void {
    this.modeSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.modeSubscribers.delete(callback);
    };
  }

  /**
   * Subscribe to transition state changes
   */
  subscribeToTransition(callback: (state: ModeTransitionState) => void): () => void {
    this.transitionSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.transitionSubscribers.delete(callback);
    };
  }

  /**
   * Notify mode subscribers
   */
  private notifyModeSubscribers(): void {
    this.modeSubscribers.forEach(callback => {
      try {
        callback(this.currentMode);
      } catch (error) {
        console.error('Error in mode subscriber:', error);
      }
    });
  }

  /**
   * Notify transition subscribers
   */
  private notifyTransitionSubscribers(): void {
    this.transitionSubscribers.forEach(callback => {
      try {
        callback(this.transitionState);
      } catch (error) {
        console.error('Error in transition subscriber:', error);
      }
    });
  }

  /**
   * Reset service (สำหรับ testing)
   */
  public reset(): void {
    this.currentMode = 'standard';
    this.transitionState = 'idle';
    this.cleanupHandlers = [];
    this.modeSubscribers.clear();
    this.transitionSubscribers.clear();
  }
}

// Export singleton instance
export const modeSwitchService = ModeSwitchService.getInstance();
