'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [message, setMessage] = useState('');
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  useEffect(() => {
    const callFunction = async () => {
      const res = await fetch(
        'https://qrefotmwbrtfthswfvcy.supabase.co/functions/v1/hello',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ name: 'Sam' }),
        }
      );

      const data = await res.json();
      setMessage(data.message);
    };

    callFunction();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Supabase Edge Function Demo</h1>
      <p>{message}</p>
    </main>
  );
}
