// Server-only function for URL shortening with Cloudflare KV
'use server';

export async function shortenUrl(data: string, origin: string) {
  try {
    // Generate a short random ID (6 characters)
    const shortId = generateShortId();
    
    // Get KV namespace binding
    // @ts-ignore - KV binding from Cloudflare Workers
    const KV = (globalThis as any).BIRTHDAY_KV || process.env.BIRTHDAY_KV;
    
    if (!KV) {
      // Fallback: If KV is not available, return the compressed URL format
      return {
        shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
        fallback: true,
        message: 'Database not configured. Using compression fallback.',
      };
    }

    // Store data with 1 year expiration
    const expiresAt = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year
    
    await KV.put(shortId, data, { expirationTtl: 31536000 }); // 1 year in seconds
    
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
