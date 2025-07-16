import React, { FormEvent } from 'react';
import { CSRFTokenInput } from '@/hooks/useCSRFToken';
import { sanitizeInput } from '@/utils/security';

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: FormData, csrfToken: string) => void | Promise<void>;
  className?: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  requireCSRF?: boolean;
}

/**
 * Secure form component with built-in CSRF protection and input sanitization
 */
export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  className = '',
  method = 'POST',
  requireCSRF = true,
}) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    // Get CSRF token
    const csrfToken = formData.get('csrf_token') as string;
    
    // Validate CSRF token if required
    if (requireCSRF && !csrfToken) {
      console.error('CSRF token missing from form submission');
      return;
    }
    
    // Sanitize text inputs
    const sanitizedFormData = new FormData();
    
    for (const [key, value] of formData.entries()) {
      if (key === 'csrf_token') {
        sanitizedFormData.append(key, value as string);
      } else if (typeof value === 'string') {
        sanitizedFormData.append(key, sanitizeInput(value));
      } else {
        sanitizedFormData.append(key, value);
      }
    }
    
    try {
      await onSubmit(sanitizedFormData, csrfToken);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} method={method}>
      {requireCSRF && <CSRFTokenInput />}
      {children}
    </form>
  );
};