
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchSittersRequest {
  search_term: string;
  current_user_id?: string;
}

interface SitterSearchResult {
  sitter_id: string;
  full_name: string;
  avatar_url: string | null;
}

// Rate limiting configuration
const RATE_LIMITS = {
  SITTER_SEARCH: { max: 30, windowMinutes: 60 }, // 30 searches per hour
};

// Security logging utility
function logSecurityEvent(event: string, details: any = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    function: 'search_sitters',
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
      p_endpoint: 'search_sitters',
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
      return false; // Fail securely - deny request if rate limiting fails
    }

    return data === true;
  } catch (error) {
    logSecurityEvent('rate_limit_check_failed', {
      error: error.message,
      identifier: identifier.substring(0, 8) + '...',
      request_type: requestType
    });
    return false; // Fail securely on error
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

function normalizePhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 1 and has 11 digits, remove the leading 1
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return digitsOnly.substring(1);
  }
  
  return digitsOnly;
}

function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

function isPhoneNumber(str: string): boolean {
  const digitsOnly = str.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { search_term, current_user_id }: SearchSittersRequest = await req.json();

    if (!search_term || search_term.trim().length === 0) {
      logSecurityEvent('invalid_search_term', {
        client_ip: getClientIP(req),
        current_user_id
      });
      return new Response(
        JSON.stringify({ error: 'search_term is required and cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use user ID as primary identifier, fallback to IP
    const clientIP = getClientIP(req);
    const identifier = current_user_id || clientIP;

    // Check rate limit
    const isAllowed = await checkRateLimit(
      supabaseClient,
      identifier,
      'sitter_search',
      RATE_LIMITS.SITTER_SEARCH.max,
      RATE_LIMITS.SITTER_SEARCH.windowMinutes
    );

    if (!isAllowed) {
      logSecurityEvent('rate_limit_exceeded', {
        user_id: current_user_id,
        client_ip: clientIP,
        search_term: search_term.substring(0, 20) + '...',
        limit: RATE_LIMITS.SITTER_SEARCH.max,
        window_minutes: RATE_LIMITS.SITTER_SEARCH.windowMinutes
      });
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Too many sitter searches. Please wait before trying again.',
          retryAfter: RATE_LIMITS.SITTER_SEARCH.windowMinutes * 60
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': (RATE_LIMITS.SITTER_SEARCH.windowMinutes * 60).toString()
          } 
        }
      );
    }

    console.log('Search params:', { search_term, current_user_id });

    let sitters: any[] = [];
    const trimmedSearchTerm = search_term.trim();

    // Determine search type and execute appropriate query
    if (isEmail(trimmedSearchTerm)) {
      // Email search (exact match)
      logSecurityEvent('email_search_attempt', {
        user_id: current_user_id,
        client_ip: clientIP
      });

      const { data: emailResults, error: emailError } = await supabaseClient
        .from('sitters')
        .select('id, name, profile_image_url')
        .eq('email', trimmedSearchTerm);

      if (emailError) {
        logSecurityEvent('email_search_error', {
          user_id: current_user_id,
          error: emailError.message
        });
        return new Response(
          JSON.stringify({ error: 'Failed to search sitters by email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      sitters = emailResults || [];
      
    } else if (isPhoneNumber(trimmedSearchTerm)) {
      // Phone number search (exact match with normalization)
      const normalizedPhone = normalizePhoneNumber(trimmedSearchTerm);
      
      logSecurityEvent('phone_search_attempt', {
        user_id: current_user_id,
        client_ip: clientIP
      });

      // Search for phone numbers that match when normalized
      const { data: phoneResults, error: phoneError } = await supabaseClient
        .from('sitters')
        .select('id, name, profile_image_url, phone_number')
        .not('phone_number', 'is', null);

      if (phoneError) {
        logSecurityEvent('phone_search_error', {
          user_id: current_user_id,
          error: phoneError.message
        });
        return new Response(
          JSON.stringify({ error: 'Failed to search sitters by phone' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Filter results by normalized phone number
      sitters = (phoneResults || []).filter(sitter => 
        normalizePhoneNumber(sitter.phone_number || '') === normalizedPhone
      );
      
    } else {
      // Name search (ILIKE)
      logSecurityEvent('name_search_attempt', {
        user_id: current_user_id,
        client_ip: clientIP
      });

      const { data: nameResults, error: nameError } = await supabaseClient
        .from('sitters')
        .select('id, name, profile_image_url')
        .ilike('name', `%${trimmedSearchTerm}%`);

      if (nameError) {
        logSecurityEvent('name_search_error', {
          user_id: current_user_id,
          error: nameError.message
        });
        return new Response(
          JSON.stringify({ error: 'Failed to search sitters by name' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      sitters = nameResults || [];
    }

    // Transform results to match expected format
    const results: SitterSearchResult[] = sitters.map(sitter => ({
      sitter_id: sitter.id,
      full_name: sitter.name,
      avatar_url: sitter.profile_image_url
    }));

    logSecurityEvent('search_completed', {
      user_id: current_user_id,
      client_ip: clientIP,
      results_count: results.length,
      search_type: isEmail(trimmedSearchTerm) ? 'email' : isPhoneNumber(trimmedSearchTerm) ? 'phone' : 'name'
    });

    return new Response(
      JSON.stringify(results),
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
