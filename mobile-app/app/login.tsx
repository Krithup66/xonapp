/**
 * Login Route - หน้าเข้าสู่ระบบ
 * Implementation ตาม Figma Design: https://www.figma.com/design/NmPv0jxFTjvRr44DEEfRd5/xon.com?node-id=3036-7190
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput, Modal, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, PanResponder, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_SCREEN_WIDTH = 375;

const scale = (size: number) => {
  return (size / BASE_SCREEN_WIDTH) * SCREEN_WIDTH;
};

// รายการประเทศและ Country Code
const COUNTRIES = [
  { code: '+66', name: 'ไทย', flag: '🇹🇭' },
  { code: '+1', name: 'สหรัฐอเมริกา', flag: '🇺🇸' },
  { code: '+44', name: 'สหราชอาณาจักร', flag: '🇬🇧' },
  { code: '+81', name: 'ญี่ปุ่น', flag: '🇯🇵' },
  { code: '+82', name: 'เกาหลีใต้', flag: '🇰🇷' },
  { code: '+86', name: 'จีน', flag: '🇨🇳' },
  { code: '+65', name: 'สิงคโปร์', flag: '🇸🇬' },
  { code: '+60', name: 'มาเลเซีย', flag: '🇲🇾' },
  { code: '+62', name: 'อินโดนีเซีย', flag: '🇮🇩' },
  { code: '+84', name: 'เวียดนาม', flag: '🇻🇳' },
  { code: '+63', name: 'ฟิลิปปินส์', flag: '🇵🇭' },
  { code: '+91', name: 'อินเดีย', flag: '🇮🇳' },
  { code: '+61', name: 'ออสเตรเลีย', flag: '🇦🇺' },
  { code: '+64', name: 'นิวซีแลนด์', flag: '🇳🇿' },
  { code: '+33', name: 'ฝรั่งเศส', flag: '🇫🇷' },
  { code: '+49', name: 'เยอรมนี', flag: '🇩🇪' },
  { code: '+39', name: 'อิตาลี', flag: '🇮🇹' },
  { code: '+34', name: 'สเปน', flag: '🇪🇸' },
  { code: '+7', name: 'รัสเซีย', flag: '🇷🇺' },
  { code: '+971', name: 'สหรัฐอาหรับเอมิเรตส์', flag: '🇦🇪' },
];

// Icon URLs จาก Figma (figma-alpha-api) - Updated from node-id=3036-7317
const ICON_URLS = {
  helpIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ebed3e9a-3149-41eb-9439-cb749daf18ef', // ใช้ URL เดียวกันเพื่อไม่ให้กระพริบ
  googleIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5c9bbaa0-4a97-4b03-a787-baed517dbb39', // Email page
  facebookIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9f53f41f-8f8a-432a-ac51-b68c65afd639', // Email page
  telegramIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/da016b75-88ea-4dc6-b969-d00cee664ea4', // Email page
  googleIconPhone: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/aa8dae6c-456f-4a5d-876e-2a61e6433f26', // Phone page (3036:7334)
  facebookIconPhone: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b8bc5343-eab4-49f7-b020-3f62de3e65c2', // Phone page (3036:7340)
  telegramIconPhone: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/45dbcf1d-b430-40f3-9b4d-20db6189ca92', // Phone page (3036:7344)
  dividerLine: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8aeb34fd-282a-4d69-904f-3fbbbcab3531', // Email page
  dividerLinePhone: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b7761e6f-4144-42c4-a804-7d7bcab2e995', // Phone page (3036:7329)
  // Email page icons
  inputIcon: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9222da3f-2fb5-4f73-8852-4ca6f609f14c',
  // Phone page icons
  dropdownArrow: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/cb91a65d-2a14-4d7d-84ea-7e1b8e4f1219', // Phone page (3036:7382)
  checkbox: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/dac3e53c-10a4-4211-ad93-678187dbbedf', // Phone page (3110:6460)
};

export default function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const phoneInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [countryCode, setCountryCode] = useState('+66');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showNumericKeypad, setShowNumericKeypad] = useState(false);
  const keypadSlideAnim = useRef(new Animated.Value(0)).current;

  // PanResponder for swipe right to go back
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt) => {
          // Only start if touch begins near left edge (within 20px)
          return evt.nativeEvent.pageX < 20;
        },
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only respond to horizontal swipes (right direction)
          return gestureState.dx > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderGrant: () => {
          // Optional: Add visual feedback
        },
        onPanResponderMove: () => {
          // Optional: Add visual feedback during swipe
        },
        onPanResponderRelease: (_, gestureState) => {
          // If swiped right more than 80px, go back
          if (gestureState.dx > 80) {
            router.push('/');
          }
        },
        onPanResponderTerminate: () => {
          // Handle cancellation
        },
      }),
    [router]
  );

  const handleMethodChange = (method: 'phone' | 'email') => {
    setLoginMethod(method);
    // Clear focus when switching methods
    phoneInputRef.current?.blur();
    emailInputRef.current?.blur();
    setShowNumericKeypad(false);
  };

  // Handle numeric keypad animation
  useEffect(() => {
    if (showNumericKeypad) {
      // Reset animation value first
      keypadSlideAnim.setValue(0);
      // Then animate in
      Animated.spring(keypadSlideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.spring(keypadSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [showNumericKeypad]);

  const handleNumberPress = (number: string) => {
    setPhoneValue((prev) => prev + number);
    // Keep keypad open and keep focus
    phoneInputRef.current?.focus();
  };

  const handleDeletePress = () => {
    setPhoneValue((prev) => prev.slice(0, -1));
    // Keep keypad open and keep focus
    phoneInputRef.current?.focus();
  };

  const handlePhoneInputFocus = () => {
    Keyboard.dismiss();
    // Small delay to ensure keyboard is dismissed first
    setTimeout(() => {
      setShowNumericKeypad(true);
    }, 100);
  };


  const handleKeypadButtonPress = (callback: () => void) => {
    // Execute callback first
    callback();
    // Then immediately refocus to prevent blur from closing keypad
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 50);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} {...panResponder.panHandlers}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <StatusBar style="light" />
      
      {/* Help Icon - กลับไปหน้าหลัก */}
      <TouchableOpacity 
        style={styles.helpButton}
        activeOpacity={0.7}
        onPress={() => router.push('/')}
      >
        <Image 
          source={{ uri: ICON_URLS.helpIcon }} 
          style={styles.helpIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Login Container - ตาม Figma: left-[27px] top-[51px] */}
      <View style={styles.loginContainer}>
        <Text style={styles.title}>เข้าสู่ระบบ</Text>
        {/* Login Method Selector */}
        <View style={styles.methodContainer}>
          <TouchableOpacity 
            onPress={() => handleMethodChange('phone')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.methodText,
              loginMethod === 'phone' && styles.methodTextActive
            ]}>
              โทรศัพท์
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleMethodChange('email')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.methodText,
              loginMethod === 'email' && styles.methodTextActive
            ]}>
              อีเมล
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Container - ตาม Figma: left-[27px] top-[119px] */}
      {loginMethod === 'phone' ? (
        <>
          <View style={styles.inputContainerPhone}>
            <View style={styles.inputFieldPhone}>
              {/* Country Code Selector */}
              <TouchableOpacity 
                style={styles.countryCodeContainer}
                activeOpacity={0.7}
                onPress={() => setShowCountryModal(true)}
              >
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <Image 
                  source={{ uri: ICON_URLS.dropdownArrow }} 
                  style={styles.dropdownArrow}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TextInput
                ref={phoneInputRef}
                style={styles.phoneInput}
                placeholder="เบอร์โทรศัพท์"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={phoneValue}
                onChangeText={setPhoneValue}
                keyboardType="phone-pad"
                editable={true}
                autoFocus={false}
                returnKeyType="done"
                showSoftInputOnFocus={false}
                blurOnSubmit={false}
                onSubmitEditing={() => {}}
                onFocus={handlePhoneInputFocus}
                onBlur={(e) => {
                  // Delay blur check to allow keypad button presses
                  const currentTarget = e.currentTarget;
                  setTimeout(() => {
                    // Only blur if input is still not focused
                    if (!phoneInputRef.current?.isFocused()) {
                      // Don't auto-hide, let user close manually
                    }
                  }, 200);
                }}
                onTouchStart={() => {
                  // Prevent default keyboard
                  Keyboard.dismiss();
                  // Show numeric keypad when touched
                  handlePhoneInputFocus();
                }}
              />
            </View>
          </View>
          {/* Checkbox - ตาม Figma: left-[314px] top-[128px] */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: ICON_URLS.checkbox }} 
              style={styles.checkbox}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              ref={emailInputRef}
              style={styles.emailInput}
              placeholder="อีเมล"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={emailValue}
              onChangeText={setEmailValue}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={true}
              autoFocus={false}
              returnKeyType="done"
              showSoftInputOnFocus={true}
              blurOnSubmit={false}
              onSubmitEditing={() => {}}
              onTouchStart={() => {
                // Force focus when touched
                emailInputRef.current?.focus();
              }}
            />
          </View>
          {/* Input Icon - ตาม Figma: left-[314px] top-[128px] (absolute) - same as checkbox */}
          <TouchableOpacity 
            style={styles.inputIconContainer}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: ICON_URLS.inputIcon }} 
              style={styles.inputIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      )}

      {/* Sign Up Text - ตาม Figma: center, top-[170px] */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>
          ไม่มีบัญชีใช่ไหม ?{' '}
          <Text style={styles.signUpLink}>สมัครสมาชิก</Text>
        </Text>
      </View>

      {/* Continue With Section - ตาม Figma: top-[700px] */}
      <View style={styles.continueWithContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.continueWithText}>หรือดำเนินการต่อด้วย</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Login Options - ตาม Figma: center, top-[745px] */}
      <View style={styles.socialLoginContainer}>
        {/* Google */}
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <Image 
            source={{ uri: loginMethod === 'email' ? ICON_URLS.googleIcon : ICON_URLS.googleIconPhone }} 
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* Facebook */}
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <Image 
            source={{ uri: loginMethod === 'email' ? ICON_URLS.facebookIcon : ICON_URLS.facebookIconPhone }} 
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* Telegram */}
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
          <Image 
            source={{ uri: loginMethod === 'email' ? ICON_URLS.telegramIcon : ICON_URLS.telegramIconPhone }} 
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Country Code Modal */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เลือกประเทศ</Text>
              <TouchableOpacity 
                onPress={() => setShowCountryModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    selectedCountry.code === item.code && styles.countryItemSelected
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setCountryCode(item.code);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCodeText}>{item.code}</Text>
                </TouchableOpacity>
              )}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>

      {/* Numeric Keypad Modal - Slide up from bottom */}
      <Modal
        visible={showNumericKeypad}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowNumericKeypad(false)}
      >
        <View style={styles.keypadOverlay}>
          <TouchableOpacity 
            style={styles.keypadOverlayTouchable}
            activeOpacity={1}
            onPress={() => {
              setShowNumericKeypad(false);
              phoneInputRef.current?.blur();
            }}
          />
          <Animated.View
            style={[
              {
                transform: [
                  {
                    translateY: keypadSlideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [400, 0],
                    }),
                  },
                ],
                opacity: keypadSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ]}
            pointerEvents="box-none"
          >
            <LinearGradient
              colors={['#1a1a1a', '#2a1a1a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.keypadContainer}
            >
              <View style={styles.keypadContent} pointerEvents="auto">
              {/* Row 1: 1, 2, 3 */}
              <View style={styles.keypadRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    handleNumberPress('1');
                  }}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>1</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleKeypadButtonPress(() => handleNumberPress('2'))}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>2</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleKeypadButtonPress(() => handleNumberPress('3'))}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>3</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Row 2: 4, 5, 6 */}
              <View style={styles.keypadRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleNumberPress('4')}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>4</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleNumberPress('5')}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>5</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleNumberPress('6')}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>6</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Row 3: 7, 8, 9 */}
              <View style={styles.keypadRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleNumberPress('7')}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>7</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleNumberPress('8')}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>8</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleNumberPress('9')}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>9</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Row 4: Delete, 0, Close */}
              <View style={styles.keypadRow}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleDeletePress()}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>⌫</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleNumberPress('0')}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>0</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setShowNumericKeypad(false);
                    phoneInputRef.current?.blur();
                  }}
                  style={styles.keypadButtonWrapper}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.keypadButton}
                  >
                    <Text style={styles.keypadButtonText}>✓</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'flex-start',
  },
  keyboardView: {
    flex: 1,
  },

  helpButton: {
    position: 'absolute',
    right: scale(27),
    top: scale(58),
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  helpIcon: {
    width: scale(20),
    height: scale(20),
  },

  loginContainer: {
    position: 'absolute',
    left: scale(27),
    top: scale(51),
    width: scale(94),
    flexDirection: 'column',
    gap: scale(10),
  },

  title: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(16),
    color: '#FFFFFF',
  },

  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(25),
  },

  methodText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: 'rgba(255,255,255,0.5)',
  },

  methodTextActive: {
    fontFamily: 'Prompt-Bold',
    color: '#FFFFFF',
  },

  inputContainer: {
    position: 'absolute',
    left: scale(27),
    top: scale(119),
    width: scale(321),
    height: scale(35),
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: scale(999),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(17),
    paddingRight: scale(10),
    zIndex: 5,
  },

  inputContainerPhone: {
    position: 'absolute',
    left: scale(27),
    top: scale(119),
    width: scale(321),
    height: scale(35),
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputFieldPhone: {
    width: scale(321),
    height: scale(35),
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: scale(999),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(17),
    position: 'relative',
    zIndex: 5,
  },

  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    marginRight: scale(5),
  },

  countryCode: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
  },

  dropdownArrow: {
    width: scale(9),
    height: scale(9),
    tintColor: '#FFFFFF',
  },

  phoneInputTouchable: {
    flex: 1,
    justifyContent: 'center',
  },

  phoneInput: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    flex: 1,
    includeFontPadding: false,
    padding: 0,
    margin: 0,
    minHeight: scale(19),
    zIndex: 6,
    backgroundColor: 'transparent',
  },

  emailInputTouchable: {
    flex: 1,
    justifyContent: 'center',
  },

  emailInput: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(14),
    color: '#FFFFFF',
    flex: 1,
    includeFontPadding: false,
    padding: 0,
    margin: 0,
    minHeight: scale(19),
    zIndex: 6,
    backgroundColor: 'transparent',
  },

  checkboxContainer: {
    position: 'absolute',
    left: scale(314), // Absolute from screen left
    top: scale(128), // Absolute from screen top
    width: scale(16.251),
    height: scale(16.251),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  checkbox: {
    width: scale(16.251),
    height: scale(16.251),
  },

  inputIconContainer: {
    position: 'absolute',
    left: scale(314), // ตาม Figma: left-[314px] (absolute) - same as checkbox
    top: scale(128), // ตาม Figma: top-[128px] (absolute) - same as checkbox
    width: scale(16.251),
    height: scale(16.251),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  inputIcon: {
    width: scale(16.251),
    height: scale(16.251),
  },

  signUpContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(157)) / 2, // Center
    top: scale(170),
    alignItems: 'center',
  },

  signUpText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    textAlign: 'center',
  },

  signUpLink: {
    fontFamily: 'Prompt-Bold',
  },

  continueWithContainer: {
    position: 'absolute',
    left: 0,
    top: scale(700),
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },

  dividerLine: {
    width: scale(118),
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  continueWithText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(12),
    color: '#FFFFFF',
    width: scale(123),
    textAlign: 'center',
  },

  socialLoginContainer: {
    position: 'absolute',
    left: (SCREEN_WIDTH - scale(152)) / 2, // Center (40*3 + 16*2 = 152)
    top: scale(745),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },

  socialButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialIcon: {
    width: scale(24),
    height: scale(24),
  },

  // Country Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    maxHeight: scale(500),
    paddingBottom: scale(20),
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },

  modalTitle: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(18),
    color: '#FFFFFF',
  },

  modalCloseButton: {
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(24),
    color: '#FFFFFF',
  },

  countryList: {
    maxHeight: scale(400),
  },

  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },

  countryItemSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  countryFlag: {
    fontSize: scale(24),
    marginRight: scale(12),
  },

  countryName: {
    flex: 1,
    fontFamily: 'Prompt-Regular',
    fontSize: scale(14),
    color: '#FFFFFF',
  },

  countryCodeText: {
    fontFamily: 'Prompt-Regular',
    fontSize: scale(14),
    color: 'rgba(255,255,255,0.6)',
    marginLeft: scale(8),
  },

  // Numeric Keypad Styles
  keypadOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  keypadOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },

  keypadContainer: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingBottom: scale(30),
    paddingTop: scale(20),
    paddingHorizontal: scale(20),
    width: '100%',
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },

  keypadContent: {
    gap: scale(15),
  },

  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(15),
  },

  keypadButtonWrapper: {
    flex: 1,
    marginHorizontal: scale(5),
  },

  keypadButtonWrapper: {
    flex: 1,
    marginHorizontal: scale(5),
  },

  keypadButton: {
    flex: 1,
    height: scale(60),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },

  keypadButtonText: {
    fontFamily: 'Prompt-Bold',
    fontSize: scale(24),
    color: '#FFFFFF',
  },
});
