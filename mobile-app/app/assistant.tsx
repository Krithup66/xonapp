/**
 * Assistant Screen - หน้าผู้ช่วย
 * กำลังพัฒนา
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/shared/BottomNavigation';

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>ผู้ช่วย</Text>
        <Text style={styles.subtitle}>กำลังพัฒนา</Text>
      </View>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Prompt-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Prompt-Regular',
    fontSize: 18,
    color: '#747474',
  },
});
