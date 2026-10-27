import { useState } from 'react';
import {
  Bot,
  Search,
  RefreshCw,
  Play,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Share2,
  Terminal,
  Activity
} from 'lucide-react';
import { getLocalBotLogs, saveLocalBotLog } from '../../utils/aiAgentTracker';
import type { BotLogEntry } from '../../utils/aiAgentTracker';

interface AiAgentTrackerStudioProps {
  logs: BotLogEntry[];
  stats?: any;
  onRefresh: () => void;
  token?: string | null;
}

export function AiAgentTrackerStudio({ logs, stats: _stats, onRefresh, token }: AiAgentTrackerStudioProps) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'rules'>('radar');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleCopyUA = (id: string | number, ua: string) => {
    navigator.clipboard.writeText(ua);
    setCopiedId(id);
    showNotice('User-Agent string copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulate = async (botName: string, path = '/') => {
    setSimulating(true);
    try {
      const res = await fetch('/api/admin/bot-simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ bot_name: botName, path })
      });

      if (res.ok) {
        showNotice(`Simulated visit from ${botName} to ${path}!`);
        onRefresh();
      } else {
        // Fallback to local simulated entry
        const fallbackEntry: BotLogEntry = {
          id: `sim-${Date.now()}`,
          bot_name: botName,
          bot_category: botName.includes('Googlebot') || botName.includes('Bing') || botName.includes('Favicon')
            ? 'Search Engine'
            : botName.includes('Card') || botName.includes('Preview')
            ? 'Social Crawler'
            : 'AI Agent',
          user_agent: `Mozilla/5.0 (compatible; ${botName}/1.0; +https://etromo.in/bot-info)`,
          ip_address: '160.79.104.' + Math.floor(Math.random() * 250),
          path,
          method: 'GET',
          status_code: 200,
          created_at: new Date().toISOString()
        };
        saveLocalBotLog(fallbackEntry);
        showNotice(`Simulated visit from ${botName} recorded locally!`);
        onRefresh();
      }
    } catch {
      // Local fallback
      const fallbackEntry: BotLogEntry = {
        id: `sim-${Date.now()}`,
        bot_name: botName,
        bot_category: 'AI Agent',
        user_agent: `Mozilla/5.0 (compatible; ${botName}/1.0; +https://etromo.in/bot-info)`,
        ip_address: '20.171.207.214',
        path,
        method: 'GET',
        status_code: 200,
        created_at: new Date().toISOString()
      };
      saveLocalBotLog(fallbackEntry);
      showNotice(`Simulated visit from ${botName} recorded locally!`);
      onRefresh();
    } finally {
      setSimulating(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear the AI & crawler log history?')) return;
    try {
      await fetch('/api/admin/bot-logs', {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch {}
    try {
      localStorage.removeItem('etromo_bot_logs');
    } catch {}
    showNotice('All bot activity logs have been cleared.');
    onRefresh();
  };

  // Merge server and local logs
  const localList = getLocalBotLogs();
  const mergedMap = new Map<string | number, BotLogEntry>();
  for (const l of [...logs, ...localList]) {
    mergedMap.set(l.id, l);
  }
  const allLogs = Array.from(mergedMap.values());
  allLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter logs
  const filteredLogs = allLogs.filter(l => {
    const matchesCat = categoryFilter === 'All' || l.bot_category === categoryFilter;
    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.bot_name && l.bot_name.toLowerCase().includes(q)) ||
      (l.path && l.path.toLowerCase().includes(q)) ||
      (l.user_agent && l.user_agent.toLowerCase().includes(q)) ||
      (l.ip_address && l.ip_address.includes(q))
    );
  });

  const totalHits = allLogs.length;
  const aiHits = allLogs.filter(l => l.bot_category === 'AI Agent').length;
  const searchHits = allLogs.filter(l => l.bot_category === 'Search Engine').length;
  const socialHits = allLogs.filter(l => l.bot_category === 'Social Crawler').length;
  const devHits = allLogs.filter(l => l.bot_category === 'Developer Agent').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Alert Notice */}
      {notice && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: 'rgba(20, 28, 45, 0.96)',
          border: '1px solid rgba(143, 193, 255, 0.3)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          borderRadius: '12px',
          padding: '14px 20px',
          color: '#fff',
          fontSize: '13px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <CheckCircle2 size={16} color="var(--sky)" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header & Live Radar Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>
              AI Agents &amp; Web Crawlers
            </h2>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              color: '#34D399',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.04em'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#34D399',
                display: 'inline-block',
                boxShadow: '0 0 8px #34D399'
              }} />
              RADAR ACTIVE
            </div>
          </div>
          <p style={{ opacity: 0.6, fontSize: '14px', margin: 0, maxWidth: '750px', lineHeight: '1.5' }}>
            Monitor in real-time when autonomous AI agents (OpenAI GPTBot, ClaudeBot, Perplexity, Google Gemini)
            and search crawlers access your pages, sitemap, and APIs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              padding: '9px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <RefreshCw size={14} /> Refresh Radar
          </button>
          <button
            onClick={handleClearLogs}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,80,80,0.08)',
              border: '1px solid rgba(255,80,80,0.2)',
              color: '#FF6B6B',
              padding: '9px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <Trash2 size={14} /> Clear History
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Agent Visits</span>
            <Bot size={18} color="#8FC1FF" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#8FC1FF' }}>{aiHits}</div>
          <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>GPTBot, Claude, Perplexity, Gemini</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search Crawlers</span>
            <Globe size={18} color="#A8FF78" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#A8FF78' }}>{searchHits}</div>
          <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>Googlebot, Google-Favicon, Bingbot</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social Card Bots</span>
            <Share2 size={18} color="#FFD97D" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFD97D' }}>{socialHits}</div>
          <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>LinkedIn, Twitter/X, WhatsApp</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Bot Traffic</span>
            <Activity size={18} color="#C2E9FB" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#C2E9FB' }}>{totalHits}</div>
          <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>
            {devHits > 0 ? `${devHits} Dev / CLI probes` : 'Across all pages & endpoints'}
          </div>
        </div>
      </div>

      {/* Simulator Test Strip */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(143,193,255,0.06) 0%, rgba(134,59,255,0.06) 100%)',
        border: '1px solid rgba(143,193,255,0.18)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--sky)" />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Simulate / Test Agent Inbound Traffic</span>
          </div>
          <span style={{ fontSize: '12px', opacity: 0.5 }}>Click any agent below to send an immediate live simulated probe:</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { name: 'OpenAI GPTBot', path: '/', color: '#10a37f' },
            { name: 'Anthropic ClaudeBot', path: '/products', color: '#d97706' },
            { name: 'PerplexityBot', path: '/case-studies', color: '#06b6d4' },
            { name: 'Google Gemini (Extended)', path: '/', color: '#4285f4' },
            { name: 'Google Favicon Fetcher', path: '/favicon.ico', color: '#ea4335' },
            { name: 'Google Searchbot', path: '/resources', color: '#fbbc05' },
            { name: 'LinkedIn Card Bot', path: '/', color: '#0a66c2' },
            { name: 'Twitter/X Card Bot', path: '/products', color: '#ffffff' },
          ].map(b => (
            <button
              key={b.name}
              disabled={simulating}
              onClick={() => handleSimulate(b.name, b.path)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 13px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '12px',
                cursor: simulating ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Play size={10} fill="currentColor" />
              <span>{b.name}</span>
              <code style={{ fontSize: '10px', opacity: 0.4 }}>{b.path}</code>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs between Live Stream & AI Crawl Policy */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('radar')}
          style={{
            background: activeTab === 'radar' ? 'rgba(143,193,255,0.15)' : 'transparent',
            border: 'none',
            color: activeTab === 'radar' ? 'var(--sky)' : 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          Live Agent Inbound Stream ({filteredLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          style={{
            background: activeTab === 'rules' ? 'rgba(143,193,255,0.15)' : 'transparent',
            border: 'none',
            color: activeTab === 'rules' ? 'var(--sky)' : 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          AI Crawler Permissions &amp; robots.txt Policies
        </button>
      </div>

      {activeTab === 'radar' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter and Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'AI Agent', 'Search Engine', 'Social Crawler', 'Developer Agent'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: categoryFilter === cat ? 'rgba(143,193,255,0.18)' : 'rgba(255,255,255,0.04)',
                    border: categoryFilter === cat ? '1px solid var(--sky)' : '1px solid rgba(255,255,255,0.08)',
                    color: categoryFilter === cat ? 'var(--sky)' : 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    fontWeight: categoryFilter === cat ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '11px', opacity: 0.4 }} />
              <input
                type="text"
                placeholder="Search bot, URL path, IP..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="modern-input"
                style={{ paddingLeft: '34px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Table of Inbound Bot Hits */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '14px 18px', fontWeight: '600', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
                    <th style={{ padding: '14px 18px', fontWeight: '600', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent / Bot</th>
                    <th style={{ padding: '14px 18px', fontWeight: '600', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                    <th style={{ padding: '14px 18px', fontWeight: '600', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Path</th>
                    <th style={{ padding: '14px 18px', fontWeight: '600', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IP Address</th>
                    <th style={{ padding: '14px 18px', fontWeight: '600', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '14px 18px', fontWeight: '600', opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>User-Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', opacity: 0.4 }}>
                        No agent activity records match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const timeStr = new Date(log.created_at).toLocaleString();
                      const isAi = log.bot_category === 'AI Agent';
                      const isSearch = log.bot_category === 'Search Engine';
                      const isSocial = log.bot_category === 'Social Crawler';

                      const badgeBg = isAi 
                        ? 'rgba(143,193,255,0.12)' 
                        : isSearch 
                        ? 'rgba(168,255,120,0.12)' 
                        : isSocial 
                        ? 'rgba(255,217,125,0.12)' 
                        : 'rgba(255,255,255,0.06)';
                      const badgeColor = isAi 
                        ? '#8FC1FF' 
                        : isSearch 
                        ? '#A8FF78' 
                        : isSocial 
                        ? '#FFD97D' 
                        : '#CBD5E1';

                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', opacity: 0.6, fontSize: '12px' }}>
                            {timeStr}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {isAi ? <Bot size={15} color="#8FC1FF" /> : isSearch ? <Globe size={15} color="#A8FF78" /> : <Share2 size={15} color="#FFD97D" />}
                              <span>{log.bot_name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: badgeBg,
                              color: badgeColor,
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {log.bot_category}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                            <code style={{
                              background: 'rgba(255,255,255,0.06)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '12px'
                            }}>
                              {log.path || '/'}
                            </code>
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', opacity: 0.6, fontFamily: 'monospace', fontSize: '12px' }}>
                            {log.ip_address || '127.0.0.1'}
                          </td>
                          <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                            <span style={{ color: '#34D399', fontWeight: '600', fontSize: '12px' }}>
                              {log.status_code || 200} OK
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => handleCopyUA(log.id, log.user_agent)}
                              title={log.user_agent}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: copiedId === log.id ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: copiedId === log.id ? '#34D399' : '#fff',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px'
                              }}
                            >
                              <Copy size={11} />
                              <span>{copiedId === log.id ? 'Copied' : 'Inspect UA'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* AI Crawl Permissions & robots.txt Inspector */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#34D399" />
              Active AI Crawler Access Policies
            </h3>
            <p style={{ opacity: 0.6, fontSize: '13px', marginBottom: '20px' }}>
              Your website is configured with explicit directives in <code>robots.txt</code> allowing search indexation and AI retrieval while securing admin routes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { bot: 'OpenAI GPTBot', purpose: 'OpenAI Web Model Search & Training', status: 'Allowed & Monitored' },
                { bot: 'ChatGPT-User', purpose: 'Live ChatGPT User Browsing (When users ask ChatGPT about Etromo)', status: 'Allowed & Monitored' },
                { bot: 'Anthropic ClaudeBot', purpose: 'Anthropic Claude AI Knowledge Retrieval', status: 'Allowed & Monitored' },
                { bot: 'PerplexityBot', purpose: 'Perplexity Conversational Search Engine', status: 'Allowed & Monitored' },
                { bot: 'Google-Extended', purpose: 'Google Gemini & Vertex AI Foundation Data', status: 'Allowed & Monitored' },
                { bot: 'Googlebot & Google-Favicon', purpose: 'Google Web Search, Snippets & Favicon Crawler', status: 'Allowed & Priority' },
                { bot: 'Applebot-Extended', purpose: 'Apple Intelligence Siri & Spotlight Services', status: 'Allowed & Monitored' },
                { bot: 'Meta-ExternalAgent', purpose: 'Meta AI & Llama Autonomous Crawler', status: 'Allowed & Monitored' }
              ].map(item => (
                <div key={item.bot} style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#fff' }}>{item.bot}</div>
                    <div style={{ fontSize: '11px', opacity: 0.5 }}>{item.purpose}</div>
                  </div>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(52,211,153,0.15)',
                    color: '#34D399',
                    fontSize: '11px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Public Endpoints &amp; Files</h3>
            <p style={{ opacity: 0.6, fontSize: '13px', margin: 0 }}>
              Verify your live public robots.txt, sitemap.xml, and favicon files directly in the browser:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'var(--sky)',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                <span>View Live <code>/robots.txt</code></span>
                <ExternalLink size={14} />
              </a>

              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'var(--sky)',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                <span>View Live <code>/sitemap.xml</code></span>
                <ExternalLink size={14} />
              </a>

              <a
                href="/favicon.ico"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'var(--sky)',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                <span>View Live <code>/favicon.ico</code></span>
                <ExternalLink size={14} />
              </a>

              <a
                href="/favicon-48x48.png"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'var(--sky)',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                <span>View Google Compliant <code>/favicon-48x48.png</code></span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiAgentTrackerStudio;
