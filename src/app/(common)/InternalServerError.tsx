'use client';

import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/button';
import { Typography } from '@/components/typography';

export default function InternalServerError() {
  const router = useRouter();

  return (
    <section className='layout flex min-h-screen flex-col items-center justify-center text-center text-primary'>
      <AlertTriangle size={60} className='text-destructive' />
      <Typography
        variant='j1'
        weight='bold'
        className='mt-6 text-2xl md:text-4xl font-bold'
      >
        Internal Server Error
      </Typography>
      <Button onClick={() => router.refresh()} className='mt-6'>
        Try Again
      </Button>
    </section>
  );
}
