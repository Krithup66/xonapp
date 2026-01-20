/**
 * Haptics Helper with Fallback
 * รองรับกรณีที่ expo-haptics ยังไม่ได้ติดตั้ง
 */

let Haptics: any = null;

try {
  Haptics = require('expo-haptics');
} catch (error) {
  // Fallback if expo-haptics is not installed
  console.warn('expo-haptics is not installed. Haptic feedback will be disabled.');
}

export const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (!Haptics) return;
  
  try {
    const ImpactStyle = Haptics.ImpactFeedbackStyle;
    let impactStyle;
    
    switch (style) {
      case 'light':
        impactStyle = ImpactStyle?.Light;
        break;
      case 'heavy':
        impactStyle = ImpactStyle?.Heavy;
        break;
      default:
        impactStyle = ImpactStyle?.Medium;
    }
    
    if (impactStyle !== undefined) {
      Haptics.impactAsync(impactStyle);
    }
  } catch (error) {
    // Silently fail if haptics is not available
  }
};

export const hapticNotification = (type: 'success' | 'warning' | 'error' = 'success') => {
  if (!Haptics) return;
  
  try {
    const NotificationType = Haptics.NotificationFeedbackType;
    let notificationType;
    
    switch (type) {
      case 'warning':
        notificationType = NotificationType?.Warning;
        break;
      case 'error':
        notificationType = NotificationType?.Error;
        break;
      default:
        notificationType = NotificationType?.Success;
    }
    
    if (notificationType !== undefined) {
      Haptics.notificationAsync(notificationType);
    }
  } catch (error) {
    // Silently fail if haptics is not available
  }
};
