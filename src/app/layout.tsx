import type { Metadata } from 'next';
import * as React from 'react';

import Providers from '@/app/providers';
import { seoConfig } from '@/config/seo';

import '@/styles/globals.css';

export const metadata: Metadata = seoConfig({
  title: 'Next.js Starter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='bg-white dark:bg-[#020817]' suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
