import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// CSRF Token Hook for protecting state-changing operations
export const useCSRFToken = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const { session } = useAuth();

  // Generate a cryptographically secure CSRF token
  const generateCSRFToken = useCallback((): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }, []);

  // Initialize or refresh CSRF token
  const refreshToken = useCallback(() => {
    if (session) {
      const newToken = generateCSRFToken();
      setCsrfToken(newToken);
      
      // Store in session storage (not localStorage for security)
      sessionStorage.setItem('csrf_token', newToken);
      
      return newToken;
    } else {
      setCsrfToken(null);
      sessionStorage.removeItem('csrf_token');
      return null;
    }
  }, [session, generateCSRFToken]);

  // Validate CSRF token
  const validateToken = useCallback((token: string): boolean => {
    if (!session || !csrfToken) return false;
    
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === csrfToken && token === storedToken;
  }, [session, csrfToken]);

  // Get token for form submission
  const getToken = useCallback((): string | null => {
    if (!session) return null;
    
    const storedToken = sessionStorage.getItem('csrf_token');
    if (storedToken && storedToken === csrfToken) {
      return storedToken;
    }
    
    // If tokens don't match, refresh
    return refreshToken();
  }, [session, csrfToken, refreshToken]);

  // Initialize token when session changes
  useEffect(() => {
    if (session) {
      const existingToken = sessionStorage.getItem('csrf_token');
      if (existingToken) {
        setCsrfToken(existingToken);
      } else {
        refreshToken();
      }
    } else {
      setCsrfToken(null);
      sessionStorage.removeItem('csrf_token');
    }
  }, [session, refreshToken]);

  return {
    csrfToken,
    getToken,
    validateToken,
    refreshToken,
  };
};

// CSRF Token Component for forms
export const CSRFTokenInput = () => {
  const { getToken } = useCSRFToken();
  const token = getToken();

  if (!token) return null;

  return (
    <input
      type="hidden"
      name="csrf_token"
      value={token}
    />
  );
};