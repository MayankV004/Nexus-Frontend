import { Metadata } from 'next'

interface SEOMetadataProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  noIndex?: boolean
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
}

export function generateMetadata({
  title,
  description = 'Transform your team productivity with Nexus - the ultimate project management and issue tracking platform. Streamline workflows, collaborate seamlessly, and deliver projects faster.',
  keywords = [],
  image = '/og-image.png',
  url,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
}: SEOMetadataProps = {}): Metadata {
  const siteName = 'Nexus'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexus-frontend-xi.vercel.app'
  
  const metaTitle = title ? `${title} | ${siteName}` : siteName
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl
  const metaImage = image.startsWith('http') ? image : `${siteUrl}${image}`

  const defaultKeywords = [
    'project management software',
    'issue tracking system',
    'team collaboration platform',
    'kanban board tool',
    'task management app',
    'productivity software',
    'agile project management',
    'workflow automation'
  ]

  const allKeywords = [...defaultKeywords, ...keywords]

  return {
    title: metaTitle,
    description,
    keywords: allKeywords,
    authors: authors ? authors.map(author => ({ name: author })) : [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      title: metaTitle,
      description,
      url: metaUrl,
      siteName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: type === 'article' ? 'article' : 'website',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [metaImage],
      creator: '@nexus',
      site: '@nexus',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      noarchive: noIndex,
      nosnippet: noIndex,
      noimageindex: noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_ID,
      yandex: process.env.YANDEX_VERIFICATION_ID,
      other: {
        'msvalidate.01': process.env.BING_VERIFICATION_ID || '',
      },
    },
  }
}

// Helper function for generating page-specific metadata
export function createPageMetadata(props: SEOMetadataProps): Metadata {
  return generateMetadata(props)
}

// Helper for auth pages
export function generateAuthMetadata(page: string): Metadata {
  const titles = {
    login: 'Sign In',
    signup: 'Create Account', 
    'forgot-password': 'Reset Password',
    'verify-email': 'Verify Email',
    'reset-password': 'Reset Password'
  }

  const descriptions = {
    login: 'Sign in to your Nexus account to access your projects and collaborate with your team.',
    signup: 'Create your free Nexus account and start managing projects more efficiently today.',
    'forgot-password': 'Reset your Nexus account password and regain access to your projects.',
    'verify-email': 'Verify your email address to complete your Nexus account setup.',
    'reset-password': 'Set a new password for your Nexus account.'
  }

  return generateMetadata({
    title: titles[page as keyof typeof titles] || 'Authentication',
    description: descriptions[page as keyof typeof descriptions] || 'Nexus authentication page',
    url: `/auth/${page}`,
    noIndex: page !== 'login' && page !== 'signup', // Only index login and signup pages
  })
}

// Helper for dashboard pages
export function generateDashboardMetadata(page: string): Metadata {
  return generateMetadata({
    title: `Dashboard - ${page}`,
    description: `Manage your ${page} in Nexus dashboard. Streamline your workflow and boost productivity.`,
    url: `/dashboard/${page}`,
    noIndex: true, // Dashboard pages should not be indexed
  })
}
