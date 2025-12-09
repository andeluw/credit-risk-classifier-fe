// !SETUP
import { Metadata } from 'next';

export const siteConfig = {
  title: 'Next.js Starter',
  description:
    'A Next.js starter with Tailwind CSS, TypeScript, and essential tools pre-configured.',
  url: process.env.SITE_URL ?? 'http://localhost:3000',
};

type seoConfigType = {
  title?: string;
  templateTitle?: string;
  description?: string;
} & Metadata;

export const seoConfig = ({
  title,
  templateTitle,
  description,
  ...props
}: seoConfigType) => {
  const metadata: Metadata = {
    applicationName: siteConfig.title,
    title: {
      default: title ? title : siteConfig.title,
      template: templateTitle ? templateTitle : `%s | ${siteConfig.title}`,
    },
    description: description ? description : siteConfig.description,
    robots: { index: true, follow: true },
    icons: {
      icon: [
        {
          url: '/favicon.ico',
        },
        {
          url: '/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: '/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
      ],
      shortcut: '/icons/favicon-16x16.png',
      apple: '/icons/apple-touch-icon.png',
    },
    manifest: `/manifest.json`,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: siteConfig.title,
    },
    openGraph: {
      url: siteConfig.url,
      title: title ? title : siteConfig.title,
      description: description ? description : siteConfig.description,
      siteName: siteConfig.title,
      images: [`${siteConfig.url}/images/og.png`],
      type: 'website',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? title : siteConfig.title,
      description: description ? description : siteConfig.description,
      images: [`${siteConfig.url}/images/og.png`],
    },
    ...props,
  };

  return metadata;
};
