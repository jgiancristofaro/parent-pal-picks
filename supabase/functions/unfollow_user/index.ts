
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UnfollowUserRequest {
  current_user_id: string;
  target_user_id: string;
}

interface UnfollowUserResponse {
  success: boolean;
  message: string;
}

// Security logging utility
function logSecurityEvent(event: string, details: any = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    function: 'unfollow_user',
    event,
    ...details
  }));
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
    const { current_user_id, target_user_id }: UnfollowUserRequest = await req.json();

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
      logSecurityEvent('self_unfollow_attempt', {
        user_id: current_user_id,
        client_ip: getClientIP(req)
      });
      return new Response(
        JSON.stringify({ error: 'Cannot unfollow yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logSecurityEvent('unfollow_initiated', {
      follower_id: current_user_id,
      following_id: target_user_id,
      client_ip: getClientIP(req)
    });

    // Create client with user JWT for RLS compliance
    const authHeaders = req.headers.get('authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeaders ? { authorization: authHeaders } : {}
        }
      }
    );

    // Delete from user_follows (RLS will ensure only own follows can be deleted)
    const { error: unfollowError, count } = await supabaseClient
      .from('user_follows')
      .delete({ count: 'exact' })
      .eq('following_id', target_user_id);

    if (unfollowError) {
      logSecurityEvent('unfollow_failed', {
        follower_id: current_user_id,
        following_id: target_user_id,
        error: unfollowError.message,
        error_code: unfollowError.code
      });
      return new Response(
        JSON.stringify({ error: 'Failed to unfollow user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log if no relationship was found to unfollow
    if (count === 0) {
      logSecurityEvent('unfollow_no_relationship', {
        follower_id: current_user_id,
        following_id: target_user_id
      });
    } else {
      logSecurityEvent('unfollow_successful', {
        follower_id: current_user_id,
        following_id: target_user_id,
        relationships_removed: count
      });
    }

    // Also delete any pending follow requests (RLS will handle permissions)
    const { error: cancelRequestError, count: requestsCount } = await supabaseClient
      .from('follow_requests')
      .delete({ count: 'exact' })
      .eq('requestee_id', target_user_id)
      .eq('status', 'pending');

    if (cancelRequestError) {
      logSecurityEvent('pending_request_cancel_failed', {
        requester_id: current_user_id,
        requestee_id: target_user_id,
        error: cancelRequestError.message,
        error_code: cancelRequestError.code
      });
      // Don't fail the entire operation for this
    } else if (requestsCount && requestsCount > 0) {
      logSecurityEvent('pending_request_cancelled', {
        requester_id: current_user_id,
        requestee_id: target_user_id,
        requests_cancelled: requestsCount
      });
    }

    const response: UnfollowUserResponse = {
      success: true,
      message: 'Successfully unfollowed user'
    };

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
