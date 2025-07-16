// Security utility functions

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: urls
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
};

/**
 * Sanitize HTML content for safe display
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof html !== 'string') return '';
  
  // Simple HTML sanitization - remove dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
};

/**
 * Validate email address format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (basic validation)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate a secure random string
 */
export const generateSecureRandom = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Rate limiting helper for client-side operations
 */
export class ClientRateLimit {
  private operations: Map<string, number[]> = new Map();

  /**
   * Check if operation is allowed under rate limit
   * @param key - Unique key for the operation
   * @param maxOperations - Maximum operations allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, maxOperations: number, windowMs: number): boolean {
    const now = Date.now();
    const operations = this.operations.get(key) || [];
    
    // Remove operations outside the time window
    const validOperations = operations.filter(time => now - time < windowMs);
    
    if (validOperations.length >= maxOperations) {
      return false;
    }
    
    // Add current operation
    validOperations.push(now);
    this.operations.set(key, validOperations);
    
    return true;
  }

  /**
   * Clear rate limit data for a key
   */
  clear(key: string): void {
    this.operations.delete(key);
  }

  /**
   * Clear all rate limit data
   */
  clearAll(): void {
    this.operations.clear();
  }
}

// Global rate limiter instance
export const globalRateLimit = new ClientRateLimit();

/**
 * Security headers for API requests
 */
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
};

/**
 * Secure storage helpers that clear sensitive data
 */
export const secureStorage = {
  setItem: (key: string, value: string, temporary: boolean = false): void => {
    const storage = temporary ? sessionStorage : localStorage;
    storage.setItem(key, value);
  },

  getItem: (key: string, temporary: boolean = false): string | null => {
    const storage = temporary ? sessionStorage : localStorage;
    return storage.getItem(key);
  },

  removeItem: (key: string, temporary: boolean = false): void => {
    const storage = temporary ? sessionStorage : localStorage;
    storage.removeItem(key);
  },

  clear: (temporary: boolean = false): void => {
    const storage = temporary ? sessionStorage : localStorage;
    storage.clear();
  },

  // Clear all sensitive authentication data
  clearAuthData: (): void => {
    const sensitiveKeys = [
      'auth_token',
      'refresh_token', 
      'user_session',
      'csrf_token',
      'temp_password',
      'recovery_token'
    ];
    
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }
};