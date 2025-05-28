
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

    const { request_id, current_user_id, response_action }: RespondToFollowRequestRequest = await req.json();

    if (!request_id || !current_user_id || !response_action) {
      return new Response(
        JSON.stringify({ error: 'request_id, current_user_id, and response_action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['approve', 'deny'].includes(response_action)) {
      return new Response(
        JSON.stringify({ error: 'response_action must be "approve" or "deny"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Respond to follow request:', { request_id, current_user_id, response_action });

    // Verify that current_user_id is the requestee for this request
    const { data: followRequest, error: requestError } = await supabaseClient
      .from('follow_requests')
      .select('requester_id, requestee_id, status')
      .eq('id', request_id)
      .eq('requestee_id', current_user_id)
      .eq('status', 'pending')
      .single();

    if (requestError || !followRequest) {
      console.error('Follow request verification error:', requestError);
      return new Response(
        JSON.stringify({ error: 'Follow request not found or unauthorized' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newStatus = response_action === 'approve' ? 'approved' : 'denied';

    // Update the follow request status
    const { error: updateError } = await supabaseClient
      .from('follow_requests')
      .update({ status: newStatus })
      .eq('id', request_id);

    if (updateError) {
      console.error('Follow request update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update follow request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If approved, create the follow relationship
    if (response_action === 'approve') {
      const { error: followError } = await supabaseClient
        .from('user_follows')
        .insert({
          follower_id: followRequest.requester_id,
          following_id: followRequest.requestee_id
        });

      if (followError) {
        console.error('Follow relationship creation error:', followError);
        return new Response(
          JSON.stringify({ error: 'Failed to create follow relationship' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
    console.error('Respond to follow request error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
