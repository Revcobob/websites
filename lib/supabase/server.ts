import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, supabaseConfigured } from '@/lib/env';

// Service-role client. Server-only. Never import from client components.
// Bypasses RLS — use this for all admin mutations and trusted reads.
let serviceClient: SupabaseClient | null = null;

export function supabaseService(): SupabaseClient {
  if (!supabaseConfigured() || !env.supabaseSvc) {
    throw new Error(
      'Supabase service role is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }
  if (!serviceClient) {
    serviceClient = createClient(env.supabaseUrl, env.supabaseSvc, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return serviceClient;
}

// Anonymous client for server-side public reads (still passes RLS).
let anonClient: SupabaseClient | null = null;

export function supabaseAnon(): SupabaseClient {
  if (!supabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }
  if (!anonClient) {
    anonClient = createClient(env.supabaseUrl, env.supabaseAnon, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return anonClient;
}
