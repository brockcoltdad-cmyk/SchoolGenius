import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create singleton instance at module level
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  // Only create one instance per browser session
  if (typeof window !== 'undefined' && supabaseInstance) {
    return supabaseInstance;
  }

  const client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Store singleton only on client side
  if (typeof window !== 'undefined') {
    supabaseInstance = client;
  }

  return client;
}
