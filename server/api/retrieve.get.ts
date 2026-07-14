// Nitro API route for retrieving shortened URL data from Cloudflare KV
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const id = query.id as string;
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Missing id parameter',
      });
    }

    // Get KV namespace binding from Cloudflare environment
    // @ts-ignore - BIRTHDAY_KV is provided by Cloudflare Workers runtime
    const KV = event.context.cloudflare?.env?.BIRTHDAY_KV;
    
    if (!KV) {
      console.warn('BIRTHDAY_KV binding not available');
      throw createError({
        statusCode: 503,
        message: 'Database not configured',
      });
    }

    // Get data from KV
    const data = await KV.get(id);
    
    if (!data) {
      throw createError({
        statusCode: 404,
        message: 'Short URL not found or expired',
      });
    }

    console.log(`✅ Retrieved short URL: ${id} (${data.length} bytes)`);
    
    return { data };
  } catch (error) {
    console.error('❌ Error retrieving short link:', error);
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error; // Re-throw createError errors
    }
    
    throw createError({
      statusCode: 500,
      message: 'Failed to retrieve short link',
    });
  }
});
