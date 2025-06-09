
import { CreateSitterProfileRequest } from './types.ts';

export function validateRequest(data: CreateSitterProfileRequest): string | null {
  // Validation 1: At least one of email or phone_number must be provided
  if (!data.email && !data.phone_number) {
    return 'Please provide either an email or a phone number for the sitter';
  }

  // Validation 2: Required fields validation
  if (!data.first_name || !data.last_name || !data.user_id) {
    return 'All required fields must be provided';
  }

  return null;
}
