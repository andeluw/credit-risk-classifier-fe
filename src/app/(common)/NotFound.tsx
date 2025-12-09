import { TriangleAlert } from 'lucide-react';

import { ButtonLink } from '@/components/button-link';
import { Typography } from '@/components/typography';

export default function NotFound() {
  return (
    <main>
      <section className='bg-background'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-primary'>
          <TriangleAlert size={60} className=' text-destructive' />
          <Typography
            variant='j1'
            className='mt-6 text-2xl md:text-4xl font-bold'
          >
            Page Not Found
          </Typography>
          <ButtonLink href='/' className='mt-6' variant='light'>
            Return to Home
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
