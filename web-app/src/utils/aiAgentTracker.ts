// AI Agent and Web Crawler Detection & Tracking Utility for Client SPA

export interface BotLogEntry {
  id: string | number;
  bot_name: string;
  bot_category: 'AI Agent' | 'Search Engine' | 'Social Crawler' | 'Developer Agent';
  user_agent: string;
  ip_address: string;
  path: string;
  method: string;
  status_code: number;
  referer?: string;
  created_at: string;
}

const CLIENT_BOT_RULES = [
  { regex: /GPTBot/i, name: 'OpenAI GPTBot', category: 'AI Agent' },
  { regex: /ChatGPT-User/i, name: 'ChatGPT Browsing', category: 'AI Agent' },
  { regex: /OAI-SearchBot/i, name: 'SearchGPT Bot', category: 'AI Agent' },
  { regex: /ClaudeBot/i, name: 'Anthropic ClaudeBot', category: 'AI Agent' },
  { regex: /Claude-Web/i, name: 'Claude Web Agent', category: 'AI Agent' },
  { regex: /anthropic-ai/i, name: 'Anthropic Crawler', category: 'AI Agent' },
  { regex: /PerplexityBot/i, name: 'PerplexityBot', category: 'AI Agent' },
  { regex: /Google-Extended/i, name: 'Google Gemini (Extended)', category: 'AI Agent' },
  { regex: /Applebot-Extended/i, name: 'Apple Intelligence', category: 'AI Agent' },
  { regex: /Meta-ExternalAgent|Meta-ExternalFetcher/i, name: 'Meta AI Crawler', category: 'AI Agent' },
  { regex: /Bytespider/i, name: 'ByteDance AI Spider', category: 'AI Agent' },
  { regex: /CCBot/i, name: 'Common Crawl (LLM Foundation)', category: 'AI Agent' },
  { regex: /Cohere-ai/i, name: 'Cohere AI Bot', category: 'AI Agent' },
  { regex: /Diffbot/i, name: 'Diffbot AI Extractor', category: 'AI Agent' },
  { regex: /Google-Favicon/i, name: 'Google Favicon Fetcher', category: 'Search Engine' },
  { regex: /Googlebot/i, name: 'Google Searchbot', category: 'Search Engine' },
  { regex: /bingbot/i, name: 'Bingbot (Microsoft/Copilot)', category: 'Search Engine' },
  { regex: /LinkedInBot/i, name: 'LinkedIn Card Bot', category: 'Social Crawler' },
  { regex: /Twitterbot|Xbot/i, name: 'Twitter/X Card Bot', category: 'Social Crawler' },
  { regex: /facebookexternalhit/i, name: 'Facebook/Instagram Link Preview', category: 'Social Crawler' },
  { regex: /WhatsApp/i, name: 'WhatsApp Link Preview', category: 'Social Crawler' }
];

export function detectClientBot(ua: string) {
  for (const rule of CLIENT_BOT_RULES) {
    if (rule.regex.test(ua)) {
      return { bot_name: rule.name, bot_category: rule.category as BotLogEntry['bot_category'] };
    }
  }
  return null;
}

const STORAGE_KEY = 'etromo_bot_logs';

export function getLocalBotLogs(): BotLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveLocalBotLog(entry: BotLogEntry) {
  try {
    const existing = getLocalBotLogs();
    const updated = [entry, ...existing.filter(e => e.id !== entry.id)].slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function trackCurrentVisitor() {
  if (typeof window === 'undefined') return;

  const ua = navigator.userAgent || '';
  const bot = detectClientBot(ua);

  // If detected bot or simulated query param
  const urlParams = new URLSearchParams(window.location.search);
  const simulatedBot = urlParams.get('bot');

  const botName = simulatedBot || (bot ? bot.bot_name : null);
  const botCategory = bot ? bot.bot_category : 'AI Agent';

  if (botName) {
    const newLog: BotLogEntry = {
      id: `client-${Date.now()}`,
      bot_name: botName,
      bot_category: botCategory,
      user_agent: ua,
      ip_address: 'Client Browser',
      path: window.location.pathname,
      method: 'GET',
      status_code: 200,
      referer: document.referrer || '',
      created_at: new Date().toISOString()
    };

    saveLocalBotLog(newLog);

    // Send to backend tracker
    try {
      fetch('/api/track/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAgent: ua,
          botName,
          category: botCategory,
          path: window.location.pathname,
          force: true
        })
      }).catch(() => {});
    } catch {}
  }
}
