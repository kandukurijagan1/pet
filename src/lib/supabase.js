import { createClient } from '@supabase/supabase-js';

const getEnv = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) return import.meta.env;
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env) return process.env;
  } catch {}
  return {};
};

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://pmqvxznvixnsnulneehi.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2-wKJ78qFfjahmOq6ykhlQ_CCEO_4c0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export default supabase;
