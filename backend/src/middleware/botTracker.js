const db = require('../config/database');

// Known AI Agents, Crawlers, and Scrapers signatures
const BOT_RULES = [
  // ── AI AGENTS & LLM CRAWLERS ───────────────────────────────────────────
  { regex: /GPTBot/i, name: 'OpenAI GPTBot', category: 'AI Agent', provider: 'OpenAI' },
  { regex: /ChatGPT-User/i, name: 'ChatGPT Browsing', category: 'AI Agent', provider: 'OpenAI' },
  { regex: /OAI-SearchBot/i, name: 'SearchGPT Bot', category: 'AI Agent', provider: 'OpenAI' },
  { regex: /ClaudeBot/i, name: 'Anthropic ClaudeBot', category: 'AI Agent', provider: 'Anthropic' },
  { regex: /Claude-Web/i, name: 'Claude Web Agent', category: 'AI Agent', provider: 'Anthropic' },
  { regex: /anthropic-ai/i, name: 'Anthropic Crawler', category: 'AI Agent', provider: 'Anthropic' },
  { regex: /PerplexityBot/i, name: 'PerplexityBot', category: 'AI Agent', provider: 'Perplexity AI' },
  { regex: /Google-Extended/i, name: 'Google Gemini (Extended)', category: 'AI Agent', provider: 'Google AI' },
  { regex: /Applebot-Extended/i, name: 'Apple Intelligence', category: 'AI Agent', provider: 'Apple' },
  { regex: /Meta-ExternalAgent|Meta-ExternalFetcher/i, name: 'Meta AI Crawler', category: 'AI Agent', provider: 'Meta' },
  { regex: /Bytespider/i, name: 'ByteDance AI Spider', category: 'AI Agent', provider: 'ByteDance' },
  { regex: /CCBot/i, name: 'Common Crawl (LLM Foundation)', category: 'AI Agent', provider: 'Common Crawl' },
  { regex: /Cohere-ai/i, name: 'Cohere AI Bot', category: 'AI Agent', provider: 'Cohere' },
  { regex: /Diffbot/i, name: 'Diffbot AI Extractor', category: 'AI Agent', provider: 'Diffbot' },
  { regex: /YouBot/i, name: 'You.com AI Search', category: 'AI Agent', provider: 'You.com' },
  { regex: /Amazonbot/i, name: 'Amazon AI Bot', category: 'AI Agent', provider: 'Amazon' },
  { regex: /langchain|llama_index|llamaindex/i, name: 'LangChain / LLM Agent', category: 'AI Agent', provider: 'Autonomous Agent' },

  // ── SEARCH ENGINE CRAWLERS ─────────────────────────────────────────────
  { regex: /Google-Favicon/i, name: 'Google Favicon Fetcher', category: 'Search Engine', provider: 'Google' },
  { regex: /Googlebot-Image/i, name: 'Google Image Bot', category: 'Search Engine', provider: 'Google' },
  { regex: /Googlebot/i, name: 'Google Searchbot', category: 'Search Engine', provider: 'Google' },
  { regex: /GoogleOther/i, name: 'Google Other Crawler', category: 'Search Engine', provider: 'Google' },
  { regex: /Mediapartners-Google/i, name: 'Google AdSense Bot', category: 'Search Engine', provider: 'Google' },
  { regex: /bingbot/i, name: 'Bingbot (Microsoft/Copilot)', category: 'Search Engine', provider: 'Microsoft' },
  { regex: /BingPreview/i, name: 'Bing Preview Bot', category: 'Search Engine', provider: 'Microsoft' },
  { regex: /DuckDuckBot|DuckDuckGo/i, name: 'DuckDuckGo Bot', category: 'Search Engine', provider: 'DuckDuckGo' },
  { regex: /YandexBot/i, name: 'Yandex Searchbot', category: 'Search Engine', provider: 'Yandex' },
  { regex: /Baiduspider/i, name: 'Baidu Spider', category: 'Search Engine', provider: 'Baidu' },
  { regex: /Sogou/i, name: 'Sogou Spider', category: 'Search Engine', provider: 'Sogou' },
  { regex: /Applebot(?!-Extended)/i, name: 'Applebot (Siri & Spotlight)', category: 'Search Engine', provider: 'Apple' },

  // ── SOCIAL MEDIA PREVIEW BOTS ──────────────────────────────────────────
  { regex: /LinkedInBot/i, name: 'LinkedIn Card Bot', category: 'Social Crawler', provider: 'LinkedIn' },
  { regex: /Twitterbot|Xbot/i, name: 'Twitter/X Card Bot', category: 'Social Crawler', provider: 'X' },
  { regex: /facebookexternalhit|facebookcatalog/i, name: 'Facebook/Instagram Link Preview', category: 'Social Crawler', provider: 'Meta' },
  { regex: /WhatsApp/i, name: 'WhatsApp Link Preview', category: 'Social Crawler', provider: 'WhatsApp' },
  { regex: /TelegramBot/i, name: 'Telegram Link Preview', category: 'Social Crawler', provider: 'Telegram' },
  { regex: /Slackbot/i, name: 'Slack Link Preview', category: 'Social Crawler', provider: 'Slack' },
  { regex: /Discordbot/i, name: 'Discord Link Preview', category: 'Social Crawler', provider: 'Discord' },

  // ── DEVELOPER & PROGRAMMATIC AGENTS ────────────────────────────────────
  { regex: /python-requests|aiohttp|urllib/i, name: 'Python Programmatic Agent', category: 'Developer Agent', provider: 'Python' },
  { regex: /curl\//i, name: 'cURL Command Agent', category: 'Developer Agent', provider: 'cURL' },
  { regex: /Wget/i, name: 'GNU Wget Crawler', category: 'Developer Agent', provider: 'Wget' },
  { regex: /PostmanRuntime/i, name: 'Postman API Agent', category: 'Developer Agent', provider: 'Postman' },
  { regex: /Go-http-client/i, name: 'Go HTTP Client', category: 'Developer Agent', provider: 'Go' },
  { regex: /Scrapy/i, name: 'Scrapy Web Spider', category: 'Developer Agent', provider: 'Scrapy' }
];

// Helper: Match User-Agent
function detectBot(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return null;
  for (const rule of BOT_RULES) {
    if (rule.regex.test(userAgent)) {
      return {
        bot_name: rule.name,
        bot_category: rule.category,
        provider: rule.provider
      };
    }
  }
  return null;
}

// In-memory buffer to guarantee rapid dashboard updates
const recentMemoryLogs = [];
const MAX_MEMORY_LOGS = 300;

async function recordBotVisit({ bot_name, bot_category, user_agent, ip_address, path, method = 'GET', status_code = 200, referer = '' }) {
  const logItem = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    bot_name,
    bot_category,
    user_agent: (user_agent || '').substring(0, 500),
    ip_address: ip_address || '127.0.0.1',
    path: (path || '/').substring(0, 255),
    method: method || 'GET',
    status_code: status_code || 200,
    referer: (referer || '').substring(0, 255),
    created_at: new Date().toISOString()
  };

  // Add to in-memory buffer
  recentMemoryLogs.unshift(logItem);
  if (recentMemoryLogs.length > MAX_MEMORY_LOGS) {
    recentMemoryLogs.pop();
  }

  // Persist to DB asynchronously
  try {
    await db.run(
      `INSERT INTO bot_logs (bot_name, bot_category, user_agent, ip_address, path, method, status_code, referer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        logItem.bot_name,
        logItem.bot_category,
        logItem.user_agent,
        logItem.ip_address,
        logItem.path,
        logItem.method,
        logItem.status_code,
        logItem.referer
      ]
    );
  } catch (err) {
    // If table doesn't exist yet, it's captured in memory
  }

  return logItem;
}

// Express Middleware
const botTrackerMiddleware = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const bot = detectBot(userAgent);

    if (bot) {
      const clientIp = req.headers['x-forwarded-for'] 
        ? req.headers['x-forwarded-for'].split(',')[0].trim() 
        : (req.socket.remoteAddress || req.ip || '127.0.0.1');

      // Record visit asynchronously without blocking response
      recordBotVisit({
        bot_name: bot.bot_name,
        bot_category: bot.bot_category,
        user_agent: userAgent,
        ip_address: clientIp,
        path: req.originalUrl || req.url || '/',
        method: req.method,
        status_code: 200,
        referer: req.headers['referer'] || ''
      }).catch(() => {});
    }
  } catch (e) {
    // Do not disrupt normal traffic
  }
  next();
};

module.exports = {
  detectBot,
  recordBotVisit,
  botTrackerMiddleware,
  recentMemoryLogs,
  BOT_RULES
};
