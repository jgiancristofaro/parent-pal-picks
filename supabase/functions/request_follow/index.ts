
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

    console.log('Request follow:', { current_user_id, target_user_id });

    // Get target user's privacy setting
    const { data: targetProfile, error: profileError } = await supabaseClient
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
      const { error: followError } = await supabaseClient
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
      const { data: existingRequest, error: existingError } = await supabaseClient
        .from('follow_requests')
        .select('id')
        .eq('requester_id', current_user_id)
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
        const { error: requestError } = await supabaseClient
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
