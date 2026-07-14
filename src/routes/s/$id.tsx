import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/s/$id')({
  loader: async ({ params }) => {
    const { id } = params;
    
    try {
      // Call the API route to retrieve data from KV
      const response = await fetch(`/api/retrieve?id=${id}`);
      
      if (!response.ok) {
        // API call failed or data not found - redirect to home
        throw redirect({ to: '/' });
      }

      const result = await response.json();
      
      if (!result.data) {
        // No data returned - redirect to home
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
