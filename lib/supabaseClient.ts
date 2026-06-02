import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwdfabkbzzbqhzxaspfo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YVqgGI6xSh0fBWU0O6pVpQ_6vToI3jv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
