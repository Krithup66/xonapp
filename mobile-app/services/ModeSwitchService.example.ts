/**
 * ModeSwitchService Usage Examples
 * ตัวอย่างการใช้งาน ModeSwitchService และการ register cleanup handlers
 */

import { modeSwitchService } from './ModeSwitchService';
import type { ResourceCleanupHandler } from './IModeSwitchService';

/**
 * Example 1: Basic Mode Switching
 */
export async function exampleBasicModeSwitch() {
  // Switch to Game Mode
  await modeSwitchService.switchMode('game', {
    animationDuration: 1000,
    onTransitionStart: () => {
      console.log('Transition started');
    },
    onTransitionComplete: () => {
      console.log('Transition completed');
    },
  });

  // Toggle between modes
  await modeSwitchService.toggleMode();
}

/**
 * Example 2: Register Cleanup Handler for Rive Animations
 * ตามกฎ: Rive Management - Use Singleton for Rive Controllers. Ensure `.dispose()` is called
 */
export function exampleRegisterRiveCleanup() {
  // สมมติว่ามี Rive controller instance
  let riveController: any = null; // Replace with actual Rive controller type

  const cleanupHandler: ResourceCleanupHandler = {
    name: 'RiveController',
    priority: 0, // High priority - cleanup first
    cleanup: async () => {
      if (riveController) {
        // Dispose Rive instance to prevent memory leaks
        riveController.dispose();
        riveController = null;
        console.log('Rive controller disposed');
      }
    },
  };

  // Register cleanup handler
  const unregister = modeSwitchService.registerCleanupHandler(cleanupHandler);

  // Later, when component unmounts:
  // unregister();
}

/**
 * Example 3: Register Multiple Cleanup Handlers
 */
export function exampleRegisterMultipleCleanup() {
  const handlers: ResourceCleanupHandler[] = [
    {
      name: 'RiveController',
      priority: 0,
      cleanup: async () => {
        // Cleanup Rive
        console.log('Cleaning up Rive...');
      },
    },
    {
      name: 'WebSocketConnection',
      priority: 1,
      cleanup: async () => {
        // Close WebSocket
        console.log('Closing WebSocket...');
      },
    },
    {
      name: 'GameAssets',
      priority: 2,
      cleanup: async () => {
        // Unload game assets
        console.log('Unloading game assets...');
      },
    },
  ];

  // Register all handlers
  const unregisterAll = modeSwitchService.registerCleanupHandlers(handlers);

  // Later, when component unmounts:
  // unregisterAll();
}

/**
 * Example 4: Subscribe to Mode Changes
 */
export function exampleSubscribeToModeChanges() {
  // Subscribe to mode changes
  const unsubscribe = modeSwitchService.subscribe((mode) => {
    console.log('Mode changed to:', mode);
    
    // Update UI based on mode
    if (mode === 'game') {
      // Load game mode assets
      console.log('Loading game mode assets...');
    } else {
      // Load standard mode assets
      console.log('Loading standard mode assets...');
    }
  });

  // Later, when component unmounts:
  // unsubscribe();
}

/**
 * Example 5: Subscribe to Transition State
 */
export function exampleSubscribeToTransition() {
  const unsubscribe = modeSwitchService.subscribeToTransition((state) => {
    console.log('Transition state:', state);
    
    if (state === 'transitioning') {
      // Show loading indicator
      console.log('Showing loading indicator...');
    } else if (state === 'completed') {
      // Hide loading indicator
      console.log('Hiding loading indicator...');
    }
  });

  // Later, when component unmounts:
  // unsubscribe();
}

/**
 * Example 6: Complete Component Example with Cleanup
 */
export function exampleComponentWithCleanup() {
  // In a React component:
  /*
  useEffect(() => {
    // Register cleanup handlers when component mounts
    const handlers: ResourceCleanupHandler[] = [
      {
        name: 'ComponentResources',
        priority: 10,
        cleanup: async () => {
          // Cleanup component-specific resources
          // e.g., cancel timers, close connections, etc.
        },
      },
    ];

    const unregister = modeSwitchService.registerCleanupHandlers(handlers);

    // Subscribe to mode changes
    const unsubscribeMode = modeSwitchService.subscribe((mode) => {
      // Update component based on mode
    });

    // Cleanup when component unmounts
    return () => {
      unregister();
      unsubscribeMode();
    };
  }, []);
  */
}
