import { Metadata } from 'next'
import { siteConfig } from './seo'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
  keywords?: string[]
}

export function generateSEO({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url,
  noIndex = false,
  keywords = siteConfig.keywords,
}: SEOProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  return {
    title: metaTitle,
    description,
    keywords,
    openGraph: {
      title: metaTitle,
      description,
      url: metaUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [image],
      creator: siteConfig.creator,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: metaUrl,
    },
  }
}

export function generatePageJsonLd({
  title,
  description = siteConfig.description,
  url,
  image = siteConfig.ogImage,
  type = 'WebPage',
}: {
  title?: string
  description?: string
  url?: string
  image?: string
  type?: string
}) {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: metaTitle,
    description,
    url: metaUrl,
    image,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
    },
  }
}
