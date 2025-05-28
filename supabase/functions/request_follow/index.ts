
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestFollowRequest {
  current_user_id: string;
  target_user_id: string;
}

interface RequestFollowResponse {
  status: 'following' | 'request_pending';
  message: string;
}

// Rate limiting configuration
const FOLLOW_REQUEST_RATE_LIMIT = {
  max: 20, // 20 follow requests per hour
  windowMinutes: 60
};

async function checkRateLimit(
  supabaseClient: any,
  identifier: string,
  maxRequests: number,
  windowMinutes: number
): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_endpoint: 'request_follow',
      p_request_type: 'follow_request',
      p_max_requests: maxRequests,
      p_window_minutes: windowMinutes
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow on error to prevent blocking users
    }

    return data === true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
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

    const { current_user_id, target_user_id }: RequestFollowRequest = await req.json();

    if (!current_user_id || !target_user_id) {
      return new Response(
        JSON.stringify({ error: 'current_user_id and target_user_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (current_user_id === target_user_id) {
      return new Response(
        JSON.stringify({ error: 'Cannot follow yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const clientIP = getClientIP(req);
    const identifier = current_user_id || clientIP;

    const isAllowed = await checkRateLimit(
      supabaseClient,
      identifier,
      FOLLOW_REQUEST_RATE_LIMIT.max,
      FOLLOW_REQUEST_RATE_LIMIT.windowMinutes
    );

    if (!isAllowed) {
      console.log(`Follow request rate limit exceeded by ${identifier}`);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many follow requests. Please wait before sending more requests.',
          retryAfter: FOLLOW_REQUEST_RATE_LIMIT.windowMinutes * 60 // seconds
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': (FOLLOW_REQUEST_RATE_LIMIT.windowMinutes * 60).toString()
          } 
        }
      );
    }

    console.log('Request follow:', { current_user_id, target_user_id });

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

    // Get target user's privacy setting (RLS will handle access control)
    const { data: targetProfile, error: profileError } = await anonSupabaseClient
      .from('profiles')
      .select('profile_privacy_setting')
      .eq('id', target_user_id)
      .single();

    if (profileError || !targetProfile) {
      console.error('Target profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Target user not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response: RequestFollowResponse = {
      status: 'not_following',
      message: ''
    };

    if (targetProfile.profile_privacy_setting === 'public') {
      // For public profiles, directly create follow relationship
      const { error: followError } = await anonSupabaseClient
        .from('user_follows')
        .insert({
          follower_id: current_user_id,
          following_id: target_user_id
        });

      if (followError) {
        console.error('Follow insert error:', followError);
        return new Response(
          JSON.stringify({ error: 'Failed to follow user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      response.status = 'following';
      response.message = 'Now following user';
    } else {
      // For private profiles, create follow request
      // First check if a pending request already exists
      const { data: existingRequest, error: existingError } = await anonSupabaseClient
        .from('follow_requests')
        .select('id')
        .eq('requestee_id', target_user_id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingError) {
        console.error('Existing request check error:', existingError);
        return new Response(
          JSON.stringify({ error: 'Failed to check existing requests' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (existingRequest) {
        response.status = 'request_pending';
        response.message = 'Follow request already pending';
      } else {
        // Create new follow request
        const { error: requestError } = await anonSupabaseClient
          .from('follow_requests')
          .insert({
            requester_id: current_user_id,
            requestee_id: target_user_id,
            status: 'pending'
          });

        if (requestError) {
          console.error('Follow request insert error:', requestError);
          return new Response(
            JSON.stringify({ error: 'Failed to send follow request' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        response.status = 'request_pending';
        response.message = 'Follow request sent';
      }
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Request follow error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
