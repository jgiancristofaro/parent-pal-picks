
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

// Security logging utility
function logSecurityEvent(event: string, details: any = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    function: 'request_follow',
    event,
    ...details
  }));
}

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
      logSecurityEvent('rate_limit_check_error', {
        error: error.message,
        identifier: identifier.substring(0, 8) + '...'
      });
      return true; // Allow on error to prevent blocking users
    }

    return data === true;
  } catch (error) {
    logSecurityEvent('rate_limit_check_failed', {
      error: error.message,
      identifier: identifier.substring(0, 8) + '...'
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

    const { current_user_id, target_user_id }: RequestFollowRequest = await req.json();

    if (!current_user_id || !target_user_id) {
      logSecurityEvent('invalid_request_params', {
        has_current_user_id: !!current_user_id,
        has_target_user_id: !!target_user_id,
        client_ip: getClientIP(req)
      });
      return new Response(
        JSON.stringify({ error: 'current_user_id and target_user_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (current_user_id === target_user_id) {
      logSecurityEvent('self_follow_attempt', {
        user_id: current_user_id,
        client_ip: getClientIP(req)
      });
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
      logSecurityEvent('follow_request_rate_limit_exceeded', {
        requester_id: current_user_id,
        target_user_id: target_user_id,
        client_ip: clientIP,
        limit: FOLLOW_REQUEST_RATE_LIMIT.max,
        window_minutes: FOLLOW_REQUEST_RATE_LIMIT.windowMinutes
      });
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

    logSecurityEvent('follow_request_initiated', {
      requester_id: current_user_id,
      target_user_id: target_user_id,
      client_ip: clientIP
    });

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

    // First check if already following
    const { data: existingFollow, error: followCheckError } = await anonSupabaseClient
      .from('user_follows')
      .select('id')
      .eq('follower_id', current_user_id)
      .eq('following_id', target_user_id)
      .maybeSingle();

    if (followCheckError) {
      logSecurityEvent('follow_check_failed', {
        requester_id: current_user_id,
        target_user_id: target_user_id,
        error: followCheckError.message
      });
      return new Response(
        JSON.stringify({ error: 'Failed to check follow status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingFollow) {
      logSecurityEvent('already_following', {
        requester_id: current_user_id,
        target_user_id: target_user_id
      });
      return new Response(
        JSON.stringify({
          status: 'following',
          message: 'Already following this user'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get target user's privacy setting (RLS will handle access control)
    const { data: targetProfile, error: profileError } = await anonSupabaseClient
      .from('profiles')
      .select('profile_privacy_setting')
      .eq('id', target_user_id)
      .single();

    if (profileError || !targetProfile) {
      logSecurityEvent('target_profile_not_found', {
        requester_id: current_user_id,
        target_user_id: target_user_id,
        error: profileError?.message
      });
      return new Response(
        JSON.stringify({ error: 'Target user not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response: RequestFollowResponse = {
      status: 'request_pending',
      message: ''
    };

    if (targetProfile.profile_privacy_setting === 'public') {
      // For public profiles, directly create follow relationship using our database function
      const { error: followError } = await anonSupabaseClient.rpc('create_follow_relationship', {
        p_follower_id: current_user_id,
        p_following_id: target_user_id
      });

      if (followError) {
        logSecurityEvent('follow_creation_failed', {
          requester_id: current_user_id,
          target_user_id: target_user_id,
          error: followError.message,
          error_code: followError.code
        });
        return new Response(
          JSON.stringify({ error: 'Failed to follow user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      logSecurityEvent('follow_relationship_created', {
        requester_id: current_user_id,
        target_user_id: target_user_id,
        profile_privacy: 'public'
      });

      response.status = 'following';
      response.message = 'Now following user';
    } else {
      // For private profiles, check if a pending request already exists
      const { data: existingRequest, error: existingError } = await anonSupabaseClient
        .from('follow_requests')
        .select('id, status')
        .eq('requester_id', current_user_id)
        .eq('requestee_id', target_user_id)
        .maybeSingle();

      if (existingError) {
        logSecurityEvent('existing_request_check_failed', {
          requester_id: current_user_id,
          target_user_id: target_user_id,
          error: existingError.message
        });
        return new Response(
          JSON.stringify({ error: 'Failed to check existing requests' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          logSecurityEvent('duplicate_follow_request_attempt', {
            requester_id: current_user_id,
            target_user_id: target_user_id,
            existing_request_id: existingRequest.id
          });
          response.status = 'request_pending';
          response.message = 'Follow request already pending';
        } else {
          // Update existing request to pending status
          const { error: updateError } = await anonSupabaseClient
            .from('follow_requests')
            .update({ status: 'pending' })
            .eq('id', existingRequest.id);

          if (updateError) {
            logSecurityEvent('follow_request_update_failed', {
              requester_id: current_user_id,
              target_user_id: target_user_id,
              error: updateError.message
            });
            return new Response(
              JSON.stringify({ error: 'Failed to update follow request' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          logSecurityEvent('follow_request_updated', {
            requester_id: current_user_id,
            target_user_id: target_user_id,
            profile_privacy: 'private'
          });

          response.status = 'request_pending';
          response.message = 'Follow request sent';
        }
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
          logSecurityEvent('follow_request_creation_failed', {
            requester_id: current_user_id,
            target_user_id: target_user_id,
            error: requestError.message,
            error_code: requestError.code
          });
          return new Response(
            JSON.stringify({ error: 'Failed to send follow request' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        logSecurityEvent('follow_request_sent', {
          requester_id: current_user_id,
          target_user_id: target_user_id,
          profile_privacy: 'private'
        });

        response.status = 'request_pending';
        response.message = 'Follow request sent';
      }
    }

    return new Response(
      JSON.stringify(response),
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
