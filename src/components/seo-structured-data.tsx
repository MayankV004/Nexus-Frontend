import Script from 'next/script'

interface SEOStructuredDataProps {
  type?: 'website' | 'webapp' | 'organization' | 'product'
  name?: string
  description?: string
  url?: string
  logo?: string
}

export function SEOStructuredData({
  type = 'webapp',
  name = 'Nexus',
  description = 'Transform your team productivity with Nexus - the ultimate project management and issue tracking platform',
  url = 'https://nexus-frontend-xi.vercel.app',
  logo = '/logo.png'
}: SEOStructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      name,
      description,
      url,
    }

    switch (type) {
      case 'webapp':
        return {
          ...baseData,
          '@type': 'SoftwareApplication',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser',
          author: {
            '@type': 'Organization',
            name: 'Nexus Team',
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '150',
          },
          features: [
            'Project Management',
            'Issue Tracking',
            'Team Collaboration',
            'Kanban Boards',
            'Real-time Updates'
          ],
        }

      case 'organization':
        return {
          ...baseData,
          '@type': 'Organization',
          logo,
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: 'English',
          },
        }

      case 'product':
        return {
          ...baseData,
          '@type': 'Product',
          brand: {
            '@type': 'Brand',
            name: 'Nexus',
          },
          category: 'Software',
        }

      default:
        return {
          ...baseData,
          '@type': 'WebSite',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  )
}
