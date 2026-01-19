/**
 * Security Utility Functions
 * ฟังก์ชันช่วยเหลือด้านความปลอดภัย
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!isValidUrl(url)) {
    return '';
  }
  return url;
};

/**
 * Validate number
 */
export const validateNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Format balance securely with currency formatting
 * @param amount - The amount to format
 * @param options - Formatting options (optional, can be object or just currency string)
 * @returns Formatted balance string
 */
export const formatBalanceSecure = (
  amount: number | string,
  options?: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } | string
): string => {
  // Handle string input
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (!validateNumber(numAmount)) {
    return '0.00';
  }

  // Handle options as string (for backward compatibility)
  let formatOptions: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {};

  if (typeof options === 'string') {
    formatOptions = { currency: options };
  } else if (options) {
    formatOptions = options;
  }

  const {
    currency = '',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = formatOptions;

  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return currency ? `${currency} ${formatted}` : formatted;
};

/**
 * Sanitize service name
 */
export const sanitizeServiceName = (name: string): string => {
  return sanitizeInput(name).replace(/[^a-zA-Z0-9-_]/g, '');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
