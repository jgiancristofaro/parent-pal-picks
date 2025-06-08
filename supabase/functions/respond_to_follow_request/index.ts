
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RespondToFollowRequestRequest {
  request_id: string;
  current_user_id: string;
  response_action: 'approve' | 'deny';
}

interface RespondToFollowRequestResponse {
  success: boolean;
  message: string;
}

// Security logging utility
function logSecurityEvent(event: string, details: any = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    function: 'respond_to_follow_request',
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
    const { request_id, current_user_id, response_action }: RespondToFollowRequestRequest = await req.json();

    if (!request_id || !current_user_id || !response_action) {
      logSecurityEvent('invalid_request_params', {
        has_request_id: !!request_id,
        has_current_user_id: !!current_user_id,
        has_response_action: !!response_action,
        client_ip: getClientIP(req)
      });
      return new Response(
        JSON.stringify({ error: 'request_id, current_user_id, and response_action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['approve', 'deny'].includes(response_action)) {
      logSecurityEvent('invalid_response_action', {
        requestee_id: current_user_id,
        request_id: request_id,
        invalid_action: response_action,
        client_ip: getClientIP(req)
      });
      return new Response(
        JSON.stringify({ error: 'response_action must be "approve" or "deny"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logSecurityEvent('follow_request_response_initiated', {
      requestee_id: current_user_id,
      request_id: request_id,
      response_action: response_action,
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

    // Get the follow request (RLS will ensure user can only access their own requests)
    const { data: followRequest, error: requestError } = await supabaseClient
      .from('follow_requests')
      .select('requester_id, requestee_id, status')
      .eq('id', request_id)
      .eq('requestee_id', current_user_id)
      .eq('status', 'pending')
      .single();

    if (requestError || !followRequest) {
      logSecurityEvent('follow_request_verification_failed', {
        requestee_id: current_user_id,
        request_id: request_id,
        error: requestError?.message,
        error_code: requestError?.code
      });
      return new Response(
        JSON.stringify({ error: 'Follow request not found or unauthorized' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the current user is the requestee
    if (followRequest.requestee_id !== current_user_id) {
      logSecurityEvent('unauthorized_follow_request_response', {
        actual_requestee_id: followRequest.requestee_id,
        attempting_user_id: current_user_id,
        request_id: request_id,
        requester_id: followRequest.requester_id
      });
      return new Response(
        JSON.stringify({ error: 'Unauthorized to respond to this request' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newStatus = response_action === 'approve' ? 'approved' : 'denied';

    // Update the follow request status
    const { error: updateError } = await supabaseClient
      .from('follow_requests')
      .update({ status: newStatus })
      .eq('id', request_id);

    if (updateError) {
      logSecurityEvent('follow_request_update_failed', {
        requestee_id: current_user_id,
        requester_id: followRequest.requester_id,
        request_id: request_id,
        response_action: response_action,
        error: updateError.message,
        error_code: updateError.code
      });
      return new Response(
        JSON.stringify({ error: 'Failed to update follow request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If approved, create the follow relationship using our database function
    if (response_action === 'approve') {
      const { error: followError } = await supabaseClient.rpc('create_follow_relationship', {
        p_follower_id: followRequest.requester_id,
        p_following_id: followRequest.requestee_id
      });

      if (followError) {
        logSecurityEvent('follow_relationship_creation_failed', {
          requestee_id: current_user_id,
          requester_id: followRequest.requester_id,
          request_id: request_id,
          error: followError.message,
          error_code: followError.code
        });
        return new Response(
          JSON.stringify({ error: 'Failed to create follow relationship' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      logSecurityEvent('follow_request_approved', {
        requestee_id: current_user_id,
        requester_id: followRequest.requester_id,
        request_id: request_id
      });
    } else {
      logSecurityEvent('follow_request_denied', {
        requestee_id: current_user_id,
        requester_id: followRequest.requester_id,
        request_id: request_id
      });
    }

    const response: RespondToFollowRequestResponse = {
      success: true,
      message: response_action === 'approve' 
        ? 'Follow request approved' 
        : 'Follow request denied'
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
