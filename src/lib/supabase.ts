import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a silent dummy client for build time or missing variables
const createDummyClient = () => {
  const dummy: any = {
    from: () => dummy,
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    eq: () => dummy,
    order: () => dummy,
    channel: () => ({
      on: () => ({
        subscribe: () => ({})
      }),
      subscribe: () => ({})
    }),
    removeChannel: () => {},
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    }
  };
  return dummy as SupabaseClient<Database>;
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
