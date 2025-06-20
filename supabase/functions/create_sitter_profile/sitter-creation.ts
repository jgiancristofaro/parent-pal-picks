
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { CreateSitterProfileRequest, SitterData } from './types.ts';

export function prepareSitterData(data: CreateSitterProfileRequest): SitterData {
  const sitterName = `${data.first_name.trim()} ${data.last_name.trim()}`;
  
  return {
    name: sitterName,
    email: data.email ? data.email.trim() : null,
    phone_number: data.phone_number ? data.phone_number.trim() : null,
    phone_number_searchable: false, // Default to private
    rating: 0, // Initialize with no rating yet
    review_count: 0, // No reviews yet
    created_by_user_id: data.user_id,
    profile_image_url: '/assets/defaultsitter.jpg' // Updated to use correct default image
  };
}

export async function createSitter(supabase: SupabaseClient, sitterData: SitterData) {
  console.log('Creating sitter with data:', sitterData);

  const { data: newSitter, error: sitterError } = await supabase
    .from('sitters')
    .insert([sitterData])
    .select()
    .single();

  if (sitterError) {
    console.error('Error creating sitter:', sitterError);
    throw new Error('Failed to create sitter profile');
  }

  console.log('Sitter created successfully:', newSitter.id);
  return newSitter;
}
