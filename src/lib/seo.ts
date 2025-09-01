import { Metadata } from 'next'

export const siteConfig = {
  name: 'Nexus',
  description: 'Transform your team productivity with Nexus - the ultimate project management and issue tracking platform. Streamline workflows, collaborate seamlessly, and deliver projects faster.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexus-frontend-xi.vercel.app',
  ogImage: '/og-image.png',
  creator: '@nexus',
  keywords: [
    'project management software',
    'issue tracking system',
    'team collaboration platform',
    'kanban board tool',
    'task management app',
    'productivity software',
    'agile project management',
    'workflow automation',
    'team organization',
    'project planning',
    'bug tracking',
    'scrum management',
    'development workflow',
    'project dashboard'
  ],
}

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.creator,
    },
  ],
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}
