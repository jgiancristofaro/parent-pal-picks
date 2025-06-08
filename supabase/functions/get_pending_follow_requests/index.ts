
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GetPendingFollowRequestsRequest {
  current_user_id: string;
}

interface PendingFollowRequest {
  request_id: string;
  requester_id: string;
  requester_full_name: string;
  requester_avatar_url: string | null;
  created_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { current_user_id }: GetPendingFollowRequestsRequest = await req.json();

    if (!current_user_id) {
      return new Response(
        JSON.stringify({ error: 'current_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Get pending follow requests for user:', current_user_id);

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

    // First, fetch pending follow requests for the current user
    const { data: pendingRequests, error: requestsError } = await supabaseClient
      .from('follow_requests')
      .select('id, requester_id, created_at')
      .eq('requestee_id', current_user_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Pending requests query error:', requestsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch pending follow requests' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!pendingRequests || pendingRequests.length === 0) {
      return new Response(
        JSON.stringify([]),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all requester IDs
    const requesterIds = pendingRequests.map(req => req.requester_id);

    // Fetch requester profile information
    const { data: requesterProfiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', requesterIds);

    if (profilesError) {
      console.error('Requester profiles query error:', profilesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch requester profiles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a map of requester profiles for easy lookup
    const profilesMap = new Map();
    (requesterProfiles || []).forEach(profile => {
      profilesMap.set(profile.id, profile);
    });

    // Transform the data to match the expected response format
    const formattedRequests: PendingFollowRequest[] = pendingRequests.map(request => {
      const requesterProfile = profilesMap.get(request.requester_id);
      return {
        request_id: request.id,
        requester_id: request.requester_id,
        requester_full_name: requesterProfile?.full_name || 'Unknown User',
        requester_avatar_url: requesterProfile?.avatar_url || null,
        created_at: request.created_at
      };
    });

    return new Response(
      JSON.stringify(formattedRequests),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get pending follow requests error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
