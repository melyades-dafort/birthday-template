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
