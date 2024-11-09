"use client";

import HomeContent from '@/components/home-content'
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Home</h1>
      <HomeContent user={user!} />
    </div>
  )
}
