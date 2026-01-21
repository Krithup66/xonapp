/**
 * ModeSwitchContext - Global State Manager สำหรับ Mode Switching
 * ตามกฎ The Warp System: Centralize 'Standard-to-Game' mode switching in a Global State Manager
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { modeSwitchService } from '../services/ModeSwitchService';
import type { AppMode, ModeTransitionState, ModeTransitionOptions } from '../services/IModeSwitchService';

/**
 * Mode Switch Context Type
 */
interface ModeSwitchContextType {
  /**
   * Current app mode
   */
  currentMode: AppMode;
  
  /**
   * Transition state
   */
  transitionState: ModeTransitionState;
  
  /**
   * สลับไปยังโหมดที่กำหนด
   */
  switchMode: (targetMode: AppMode, options?: ModeTransitionOptions) => Promise<void>;
  
  /**
   * Toggle ระหว่าง standard และ game mode
   */
  toggleMode: (options?: ModeTransitionOptions) => Promise<void>;
  
  /**
   * ตรวจสอบว่าเป็น Game Mode หรือไม่
   */
  isGameMode: boolean;
  
  /**
   * ตรวจสอบว่าเป็น Standard Mode หรือไม่
   */
  isStandardMode: boolean;
  
  /**
   * ตรวจสอบว่ากำลัง transition อยู่หรือไม่
   */
  isTransitioning: boolean;
}

const ModeSwitchContext = createContext<ModeSwitchContextType | undefined>(undefined);

/**
 * ModeSwitchProvider Component
 * Global State Manager สำหรับ mode switching
 */
export function ModeSwitchProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentMode] = useState<AppMode>(modeSwitchService.getCurrentMode());
  const [transitionState, setTransitionState] = useState<ModeTransitionState>(
    modeSwitchService.getTransitionState()
  );

  // Subscribe to mode changes
  useEffect(() => {
    const unsubscribeMode = modeSwitchService.subscribe((mode) => {
      setCurrentMode(mode);
    });

    const unsubscribeTransition = modeSwitchService.subscribeToTransition((state) => {
      setTransitionState(state);
    });

    return () => {
      unsubscribeMode();
      unsubscribeTransition();
    };
  }, []);

  /**
   * Switch mode handler
   */
  const switchMode = useCallback(async (
    targetMode: AppMode,
    options?: ModeTransitionOptions
  ) => {
    await modeSwitchService.switchMode(targetMode, options);
  }, []);

  /**
   * Toggle mode handler
   */
  const toggleMode = useCallback(async (options?: ModeTransitionOptions) => {
    await modeSwitchService.toggleMode(options);
  }, []);

  const value: ModeSwitchContextType = {
    currentMode,
    transitionState,
    switchMode,
    toggleMode,
    isGameMode: currentMode === 'game',
    isStandardMode: currentMode === 'standard',
    isTransitioning: transitionState === 'transitioning',
  };

  return (
    <ModeSwitchContext.Provider value={value}>
      {children}
    </ModeSwitchContext.Provider>
  );
}

/**
 * useModeSwitch Hook
 * ใช้สำหรับเข้าถึง ModeSwitchContext ใน components
 */
export function useModeSwitch(): ModeSwitchContextType {
  const context = useContext(ModeSwitchContext);
  if (context === undefined) {
    throw new Error('useModeSwitch must be used within ModeSwitchProvider');
  }
  return context;
}
