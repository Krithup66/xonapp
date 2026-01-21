/**
 * AI Sphere Component
 * วงกลม AI ตรงกลางที่มี gradient และ animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import Svg, { Circle, Line } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface AISphereProps {
  isThinking?: boolean;
}

export const AISphere: React.FC<AISphereProps> = ({ isThinking = false }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Orbiting particles */}
      <Animated.View
        style={[
          styles.particlesContainer,
          { transform: [{ rotate: rotation }] },
        ]}
      >
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const radius = scale(60);
          
          return (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  transform: [
                    {
                      translateX: radius * Math.cos(angle),
                    },
                    {
                      translateY: radius * Math.sin(angle),
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </Animated.View>

      {/* Main AI Sphere */}
      <Animated.View
        style={[
          styles.sphereContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#3B82F6', '#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.sphereInner}>
            <Text style={styles.aiText}>AI</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.1],
              outputRange: [0.3, 0.5],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(200),
    height: scale(200),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: '#3B82F6',
    opacity: 0.6,
  },
  sphereContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    overflow: 'hidden',
    zIndex: 1,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sphereInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  aiText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(32),
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  glow: {
    position: 'absolute',
    width: scale(160),
    height: scale(160),
    borderRadius: scale(80),
    backgroundColor: '#3B82F6',
    zIndex: 0,
  },
});
