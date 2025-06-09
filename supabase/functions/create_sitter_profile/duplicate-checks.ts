
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function checkNameDuplicates(
  supabase: SupabaseClient,
  firstName: string,
  lastName: string
): Promise<string | null> {
  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  // Check for name duplicates in profiles table
  const { data: profileNameCheck } = await supabase
    .from('profiles')
    .select('id')
    .eq('full_name', fullName)
    .limit(1);

  if (profileNameCheck && profileNameCheck.length > 0) {
    return 'A profile with this name already exists. Please search for the existing sitter to review.';
  }

  // Check for name duplicates in sitters table
  const { data: sitterNameCheck } = await supabase
    .from('sitters')
    .select('id')
    .eq('name', fullName)
    .limit(1);

  if (sitterNameCheck && sitterNameCheck.length > 0) {
    return 'A sitter with this name already exists. Please search for the existing sitter to review.';
  }

  return null;
}

export async function checkPhoneDuplicates(
  supabase: SupabaseClient,
  phoneNumber: string
): Promise<string | null> {
  const normalizedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits

  // Check profiles table for phone duplicates
  const { data: profilePhoneCheck } = await supabase
    .from('profiles')
    .select('id, phone_number');

  if (profilePhoneCheck) {
    const phoneExists = profilePhoneCheck.some(profile => 
      profile.phone_number && profile.phone_number.replace(/\D/g, '') === normalizedPhone
    );

    if (phoneExists) {
      return 'A profile with this phone number already exists. Please search for the existing sitter to review.';
    }
  }

  // Check sitters table for phone duplicates
  const { data: sitterPhoneCheck } = await supabase
    .from('sitters')
    .select('id, phone_number');

  if (sitterPhoneCheck) {
    const phoneExists = sitterPhoneCheck.some(sitter => 
      sitter.phone_number && sitter.phone_number.replace(/\D/g, '') === normalizedPhone
    );

    if (phoneExists) {
      return 'A sitter with this phone number already exists. Please search for the existing sitter to review.';
    }
  }

  return null;
}
