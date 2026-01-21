/**
 * ModeSwitchButton Component
 * Widget ปุ่มสลับโหมดพร้อมแอนิเมชันวาร์ปแบบ Sci-fi
 * ตามกฎ The Warp System
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useModeSwitch } from '../../contexts/ModeSwitchContext';
import { hapticImpact } from '../../utils/haptics';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

/**
 * Sci-fi Warp Animation Component
 */
const WarpAnimation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Start warp animation
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      // Reset animations
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
      opacityAnim.setValue(0);
    }
  }, [isActive]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.warpContainer,
        {
          transform: [{ rotate }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Svg width={scale(60)} height={scale(60)} viewBox="0 0 60 60">
        <Defs>
          <SvgLinearGradient id="warpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <Stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Outer ring */}
        <Circle
          cx="30"
          cy="30"
          r="28"
          fill="none"
          stroke="url(#warpGradient)"
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Inner ring */}
        <Circle
          cx="30"
          cy="30"
          r="20"
          fill="none"
          stroke="url(#warpGradient)"
          strokeWidth="1.5"
          opacity="0.8"
        />
        
        {/* Center core */}
        <Circle
          cx="30"
          cy="30"
          r="8"
          fill="url(#warpGradient)"
          opacity="0.9"
        />
        
        {/* Energy lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * 60) * (Math.PI / 180);
          const x1 = 30 + Math.cos(angle) * 20;
          const y1 = 30 + Math.sin(angle) * 20;
          const x2 = 30 + Math.cos(angle) * 28;
          const y2 = 30 + Math.sin(angle) * 28;
          
          return (
            <Path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
              stroke="url(#warpGradient)"
              strokeWidth="1"
              opacity="0.7"
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};

/**
 * ModeSwitchButton Component
 */
export const ModeSwitchButton: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  size?: 'small' | 'medium' | 'large';
}> = ({ position = 'top-right', size = 'medium' }) => {
  const { currentMode, toggleMode, isTransitioning } = useModeSwitch();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when transitioning
  useEffect(() => {
    if (isTransitioning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTransitioning]);

  const handlePress = async () => {
    hapticImpact('medium');
    
    await toggleMode({
      animationDuration: 1000,
      onTransitionStart: () => {
        // Haptic feedback when transition starts
        hapticImpact('heavy');
      },
      onTransitionComplete: () => {
        // Haptic feedback when transition completes
        hapticImpact('light');
      },
      onError: (error) => {
        console.error('Mode switch error:', error);
        // TODO: Show error dialog to user
      },
    });
  };

  // Size configurations
  const sizeConfig = {
    small: { width: scale(50), height: scale(50), fontSize: scale(10) },
    medium: { width: scale(60), height: scale(60), fontSize: scale(12) },
    large: { width: scale(70), height: scale(70), fontSize: scale(14) },
  };

  const config = sizeConfig[size];

  // Position styles
  const positionStyles = {
    'top-right': { top: scale(60), right: scale(20) },
    'top-left': { top: scale(60), left: scale(20) },
    'bottom-right': { bottom: scale(100), right: scale(20) },
    'bottom-left': { bottom: scale(100), left: scale(20) },
    'center': { top: '50%', left: '50%', transform: [{ translateX: -config.width / 2 }, { translateY: -config.height / 2 }] },
  };

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyles[position],
        {
          width: config.width,
          height: config.height,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        disabled={isTransitioning}
        activeOpacity={0.8}
      >
        {/* Warp animation overlay */}
        {isTransitioning && <WarpAnimation isActive={isTransitioning} />}
        
        {/* Button background with gradient */}
        <LinearGradient
          colors={
            currentMode === 'game'
              ? ['#3B82F6', '#8B5CF6', '#EC4899'] // Game mode: Blue to Purple to Pink
              : ['#1F2937', '#374151', '#4B5563'] // Standard mode: Gray gradient
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Mode indicator text */}
          <Text style={[styles.modeText, { fontSize: config.fontSize }]}>
            {currentMode === 'game' ? 'GAME' : 'STD'}
          </Text>
          
          {/* Sci-fi border effect */}
          <View style={styles.borderEffect} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    elevation: 10,
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: scale(30),
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modeText: {
    fontFamily: 'Prompt-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 2,
  },
  borderEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(30),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1,
  },
  warpContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
});
