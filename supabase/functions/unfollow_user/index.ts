
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

    const { current_user_id, target_user_id }: UnfollowUserRequest = await req.json();

    if (!current_user_id || !target_user_id) {
      return new Response(
        JSON.stringify({ error: 'current_user_id and target_user_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Unfollow user:', { current_user_id, target_user_id });

    // Delete from user_follows
    const { error: unfollowError } = await supabaseClient
      .from('user_follows')
      .delete()
      .eq('follower_id', current_user_id)
      .eq('following_id', target_user_id);

    if (unfollowError) {
      console.error('Unfollow error:', unfollowError);
      return new Response(
        JSON.stringify({ error: 'Failed to unfollow user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also delete any pending follow requests
    const { error: cancelRequestError } = await supabaseClient
      .from('follow_requests')
      .delete()
      .eq('requester_id', current_user_id)
      .eq('requestee_id', target_user_id)
      .eq('status', 'pending');

    if (cancelRequestError) {
      console.error('Cancel request error:', cancelRequestError);
      // Don't fail the entire operation for this
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
    console.error('Unfollow user error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
