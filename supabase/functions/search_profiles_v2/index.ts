
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchProfilesRequest {
  search_term?: string;
  search_phone?: string;
  current_user_id: string;
}

interface ProfileWithFollowStatus {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  profile_privacy_setting: string;
  follow_status: 'following' | 'request_pending' | 'not_following';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { search_term, search_phone, current_user_id }: SearchProfilesRequest = await req.json();

    if (!current_user_id) {
      return new Response(
        JSON.stringify({ error: 'current_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Search params:', { search_term, search_phone, current_user_id });

    let profilesQuery = supabaseClient
      .from('profiles')
      .select('id, full_name, username, avatar_url, profile_privacy_setting')
      .neq('id', current_user_id);

    // Search by phone number (exact match)
    if (search_phone) {
      profilesQuery = profilesQuery
        .eq('phone_number', search_phone)
        .eq('phone_number_searchable', true);
    }
    // Search by name/username (fuzzy match)
    else if (search_term) {
      profilesQuery = profilesQuery.or(
        `full_name.ilike.%${search_term}%,username.ilike.%${search_term}%`
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Either search_term or search_phone must be provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profiles, error: profilesError } = await profilesQuery;

    if (profilesError) {
      console.error('Profiles query error:', profilesError);
      return new Response(
        JSON.stringify({ error: 'Failed to search profiles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify([]),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const profileIds = profiles.map(p => p.id);

    // Get follow status for each profile
    const { data: followRelations, error: followError } = await supabaseClient
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', current_user_id)
      .in('following_id', profileIds);

    const { data: pendingRequests, error: requestsError } = await supabaseClient
      .from('follow_requests')
      .select('requestee_id')
      .eq('requester_id', current_user_id)
      .eq('status', 'pending')
      .in('requestee_id', profileIds);

    if (followError || requestsError) {
      console.error('Follow status query error:', followError || requestsError);
      return new Response(
        JSON.stringify({ error: 'Failed to determine follow status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const followingIds = new Set(followRelations?.map(f => f.following_id) || []);
    const pendingIds = new Set(pendingRequests?.map(r => r.requestee_id) || []);

    // Augment profiles with follow status
    const profilesWithStatus: ProfileWithFollowStatus[] = profiles.map(profile => ({
      ...profile,
      follow_status: followingIds.has(profile.id) 
        ? 'following' 
        : pendingIds.has(profile.id) 
        ? 'request_pending' 
        : 'not_following'
    }));

    return new Response(
      JSON.stringify(profilesWithStatus),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Search profiles error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
