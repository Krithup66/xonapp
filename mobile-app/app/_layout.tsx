/**
 * Root Layout - ตั้งค่าหลักของแอป
 * โหลด Font Prompt (Regular, Medium, Bold)
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LoadingScreen from './loading';
import { UserProvider } from '../contexts/UserContext';
import { ModeSwitchProvider } from '../contexts/ModeSwitchContext';

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Medium': require('../assets/fonts/Prompt-Medium.ttf'),
    'Prompt-Bold': require('../assets/fonts/Prompt-Bold.ttf'),
    // Aliases for backward compatibility
    'Prompt': require('../assets/fonts/Prompt-Regular.ttf'),
  });

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen when fonts are loaded
      SplashScreen.hideAsync();
      
      // แสดงหน้า loading เป็นเวลา 3-4 วินาที
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  // แสดงหน้า loading ก่อน
  if (showLoading || (!fontsLoaded && !fontError)) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ModeSwitchProvider>
          <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
            animation: 'none', // Instant transition - no animation สำหรับทุกหน้า
          }}
        >
          <Stack.Screen 
            name="loading"
            options={{
              animation: 'none',
              headerShown: false,
            }}
          />
          <Stack.Screen name="index" />
          <Stack.Screen name="finance" />
          <Stack.Screen name="trade" />
          <Stack.Screen name="community" />
          <Stack.Screen name="assistant" />
          <Stack.Screen
            name="transaction-summary"
            options={{
              animation: 'none', // Instant transition - no animation
              presentation: 'transparentModal', // Modal presentation for overlay effect
            }}
          />
        </Stack>
        </ModeSwitchProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
