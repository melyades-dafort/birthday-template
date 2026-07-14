import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These will be set as environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using fallback');
    return {
      shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
      fallback: true,
      message: 'Database not configured. Using compression fallback.',
    };
  }

  try {
    const shortId = generateShortId();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year from now

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
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log(`✅ Created short URL: ${shortId}`);

    return {
      shortUrl: `${origin}/s/${shortId}`,
      shortId,
      expiresAt: expiresAt.getTime(),
      fallback: false,
    };
  } catch (error) {
    console.error('Error creating short URL:', error);
    
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
