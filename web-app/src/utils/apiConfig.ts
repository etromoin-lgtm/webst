// Centralized API configuration supporting local dev, custom domain, and production hosting
export const getApiBase = (): string => {
  // 1. Support explicit env variable if provided (e.g., VITE_API_URL=https://api.yourdomain.com)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  // 2. In browser environments
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // When running in local development mode on localhost:5173
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // In dev with Vite, the proxy forwards /api to port 5000, so empty string or direct URL works
      return '';
    }

    // When deployed on hosting (Render, Railway, Vercel, or custom server),
    // relative paths ('') work seamlessly with reverse proxies and unified domains.
    return '';
  }

  return '';
};

export const API_BASE = getApiBase();
export default API_BASE;

