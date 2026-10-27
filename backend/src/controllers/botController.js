const db = require('../config/database');
const { recordBotVisit, recentMemoryLogs, detectBot, BOT_RULES } = require('../middleware/botTracker');

// Pre-seeded demo logs if database is fresh
const INITIAL_DEMO_BOTS = [
  { bot_name: 'OpenAI GPTBot', bot_category: 'AI Agent', user_agent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)', path: '/', ip_address: '20.171.207.214' },
  { bot_name: 'Anthropic ClaudeBot', bot_category: 'AI Agent', user_agent: 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)', path: '/products', ip_address: '160.79.104.14' },
  { bot_name: 'PerplexityBot', bot_category: 'AI Agent', user_agent: 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)', path: '/case-studies', ip_address: '54.214.22.91' },
  { bot_name: 'Google Gemini (Extended)', bot_category: 'AI Agent', user_agent: 'Mozilla/5.0 (compatible; Google-Extended; +https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)', path: '/about', ip_address: '66.249.66.1' },
  { bot_name: 'Google Searchbot', bot_category: 'Search Engine', user_agent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', path: '/', ip_address: '66.249.79.13' },
  { bot_name: 'Google Favicon Fetcher', bot_category: 'Search Engine', user_agent: 'Mozilla/5.0 (compatible; Google-Favicon)', path: '/favicon.ico', ip_address: '66.249.90.45' },
  { bot_name: 'Bingbot (Microsoft/Copilot)', bot_category: 'Search Engine', user_agent: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)', path: '/resources', ip_address: '157.55.39.201' },
  { bot_name: 'LinkedIn Card Bot', bot_category: 'Social Crawler', user_agent: 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)', path: '/', ip_address: '108.174.1.20' },
  { bot_name: 'Twitter/X Card Bot', bot_category: 'Social Crawler', user_agent: 'Twitterbot/1.0', path: '/products', ip_address: '199.16.157.180' },
  { bot_name: 'WhatsApp Link Preview', bot_category: 'Social Crawler', user_agent: 'WhatsApp/2.23.20.10 A', path: '/contact', ip_address: '31.13.127.35' }
];

const getBotLogs = async (req, res) => {
  try {
    const { category, search, limit = 100 } = req.query;

    let rows = [];
    try {
      let query = 'SELECT * FROM bot_logs ORDER BY id DESC LIMIT ?';
      let params = [parseInt(limit, 10) || 100];

      if (category && category !== 'All') {
        query = 'SELECT * FROM bot_logs WHERE bot_category = ? ORDER BY id DESC LIMIT ?';
        params = [category, parseInt(limit, 10) || 100];
      }

      rows = await db.all(query, params);
    } catch {
      rows = [];
    }

    // Merge with recent memory logs to guarantee zero-delay updates
    const combined = [...recentMemoryLogs];
    for (const r of rows) {
      if (!combined.some(c => c.id === r.id)) {
        combined.push(r);
      }
    }

    // Fallback if completely empty
    if (combined.length === 0) {
      combined.push(...INITIAL_DEMO_BOTS.map((b, i) => ({
        id: `demo-${i + 1}`,
        bot_name: b.bot_name,
        bot_category: b.bot_category,
        user_agent: b.user_agent,
        ip_address: b.ip_address,
        path: b.path,
        method: 'GET',
        status_code: 200,
        referer: '',
        created_at: new Date(Date.now() - (i * 3600000)).toISOString()
      })));
    }

    // Apply filtering
    let filtered = combined;
    if (category && category !== 'All') {
      filtered = filtered.filter(l => l.bot_category === category);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(l => 
        (l.bot_name && l.bot_name.toLowerCase().includes(q)) ||
        (l.path && l.path.toLowerCase().includes(q)) ||
        (l.user_agent && l.user_agent.toLowerCase().includes(q)) ||
        (l.ip_address && l.ip_address.includes(q))
      );
    }

    // Sort descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ logs: filtered.slice(0, parseInt(limit, 10) || 100) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBotStats = async (req, res) => {
  try {
    let rows = [];
    try {
      rows = await db.all('SELECT * FROM bot_logs ORDER BY id DESC LIMIT 500');
    } catch {
      rows = [];
    }

    const allRecords = [...recentMemoryLogs];
    for (const r of rows) {
      if (!allRecords.some(c => c.id === r.id)) {
        allRecords.push(r);
      }
    }

    if (allRecords.length === 0) {
      allRecords.push(...INITIAL_DEMO_BOTS.map((b, i) => ({
        id: `demo-${i + 1}`,
        bot_name: b.bot_name,
        bot_category: b.bot_category,
        user_agent: b.user_agent,
        ip_address: b.ip_address,
        path: b.path,
        method: 'GET',
        status_code: 200,
        created_at: new Date(Date.now() - (i * 3600000)).toISOString()
      })));
    }

    const totalVisits = allRecords.length;
    const aiVisits = allRecords.filter(r => r.bot_category === 'AI Agent').length;
    const searchVisits = allRecords.filter(r => r.bot_category === 'Search Engine').length;
    const socialVisits = allRecords.filter(r => r.bot_category === 'Social Crawler').length;
    const devVisits = allRecords.filter(r => r.bot_category === 'Developer Agent').length;

    // Bot breakdown count
    const botCounts = {};
    const pathCounts = {};
    for (const r of allRecords) {
      botCounts[r.bot_name] = (botCounts[r.bot_name] || 0) + 1;
      const cleanPath = (r.path || '/').split('?')[0];
      pathCounts[cleanPath] = (pathCounts[cleanPath] || 0) + 1;
    }

    const topBots = Object.entries(botCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const latestAiVisit = allRecords.find(r => r.bot_category === 'AI Agent') || null;

    res.json({
      stats: {
        totalVisits,
        aiVisits,
        searchVisits,
        socialVisits,
        devVisits,
        topBots,
        topPages,
        latestAiVisit,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const simulateBotVisit = async (req, res) => {
  try {
    const { bot_name = 'OpenAI GPTBot', path = '/' } = req.body;

    const matchedRule = BOT_RULES.find(r => r.name.toLowerCase() === bot_name.toLowerCase()) || BOT_RULES[0];

    const simulatedUserAgents = {
      'OpenAI GPTBot': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
      'Anthropic ClaudeBot': 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
      'PerplexityBot': 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
      'Google Gemini (Extended)': 'Mozilla/5.0 (compatible; Google-Extended; +https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)',
      'Google Favicon Fetcher': 'Mozilla/5.0 (compatible; Google-Favicon)',
      'Google Searchbot': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Bingbot (Microsoft/Copilot)': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Apple Intelligence': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot-Extended/0.1)'
    };

    const ua = simulatedUserAgents[matchedRule.name] || `Mozilla/5.0 (compatible; ${matchedRule.name})`;
    const fakeIps = ['20.171.207.214', '160.79.104.14', '54.214.22.91', '66.249.66.1', '157.55.39.201', '108.174.1.20'];
    const randomIp = fakeIps[Math.floor(Math.random() * fakeIps.length)];

    const created = await recordBotVisit({
      bot_name: matchedRule.name,
      bot_category: matchedRule.category,
      user_agent: ua,
      ip_address: randomIp,
      path: path || '/',
      method: 'GET',
      status_code: 200,
      referer: 'https://etromo.in/'
    });

    res.json({ success: true, visit: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const clearBotLogs = async (req, res) => {
  try {
    recentMemoryLogs.length = 0;
    try {
      await db.run('DELETE FROM bot_logs');
    } catch {}
    res.json({ success: true, message: 'Bot logs cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Client-side beacon for SPA / edge bot ping
const publicTrackBot = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || req.body.userAgent || '';
    const bot = detectBot(userAgent);

    if (bot || req.body.force) {
      const clientIp = req.headers['x-forwarded-for'] 
        ? req.headers['x-forwarded-for'].split(',')[0].trim() 
        : (req.socket.remoteAddress || req.ip || '127.0.0.1');

      const log = await recordBotVisit({
        bot_name: bot ? bot.bot_name : (req.body.botName || 'Custom Agent'),
        bot_category: bot ? bot.bot_category : 'AI Agent',
        user_agent: userAgent,
        ip_address: clientIp,
        path: req.body.path || req.originalUrl || '/',
        method: req.method,
        status_code: 200,
        referer: req.headers['referer'] || ''
      });
      return res.json({ tracked: true, bot: log });
    }

    res.json({ tracked: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBotLogs,
  getBotStats,
  simulateBotVisit,
  clearBotLogs,
  publicTrackBot
};
