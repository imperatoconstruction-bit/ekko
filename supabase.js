const SUPABASE_URL = 'https://iwdfabkbzzbqhzxaspfo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YVqgGI6xSh0fBWU0O6pVpQ_6vToI3jv';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) window.location.href = 'login.html';
  return user;
}
