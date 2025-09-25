import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _anon: SupabaseClient | null = null;
let _service: SupabaseClient | null = null;

export function getSupabaseAnon(): SupabaseClient {
  if (_anon) return _anon;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Server misconfigured: Supabase anon vars missing');
  _anon = createClient(url, key, { auth: { persistSession: false } });
  return _anon;
}

export function getSupabaseService(): SupabaseClient {
  if (_service) return _service;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Server misconfigured: Supabase service vars missing');
  _service = createClient(url, key, { auth: { persistSession: false } });
  return _service;
}
