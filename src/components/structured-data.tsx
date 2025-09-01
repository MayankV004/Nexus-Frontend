import { siteConfig } from '@/lib/seo'

interface StructuredDataProps {
  type?: 'website' | 'webapp' | 'article'
  title?: string
  description?: string
  url?: string
}

export function StructuredData({ 
  type = 'website',
  title = siteConfig.name,
  description = siteConfig.description,
  url = siteConfig.url
}: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'webapp' ? 'SoftwareApplication' : 'WebSite',
    name: title,
    description: description,
    url: url,
    ...(type === 'webapp' && {
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
