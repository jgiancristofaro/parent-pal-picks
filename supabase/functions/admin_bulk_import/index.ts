
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

// Helper function to get CSV column name for a database field
const getCsvColumnForField = (fieldName: string, columnMapping: { [csvColumn: string]: string }): string | null => {
  for (const [csvColumn, dbField] of Object.entries(columnMapping)) {
    if (dbField === fieldName) {
      return csvColumn;
    }
  }
  return null;
};

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
          // Map sitter fields using proper column lookup
          const nameColumn = getCsvColumnForField('name', columnMapping);
          const bioColumn = getCsvColumnForField('bio', columnMapping);
          const experienceColumn = getCsvColumnForField('experience', columnMapping);
          const hourlyRateColumn = getCsvColumnForField('hourly_rate', columnMapping);
          const phoneNumberColumn = getCsvColumnForField('phone_number', columnMapping);
          const emailColumn = getCsvColumnForField('email', columnMapping);
          const profileImageColumn = getCsvColumnForField('profile_image_url', columnMapping);
          const certificationsColumn = getCsvColumnForField('certifications', columnMapping);

          transformedRow = {
            name: nameColumn ? (row[nameColumn] || '') : '',
            bio: bioColumn ? (row[bioColumn] || null) : null,
            experience: experienceColumn ? (row[experienceColumn] || null) : null,
            hourly_rate: hourlyRateColumn && row[hourlyRateColumn] ? 
              parseFloat(row[hourlyRateColumn] as string) : null,
            phone_number: phoneNumberColumn ? (row[phoneNumberColumn] || null) : null,
            email: emailColumn ? (row[emailColumn] || null) : null,
            profile_image_url: profileImageColumn ? (row[profileImageColumn] || null) : null,
            certifications: certificationsColumn && row[certificationsColumn] ? 
              (row[certificationsColumn] as string).split(',').map(cert => cert.trim()) : [],
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
          // Map product fields using proper column lookup
          const nameColumn = getCsvColumnForField('name', columnMapping);
          const descriptionColumn = getCsvColumnForField('description', columnMapping);
          const brandNameColumn = getCsvColumnForField('brand_name', columnMapping);
          const categoryColumn = getCsvColumnForField('category', columnMapping);
          const priceColumn = getCsvColumnForField('price', columnMapping);
          const imageUrlColumn = getCsvColumnForField('image_url', columnMapping);
          const purchaseLinkColumn = getCsvColumnForField('external_purchase_link', columnMapping);

          transformedRow = {
            name: nameColumn ? (row[nameColumn] || '') : '',
            description: descriptionColumn ? (row[descriptionColumn] || null) : null,
            brand_name: brandNameColumn ? (row[brandNameColumn] || '') : '',
            category: categoryColumn ? (row[categoryColumn] || null) : null,
            price: priceColumn && row[priceColumn] ? 
              parseFloat(row[priceColumn] as string) : null,
            image_url: imageUrlColumn ? (row[imageUrlColumn] || null) : null,
            external_purchase_link: purchaseLinkColumn ? (row[purchaseLinkColumn] || null) : null,
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
