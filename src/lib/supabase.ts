import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// AJUSTE PARA VITE: Using import.meta.env and the VITE prefix_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client for build time if variables are missing
const createDummyClient = () => {
  return new Proxy({} as any, {
    get: () => {
      return () => {
        throw new Error('The subbase is not initialized. Verify that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in Vercel.');
      };
    }
  });
};

export const supabase = (() => {
  // Check if the keys exist and if the link starts with http
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    try {
      return createClient<Database>(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error('Error initializing Supabase:', e);
    }
  }
  return createDummyClient();
})();

// Test connection helper
export const testSupabaseConnection = async () => {
  try {
    const { error } = await (supabase as any).from('team_members').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Connection to Supabase successfully established!');
    return true;
  } catch (e) {
    console.warn('Connection test error:', e);
    return false;
  }
};
