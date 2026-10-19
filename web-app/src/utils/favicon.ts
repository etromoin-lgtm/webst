/**
 * Utility functions for extracting domains and resolving client favicons
 */

export function extractDomain(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const parsed = new URL(cleaned);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return cleaned.replace(/^https?:\/\//i, '').split('/')[0].replace(/^www\./i, '');
  }
}

export function getFaviconUrl(urlOrDomain: string, customFavicon?: string, size: number = 64): string {
  if (customFavicon && customFavicon.trim()) {
    return customFavicon.trim();
  }
  const domain = extractDomain(urlOrDomain);
  if (!domain) {
    return '';
  }
  // High-resolution Google Favicon API
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

export function getFallbackInitials(name: string): string {
  if (!name) return 'EP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
