import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/s/$id')({
  loader: async ({ params }) => {
    const { id } = params;
    
    try {
      // Get KV namespace binding
      // @ts-ignore - KV binding from Cloudflare Workers
      const KV = (globalThis as any).BIRTHDAY_KV || process.env.BIRTHDAY_KV;
      
      if (!KV) {
        // KV not available - redirect to home
        throw redirect({ to: '/' });
      }

      // Get data from KV
      const data = await KV.get(id);
      
      if (!data) {
        // Short ID not found - redirect to home
        throw redirect({ to: '/' });
      }

      // Redirect to home with the compressed data
      throw redirect({ 
        to: '/',
        search: { d: data },
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
