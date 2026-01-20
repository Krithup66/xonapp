/**
 * Create Post Modal Component
 * Modal สำหรับสร้างโพสต์ใหม่
 * มีตัวเลือกว่าจะโพสต์เป็นสตอรี่ด้วยหรือไม่
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COMMUNITY_COLORS, COMMUNITY_SIZES, COMMUNITY_SPACING } from '../../config/community-design.config';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; media?: string[]; isStory: boolean }) => void;
  userAvatar?: string;
}

/**
 * Close Icon
 */
const CloseIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Image Icon
 */
const ImageIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L22 16M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onSubmit,
  userAvatar,
}) => {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isStory, setIsStory] = useState(false);

  const handleSubmit = () => {
    if (!text.trim() && selectedImages.length === 0) {
      Alert.alert('ผิดพลาด', 'กรุณาใส่ข้อความหรือเลือกรูปภาพ');
      return;
    }

    onSubmit({
      text: text.trim(),
      media: selectedImages.length > 0 ? selectedImages : undefined,
      isStory,
    });

    // Reset form
    setText('');
    setSelectedImages([]);
    setIsStory(false);
    onClose();
  };

  const handleAddImage = () => {
    // TODO: เปิด image picker
    // ตอนนี้ใช้ placeholder
    Alert.alert('เพิ่มรูปภาพ', 'ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { paddingTop: insets.top }]}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseIcon size={scale(24)} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>สร้างโพสต์</Text>
            <TouchableOpacity 
              onPress={handleSubmit}
              style={[styles.submitButton, (!text.trim() && selectedImages.length === 0) && styles.submitButtonDisabled]}
              disabled={!text.trim() && selectedImages.length === 0}
            >
              <Text style={[styles.submitButtonText, (!text.trim() && selectedImages.length === 0) && styles.submitButtonTextDisabled]}>
                โพสต์
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                {userAvatar ? (
                  <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
                ) : (
                  <Svg width={40} height={40} viewBox="0 0 40 40">
                    <Circle cx="20" cy="16" r="6" fill="#FFFFFF" opacity={0.9} />
                    <Path
                      d="M9 35C9 28.5 15 24 20 24C25 24 31 28.5 31 35"
                      fill="#FFFFFF"
                      opacity={0.9}
                    />
                  </Svg>
                )}
              </View>
              <Text style={styles.userName}>คุณ</Text>
            </View>

            {/* Text Input */}
            <TextInput
              style={styles.textInput}
              placeholder="เขียนอะไรบางอย่าง..."
              placeholderTextColor={COMMUNITY_COLORS.textGray}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
            />

            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <View style={styles.imagesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.imageItem}>
                      <Image source={{ uri }} style={styles.selectedImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                      >
                        <CloseIcon size={scale(16)} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleAddImage}
              >
                <ImageIcon size={scale(24)} />
                <Text style={styles.actionButtonText}>เพิ่มรูปภาพ</Text>
              </TouchableOpacity>
            </View>

            {/* Story Toggle */}
            <View style={styles.storyToggleContainer}>
              <TouchableOpacity
                style={[styles.storyToggle, isStory && styles.storyToggleActive]}
                onPress={() => setIsStory(!isStory)}
                activeOpacity={0.7}
              >
                <View style={[styles.toggleSwitch, isStory && styles.toggleSwitchActive]}>
                  <View style={[styles.toggleThumb, isStory && styles.toggleThumbActive]} />
                </View>
                <View style={styles.storyToggleTextContainer}>
                  <Text style={styles.storyToggleTitle}>โพสต์เป็นสตอรี่ด้วย</Text>
                  <Text style={styles.storyToggleDescription}>
                    โพสต์นี้จะแสดงในสตอรี่ของคุณอัตโนมัติ
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COMMUNITY_COLORS.background,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    maxHeight: '90%',
    paddingBottom: scale(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: COMMUNITY_SPACING.screenPadding,
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    width: scale(32),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Prompt-Medium',
    fontSize: scaleFont(16),
    color: COMMUNITY_COLORS.textWhite,
  },
  submitButton: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    backgroundColor: COMMUNITY_COLORS.activeColor,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(123, 9, 9, 0.3)',
  },
  submitButtonText: {
    fontFamily: 'Prompt-Medium',
    fontSize: scaleFont(14),
    color: COMMUNITY_COLORS.textWhite,
  },
  submitButtonTextDisabled: {
    color: COMMUNITY_COLORS.textGray,
  },
  content: {
    flex: 1,
    paddingHorizontal: COMMUNITY_SPACING.screenPadding,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: scale(16),
  },
  userAvatar: {
    width: COMMUNITY_SIZES.avatarSize,
    height: COMMUNITY_SIZES.avatarSize,
    borderRadius: COMMUNITY_SIZES.avatarRadius,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontFamily: 'Prompt-Medium',
    fontSize: COMMUNITY_SIZES.userNameText,
    color: COMMUNITY_COLORS.textWhite,
  },
  textInput: {
    fontFamily: 'Prompt-Regular',
    fontSize: COMMUNITY_SIZES.postText,
    color: COMMUNITY_COLORS.textWhite,
    minHeight: scale(120),
    marginBottom: scale(16),
  },
  imagesContainer: {
    marginBottom: scale(16),
  },
  imageItem: {
    width: scale(100),
    height: scale(100),
    marginRight: scale(8),
    borderRadius: scale(8),
    overflow: 'hidden',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    marginBottom: scale(16),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  actionButtonText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(14),
    color: COMMUNITY_COLORS.textWhite,
  },
  storyToggleContainer: {
    marginTop: scale(8),
    marginBottom: scale(16),
  },
  storyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    padding: scale(16),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  storyToggleActive: {
    borderColor: '#FF6B9D',
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
  toggleSwitch: {
    width: scale(44),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    paddingHorizontal: scale(2),
  },
  toggleSwitchActive: {
    backgroundColor: '#FF6B9D',
  },
  toggleThumb: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  storyToggleTextContainer: {
    flex: 1,
  },
  storyToggleTitle: {
    fontFamily: 'Prompt-Medium',
    fontSize: scaleFont(14),
    color: COMMUNITY_COLORS.textWhite,
    marginBottom: scale(4),
  },
  storyToggleDescription: {
    fontFamily: 'Prompt-Regular',
    fontSize: scaleFont(12),
    color: COMMUNITY_COLORS.textGray,
    lineHeight: scale(16),
  },
});
