'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { SkinProvider } from '@/components/theme/SkinProvider';

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const kidId = params.id as string;

  useEffect(() => {
    if (typeof window !== 'undefined' && kidId) {
      localStorage.setItem('current_child_id', kidId);
    }
  }, [kidId]);

  return <SkinProvider>{children}</SkinProvider>;
}
