import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexus-frontend-xi.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/verify-email',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/_next/',
          '/admin/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/auth/login',
          '/auth/signup',
          '/features',
          '/pricing',
          '/about'
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/verify-email',
          '/auth/forgot-password',
          '/auth/reset-password'
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
