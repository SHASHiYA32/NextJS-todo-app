import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
	// Provide a clearer console warning for missing configuration
	// This helps surface the root cause of network "Failed to fetch" errors.
	// NEXT_PUBLIC_* env vars must be present in the environment for the client to reach Supabase.
	// Do not throw here to avoid breaking builds — pages can check these values and show user-friendly errors.
	// eslint-disable-next-line no-console
	console.warn("Supabase client config missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
