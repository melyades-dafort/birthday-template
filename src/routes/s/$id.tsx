import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { getShortUrl } from '@/lib/supabase';

export const Route = createFileRoute('/s/$id')({
  component: ShortUrlRedirect,
});

function ShortUrlRedirect() {
  const { id } = useParams({ from: '/s/$id' });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAndRedirect() {
      console.log('🔗 Short URL lookup for id:', id);
      try {
        const data = await getShortUrl(id);
        console.log('📦 Retrieved data from Supabase, length:', data?.length);

        if (!data) {
          console.warn('❌ No data found for id:', id);
          navigate({ to: '/' });
          return;
        }

        // Navigate to home with the compressed data as search param
        console.log('✅ Redirecting to home with data...');
        navigate({ to: '/', search: { d: data } });
      } catch (error) {
        console.error('💥 Error retrieving short URL:', error);
        navigate({ to: '/' });
      }
    }

    fetchAndRedirect();
  }, [id, navigate]);

  return (
    <div className="flex h-[100svh] w-full items-center justify-center bg-gradient-blush">
      <div className="font-serif italic text-berry/70">loading your gift…</div>
    </div>
  );
}
