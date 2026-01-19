/**
 * Finance Header Component
 * Component สำหรับ Header ของ Finance Screen
 * แยกออกมาเพื่อให้สามารถ reuse และแก้ไขได้ง่าย
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { SvgUri } from 'react-native-svg';
import { FINANCE_COLORS, FINANCE_SIZES, FINANCE_SPACING, FINANCE_ICON_URLS, FINANCE_PATTERNS } from '../../config/finance-design.config';
import { scaleWidth, scaleFont } from '../../utils/dimensions';
import { formatBalanceSecure } from '../../utils/security';

interface FinanceHeaderProps {
  userName?: string;
  balance?: number;
  showBalance?: boolean;
}

/**
 * XON Logo Component
 */
const XonLogo = () => {
  return (
    <SvgUri 
      uri={FINANCE_ICON_URLS.logo}
      width={scaleWidth(57)}
      height={scaleWidth(20)}
    />
  );
};

/**
 * Calendar Icon
 */
const CalendarIcon = ({ size = 16 }: { size?: number }) => (
  <SvgUri uri={FINANCE_ICON_URLS.calendar} width={size} height={size} />
);

/**
 * Notification Icon
 */
const NotificationIcon = ({ size = 15 }: { size?: number }) => (
  <SvgUri uri={FINANCE_ICON_URLS.notification} width={size} height={size} />
);

/**
 * Transfer Icon - Generated SVG (Wallet icon)
 */
