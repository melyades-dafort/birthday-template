// Nitro API route for shortening URLs with Cloudflare KV
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { data } = body;
    
    if (!data || typeof data !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Missing or invalid data parameter',
      });
    }

    // Generate a short random ID (6 characters)
    const shortId = generateShortId();
    
    // Get KV namespace binding from Cloudflare environment
    // @ts-ignore - BIRTHDAY_KV is provided by Cloudflare Workers runtime
    const KV = event.context.cloudflare?.env?.BIRTHDAY_KV;
    
    if (!KV) {
      console.warn('BIRTHDAY_KV binding not available, using fallback');
      // Fallback: Return indication that KV is not configured
      return {
        shortId: null,
        fallback: true,
        message: 'Database not configured. Using compression fallback.',
      };
    }

    // Store data with 1 year expiration (31536000 seconds)
    await KV.put(shortId, data, { expirationTtl: 31536000 });
    
    console.log(`✅ Created short URL: ${shortId} (${data.length} bytes)`);
    
    return {
      shortId,
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year from now
      fallback: false,
    };
  } catch (error) {
    console.error('❌ Error creating short link:', error);
    
    throw createError({
      statusCode: 500,
      message: 'Failed to create short link',
    });
  }
});

function generateShortId(): string {
  // Generate a 6-character alphanumeric ID
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
