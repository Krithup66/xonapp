/**
 * Theme System - ใช้ Design System
 * อัปเดตให้ใช้ design-system.json แทน hardcoded values
 */

import { getThemeColors, ThemeMode } from './designSystem';

export type { ThemeMode };

export interface ThemeColors {
  // Background colors
  bg: string;              // พื้นหลังหลัก
  bgSecondary: string;     // พื้นหลังรอง
  bgTertiary: string;      // พื้นหลังที่ 3
  
  // Card colors
  card: string;            // พื้นหลังการ์ด
  cardBorder: string;     // เส้นขอบการ์ด
  cardShadow: string;      // เงาการ์ด
  
  // Text colors
  text: string;            // ข้อความหลัก
  textSecondary: string;  // ข้อความรอง
  textTertiary: string;   // ข้อความที่ 3
  textMuted: string;      // ข้อความจาง
  
  // Accent colors
  primary: string;        // สีหลัก
  secondary: string;      // สีรอง
  success: string;        // สีสำเร็จ
  warning: string;         // สีเตือน
  error: string;          // สีข้อผิดพลาด
  info: string;           // สีข้อมูล
  
  // Interactive colors
  button: string;         // สีปุ่ม
  buttonText: string;     // สีข้อความปุ่ม
  buttonSecondary: string;
  buttonSecondaryText: string;
  link: string;          // สีลิงก์
  
  // Border & Divider
  border: string;         // เส้นขอบ
  borderLight: string;
  divider: string;        // เส้นแบ่ง
  
  // Overlay
  overlay: string;        // สีทับซ้อน
  backdrop: string;       // พื้นหลังเบลอ
  
  // Card
  cardBg: string;
}

/**
 * Get theme colors from Design System
 */
export function getTheme(mode: ThemeMode = 'dark'): ThemeColors {
  return getThemeColors(mode);
}

// Export for backward compatibility
export const darkTheme = getTheme('dark');
export const lightTheme = getTheme('light');
