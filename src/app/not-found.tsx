import { Metadata } from 'next';

import NotFound from '@/app/(common)/NotFound';
import { seoConfig } from '@/config/seo';

export const metadata: Metadata = seoConfig({
  title: '404',
  description: 'The page you are looking for does not exist or has been moved.',
});

export default function Page() {
  return <NotFound />;
}
