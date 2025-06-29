
export const validatePhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 0) {
    return { isValid: true, error: '' };
  }
  
  if (cleanPhone.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  if (cleanPhone.length > 11) {
    return { isValid: false, error: 'Phone number must be 10 or 11 digits' };
  }
  
  // If 11 digits, first digit should be 1 (US country code)
  if (cleanPhone.length === 11 && !cleanPhone.startsWith('1')) {
    return { isValid: false, error: '11-digit numbers must start with 1' };
  }
  
  return { isValid: true, error: '' };
};
