
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ImportRow {
  [key: string]: string | number | boolean | null;
}

interface BulkImportRequest {
  type: 'sitters' | 'products';
  data: ImportRow[];
  columnMapping: Record<string, string>;
}

Deno.serve(async (req) => {
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
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Set the auth context
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { type, data, columnMapping }: BulkImportRequest = await req.json();

    console.log(`Processing bulk import for ${type}:`, { 
      rowCount: data.length, 
      columnMapping 
    });

    // Validate input
    if (!type || !['sitters', 'products'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid import type. Must be "sitters" or "products"' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No data provided for import' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Map CSV columns to database columns
        const mappedData: Record<string, any> = {};
        
        for (const [csvColumn, dbColumn] of Object.entries(columnMapping)) {
          if (row[csvColumn] !== undefined && row[csvColumn] !== '') {
            let value = row[csvColumn];
            
            // Type conversion based on database column
            if (type === 'sitters') {
              if (dbColumn === 'hourly_rate') {
                value = parseFloat(String(value)) || null;
              } else if (dbColumn === 'certifications') {
                // Handle certifications as array
                value = String(value).split(',').map(cert => cert.trim()).filter(cert => cert);
              }
            } else if (type === 'products') {
              if (dbColumn === 'price') {
                value = parseFloat(String(value)) || null;
              } else if (dbColumn === 'average_rating') {
                value = parseFloat(String(value)) || null;
              } else if (dbColumn === 'review_count') {
                value = parseInt(String(value)) || 0;
              }
            }
            
            mappedData[dbColumn] = value;
          }
        }

        // Add required defaults
        if (type === 'sitters') {
          mappedData.created_by_user_id = user.id;
          mappedData.rating = mappedData.rating || 0;
          mappedData.review_count = mappedData.review_count || 0;
        } else if (type === 'products') {
          mappedData.created_by_user_id = user.id;
          mappedData.average_rating = mappedData.average_rating || 0;
          mappedData.review_count = mappedData.review_count || 0;
          // Set a default category_id if none provided
          if (!mappedData.category_id) {
            // Get or create a default category
            const { data: defaultCategory } = await supabase
              .from('categories')
              .select('id')
              .eq('name', 'General')
              .single();
            
            if (defaultCategory) {
              mappedData.category_id = defaultCategory.id;
            } else {
              // Create default category
              const { data: newCategory, error: categoryError } = await supabase
                .from('categories')
                .insert({ name: 'General' })
                .select('id')
                .single();
              
              if (!categoryError && newCategory) {
                mappedData.category_id = newCategory.id;
              }
            }
          }
        }

        console.log(`Inserting row ${i + 1}:`, mappedData);

        // Insert into appropriate table
        const { error } = await supabase
          .from(type)
          .insert(mappedData);

        if (error) {
          console.error(`Error inserting row ${i + 1}:`, error);
          results.failed++;
          results.errors.push(`Row ${i + 1}: ${error.message}`);
        } else {
          results.successful++;
        }

      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Log the admin action
    await supabase
      .from('audit_log')
      .insert({
        admin_id: user.id,
        action_type: 'bulk_import',
        target_id: user.id, // Use admin's ID as target
        reason: `Bulk import of ${results.successful} ${type} (${results.failed} failed)`
      });

    console.log('Bulk import completed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in admin-bulk-import:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
