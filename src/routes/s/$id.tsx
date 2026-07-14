import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/s/$id')({
  loader: async ({ params }) => {
    const { id } = params;
    
    try {
      // Get D1 database binding
      // @ts-ignore - DB binding from Cloudflare Workers
      const DB = (globalThis as any).DB || process.env.DB;
      
      if (!DB) {
        // DB not available - redirect to home
        throw redirect({ to: '/' });
      }

      // Query the database for the short ID
      const result = await DB.prepare(
        'SELECT data, expires_at FROM birthday_links WHERE id = ?'
      )
        .bind(id)
        .first();
      
      if (!result) {
        // Short ID not found - redirect to home
        throw redirect({ to: '/' });
      }

      // Check if link has expired
      const now = Date.now();
      if (result.expires_at < now) {
        // Link expired - redirect to home
        throw redirect({ to: '/' });
      }

      // Redirect to home with the compressed data
      throw redirect({ 
        to: '/',
        search: { d: result.data },
      });
    } catch (error) {
      // On any error, redirect to home
      if (error && typeof error === 'object' && 'to' in error) {
        throw error; // Re-throw redirect
      }
      console.error('Error retrieving short link:', error);
      throw redirect({ to: '/' });
    }
  },
});
