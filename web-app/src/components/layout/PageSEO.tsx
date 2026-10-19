import { Helmet } from 'react-helmet-async';

export interface PageSEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function PageSEO({
  title,
  description,
  url,
  image = '/og-default.png',
  canonical,
  type = 'website',
  noindex = false,
  jsonLd,
}: PageSEOProps) {
  const fullTitle = `${title} | Etromo`;
  const defaultUrl = 'https://www.etromo.com';
  const pageUrl = url ? `${defaultUrl}${url}` : defaultUrl;
  const absoluteImage = image.startsWith('http') ? image : `${defaultUrl}${image}`;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical || pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={absoluteImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      {jsonLdArray.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArray.length === 1 ? jsonLdArray[0] : jsonLdArray) }}
        />
      )}
    </Helmet>
  );
}

export default PageSEO;
