/**
 * Assistant Screen - หน้าผู้ช่วย
 * AI Assistant Interface แบบ Futuristic
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BottomNavigation } from '../components/shared/BottomNavigation';
import { AISphere } from '../components/assistant/AISphere';
import { FloatingCard } from '../components/assistant/FloatingCard';
import { ChatInput } from '../components/assistant/ChatInput';
import { ThinkingIndicator } from '../components/assistant/ThinkingIndicator';
import { Sidebar } from '../components/assistant/Sidebar';
import { scaleWidth, scaleFont } from '../utils/dimensions';
import { hapticImpact } from '../utils/haptics';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Menu Icon
const MenuIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12H21M3 6H21M3 18H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sample floating cards data
const FLOATING_CARDS = [
  {
    id: '1',
    title: '# กลยุทธ์ AI Trading Bot',
    content: 'ตามพอร์ตโฟลิโอของคุณ ฉันแนะนำ Dynamic Scalping โดยใช้ MACD และ RSI Indicators',
    position: 'topRight' as const,
  },
  {
    id: '2',
    title: 'สถานะการประมวลผล',
    content: 'MACD, RSI, Trend Analysis, ATS (automated)',
    position: 'middleRight' as const,
  },
  {
    id: '3',
    title: '# กลยุทธ์ AI Trading Bot',
    content: 'แนะนำ Strategy: Scalping โดยใช้ Indicators: MACD และ RSI สำหรับการเทรดบ่อยๆ',
    position: 'bottomRight' as const,
  },
  {
    id: '4',
    title: 'การเลือกทั้งหมด',
    content: 'วิเคราะห์พอร์ตโฟลิโอและแนะนำกลยุทธ์ที่ดีที่สุด',
    position: 'middleLeft' as const,
  },
  {
    id: '5',
    title: 'สถานะการประมวลผล',
    content: '• Key Indicators: MACD (oscillators)',
    position: 'bottomLeft' as const,
  },
];

// Sidebar items
const SIDEBAR_ITEMS = [
  { label: '1. ประวัติ', hasArrow: false },
  { label: 'การตั้งค่า >', hasArrow: true },
  { label: 'รีเฟรช >', hasArrow: true },
  { label: 'ปิด', hasArrow: false },
  { label: 'ค้นหา', hasArrow: false },
];

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean }>>([]);

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI thinking
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: 'ฉันกำลังประมวลผลคำถามของคุณ...',
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 2000);
  };

  const handleVoicePress = () => {
    hapticImpact('medium');
    // TODO: Implement voice input
    console.log('Voice input pressed');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              },
            ]}
          />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            hapticImpact('light');
            setSidebarVisible(true);
          }}
          activeOpacity={0.7}
        >
          <MenuIcon size={scale(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ผู้ช่วย AI</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* AI Sphere */}
        <View style={styles.sphereContainer}>
          <AISphere isThinking={isThinking} />
        </View>

        {/* Floating Cards Container - Only show when not thinking */}
        {!isThinking && (
          <View style={styles.floatingCardsContainer}>
            {FLOATING_CARDS.map((card) => (
              <FloatingCard
                key={card.id}
                title={card.title}
                content={card.content}
                position={card.position}
                onPress={() => {
                  hapticImpact('light');
                  // TODO: Handle card press
                }}
              />
            ))}
          </View>
        )}

        {/* Messages Scroll */}
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesScrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Messages */}
          {messages.length > 0 && (
            <View style={styles.messagesContainer}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.message,
                    msg.isUser ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Thinking Indicator */}
          {isThinking && (
            <View style={styles.thinkingContainer}>
              <ThinkingIndicator visible={isThinking} />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Chat Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <ChatInput
          placeholder="ถามอะไรก็ได้..."
          onSend={handleSendMessage}
          onVoicePress={handleVoicePress}
          disabled={isThinking}
        />
      </View>

      {/* Sidebar */}
      <Sidebar
        items={SIDEBAR_ITEMS}
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    width: scale(2),
    height: scale(2),
    borderRadius: scale(1),
    backgroundColor: '#3B82F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
  },
  menuButton: {
    padding: scale(4),
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(20),
    color: '#FFFFFF',
    textAlign: 'center',
    marginLeft: scale(-32), // Center with menu button
  },
  headerSpacer: {
    width: scale(32),
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  sphereContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(40),
    zIndex: 2,
    minHeight: scale(300),
  },
  floatingCardsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    pointerEvents: 'box-none',
  },
  messagesScroll: {
    flex: 1,
    zIndex: 1,
  },
  messagesScrollContent: {
    paddingBottom: scale(120),
    paddingHorizontal: scale(16),
    paddingTop: scale(350), // Space for sphere
  },
  messagesContainer: {
    marginTop: scale(20),
    gap: scale(12),
  },
  message: {
    maxWidth: '80%',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(20),
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: '#FFFFFF',
    lineHeight: scaleFont(20),
  },
  thinkingContainer: {
    paddingHorizontal: scale(16),
    marginTop: scale(12),
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
    paddingTop: scale(8),
  },
});
