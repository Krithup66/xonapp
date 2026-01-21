/**
 * Assistant Screen - หน้าผู้ช่วย
 * AI Assistant Interface แบบ Futuristic
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { BottomNavigation } from '../components/shared/BottomNavigation';
import { scaleWidth, scaleFont } from '../utils/dimensions';
import { hapticImpact } from '../utils/haptics';
import Svg, { Path } from 'react-native-svg';

// Lazy load heavy components - load on demand (React Native compatible)
let AISphereComponent: React.ComponentType<any> | null = null;
let FloatingCardComponent: React.ComponentType<any> | null = null;
let ChatInputComponent: React.ComponentType<any> | null = null;
let ThinkingIndicatorComponent: React.ComponentType<any> | null = null;
let SidebarComponent: React.ComponentType<any> | null = null;

const loadComponents = async () => {
  try {
    if (!AISphereComponent) {
      const module = await import('../components/assistant/AISphere');
      AISphereComponent = module.AISphere;
    }
    if (!FloatingCardComponent) {
      const module = await import('../components/assistant/FloatingCard');
      FloatingCardComponent = module.FloatingCard;
    }
    if (!ChatInputComponent) {
      const module = await import('../components/assistant/ChatInput');
      ChatInputComponent = module.ChatInput;
    }
    if (!ThinkingIndicatorComponent) {
      const module = await import('../components/assistant/ThinkingIndicator');
      ThinkingIndicatorComponent = module.ThinkingIndicator;
    }
    if (!SidebarComponent) {
      const module = await import('../components/assistant/Sidebar');
      SidebarComponent = module.Sidebar;
    }
  } catch (error) {
    console.error('Error loading assistant components:', error);
  }
};

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

// Back Icon
const BackIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
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
  const navigation = useNavigation();
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean }>>([]);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  // Handle back button press
  const handleBack = () => {
    hapticImpact('light');
    if (navigation.canGoBack()) {
      router.back();
    } else {
      // ถ้าไม่มีหน้าข้างหลัง ให้ไปที่หน้า index
      router.replace('/');
    }
  };

  // Lazy load components on mount
  useEffect(() => {
    loadComponents().then(() => {
      setComponentsLoaded(true);
    });
  }, []);

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
        {/* Back Button - ซ้ายสุด */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <BackIcon size={scale(24)} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Title - ตรงกลาง */}
        <Text style={styles.headerTitle}>ผู้ช่วย AI</Text>
        
        {/* Menu Button - ขวาสุด */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            hapticImpact('light');
            setSidebarVisible(true);
          }}
          activeOpacity={0.7}
        >
          <MenuIcon size={scale(24)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* AI Sphere */}
        <View style={styles.sphereContainer}>
          {componentsLoaded && AISphereComponent ? (
            <AISphereComponent isThinking={isThinking} />
          ) : (
            <View style={{ width: scale(200), height: scale(200), backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: scale(100) }} />
          )}
        </View>

        {/* Floating Cards Container - Only show when not thinking */}
        {!isThinking && componentsLoaded && FloatingCardComponent && (
          <View style={styles.floatingCardsContainer}>
            {FLOATING_CARDS.map((card) => (
              <FloatingCardComponent
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
              {componentsLoaded && ThinkingIndicatorComponent ? (
                <ThinkingIndicatorComponent visible={isThinking} />
              ) : (
                <View style={{ width: scale(100), height: scale(20), backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: scale(10) }} />
              )}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Chat Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        {componentsLoaded && ChatInputComponent ? (
          <ChatInputComponent
            placeholder="ถามอะไรก็ได้..."
            onSend={handleSendMessage}
            onVoicePress={handleVoicePress}
            disabled={isThinking}
          />
        ) : (
          <View style={{ height: scale(50), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: scale(25) }} />
        )}
      </View>

      {/* Sidebar */}
      {componentsLoaded && SidebarComponent && (
        <SidebarComponent
          items={SIDEBAR_ITEMS}
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />
      )}

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
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
  },
  backButton: {
    padding: scale(4),
    width: scale(32),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: scale(4),
    width: scale(32),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Prompt-Bold',
    fontSize: scaleFont(20),
    color: '#FFFFFF',
    textAlign: 'center',
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
