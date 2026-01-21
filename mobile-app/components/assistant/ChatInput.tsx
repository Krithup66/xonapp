/**
 * Chat Input Component
 * แถบ input สำหรับถาม AI
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import { hapticImpact } from '../../utils/haptics';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// Microphone Icon
const MicIcon = ({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 10V12C19 15.87 15.87 19 12 19M5 10V12C5 15.87 8.13 19 12 19M12 19V23M8 23H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface ChatInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  onVoicePress?: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'ถามอะไรก็ได้...',
  onSend,
  onVoicePress,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      hapticImpact('medium');
      onSend?.(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          editable={!disabled}
        />
        <TouchableOpacity
          style={styles.micButton}
          onPress={() => {
            hapticImpact('light');
            onVoicePress?.();
          }}
          activeOpacity={0.7}
        >
          <MicIcon size={scale(20)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: scale(24),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(15),
    color: '#FFFFFF',
    maxHeight: scale(100),
  },
  micButton: {
    marginLeft: scale(8),
    padding: scale(4),
  },
});
