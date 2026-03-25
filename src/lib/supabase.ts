import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client for build time if variables are missing
const createDummyClient = () => {
  return new Proxy({} as SupabaseClient<Database>, {
    get: () => {
      return () => {
        throw new Error('Supabase client not initialized. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
      };
    }
  });
};

export const supabase = (() => {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    try {
      return createClient<Database>(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error('Supabase initialization error:', e);
    }
  }
  return createDummyClient();
})();

// Test connection helper
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('team_members').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (e) {
    console.warn('Supabase connection test error:', e);
    return false;
  }
};
