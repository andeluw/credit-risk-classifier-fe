'use client';

import { Metadata } from 'next';
import * as React from 'react';

import InternalServerError from '@/app/(common)/InternalServerError';
import { seoConfig } from '@/config/seo';

export const metadata: Metadata = seoConfig({
  title: '500',
  description: 'This page is inaccessible due to a server error.',
});

export default function Page() {
  return <InternalServerError />;
}
