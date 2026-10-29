import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_BASE } from '../../utils/apiConfig';

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

// Module-level cache to prevent duplicate fetches across page components
let globalSeoMap: Record<string, { title?: string; description?: string; og_image?: string }> | null = null;
let fetchPromise: Promise<void> | null = null;

function getCachedOverride(pageUrl?: string) {
  if (!pageUrl || typeof window === 'undefined') return null;
  const path = pageUrl === '' ? '/' : pageUrl;

  if (globalSeoMap && globalSeoMap[path]) {
    return globalSeoMap[path];
  }

  try {
    const raw = localStorage.getItem('etromo_seo_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[path]) return parsed[path];
    }
  } catch {}
  return null;
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
  const [override, setOverride] = useState(() => getCachedOverride(url));

  useEffect(() => {
    if (!url || typeof window === 'undefined') return;
    const path = url === '' ? '/' : url;

    // Load from cache or fetch once
    if (!globalSeoMap) {
      if (!fetchPromise) {
        fetchPromise = fetch(`${API_BASE}/api/settings/seo`)
          .then(res => (res.ok ? res.json() : null))
          .then(data => {
            if (data && Array.isArray(data.seo)) {
              const map: Record<string, any> = {};
              data.seo.forEach((item: any) => {
                if (item.page) map[item.page] = item;
              });
              globalSeoMap = map;
              try {
                localStorage.setItem('etromo_seo_cache', JSON.stringify(map));
              } catch {}
              if (map[path]) setOverride(map[path]);
            }
          })
          .catch(() => {})
          .finally(() => {
            fetchPromise = null;
          });
      } else {
        fetchPromise.then(() => {
          if (globalSeoMap && globalSeoMap[path]) {
            setOverride(globalSeoMap[path]);
          }
        });
      }
    } else if (globalSeoMap[path]) {
      setOverride(globalSeoMap[path]);
    }
  }, [url]);

  const activeTitle = override?.title || title;
  const activeDescription = override?.description || description;
  const activeImage = override?.og_image || image;

  const fullTitle = activeTitle.includes('Etromo') ? activeTitle : `${activeTitle} | Etromo`;
  const defaultUrl =
    typeof window !== 'undefined' &&
    window.location.origin &&
    !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://etromo.in';
  const pageUrl = url ? `${defaultUrl}${url}` : defaultUrl;
  const resolvedImage = activeImage === '/og-default.png' ? '/logo.png' : activeImage;
  const absoluteImage = resolvedImage.startsWith('http')
    ? resolvedImage
    : `${defaultUrl}${resolvedImage}`;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={activeDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical || pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={activeDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={absoluteImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={activeDescription} />
      <meta name="twitter:image" content={absoluteImage} />
      {jsonLdArray.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdArray.length === 1 ? jsonLdArray[0] : jsonLdArray)
          }}
        />
      )}
    </Helmet>
  );
}

export default PageSEO;
