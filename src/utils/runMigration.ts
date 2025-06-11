
import { supabase } from "@/integrations/supabase/client";

export const runLocationMigration = async () => {
  try {
    console.log('Starting location migration...');
    
    const { data, error } = await supabase.functions.invoke('migrate-locations-to-google-places', {
      method: 'POST',
    });

    if (error) {
      console.error('Migration failed:', error);
      throw error;
    }

    console.log('Migration completed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  }
};

// Execute the migration immediately when this module is imported
runLocationMigration()
  .then((result) => {
    console.log('Migration execution completed:', result);
  })
  .catch((error) => {
    console.error('Migration execution failed:', error);
  });
