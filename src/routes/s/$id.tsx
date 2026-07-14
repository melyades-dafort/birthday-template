import { createFileRoute, redirect } from '@tanstack/react-router';
import { getShortUrl } from '@/lib/supabase';

export const Route = createFileRoute('/s/$id')({
  loader: async ({ params }) => {
    const { id } = params;
    
    try {
      // Retrieve data from Supabase
      const data = await getShortUrl(id);
      
      if (!data) {
        // Data not found or expired - redirect to home
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
