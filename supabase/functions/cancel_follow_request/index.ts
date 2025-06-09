
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CancelFollowRequestRequest {
  target_user_id: string;
}

interface CancelFollowRequestResponse {
  success: boolean;
  message: string;
}

// Security logging utility
function logSecurityEvent(event: string, details: any = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    function: 'cancel_follow_request',
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
    const { target_user_id }: CancelFollowRequestRequest = await req.json();

    if (!target_user_id) {
      logSecurityEvent('invalid_request_params', {
        has_target_user_id: !!target_user_id,
        client_ip: getClientIP(req)
      });
      return new Response(
        JSON.stringify({ error: 'target_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Get current user from JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      logSecurityEvent('authentication_failed', {
        error: userError?.message,
        client_ip: getClientIP(req)
      });
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const current_user_id = user.id;

    if (current_user_id === target_user_id) {
      logSecurityEvent('self_cancel_attempt', {
        user_id: current_user_id,
        client_ip: getClientIP(req)
      });
      return new Response(
        JSON.stringify({ error: 'Cannot cancel follow request to yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logSecurityEvent('cancel_request_initiated', {
      requester_id: current_user_id,
      target_user_id: target_user_id,
      client_ip: getClientIP(req)
    });

    // Delete the pending follow request
    const { error: deleteError, count } = await supabaseClient
      .from('follow_requests')
      .delete({ count: 'exact' })
      .eq('requester_id', current_user_id)
      .eq('requestee_id', target_user_id)
      .eq('status', 'pending');

    if (deleteError) {
      logSecurityEvent('cancel_request_failed', {
        requester_id: current_user_id,
        target_user_id: target_user_id,
        error: deleteError.message,
        error_code: deleteError.code
      });
      return new Response(
        JSON.stringify({ error: 'Failed to cancel follow request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if any request was actually deleted
    if (count === 0) {
      logSecurityEvent('no_pending_request_found', {
        requester_id: current_user_id,
        target_user_id: target_user_id
      });
      return new Response(
        JSON.stringify({ error: 'No pending follow request found to cancel' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logSecurityEvent('cancel_request_successful', {
      requester_id: current_user_id,
      target_user_id: target_user_id,
      requests_cancelled: count
    });

    const response: CancelFollowRequestResponse = {
      success: true,
      message: 'Follow request successfully cancelled.'
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
