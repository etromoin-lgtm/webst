const { URL } = require('url');

/**
 * SSRF and Security Validation for URL
 */
function isSafeUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, error: 'Only http and https protocols are supported' };
    }

    const host = parsed.hostname.toLowerCase();

    // Block localhost, link-local, loopback, private networks
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', 'ip6-localhost'];
    if (blockedHosts.includes(host)) {
      return { safe: false, error: 'Localhost and loopback addresses are blocked' };
    }

    if (host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.lan')) {
      return { safe: false, error: 'Internal private domains are blocked' };
    }

    // Check IPv4 private ranges: 10.x.x.x, 192.168.x.x, 172.16-31.x.x, 169.254.x.x
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = host.match(ipv4Regex);
    if (ipMatch) {
      const [, o1, o2] = ipMatch.map(Number);
      if (
        o1 === 10 ||
        o1 === 127 ||
        (o1 === 172 && o2 >= 16 && o2 <= 31) ||
        (o1 === 192 && o2 === 168) ||
        (o1 === 169 && o2 === 254) ||
        o1 === 0
      ) {
        return { safe: false, error: 'Private and link-local IP addresses are blocked' };
      }
    }

    return { safe: true, parsed };
  } catch (err) {
    return { safe: false, error: 'Invalid URL format' };
  }
}

/**
 * Extract clean registrable domain / hostname
 */
function extractDomain(urlString) {
  try {
    const parsed = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    let host = parsed.hostname.toLowerCase();
    // Remove port if present
    host = host.split(':')[0];
    return host;
  } catch {
    return '';
  }
}

/**
 * Resolves favicon metadata for a given URL safely
 */
async function resolveFavicon(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { success: false, status: 'invalid_url', error: 'No URL provided' };
  }

  // Ensure scheme
  let formattedUrl = inputUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  const check = isSafeUrl(formattedUrl);
  if (!check.safe) {
    return { success: false, status: 'invalid_url', error: check.error };
  }

  const hostname = check.parsed.hostname.toLowerCase();
  // Strip www for cleaner domain resolution
  const cleanDomain = hostname.replace(/^www\./, '');

  if (!cleanDomain || !cleanDomain.includes('.')) {
    return { success: false, status: 'invalid_url', error: 'Invalid hostname format' };
  }

  // Build secure high-resolution favicon endpoint
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`;
  const fallbackFaviconUrl = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(cleanDomain)}.ico`;

  return {
    success: true,
    status: 'found',
    url: formattedUrl,
    hostname,
    domain: cleanDomain,
    favicon_url: faviconUrl,
    fallback_favicon_url: fallbackFaviconUrl
  };
}

module.exports = {
  isSafeUrl,
  extractDomain,
  resolveFavicon
};
