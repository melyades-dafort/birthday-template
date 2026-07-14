// Server-only function for URL shortening with D1 database
'use server';

export async function shortenUrl(data: string, origin: string) {
  try {
    // Generate a short random ID (6 characters)
    const shortId = generateShortId();
    
    // Get D1 database binding
    // @ts-ignore - DB binding from Cloudflare Workers
    const DB = (globalThis as any).DB || process.env.DB;
    
    if (!DB) {
      // Fallback: If DB is not available, return the compressed URL format
      return {
        shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
        fallback: true,
        message: 'Database not configured. Using compression fallback.',
      };
    }

    // Store data with 1 year expiration
    const now = Date.now();
    const expiresAt = now + (365 * 24 * 60 * 60 * 1000); // 1 year from now
    
    await DB.prepare(
      'INSERT INTO birthday_links (id, data, created_at, expires_at) VALUES (?, ?, ?, ?)'
    )
      .bind(shortId, data, now, expiresAt)
      .run();
    
    return {
      shortUrl: `${origin}/s/${shortId}`,
      shortId,
      expiresAt,
    };
  } catch (error) {
    console.error('Error creating short link:', error);
    
    // Fallback to compressed URL on error
    return { 
      shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
      fallback: true,
      error: 'Failed to create short link, using compression fallback',
    };
  }
}

function generateShortId(): string {
  // Generate a 6-character alphanumeric ID
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
