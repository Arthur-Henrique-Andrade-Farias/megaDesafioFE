// src/lib/supabase.js (Ensure this or similar exists)
import { createClient } from '@supabase/supabase-js';

// REPLACE WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const supabaseUrl = 'https://zxrtjasxungnpcgxaoip.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cnRqYXN4dW5nbnBjZ3hhb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY0MDIsImV4cCI6MjA2Mjc2MjQwMn0.wR8ExVL3FY_TrQCPY274HHnZCXo40_v31X_uSK-xsXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

export async function getAuthHeaders(isJsonContent = false) {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        console.error('Authentication error:', error);
        throw new Error('User not authenticated or session expired.');
    }
    const headers = {
        'Authorization': `Bearer ${session.access_token}`,
    };
    if (isJsonContent) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
}