
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

// Rate limiting configuration
const RATE_LIMITS = {
  PHONE_SEARCH: { max: 10, windowMinutes: 60 }, // 10 phone searches per hour
  NAME_SEARCH: { max: 50, windowMinutes: 60 },  // 50 name searches per hour
};

// Security logging utility
function logSecurityEvent(event: string, details: any = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    function: 'search_profiles_v2',
    event,
    ...details
  }));
}

async function checkRateLimit(
  supabaseClient: any,
  identifier: string,
  requestType: string,
  maxRequests: number,
  windowMinutes: number
): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_endpoint: 'search_profiles_v2',
      p_request_type: requestType,
      p_max_requests: maxRequests,
      p_window_minutes: windowMinutes
    });

    if (error) {
      logSecurityEvent('rate_limit_check_error', {
        error: error.message,
        identifier: identifier.substring(0, 8) + '...',
        request_type: requestType
      });
      return true; // Allow on error to prevent blocking users
    }

    return data === true;
  } catch (error) {
    logSecurityEvent('rate_limit_check_failed', {
      error: error.message,
      identifier: identifier.substring(0, 8) + '...',
      request_type: requestType
    });
    return true; // Allow on error
  }
}

function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  return forwardedFor?.split(',')[0]?.trim() || 
         realIP || 
         cfConnectingIP || 
         'unknown';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for rate limiting
    );

    const { search_term, search_phone, current_user_id }: SearchProfilesRequest = await req.json();

    if (!current_user_id) {
      logSecurityEvent('unauthorized_search_attempt', {
        client_ip: getClientIP(req),
        has_search_term: !!search_term,
        has_search_phone: !!search_phone
      });
      return new Response(
        JSON.stringify({ error: 'current_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine request type and rate limit
    const isPhoneSearch = !!search_phone;
    const requestType = isPhoneSearch ? 'phone_search' : 'name_search';
    const rateLimit = isPhoneSearch ? RATE_LIMITS.PHONE_SEARCH : RATE_LIMITS.NAME_SEARCH;
    
    // Log search attempt
    logSecurityEvent('search_attempt', {
      user_id: current_user_id,
      search_type: requestType,
      client_ip: getClientIP(req)
    });

    // Use user ID as primary identifier, fallback to IP
    const clientIP = getClientIP(req);
    const identifier = current_user_id || clientIP;

    // Check rate limit
    const isAllowed = await checkRateLimit(
      supabaseClient,
      identifier,
      requestType,
      rateLimit.max,
      rateLimit.windowMinutes
    );

    if (!isAllowed) {
      logSecurityEvent('rate_limit_exceeded', {
        user_id: current_user_id,
        search_type: requestType,
        client_ip: clientIP,
        limit: rateLimit.max,
        window_minutes: rateLimit.windowMinutes
      });
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: isPhoneSearch 
            ? `Too many phone searches. Please wait before trying again.`
            : `Too many searches. Please wait before trying again.`,
          retryAfter: rateLimit.windowMinutes * 60 // seconds
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': (rateLimit.windowMinutes * 60).toString()
          } 
        }
      );
    }

    console.log('Search params:', { search_term, search_phone, current_user_id });

    // Create client with user JWT for RLS compliance
    const authHeaders = req.headers.get('authorization');
    const anonSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeaders ? { authorization: authHeaders } : {}
        }
      }
    );

    let profiles: any[] = [];

    // Search by phone number using secure function
    if (search_phone) {
      const { data: phoneResults, error: phoneError } = await anonSupabaseClient
        .rpc('search_profile_by_phone_secure', {
          search_phone: search_phone
        });

      if (phoneError) {
        logSecurityEvent('phone_search_error', {
          user_id: current_user_id,
          error: phoneError.message,
          error_code: phoneError.code
        });
        return new Response(
          JSON.stringify({ error: 'Failed to search profiles by phone' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      profiles = phoneResults || [];
      logSecurityEvent('phone_search_completed', {
        user_id: current_user_id,
        results_count: profiles.length
      });
    }
    // Search by name/username (RLS will automatically filter)
    else if (search_term) {
      const { data: nameResults, error: nameError } = await anonSupabaseClient
        .from('profiles')
        .select('id, full_name, username, avatar_url, profile_privacy_setting')
        .or(`full_name.ilike.%${search_term}%,username.ilike.%${search_term}%`);

      if (nameError) {
        logSecurityEvent('name_search_error', {
          user_id: current_user_id,
          error: nameError.message,
          error_code: nameError.code
        });
        return new Response(
          JSON.stringify({ error: 'Failed to search profiles by name' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      profiles = nameResults || [];
      logSecurityEvent('name_search_completed', {
        user_id: current_user_id,
        results_count: profiles.length
      });
    } else {
      logSecurityEvent('invalid_search_params', {
        user_id: current_user_id,
        has_search_term: !!search_term,
        has_search_phone: !!search_phone
      });
      return new Response(
        JSON.stringify({ error: 'Either search_term or search_phone must be provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify([]),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const profileIds = profiles.map(p => p.id);

    // Get follow status for each profile (RLS will filter automatically)
    const { data: followRelations, error: followError } = await anonSupabaseClient
      .from('user_follows')
      .select('following_id')
      .in('following_id', profileIds);

    const { data: pendingRequests, error: requestsError } = await anonSupabaseClient
      .from('follow_requests')
      .select('requestee_id')
      .eq('status', 'pending')
      .in('requestee_id', profileIds);

    if (followError || requestsError) {
      logSecurityEvent('follow_status_query_error', {
        user_id: current_user_id,
        follow_error: followError?.message,
        requests_error: requestsError?.message
      });
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
    logSecurityEvent('unexpected_error', {
      error: error.message,
      stack: error.stack?.substring(0, 500),
      client_ip: getClientIP(req)
    });
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