const TransferIcon = ({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 7H5C3.895 7 3 7.895 3 9V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V9C21 7.895 20.105 7 19 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 10H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle
      cx="17"
      cy="14.5"
      r="1.5"
      fill={color}
    />
  </Svg>
);

/**
 * Withdraw Icon
 */
const WithdrawIcon = ({ size = 24 }: { size?: number }) => (
  <SvgUri uri={FINANCE_ICON_URLS.withdraw} width={size} height={size} />
);

/**
 * Profile Image Component - Generated with gradient
 */
const ProfileImage = () => {
  return (
    <View style={styles.profileImageContainer}>
      <LinearGradient
        colors={[...FINANCE_PATTERNS.profileGradientColors]}
        start={FINANCE_PATTERNS.glassGradientStart}
        end={FINANCE_PATTERNS.glassGradientEnd}
        style={styles.profileImageGradient}
      >
        <Svg width={scaleWidth(45)} height={scaleWidth(45)} viewBox="0 0 45 45">
          {/* User icon - face circle */}
          <Circle cx="22.5" cy="16" r="6" fill="#FFFFFF" opacity={0.9} />
          {/* User icon - body semi-circle */}
          <Path
            d="M9 35C9 28.5 15 24 22.5 24C30 24 36 28.5 36 35"
            fill="#FFFFFF"
            opacity={0.9}
          />
        </Svg>
      </LinearGradient>
    </View>
  );
};

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  userName = 'SniperX',
  balance = 123456.78,
  showBalance = true,
}) => {
  const insets = useSafeAreaInsets();
  const [currentBalance, setCurrentBalance] = useState(balance);

  // Real-time balance animation
  useEffect(() => {
    const interval = setInterval(() => {
      const minBalance = 100000;
      const maxBalance = 999999.99;
      const newBalance = Math.random() * (maxBalance - minBalance) + minBalance;
      setCurrentBalance(newBalance);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10, paddingBottom: scaleWidth(20) }]}>
      {/* Top Bar - Profile & Notifications */}
      <View style={styles.topBar}>
        {/* User Info Container */}
        <View style={styles.userInfoContainer}>
          <ProfileImage />

          {/* User Details */}
          <View style={styles.userDetails}>
            <XonLogo />
            <Text style={styles.greetingText}>สวัสดีคุณ {userName}</Text>
          </View>
        </View>

        {/* Right Icons - Calendar & Notification */}
        <View style={styles.headerIcons}>
          {/* Calendar Icon */}
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.iconButtonInner}>
              <LinearGradient
                colors={[...FINANCE_PATTERNS.glassGradientDark]}
                start={FINANCE_PATTERNS.glassGradientStart}
                end={FINANCE_PATTERNS.glassGradientEnd}
                style={styles.glassGradient}
              />
              <CalendarIcon size={scaleWidth(16)} />
            </View>
          </TouchableOpacity>

          {/* Notification Icon with Badge */}
          <View style={styles.notificationContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <View style={styles.iconButtonInner}>
                <LinearGradient
                  colors={[...FINANCE_PATTERNS.glassGradientDark]}
                  start={FINANCE_PATTERNS.glassGradientStart}
                  end={FINANCE_PATTERNS.glassGradientEnd}
                  style={styles.glassGradient}
                />
                <NotificationIcon size={scaleWidth(15)} />
              </View>
            </TouchableOpacity>
            <LinearGradient
              colors={[FINANCE_COLORS.notificationBadgeStart, FINANCE_COLORS.notificationBadgeEnd]}
              style={styles.notificationBadge}
            >
              <Text style={styles.badgeText}>3</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Balance Display */}
      {showBalance && (
        <TouchableOpacity style={styles.balanceContainer}>
          <Text style={styles.balanceText}>{formatBalanceSecure(currentBalance)}</Text>
        </TouchableOpacity>
      )}

      {/* Transfer & Withdraw Buttons */}
      <View style={styles.quickActionsContainer}>
        {/* Transfer Button */}
        <TouchableOpacity style={styles.quickActionItem}>
          <View style={styles.quickActionIconContainer}>
            <LinearGradient
              colors={[...FINANCE_PATTERNS.glassGradientDark]}
              start={FINANCE_PATTERNS.glassGradientStart}
              end={FINANCE_PATTERNS.glassGradientEnd}
              style={styles.glassGradient}
            />
            <TransferIcon size={scaleWidth(24)} />
          </View>
          <Text style={styles.quickActionLabel}>โอน</Text>
        </TouchableOpacity>

        {/* Withdraw Button */}
        <TouchableOpacity style={styles.quickActionItem}>
          <View style={styles.quickActionIconContainer}>
            <LinearGradient
              colors={[...FINANCE_PATTERNS.glassGradientDark]}
              start={FINANCE_PATTERNS.glassGradientStart}
              end={FINANCE_PATTERNS.glassGradientEnd}
              style={styles.glassGradient}
            />
            <WithdrawIcon size={scaleWidth(24)} />
          </View>
          <Text style={styles.quickActionLabel}>ถอน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: FINANCE_COLORS.headerBg,
    paddingHorizontal: FINANCE_SPACING.screenPadding,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleWidth(30),
  },

  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: FINANCE_SPACING.userInfoGap,
  },

  profileImageContainer: {
    width: FINANCE_SIZES.profileImage,
    height: FINANCE_SIZES.profileImage,
    borderRadius: FINANCE_SIZES.profileImage / 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  profileImageGradient: {
    width: '100%',
    height: '100%',
    borderRadius: FINANCE_SIZES.profileImage / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userDetails: {
    gap: FINANCE_SPACING.userDetailsGap,
  },

  greetingText: {
    fontFamily: 'Prompt-Bold',
    fontSize: FINANCE_SIZES.greetingText,
    color: FINANCE_COLORS.textWhite,
  },

  headerIcons: {
    flexDirection: 'row',
    gap: scaleWidth(6),
  },

  iconButton: {
    width: FINANCE_SIZES.iconContainerSmall,
    height: FINANCE_SIZES.iconContainerSmall,
    borderRadius: FINANCE_SIZES.iconRadius,
    backgroundColor: FINANCE_COLORS.iconContainerDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  iconButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  glassGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: FINANCE_SIZES.iconRadius,
  },

  notificationContainer: {
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: scaleWidth(-5),
    right: scaleWidth(-5),
    width: scaleWidth(17),
    height: scaleWidth(15),
    borderRadius: FINANCE_SIZES.badgeRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontFamily: 'Prompt-Regular',
    fontSize: FINANCE_SIZES.badgeText,
    color: FINANCE_COLORS.textWhite,
    textAlign: 'center',
  },

  balanceContainer: {
    alignItems: 'center',
    marginBottom: scaleWidth(20),
  },

  balanceText: {
    fontFamily: 'Prompt-Bold',
    fontSize: FINANCE_SIZES.balanceText,
    color: FINANCE_COLORS.textWhite,
  },

  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16, // Fixed 16px gap
  },

  quickActionItem: {
    alignItems: 'center',
    minWidth: scaleWidth(60),
    flex: 1,
    maxWidth: scaleWidth(80),
    gap: scaleWidth(3),
  },

  quickActionIconContainer: {
    width: FINANCE_SIZES.iconContainer,
    height: FINANCE_SIZES.iconContainer,
    borderRadius: FINANCE_SIZES.iconRadius,
    backgroundColor: FINANCE_COLORS.iconContainerDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  quickActionLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: FINANCE_SIZES.serviceLabelText,
    color: FINANCE_COLORS.textWhite,
    textAlign: 'center',
  },
});
