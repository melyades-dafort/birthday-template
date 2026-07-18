import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Using direct values for Vercel deployment (these are public anon keys - safe to expose)
// CORRECT URL: zkqdlljtftzvunaaanjs (NOT zkdqljffitzvunaaanjs)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zkqdlljtftzvunaaanjs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcWRsbGp0ZnR6dnVuYWFhbmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzY3MTYsImV4cCI6MjA5OTYxMjcxNn0.lNlM1XdG8yfS2f_2PBqtKSzbA1XR9ae1LI9T7jB0gPg';

// Create Supabase client (only if credentials are provided)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase);
};

// Generate a short random ID
function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a short URL
export async function createShortUrl(data: string, origin: string) {
  console.log('🔍 createShortUrl called');
  console.log('📊 Data length:', data.length, 'chars');
  console.log('🌐 Origin:', origin);
  
  const isConfigured = isSupabaseConfigured();
  console.log('⚙️ Supabase configured:', isConfigured);
  
  if (!isConfigured) {
    console.warn('⚠️ Supabase not configured, using fallback');
    return {
      shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
      fallback: true,
      message: 'Database not configured. Using compression fallback.',
    };
  }

  try {
    const shortId = generateShortId();
    console.log('🎲 Generated shortId:', shortId);
    
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year from now
    console.log('⏰ Expires at:', expiresAt.toISOString());

    console.log('💾 Attempting to insert into Supabase...');
    
    // Insert into Supabase
    const { error } = await supabase!
      .from('short_urls')
      .insert({
        id: shortId,
        data: data,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log(`✅ SUCCESS! Created short URL: ${shortId}`);
    console.log(`🔗 Short URL: ${origin}/s/${shortId}`);

    return {
      shortUrl: `${origin}/s/${shortId}`,
      shortId,
      expiresAt: expiresAt.getTime(),
      fallback: false,
    };
  } catch (error) {
    console.error('💥 Error creating short URL:', error);
    
    // Fallback to compressed URL
    return {
      shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
      fallback: true,
      error: 'Failed to create short link, using compression fallback',
    };
  }
}

// Retrieve data from short URL
export async function getShortUrl(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Database not configured');
  }

  try {
    const { data, error } = await supabase!
      .from('short_urls')
      .select('data, expires_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Short URL not found:', id);
      return null;
    }

    // Check if expired
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      console.warn('Short URL expired:', id);
      return null;
    }

    console.log(`✅ Retrieved short URL: ${id}`);
    return data.data;
  } catch (error) {
    console.error('Error retrieving short URL:', error);
    return null;
  }
}

// ─── Passcode System ─────────────────────────────────────────────────────────

// Generate a human-friendly 8-character passcode (no ambiguous chars)
function generatePasscode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/I/1
  let result = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += '-'; // format: XXXX-XXXX
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a passcode that expires in 24 hours
export async function createPasscode(label: string): Promise<{ passcode: string; expiresAt: Date } | null> {
  if (!isSupabaseConfigured()) return null;

  const passcode = generatePasscode();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const { error } = await supabase!
    .from('passcodes')
    .insert({
      code: passcode,
      label,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error creating passcode:', error);
    return null;
  }

  return { passcode, expiresAt };
}

// Validate a passcode - returns true if valid and not expired
export async function validatePasscode(code: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { data, error } = await supabase!
    .from('passcodes')
    .select('expires_at')
    .eq('code', code.toUpperCase().replace(/\s/g, ''))
    .single();

  if (error || !data) return false;

  const expiresAt = new Date(data.expires_at);
  return expiresAt > new Date();
}

// Get all active passcodes (for developer view)
export async function getActivePasscodes(): Promise<Array<{ code: string; label: string; expires_at: string }>> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase!
    .from('passcodes')
    .select('code, label, expires_at')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

// Delete/revoke a passcode
export async function revokePasscode(code: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase!
    .from('passcodes')
    .delete()
    .eq('code', code);

  return !error;
}
