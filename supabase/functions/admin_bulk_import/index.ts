
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImportRow {
  [key: string]: string | number | boolean | null;
}

interface ImportRequest {
  importType: 'sitters' | 'products';
  data: ImportRow[];
  columnMapping: { [csvColumn: string]: string };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Set the auth context
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin role required.' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { importType, data, columnMapping }: ImportRequest = await req.json();

    console.log(`Starting bulk import for ${importType} with ${data.length} rows`);

    let insertData: any[] = [];
    let insertErrors: string[] = [];

    // Transform data based on column mapping and import type
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        let transformedRow: any = {};

        if (importType === 'sitters') {
          // Map sitter fields
          transformedRow = {
            name: row[columnMapping['name']] || '',
            bio: row[columnMapping['bio']] || null,
            experience: row[columnMapping['experience']] || null,
            hourly_rate: row[columnMapping['hourly_rate']] ? 
              parseFloat(row[columnMapping['hourly_rate']] as string) : null,
            phone_number: row[columnMapping['phone_number']] || null,
            email: row[columnMapping['email']] || null,
            profile_image_url: row[columnMapping['profile_image_url']] || null,
            certifications: row[columnMapping['certifications']] ? 
              (row[columnMapping['certifications']] as string).split(',').map(cert => cert.trim()) : [],
            created_by_user_id: user.id,
            is_verified: false,
            rating: 0,
            review_count: 0
          };

          // Validate required fields
          if (!transformedRow.name) {
            insertErrors.push(`Row ${i + 1}: Name is required`);
            continue;
          }

        } else if (importType === 'products') {
          // Map product fields
          transformedRow = {
            name: row[columnMapping['name']] || '',
            description: row[columnMapping['description']] || null,
            brand_name: row[columnMapping['brand_name']] || '',
            category: row[columnMapping['category']] || null,
            price: row[columnMapping['price']] ? 
              parseFloat(row[columnMapping['price']] as string) : null,
            image_url: row[columnMapping['image_url']] || null,
            external_purchase_link: row[columnMapping['external_purchase_link']] || null,
            created_by_user_id: user.id,
            is_verified: false,
            average_rating: 0,
            review_count: 0
          };

          // Validate required fields
          if (!transformedRow.name || !transformedRow.brand_name) {
            insertErrors.push(`Row ${i + 1}: Name and brand name are required`);
            continue;
          }
        }

        insertData.push(transformedRow);
      } catch (error) {
        insertErrors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    console.log(`Processed ${insertData.length} valid rows, ${insertErrors.length} errors`);

    // Perform bulk insert if we have valid data
    let insertResult;
    if (insertData.length > 0) {
      const { data: result, error: insertError } = await supabase
        .from(importType)
        .insert(insertData)
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to import data', 
            details: insertError.message,
            validationErrors: insertErrors
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      insertResult = result;
    }

    // Log the import action
    await supabase
      .from('audit_log')
      .insert({
        admin_id: user.id,
        action_type: `bulk_import_${importType}`,
        target_id: user.id,
        reason: `Imported ${insertData.length} ${importType} records`
      });

    return new Response(
      JSON.stringify({
        success: true,
        imported: insertData.length,
        errors: insertErrors.length,
        validationErrors: insertErrors,
        data: insertResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Bulk import error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
