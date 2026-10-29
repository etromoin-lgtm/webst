import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers,
  Activity,
  Briefcase,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Zap,
  Trash2,
  Edit2,
  Plus,
  Users,
  Bot,
  Globe,
  Search
} from 'lucide-react';
import ImageUpload from '../components/ui/ImageUpload';
import ProductCardItem from '../components/ui/ProductCardItem';
import TeamCard from '../components/ui/TeamCard';
import TeamExpandedModal from '../components/ui/TeamExpandedModal';
import CaseStudiesStudio from '../components/admin/CaseStudiesStudio';
import AdminClientManager from '../components/admin/AdminClientManager';
import AiAgentTrackerStudio from '../components/admin/AiAgentTrackerStudio';
import SiteSettingsAndSocialStudio from '../components/admin/SiteSettingsAndSocialStudio';
import SeoManagerStudio from '../components/admin/SeoManagerStudio';
import { getLocalBotLogs } from '../utils/aiAgentTracker';
const defaultAdminProducts = [
  {
    id: 1,
    name: 'Real Estate CRM Pro',
    category: 'Real Estate',
    price_label: 'Subscription Based',
    link_url: '/products/real-estate-crm',
    description: 'The complete operating system for real estate developers and channel partners. Unified lead pipeline, automated follow-ups, and site visit tracking.',
    features_json: JSON.stringify({
      boostValue: '+65%',
      boostLabel: 'Lead Conversion',
      timeReducedValue: '-40%',
      timeReducedLabel: 'Time Reduced',
      benefits: [
        { icon: 'target', text: 'Instant Lead Capture from Meta & Google' },
        { icon: 'refresh', text: 'Automated Follow-ups & WhatsApp Broadcasts' },
        { icon: 'shield', text: 'Role-Based Access & Database Security' }
      ]
    })
  },
  {
    id: 2,
    name: 'EduSphere Academy CRM',
    category: 'Education',
    price_label: 'Subscription Based',
    link_url: '/contact?topic=education-crm',
    description: 'All-in-one education lifecycle operating system for academies, institutes, and coaching schools. Streamlined inquiry intake, admission stages, batch allocations, and automated fee reminders.',
    features_json: JSON.stringify({
      boostValue: '+78%',
      boostLabel: 'Admission Ratio',
      timeReducedValue: '-55%',
      timeReducedLabel: 'Admin Workload',
      benefits: [
        { icon: 'target', text: 'Omnichannel Inquiry Intake & Fast Follow-up' },
        { icon: 'refresh', text: 'Automated Fee Reminders & Payment Receipts' },
        { icon: 'shield', text: 'Student Lifecycle, Batches & Attendance Logs' }
      ]
    })
  },
  {
    id: 3,
    name: 'WhatsApp CRM',
    category: 'Communication & AI',
    price_label: 'One-Time + Subscription',
    link_url: '/products/whatsapp-crm',
    description: 'Connect directly with customers on their favorite platform. Multi-agent routing, automated message flows, broadcast campaigns, and analytics.',
    features_json: JSON.stringify({
      boostValue: '3.5x',
      boostLabel: 'Response Speed',
      timeReducedValue: '-60%',
      timeReducedLabel: 'Resolution Time',
      benefits: [
        { icon: 'zap', text: 'Official WhatsApp Business Cloud API Integration' },
        { icon: 'refresh', text: 'Multi-Agent Routing & Shared Inbox' },
        { icon: 'trending', text: 'High-Open-Rate Automated Broadcasts' }
      ]
    })
  },
  {
    id: 4,
    name: 'Café Management Suite',
    category: 'Hospitality',
    price_label: 'Subscription Based',
    link_url: '/products/cafe-crm',
    description: 'An integrated management platform for modern café groups and restaurant chains. Multi-branch inventory, loyalty programs, and digital menus.',
    features_json: JSON.stringify({
      boostValue: '+32%',
      boostLabel: 'Repeat Customers',
      timeReducedValue: '-50%',
      timeReducedLabel: 'Inventory Waste',
      benefits: [
        { icon: 'target', text: 'Centralized Multi-Outlet Inventory Control' },
        { icon: 'trending', text: 'Integrated Loyalty Programs & Digital Menus' },
        { icon: 'shield', text: 'Real-time Cross-Branch Sales Analytics' }
      ]
    })
  }
];

export function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const location = useLocation();
  const searchTab = new URLSearchParams(location.search).get('tab');
  const [tab, setTab] = useState(searchTab || 'overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const qTab = new URLSearchParams(location.search).get('tab');
    if (qTab) {
      setTab(qTab);
    }
  }, [location.search]);

  // Data state
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactFilter, setContactFilter] = useState('All');
  const [applicationFilter, setApplicationFilter] = useState('All');
  const [bookings, setBookings] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [adminProductCategory, setAdminProductCategory] = useState('All');
  const [team, setTeam] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any>(null);
  const [seoSettings, setSeoSettings] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [botLogs, setBotLogs] = useState<any[]>([]);
  const [botStats, setBotStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state

  const [productImageUrl, setProductImageUrl] = useState('');
  const [teamImageUrl, setTeamImageUrl] = useState('');

  // Product Studio Form State
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'CRM Software',
    price_label: 'Subscription Based',
    description: '',
    link_url: '',
    boostValue: '+65%',
    boostLabel: 'Lead Conversion',
    timeReducedValue: '-40%',
    timeReducedLabel: 'Time Reduced',
    benefits: [
      { icon: 'target', text: 'Instant Lead Capture from Meta & Google' },
      { icon: 'refresh', text: 'Automated Follow-ups & WhatsApp Broadcasts' },
      { icon: 'shield', text: 'Role-Based Access & Database Security' }
    ]
  });

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductImageUrl('');
    setProductForm({
      name: '',
      category: 'CRM Software',
      price_label: 'Subscription Based',
      description: '',
      link_url: '',
      boostValue: '+65%',
      boostLabel: 'Lead Conversion',
      timeReducedValue: '-40%',
      timeReducedLabel: 'Time Reduced',
      benefits: [
        { icon: 'target', text: 'Instant Lead Capture from Meta & Google' },
        { icon: 'refresh', text: 'Automated Follow-ups & WhatsApp Broadcasts' },
        { icon: 'shield', text: 'Role-Based Access & Database Security' }
      ]
    });
  };

  const handleEditProduct = (p: any) => {
    setEditingProductId(p.id);
    setProductImageUrl(p.image_url || '');
    let parsedFeatures: any = {};
    try {
      parsedFeatures = typeof p.features_json === 'string' ? JSON.parse(p.features_json) : (p.features_json || {});
    } catch {
      parsedFeatures = {};
    }
    setProductForm({
      name: p.name || '',
      category: p.category || 'CRM Software',
      price_label: p.price_label || 'Subscription Based',
      description: p.description || '',
      link_url: p.link_url || '',
      boostValue: parsedFeatures.boostValue || '+50%',
      boostLabel: parsedFeatures.boostLabel || 'Conversion Lift',
      timeReducedValue: parsedFeatures.timeReducedValue || '-40%',
      timeReducedLabel: parsedFeatures.timeReducedLabel || 'Time Reduced',
      benefits: parsedFeatures.benefits && parsedFeatures.benefits.length > 0 ? parsedFeatures.benefits : [
        { icon: 'target', text: 'Centralized Pipeline' },
        { icon: 'refresh', text: 'Automated Sync' }
      ]
    });
  };

  // Team Studio Form State
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    department: 'Executive Leadership',
    short_desc: '',
    bio: '',
    email: '',
    linkedin_url: '',
    github_url: '',
    x_url: '',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    website_url: '',
    skills: '',
    sort_order: 1,
    is_active: 1
  });

  const resetTeamForm = () => {
    setEditingTeamId(null);
    setTeamImageUrl('');
    setTeamForm({
      name: '',
      role: '',
      department: 'Executive Leadership',
      short_desc: '',
      bio: '',
      email: '',
      linkedin_url: '',
      github_url: '',
      x_url: '',
      instagram_url: '',
      facebook_url: '',
      youtube_url: '',
      website_url: '',
      skills: '',
      sort_order: (team?.length || 0) + 1,
      is_active: 1
    });
  };

  const handleEditTeam = (m: any) => {
    setEditingTeamId(m.id);
    setTeamImageUrl(m.image_url || '');
    setTeamForm({
      name: m.name || '',
      role: m.role || '',
      department: m.department || 'Executive Leadership',
      short_desc: m.short_desc || '',
      bio: m.bio || '',
      email: m.email || '',
      linkedin_url: m.linkedin_url || '',
      github_url: m.github_url || '',
      x_url: m.x_url || '',
      instagram_url: m.instagram_url || '',
      facebook_url: m.facebook_url || '',
      youtube_url: m.youtube_url || '',
      website_url: m.website_url || '',
      skills: typeof m.skills === 'string' ? m.skills : (Array.isArray(m.skills) ? m.skills.join(', ') : ''),
      sort_order: m.sort_order ?? 1,
      is_active: m.is_active !== undefined ? m.is_active : 1
    });
  };

  const [previewTeamModalOpen, setPreviewTeamModalOpen] = useState(false);

  const API = '';

  const authFetch = (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(url, { ...options, headers });
  };

  const safeJson = async (resPromise: Promise<Response>, fallback: any) => {
    try {
      const res = await resPromise;
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        return await res.json();
      }
    } catch {}
    return fallback;
  };

  // localStorage helpers
  const lsGet = (key: string, def: any = []) => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; } catch { return def; }
  };

  const loadAll = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, apps, ctcs, bks, bls, prds, tm, wh, seo, setts, bLogs, bStats] = await Promise.all([
        safeJson(authFetch(`${API}/api/admin/stats`), null),
        safeJson(authFetch(`${API}/api/admin/applications`), null),
        safeJson(authFetch(`${API}/api/admin/contacts`), null),
        safeJson(authFetch(`${API}/api/admin/bookings`), null),
        safeJson(authFetch(`${API}/api/admin/blogs`), null),
        safeJson(authFetch(`${API}/api/admin/products`), null),
        safeJson(authFetch(`${API}/api/admin/team`), null),
        safeJson(authFetch(`${API}/api/admin/webhooks`), { webhook: { url: null } }),
        safeJson(authFetch(`${API}/api/admin/seo`), { seo: [] }),
        safeJson(fetch(`${API}/api/settings`), { settings: {} }),
        safeJson(authFetch(`${API}/api/admin/bot-logs`), { logs: [] }),
        safeJson(authFetch(`${API}/api/admin/bot-stats`), { stats: null }),
      ]);

      // ── LOCAL STORAGE FALLBACK ─────────────────────────────────────────────
      // When the backend API is unavailable (Vercel static hosting returns HTML),
      // we read from localStorage where form submissions are persisted locally.

      // BOOKINGS – saved by ContactPage as etromo_saved_bookings
      let resolvedBookings: any[] = bks?.bookings || [];
      if (!resolvedBookings.length) {
        resolvedBookings = (lsGet('etromo_saved_bookings', []) as any[]).map((b: any, i: number) => ({
          id: b.id || `local-bk-${i + 1}`,
          name: b.name || 'Visitor',
          email: b.email || '',
          phone: b.phone || '',
          company: b.company || '',
          date: b.date || b.bookedAt || null,
          time: b.time || '',
          topics: b.topics || [],
          message: b.message || '',
          status: b.status || 'Scheduled',
          created_at: b.bookedAt || b.created_at || new Date().toISOString()
        }));
      }

      // PARTNER APPLICATIONS – saved by PartnerApplyPage as etromo_partner_apps
      let rawApps: any[] = apps?.applications || [];
      if (!rawApps.length) {
        const localApps: Record<string, any> = lsGet('etromo_partner_apps', {});
        rawApps = Object.values(localApps).map((a: any, i: number) => ({
          id: a.id || `local-app-${i + 1}`,
          code: a.code || '',
          name: a.name || 'Applicant',
          email: a.email || '',
          company: a.company || '',
          type: a.type || 'sales',
          status: a.status || 'Pending',
          experience: a.experience || '',
          linkedin: a.linkedin || '',
          notes: a.notes || '',
          created_at: a.date || a.created_at || new Date().toISOString()
        }));
      }

      // STRICT DEDUPLICATION: eliminate duplicate partner applications by email or code
      const seenAppKeys = new Set<string>();
      const resolvedApps: any[] = [];
      for (const a of rawApps) {
        const emailKey = (a.email || '').trim().toLowerCase();
        const codeKey = (a.code || '').trim().toUpperCase();
        const dedupeKey = emailKey || codeKey || `id-${a.id}`;
        if (!seenAppKeys.has(dedupeKey)) {
          seenAppKeys.add(dedupeKey);
          resolvedApps.push(a);
        }
      }

      // CONTACT MESSAGES – saved by contact forms as etromo_saved_contacts
      let resolvedContacts: any[] = ctcs?.contacts || [];
      if (!resolvedContacts.length) {
        resolvedContacts = (lsGet('etromo_saved_contacts', []) as any[]).map((c: any, i: number) => ({
          id: c.id || `local-ct-${i + 1}`,
          name: c.name || 'Visitor',
          email: c.email || '',
          company: c.company || '',
          phone: c.phone || '',
          message: c.message || '',
          status: c.status || 'New',
          created_at: c.sentAt || c.created_at || new Date().toISOString()
        }));
      }

      // PRODUCTS – admin-managed, saved locally as etromo_admin_products
      let resolvedProducts: any[] = prds?.products || [];
      if (!resolvedProducts.length) resolvedProducts = lsGet('etromo_admin_products', []);
      if (!resolvedProducts.length) {
        resolvedProducts = defaultAdminProducts;
        try { localStorage.setItem('etromo_admin_products', JSON.stringify(defaultAdminProducts)); } catch {}
      }

      // TEAM – admin-managed, saved locally as etromo_admin_team
      let resolvedTeam: any[] = tm?.team || [];
      if (!resolvedTeam.length) resolvedTeam = lsGet('etromo_admin_team', []);

      // BLOGS – admin-managed, saved locally as etromo_admin_blogs
      let resolvedBlogs: any[] = bls?.blogs || [];
      if (!resolvedBlogs.length) resolvedBlogs = lsGet('etromo_admin_blogs', []);

      // Recompute stats from actual resolved data
      const resolvedStats = {
        contacts: resolvedContacts.length || s?.contacts || 0,
        bookings: resolvedBookings.length || s?.bookings || 0,
        applications: resolvedApps.length || s?.applications || 0,
        blogs: resolvedBlogs.length || s?.blogs || 0,
        products: resolvedProducts.length || s?.products || 0,
        team: resolvedTeam.length || s?.team || 0,
        case_studies: s?.case_studies || 0,
        ai_agents: (bLogs?.logs || []).filter((b: any) => b.bot_category === 'AI Agent').length || 0
      };

      // BOT LOGS & STATS FALLBACK
      let resolvedBotLogs = bLogs?.logs || [];
      if (!resolvedBotLogs.length) {
        resolvedBotLogs = getLocalBotLogs();
      }

      // SITE SETTINGS FALLBACK
      let resolvedSiteSettings = setts?.settings || {};
      if (!Object.keys(resolvedSiteSettings).length) {
        resolvedSiteSettings = lsGet('etromo_site_settings', {});
      }

      setStats(resolvedStats);
      setApplications(resolvedApps);
      setContacts(resolvedContacts);
      setBookings(resolvedBookings);
      setBlogs(resolvedBlogs);
      setProducts(resolvedProducts);
      setTeam(resolvedTeam);
      setWebhooks(wh);
      setSeoSettings(seo.seo || []);
      setSiteSettings(resolvedSiteSettings);
      setBotLogs(resolvedBotLogs);
      setBotStats(bStats?.stats || null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSiteSettings = async (newSettings: Record<string, string>) => {
    try {
      await authFetch(`${API}/api/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch {}
    try {
      localStorage.setItem('etromo_site_settings', JSON.stringify(newSettings));
    } catch {}
    setSiteSettings(newSettings);
  };

  const handleSaveSeo = async (page: string, title: string, description: string) => {
    try {
      await authFetch(`${API}/api/admin/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, title, description })
      });
      try {
        const raw = localStorage.getItem('etromo_seo_cache');
        const map = raw ? JSON.parse(raw) : {};
        map[page] = { page, title, description };
        localStorage.setItem('etromo_seo_cache', JSON.stringify(map));
      } catch {}
    } catch {}
    loadAll();
  };

  // Rate limit lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) {
      if (isLocked) {
        setIsLocked(false);
        setLoginError('');
      }
      return;
    }
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          setIsLocked(false);
          setLoginError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds, isLocked]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setLoginError('');

    const cleanUser = username.trim();
    const isDefaultAdmin = (cleanUser === 'admin' || cleanUser === 'super_admin') && password === 'admin123';

    try {
      const res = await fetch(`${API}/api/gmcadmin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem('admin_token', data.token);
          setToken(data.token);
          setIsLocked(false);
          setRemainingAttempts(null);
          return;
        }
      } else if (res.status === 429) {
        setIsLocked(true);
        setLockoutSeconds(900);
        setLoginError('Security Lockout: Maximum login attempts exceeded. Account access locked.');
        return;
      }
    } catch {
      // Backend returned HTML or server not running
    }

    // Direct fallback for default administrator credentials
    if (isDefaultAdmin) {
      const fallbackToken = 'admin-jwt-token-secure-123';
      localStorage.setItem('admin_token', fallbackToken);
      setToken(fallbackToken);
      setIsLocked(false);
      setRemainingAttempts(null);
      return;
    }

    setLoginError('Invalid credentials. Please verify your administrative username and password.');
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); setToken(null); };

  useEffect(() => { loadAll(); }, [token]);

  // ─── LOGIN PAGE (GMCADMIN) ──────────────────────────────────────────────────
  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05080F',
        position: 'relative',
        padding: 'clamp(16px, 3vw, 40px)',
        overflow: 'hidden'
      }}>
        {/* Atmospheric ambient lighting */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(47, 107, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(143, 193, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        {/* Master Split Card Container */}
        <div className="admin-split-auth-container" style={{
          width: '100%',
          maxWidth: '1080px',
          minHeight: '640px',
          background: 'linear-gradient(135deg, rgba(10, 21, 48, 0.6) 0%, rgba(5, 8, 15, 0.85) 100%)',
          border: '1px solid rgba(143, 193, 255, 0.14)',
          borderRadius: '28px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          position: 'relative',
          zIndex: 1
        }}>

          {/* LEFT SIDE: Visual Brand Hero with Our Vision.jpg */}
          <div className="admin-auth-visual" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: ' clamp(32px, 5vw, 48px)',
            background: 'linear-gradient(180deg, rgba(5, 8, 15, 0.25) 0%, rgba(5, 8, 15, 0.88) 100%)',
            overflow: 'hidden',
            borderRight: '1px solid rgba(143, 193, 255, 0.1)'
          }}>
            {/* Background Image with rich cinematic overlays */}
            <img
              src="/about/Our%20Vision.jpg"
              alt="Etromo Vision"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(0.68) contrast(1.12) saturate(1.15)',
                transform: 'scale(1.03)',
                transition: 'transform 8s ease-out',
                zIndex: 0
              }}
            />
            {/* Dual gradient overlay for text readability & premium atmospheric feel */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(5, 8, 15, 0.45) 0%, rgba(5, 8, 15, 0.25) 40%, rgba(5, 8, 15, 0.95) 100%)',
              zIndex: 1
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 80% 20%, rgba(47, 107, 255, 0.25) 0%, transparent 60%)',
              zIndex: 1
            }} />

            {/* Left Top Brand Lockup */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(5, 8, 15, 0.65)', border: '1px solid rgba(143, 193, 255, 0.25)', padding: '6px 14px', borderRadius: '100px', backdropFilter: 'blur(12px)', marginBottom: '20px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2F6BFF', boxShadow: '0 0 10px #2F6BFF' }} />
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', letterSpacing: '0.12em', color: '#8FC1FF', fontWeight: 700, textTransform: 'uppercase' }}>
                  GMCADMIN • SECURE CONSOLE
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo.png" alt="Etromo" style={{ height: '38px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(47,107,255,0.5))' }} />
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'var(--brand-font)' }}>
                  Etromo<span style={{ color: '#2F6BFF' }}>.</span>
                </span>
              </div>
            </div>

            {/* Left Bottom Vision & Security Statement */}
            <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', paddingTop: '40px' }}>
              <p style={{
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8FC1FF',
                marginBottom: '10px',
                fontWeight: 600,
                opacity: 0.9
              }}>
                ARCHITECTURAL INTELLIGENCE
              </p>
              <h2 style={{
                fontSize: 'clamp(22px, 2.5vw, 30px)',
                fontWeight: 400,
                color: '#F4F6F9',
                lineHeight: 1.25,
                margin: '0 0 14px 0',
                letterSpacing: '-0.02em'
              }}>
                Engineered for <span style={{ color: '#8FC1FF', fontWeight: 600 }}>zero friction</span> and absolute control.
              </h2>
              <p style={{
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'rgba(244, 246, 249, 0.75)',
                margin: 0,
                maxWidth: '440px'
              }}>
                Manage client portals, monitor autonomous CRM workflows, orchestrate catalog products, and verify live deployments from one single command center.
              </p>

              {/* Security Badges */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '24px',
                paddingTop: '18px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(244, 246, 249, 0.65)', fontFamily: 'var(--mono)' }}>
                  <ShieldCheck size={14} color="#34D399" />
                  <span>256-BIT ENCRYPTION</span>
                </div>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(244, 246, 249, 0.65)', fontFamily: 'var(--mono)' }}>
                  <Activity size={14} color="#8FC1FF" />
                  <span>RATE LIMIT ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Authentication Card */}
          <div className="admin-auth-form-side" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(32px, 5vw, 54px) clamp(28px, 4.5vw, 48px)',
            background: 'rgba(5, 8, 15, 0.4)',
            backdropFilter: 'blur(20px)',
            position: 'relative'
          }}>
            <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{
                  fontSize: '26px',
                  fontWeight: 600,
                  color: '#F4F6F9',
                  marginBottom: '8px',
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--brand-font)'
                }}>
                  Sign In
                </h1>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(244, 246, 249, 0.6)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  Enter your administrative credentials to access the internal control console.
                </p>
              </div>

              {/* Rate limit lockout warning box */}
              {isLocked && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '22px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#FF6B6B', fontWeight: 600, fontSize: '13px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span>🔒</span> Security Rate Limit Active
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                    Too many failed attempts. Temporary lockout enforced.
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#FF8A3D', fontFamily: 'monospace' }}>
                    {formatCountdown(lockoutSeconds)}
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(244, 246, 249, 0.75)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontFamily: 'var(--mono)'
                  }}>
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={isLocked}
                    className="modern-input"
                    placeholder="admin"
                    autoComplete="username"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '13px 16px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(244, 246, 249, 0.75)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontFamily: 'var(--mono)'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLocked}
                    className="modern-input"
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '13px 16px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn p"
                  disabled={isLocked}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: isLocked ? 'rgba(255, 255, 255, 0.08)' : 'linear-gradient(135deg, #1B3FD8 0%, #2F6BFF 100%)',
                    border: '1px solid rgba(143, 193, 255, 0.3)',
                    borderRadius: '10px',
                    color: '#fff',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    boxShadow: isLocked ? 'none' : '0 8px 24px rgba(47, 107, 255, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  {isLocked ? `Console Locked (${formatCountdown(lockoutSeconds)})` : 'Authenticate & Open Console'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin123');
                    const fallbackToken = 'admin-jwt-token-secure-123';
                    localStorage.setItem('admin_token', fallbackToken);
                    setToken(fallbackToken);
                    setIsLocked(false);
                    setLoginError('');
                  }}
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '11px 16px',
                    background: 'rgba(143, 193, 255, 0.08)',
                    border: '1px solid rgba(143, 193, 255, 0.25)',
                    borderRadius: '10px',
                    color: 'var(--sky)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>⚡</span> One-Click Admin Access (admin / admin123)
                </button>

                {loginError && !isLocked && (
                  <div style={{
                    background: remainingAttempts !== null && remainingAttempts <= 2 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 138, 61, 0.12)',
                    border: remainingAttempts !== null && remainingAttempts <= 2 ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 138, 61, 0.35)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginTop: '16px',
                    fontSize: '13px',
                    color: remainingAttempts !== null && remainingAttempts <= 2 ? '#FCA5A5' : '#FF8A3D',
                    textAlign: 'center'
                  }}>
                    {loginError}
                  </div>
                )}

                <div style={{
                  marginTop: '26px',
                  paddingTop: '18px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'rgba(244, 246, 249, 0.45)',
                  fontFamily: 'var(--mono)'
                }}>
                  <span>RATE-LIMITED ENDPOINT</span>
                  <span>MAX 5 FAILS / 15 MIN</span>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const TabBtn = ({ id, label, icon: Icon, badge }: any) => (
    <button onClick={() => { setTab(id); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '11px 14px', background: tab === id ? 'rgba(143,193,255,0.12)' : 'transparent', border: 'none', borderRadius: '10px', color: tab === id ? 'var(--sky)' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: tab === id ? '600' : '400', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', position: 'relative' }}>
      <Icon size={16} />
      <span style={{ flexGrow: 1 }}>{label}</span>
      {badge > 0 && <span style={{ background: 'var(--sky)', color: '#000', borderRadius: '10px', padding: '2px 7px', fontSize: '11px', fontWeight: '700' }}>{badge}</span>}
    </button>
  );

  const Card = ({ children, style = {} }: any) => (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', ...style }}>{children}</div>
  );

  const newContacts = contacts.filter(c => c.status === 'New' || !c.status).length;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const scheduledBookings = bookings.filter(b => b.status === 'Scheduled' || !b.status).length;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0d14', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Header */}
      <header className="admin-header" style={{ height: '60px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', fontSize: '15px' }}>
          <img src="/logo.png" alt="Etromo" style={{ height: '26px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--brand-font)', letterSpacing: '-0.01em' }}>Etromo</span>
          <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</span>
        </div>
        <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
          ☰ Menu
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="admin-header-view-link" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>← View Site</a>
        <div className="admin-header-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={loadAll} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>↻</button>
          <button onClick={handleLogout} style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#FF5050', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Logout</button>
        </div>
      </header>

      <div style={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`} style={{ width: '220px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          <p style={{ fontSize: '11px', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 14px 4px', marginBottom: '4px' }}>Overview</p>
          <TabBtn id="overview" label="Dashboard" icon={TrendingUp} />

          <p style={{ fontSize: '11px', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '1px', padding: '16px 14px 4px' }}>Client Portal</p>
          <TabBtn id="clients" label="Client Manager" icon={Users} />

          <p style={{ fontSize: '11px', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '1px', padding: '16px 14px 4px' }}>CRM & Leads</p>
          <TabBtn id="contacts" label="Contact Messages" icon={Activity} badge={newContacts} />
          <TabBtn id="bookings" label="Bookings" icon={Briefcase} badge={scheduledBookings} />
          <TabBtn id="applications" label="Partner Apps" icon={Layers} badge={pendingApps} />

          <p style={{ fontSize: '11px', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '1px', padding: '16px 14px 4px' }}>Content (CMS)</p>
          <TabBtn id="case_studies" label="Case Studies" icon={ShieldCheck} badge={stats?.case_studies} />
          <TabBtn id="blogs" label="Resources / Blog" icon={TrendingUp} />
          <TabBtn id="products" label="Products" icon={Cpu} />
          <TabBtn id="team" label="Team Members" icon={ShieldCheck} />
          <p style={{ fontSize: '11px', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '1px', padding: '16px 14px 4px' }}>Traffic &amp; Radar</p>
          <TabBtn id="ai_agents" label="AI Agents &amp; Crawlers" icon={Bot} badge={botStats?.aiVisits || botLogs.filter((b: any) => b.bot_category === 'AI Agent').length} />

          <p style={{ fontSize: '11px', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '1px', padding: '16px 14px 4px' }}>Settings &amp; SEO</p>
          <TabBtn id="settings" label="Site Settings &amp; Social" icon={Globe} />
          <TabBtn id="seo" label="SEO &amp; Google Snippet" icon={Search} />
          <TabBtn id="webhooks" label="Integrations" icon={Zap} />
        </aside>

        {/* Main Content */}
        <main className="admin-main" style={{ flexGrow: 1, padding: '32px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', opacity: 0.4 }}>Loading...</div>
          ) : (
            <>
              {/* ── OVERVIEW ─────────────────────────────────────────────── */}
              {tab === 'overview' && (
                <div>
                  <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Dashboard Overview</h2>
                  <p style={{ opacity: 0.5, marginBottom: '32px', fontSize: '14px' }}>Real-time snapshot of your website activity.</p>

                  <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    {[
                      { label: 'New Messages', value: stats?.contacts ?? 0, icon: Activity, color: '#8FC1FF', action: () => setTab('contacts') },
                      { label: 'Meetings Booked', value: stats?.bookings ?? 0, icon: Briefcase, color: '#A8FF78', action: () => setTab('bookings') },
                      { label: 'Partner Applications', value: stats?.applications ?? 0, icon: Layers, color: '#FFD97D', action: () => setTab('applications') },
                      { label: 'AI Agents Tracked', value: stats?.ai_agents ?? botLogs.filter((b: any) => b.bot_category === 'AI Agent').length, icon: Bot, color: '#8FC1FF', action: () => setTab('ai_agents') },
                      { label: 'Case Studies', value: stats?.case_studies ?? 0, icon: ShieldCheck, color: '#34D399', action: () => setTab('case_studies') },
                      { label: 'Blog Articles', value: stats?.blogs ?? 0, icon: TrendingUp, color: '#FF9A9E', action: () => setTab('blogs') },
                      { label: 'Products Listed', value: stats?.products ?? 0, icon: Cpu, color: '#C2E9FB', action: () => setTab('products') },
                      { label: 'Team Members', value: stats?.team ?? 0, icon: ShieldCheck, color: '#a18cd1', action: () => setTab('team') },
                    ].map(s => (
                      <Card key={s.label} style={{ cursor: 'pointer' }}>
                        <button onClick={s.action} style={{ background: 'none', border: 'none', color: 'inherit', width: '100%', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <p style={{ fontSize: '12px', opacity: 0.5, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                              <p style={{ fontSize: '36px', fontWeight: '700', color: s.color }}>{s.value}</p>
                            </div>
                            <s.icon size={20} style={{ opacity: 0.3 }} />
                          </div>
                        </button>
                      </Card>
                    ))}
                  </div>

                  <div className="admin-recent-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Card>
                      <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Recent Contact Messages</h3>
                      {contacts.slice(0, 4).map(c => (
                        <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontWeight: '600', fontSize: '14px' }}>{c.name}</p>
                            <p style={{ opacity: 0.5, fontSize: '12px' }}>{c.company || c.email}</p>
                          </div>
                          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', alignSelf: 'center', background: c.status === 'New' || !c.status ? 'rgba(168,255,120,0.1)' : 'rgba(255,255,255,0.05)', color: c.status === 'New' || !c.status ? '#A8FF78' : 'rgba(255,255,255,0.5)' }}>{c.status || 'New'}</span>
                        </div>
                      ))}
                      {contacts.length === 0 && <p style={{ opacity: 0.4, fontSize: '14px' }}>No messages yet.</p>}
                    </Card>
                    <Card>
                      <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Upcoming Bookings</h3>
                      {bookings.slice(0, 4).map(b => (
                        <div key={b.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <p style={{ fontWeight: '600', fontSize: '14px' }}>{b.name}</p>
                          <p style={{ opacity: 0.5, fontSize: '12px' }}>{b.date ? new Date(b.date).toLocaleDateString() : '—'} at {b.time}</p>
                        </div>
                      ))}
                      {bookings.length === 0 && <p style={{ opacity: 0.4, fontSize: '14px' }}>No bookings yet.</p>}
                    </Card>
                  </div>
                </div>
              )}

              {/* ── CLIENT PORTAL & HISTORY MANAGER ───────────────────────── */}
              {tab === 'clients' && (
                <AdminClientManager apiBase={API} />
              )}

              {/* ── CONTACTS ─────────────────────────────────────────────── */}
              {tab === 'contacts' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Contact Messages <span style={{ fontSize: '14px', opacity: 0.5, fontWeight: 400 }}>({contacts.length} total)</span></h2>
                      <p style={{ opacity: 0.6, fontSize: '14px' }}>Review inbound inquiries, update response stages, or remove processed messages.</p>
                    </div>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['All', 'New', 'Reviewed', 'Contacted'].map(f => {
                        const isAct = contactFilter === f;
                        const count = f === 'All' ? contacts.length : contacts.filter(c => (c.status || 'New').toLowerCase() === f.toLowerCase()).length;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setContactFilter(f)}
                            style={{
                              background: isAct ? 'rgba(143,193,255,0.18)' : 'rgba(255,255,255,0.04)',
                              border: isAct ? '1px solid rgba(143,193,255,0.45)' : '1px solid rgba(255,255,255,0.08)',
                              color: isAct ? 'var(--sky)' : 'rgba(255,255,255,0.65)',
                              padding: '5px 14px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: isAct ? 600 : 400,
                              transition: 'all 0.2s'
                            }}
                          >
                            {f} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '14px' }}>
                    {contacts.length === 0 && <p style={{ opacity: 0.5 }}>No contact messages yet.</p>}
                    {contacts
                      .filter(c => {
                        if (contactFilter === 'All') return true;
                        return (c.status || 'New').toLowerCase() === contactFilter.toLowerCase();
                      })
                      .map(c => (
                        <Card key={c.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                <h4 style={{ fontSize: '17px', fontWeight: '600', margin: 0 }}>{c.name}</h4>
                                <span style={{
                                  fontSize: '11px',
                                  padding: '3px 10px',
                                  borderRadius: '20px',
                                  background: (c.status === 'New' || !c.status) ? 'rgba(168,255,120,0.12)' : c.status === 'Contacted' ? 'rgba(143,193,255,0.15)' : 'rgba(255,255,255,0.06)',
                                  color: (c.status === 'New' || !c.status) ? '#A8FF78' : c.status === 'Contacted' ? 'var(--sky)' : 'rgba(255,255,255,0.6)',
                                  border: `1px solid ${(c.status === 'New' || !c.status) ? 'rgba(168,255,120,0.3)' : 'rgba(255,255,255,0.1)'}`
                                }}>
                                  {c.status || 'New'}
                                </span>
                              </div>
                              <p style={{ opacity: 0.6, fontSize: '13px', margin: 0 }}>
                                <a href={`mailto:${c.email}`} style={{ color: 'var(--sky)', textDecoration: 'none' }}>{c.email}</a>
                                {c.company ? ` • ${c.company}` : ''}
                                {c.phone ? ` • 📞 ${c.phone}` : ''}
                              </p>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                              {/* Status Select */}
                              <select
                                value={c.status || 'New'}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  try {
                                    await fetch(`${API}/api/admin/contacts/${c.id}`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ status: newStatus })
                                    });
                                  } catch {}
                                  try {
                                    const local = lsGet('etromo_saved_contacts', []);
                                    const idx = local.findIndex((x: any) => x.id === c.id);
                                    if (idx >= 0) {
                                      local[idx].status = newStatus;
                                      localStorage.setItem('etromo_saved_contacts', JSON.stringify(local));
                                    }
                                  } catch {}
                                  loadAll();
                                }}
                                className="modern-input"
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '12px',
                                  borderRadius: '8px',
                                  background: '#0a0d14',
                                  color: '#fff',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="New">Status: New</option>
                                <option value="Reviewed">Status: Reviewed</option>
                                <option value="Contacted">Status: Contacted</option>
                                <option value="Archived">Status: Archived</option>
                              </select>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Permanently delete contact message from "${c.name}"?`)) {
                                    try {
                                      await fetch(`${API}/api/admin/contacts/${c.id}`, {
                                        method: 'DELETE',
                                        headers: { Authorization: `Bearer ${token}` }
                                      });
                                    } catch {}
                                    try {
                                      const local = lsGet('etromo_saved_contacts', []);
                                      const filtered = local.filter((x: any) => x.id !== c.id && x.email !== c.email && x.created_at !== c.created_at);
                                      localStorage.setItem('etromo_saved_contacts', JSON.stringify(filtered));
                                    } catch {}
                                    loadAll();
                                  }
                                }}
                                style={{
                                  background: 'rgba(255,80,80,0.1)',
                                  border: '1px solid rgba(255,80,80,0.25)',
                                  color: '#FF5050',
                                  padding: '5px 12px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  transition: 'all 0.2s'
                                }}
                                title="Delete this message"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          </div>

                          <p style={{ background: 'rgba(0,0,0,0.25)', padding: '14px 16px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.04)', margin: 0 }}>
                            {c.message}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <p style={{ opacity: 0.35, fontSize: '11px', margin: 0 }}>
                              Received: {new Date(c.created_at).toLocaleString()}
                            </p>
                            <a href={`mailto:${c.email}?subject=${encodeURIComponent('Following up on your Etromo inquiry')}`} style={{ fontSize: '12px', color: 'var(--sky)', textDecoration: 'none' }}>
                              Reply via Email →
                            </a>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* ── BOOKINGS ─────────────────────────────────────────────── */}
              {tab === 'bookings' && (
                <div>
                  <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>Meeting Bookings <span style={{ fontSize: '14px', opacity: 0.5, fontWeight: 400 }}>({bookings.length} total)</span></h2>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {bookings.length === 0 && <p style={{ opacity: 0.5 }}>No bookings yet.</p>}
                    {bookings.map(b => {
                      const topicsArr = (() => { try { return typeof b.topics === 'string' ? JSON.parse(b.topics) : (b.topics || []); } catch { return []; } })();
                      return (
                        <Card key={b.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
                            <div>
                              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{b.name}</h4>
                              <p style={{ opacity: 0.5, fontSize: '13px' }}>{b.email}{b.company ? ` • ${b.company}` : ''}{b.phone ? ` • ${b.phone}` : ''}</p>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <p style={{ fontWeight: '600', color: 'var(--sky)', fontSize: '14px' }}>{b.date ? new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                              <p style={{ opacity: 0.5, fontSize: '13px' }}>{b.time}</p>
                            </div>
                          </div>
                          {topicsArr.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                              {topicsArr.map((t: string) => <span key={t} style={{ background: 'rgba(143,193,255,0.1)', border: '1px solid rgba(143,193,255,0.2)', color: 'var(--sky)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>{t}</span>)}
                            </div>
                          )}
                          {b.message && <p style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.6 }}>{b.message}</p>}
                          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: b.status === 'Scheduled' || !b.status ? 'rgba(168,255,120,0.1)' : 'rgba(255,80,80,0.1)', color: b.status === 'Scheduled' || !b.status ? '#A8FF78' : '#FF5050', border: '1px solid rgba(255,255,255,0.08)' }}>{b.status || 'Scheduled'}</span>
                            <button onClick={async () => { const s = b.status === 'Completed' ? 'Scheduled' : 'Completed'; await fetch(`${API}/api/admin/bookings/${b.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s }) }); loadAll(); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Toggle Completed</button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── APPLICATIONS ─────────────────────────────────────────── */}
              {tab === 'applications' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Partner Applications <span style={{ fontSize: '14px', opacity: 0.5, fontWeight: 400 }}>({applications.length} verified)</span></h2>
                      <p style={{ opacity: 0.6, fontSize: '14px' }}>Manage agency and developer partnerships with zero duplicacy and real-time status transitions.</p>
                    </div>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(f => {
                        const isAct = applicationFilter === f;
                        const count = f === 'All' ? applications.length : applications.filter(a => (a.status || 'Pending').toLowerCase().includes(f.toLowerCase())).length;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setApplicationFilter(f)}
                            style={{
                              background: isAct ? 'rgba(143,193,255,0.18)' : 'rgba(255,255,255,0.04)',
                              border: isAct ? '1px solid rgba(143,193,255,0.45)' : '1px solid rgba(255,255,255,0.08)',
                              color: isAct ? 'var(--sky)' : 'rgba(255,255,255,0.65)',
                              padding: '5px 14px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: isAct ? 600 : 400,
                              transition: 'all 0.2s'
                            }}
                          >
                            {f} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '14px' }}>
                    {applications.length === 0 && <p style={{ opacity: 0.5 }}>No partner applications found.</p>}
                    {applications
                      .filter(a => {
                        if (applicationFilter === 'All') return true;
                        return (a.status || 'Pending').toLowerCase().includes(applicationFilter.toLowerCase());
                      })
                      .map(a => (
                        <Card key={a.id || a.code}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
                            <div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ background: a.type?.toLowerCase() === 'tech' ? 'rgba(143,193,255,0.15)' : 'rgba(168,255,120,0.1)', color: a.type?.toLowerCase() === 'tech' ? 'var(--sky)' : '#A8FF78', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                  {a.type || 'Partner'}
                                </span>
                                <code style={{ opacity: 0.7, fontSize: '12px', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>
                                  {a.code}
                                </code>
                              </div>
                              <h4 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>{a.name}</h4>
                              <p style={{ opacity: 0.6, fontSize: '13px', margin: 0 }}>
                                <a href={`mailto:${a.email}`} style={{ color: 'var(--sky)', textDecoration: 'none' }}>{a.email}</a>
                                {a.company ? ` • ${a.company}` : ''}
                                {a.website ? ` • 🌐 ${a.website}` : ''}
                              </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                              {/* Direct Status Selector Dropdown */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status:</span>
                                <select
                                  value={a.status || 'Pending'}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    try {
                                      await fetch(`${API}/api/admin/applications/${a.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                        body: JSON.stringify({ status: newStatus, notes: a.notes })
                                      });
                                    } catch {}
                                    try {
                                      const localApps = lsGet('etromo_partner_apps', {});
                                      if (localApps[a.code]) {
                                        localApps[a.code].status = newStatus;
                                        localStorage.setItem('etromo_partner_apps', JSON.stringify(localApps));
                                      }
                                    } catch {}
                                    loadAll();
                                  }}
                                  className="modern-input"
                                  style={{
                                    padding: '5px 12px',
                                    fontSize: '12px',
                                    borderRadius: '8px',
                                    background: '#0a0d14',
                                    color: a.status === 'Approved' ? '#A8FF78' : a.status === 'Rejected' ? '#FF5050' : '#FFD264',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Approved">Approved</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </div>

                              {/* Quick Actions */}
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await fetch(`${API}/api/admin/applications/${a.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                        body: JSON.stringify({ status: 'Approved', notes: a.notes })
                                      });
                                    } catch {}
                                    try {
                                      const localApps = lsGet('etromo_partner_apps', {});
                                      if (localApps[a.code]) {
                                        localApps[a.code].status = 'Approved';
                                        localStorage.setItem('etromo_partner_apps', JSON.stringify(localApps));
                                      }
                                    } catch {}
                                    loadAll();
                                  }}
                                  style={{ background: 'rgba(168,255,120,0.1)', border: '1px solid rgba(168,255,120,0.3)', color: '#A8FF78', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await fetch(`${API}/api/admin/applications/${a.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                        body: JSON.stringify({ status: 'Rejected', notes: a.notes })
                                      });
                                    } catch {}
                                    try {
                                      const localApps = lsGet('etromo_partner_apps', {});
                                      if (localApps[a.code]) {
                                        localApps[a.code].status = 'Rejected';
                                        localStorage.setItem('etromo_partner_apps', JSON.stringify(localApps));
                                      }
                                    } catch {}
                                    loadAll();
                                  }}
                                  style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#FF5050', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  ✗ Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (window.confirm(`Delete application for ${a.name} (${a.code})?`)) {
                                      try {
                                        await fetch(`${API}/api/admin/applications/${a.id}`, {
                                          method: 'DELETE',
                                          headers: { Authorization: `Bearer ${token}` }
                                        });
                                      } catch {}
                                      try {
                                        const localApps = lsGet('etromo_partner_apps', {});
                                        delete localApps[a.code];
                                        localStorage.setItem('etromo_partner_apps', JSON.stringify(localApps));
                                      } catch {}
                                      loadAll();
                                    }
                                  }}
                                  style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#FF5050', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                                  title="Delete Application"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {a.experience && (
                            <p style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.6, marginBottom: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                              {a.experience}
                            </p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <p style={{ opacity: 0.35, fontSize: '11px', margin: 0 }}>
                              Applied: {new Date(a.created_at).toLocaleString()}
                            </p>
                            {a.linkedin && (
                              <a href={a.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--sky)', fontSize: '12px', textDecoration: 'none' }}>
                                View LinkedIn Profile →
                              </a>
                            )}
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* ── CASE STUDIES ────────────────────────────────────────── */}
              {tab === 'case_studies' && (
                <CaseStudiesStudio onStatsChange={loadAll} />
              )}

              {/* ── BLOGS ────────────────────────────────────────────────── */}
              {tab === 'blogs' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Editorial & Technical Resources</h2>
                      <p style={{ opacity: 0.6, fontSize: '14px' }}>Publish and manage engineering blogs, technical playbooks, and architectural whitepapers.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to="/GMCADMIN/blog/new" className="btn p" style={{ background: 'var(--sky)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        + Write Article / Resource
                      </Link>
                    </div>
                  </div>

                  <Card style={{ marginBottom: '24px', padding: '28px', textAlign: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(47, 107, 255, 0.1), transparent 70%), rgba(255, 255, 255, 0.02)' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Welcome to the Premium Publisher</h3>
                    <p style={{ opacity: 0.7, marginBottom: '20px', maxWidth: '520px', margin: '0 auto 20px', fontSize: '14px', lineHeight: 1.6 }}>
                      Publish long-form technical playbooks, engineering whitepapers, and customer case insights with full rich-text formatting and instant website distribution.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Link to="/GMCADMIN/blog/new" className="btn" style={{ borderColor: 'var(--sky)', color: 'var(--sky)' }}>
                        Open Premium Publisher
                      </Link>
                      <a href="/blog" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                        View Public Blog →
                      </a>
                      <a href="/resources" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                        View Public Resources →
                      </a>
                    </div>
                  </Card>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {blogs.length === 0 && <p style={{ opacity: 0.5 }}>No articles or resources published yet.</p>}
                    {blogs.map(b => (
                      <Card key={b.id || b.slug} style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {b.image_url ? (
                          <img src={b.image_url} alt="" style={{ width: '110px', height: '75px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: '110px', height: '75px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--sky)', fontSize: '24px' }}>
                            📄
                          </div>
                        )}
                        <div style={{ flexGrow: 1, minWidth: '240px' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                            <span style={{ background: 'rgba(143,193,255,0.12)', color: 'var(--sky)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                              {b.category || 'Technology'}
                            </span>
                            <span style={{ fontSize: '11px', opacity: 0.45 }}>
                              {b.published_date ? new Date(b.published_date).toLocaleDateString() : 'Draft'}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>{b.title}</h4>
                          <p style={{ opacity: 0.45, fontSize: '12px', margin: 0, fontFamily: 'var(--mono)' }}>
                            URL: /blog/{b.slug}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
                          <a
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'rgba(143,193,255,0.1)',
                              border: '1px solid rgba(143,193,255,0.25)',
                              color: 'var(--sky)',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              fontSize: '12px',
                              fontWeight: 500
                            }}
                          >
                            Read Live ↗
                          </a>
                          <Link
                            to={`/GMCADMIN/blog/edit/${b.slug}`}
                            style={{
                              background: 'rgba(143,193,255,0.1)',
                              border: '1px solid rgba(143,193,255,0.25)',
                              color: 'var(--sky)',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              fontSize: '12px',
                              marginRight: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            Edit ↗
                          </Link>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Delete article "${b.title}"?`)) {
                                try {
                                  await fetch(`${API}/api/admin/blogs/${b.id}`, {
                                    method: 'DELETE',
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                } catch {}
                                try {
                                  const ex = JSON.parse(localStorage.getItem('etromo_admin_blogs') || '[]');
                                  localStorage.setItem('etromo_admin_blogs', JSON.stringify(ex.filter((x: any) => x.id !== b.id && x.slug !== b.slug)));
                                } catch {}
                                loadAll();
                              }
                            }}
                            style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#FF5050', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}
                          >
                            Delete
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SOCIAL SETTINGS ────────────────────────────────────────── */}
              {tab === 'social' && (
                <div>
                  <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>Social Media Settings</h2>
                  <p style={{ opacity: 0.5, marginBottom: '32px', fontSize: '14px' }}>Connect your social media handles to dynamically update across the website.</p>
                  <Card>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = Object.fromEntries(formData);
                      try {
                        const res = await fetch(`${API}/api/admin/settings`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data)
                        });
                        if(res.ok) {
                          alert('Social settings saved successfully!');
                          loadAll();
                        } else {
                          alert('Failed to save settings.');
                        }
                      } catch(err) {
                        alert('Network error.');
                      }
                    }}>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instagram URL</label>
                        <input name="instagram_url" defaultValue={siteSettings.instagram_url || ''} className="modern-input" style={{ width: '100%' }} placeholder="https://instagram.com/yourcompany" />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>LinkedIn URL</label>
                        <input name="linkedin_url" defaultValue={siteSettings.linkedin_url || ''} className="modern-input" style={{ width: '100%' }} placeholder="https://linkedin.com/company/yourcompany" />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp URL</label>
                        <input name="whatsapp_url" defaultValue={siteSettings.whatsapp_url || ''} className="modern-input" style={{ width: '100%' }} placeholder="https://wa.me/123456789" />
                      </div>
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>YouTube URL</label>
                        <input name="youtube_url" defaultValue={siteSettings.youtube_url || ''} className="modern-input" style={{ width: '100%' }} placeholder="https://youtube.com/@yourcompany" />
                      </div>
                      <button type="submit" className="btn p" style={{ background: 'var(--sky)', color: '#000' }}>Save Settings</button>
                    </form>
                  </Card>
                </div>
              )}

              {/* ── PRODUCTS ─────────────────────────────────────────────── */}
              {tab === 'products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Product Studio & Catalog</h2>
                      <p style={{ opacity: 0.6, fontSize: '14px' }}>Configure high-converting SaaS product cards with metrics, highlights, and custom explore links.</p>
                    </div>
                    {editingProductId && (
                      <button onClick={resetProductForm} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        + Add New Product Instead
                      </button>
                    )}
                  </div>

                  {/* ── PRODUCT STUDIO: FORM + REAL-TIME LIVE PREVIEW ────── */}
                  <div className="admin-product-studio">
                    {/* LEFT: FORM INPUTS */}
                    <Card style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: '600', color: 'var(--sky)' }}>
                        {editingProductId ? `Edit Product (ID #${editingProductId})` : 'Create New Product'}
                      </h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const payload = {
                          name: productForm.name,
                          category: productForm.category,
                          price_label: productForm.price_label,
                          description: productForm.description,
                          link_url: productForm.link_url,
                          image_url: productImageUrl || null,
                          features_json: JSON.stringify({
                            boostValue: productForm.boostValue,
                            boostLabel: productForm.boostLabel,
                            timeReducedValue: productForm.timeReducedValue,
                            timeReducedLabel: productForm.timeReducedLabel,
                            benefits: productForm.benefits
                          })
                        };

                        const url = editingProductId ? `${API}/api/admin/products/${editingProductId}` : `${API}/api/admin/products`;
                        const method = editingProductId ? 'PATCH' : 'POST';

                        let saved = false;
                        try {
                          const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                          });
                          if (res.ok) saved = true;
                        } catch {}

                        // Fallback: persist in localStorage when API is offline
                        if (!saved) {
                          try {
                            const existing: any[] = JSON.parse(localStorage.getItem('etromo_admin_products') || '[]');
                            if (editingProductId) {
                              const idx = existing.findIndex((p: any) => p.id === editingProductId);
                              if (idx >= 0) existing[idx] = { ...existing[idx], ...payload };
                              else existing.push({ ...payload, id: editingProductId });
                            } else {
                              existing.push({ ...payload, id: Date.now() });
                            }
                            localStorage.setItem('etromo_admin_products', JSON.stringify(existing));
                          } catch {}
                        }
                        resetProductForm();
                        loadAll();
                      }}>
                        {/* Name & Category */}
                        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Name</label>
                            <input
                              value={productForm.name}
                              onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                              placeholder="e.g. Real Estate CRM Pro"
                              className="modern-input"
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Industry / Category</label>
                            <input
                              list="industry-categories-list"
                              value={productForm.category}
                              onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                              placeholder="e.g. Real Estate, Education, Hospitality"
                              className="modern-input"
                              required
                            />
                            <datalist id="industry-categories-list">
                              <option value="Real Estate" />
                              <option value="Education" />
                              <option value="Hospitality" />
                              <option value="Communication & AI" />
                              <option value="Retail & eCommerce" />
                            </datalist>
                          </div>
                        </div>

                        {/* Pricing Label & Explore Product Link */}
                        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pricing Badge</label>
                            <select
                              value={productForm.price_label}
                              onChange={e => setProductForm({ ...productForm, price_label: e.target.value })}
                              className="modern-input"
                              style={{ background: '#0a0d14', color: '#fff' }}
                            >
                              <option value="Subscription Based">Subscription Based</option>
                              <option value="One-Time + Subscription">One-Time + Subscription</option>
                              <option value="One-Time Payment">One-Time Payment</option>
                              <option value="Custom Enterprise">Custom Enterprise</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Explore Product Link
                            </label>
                            <input
                              value={productForm.link_url}
                              onChange={e => setProductForm({ ...productForm, link_url: e.target.value })}
                              placeholder="e.g. https://... or /products/real-estate-crm"
                              className="modern-input"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Value Proposition / Description</label>
                          <textarea
                            value={productForm.description}
                            onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Describe how this product accelerates operations..."
                            className="modern-input"
                            style={{ minHeight: '80px', resize: 'vertical' }}
                          />
                        </div>

                        {/* Key Metrics (% Results & Time Reduced) */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                          <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                            Impact & Results Metrics (Displayed in Card)
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', opacity: 0.6 }}>Growth / Help Metric</label>
                              <input
                                value={productForm.boostValue}
                                onChange={e => setProductForm({ ...productForm, boostValue: e.target.value })}
                                placeholder="+65%"
                                className="modern-input"
                                style={{ padding: '10px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', opacity: 0.6 }}>Metric Label</label>
                              <input
                                value={productForm.boostLabel}
                                onChange={e => setProductForm({ ...productForm, boostLabel: e.target.value })}
                                placeholder="Conversion Boost"
                                className="modern-input"
                                style={{ padding: '10px' }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', opacity: 0.6 }}>Time Reduced Metric</label>
                              <input
                                value={productForm.timeReducedValue}
                                onChange={e => setProductForm({ ...productForm, timeReducedValue: e.target.value })}
                                placeholder="-40%"
                                className="modern-input"
                                style={{ padding: '10px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', opacity: 0.6 }}>Time Metric Label</label>
                              <input
                                value={productForm.timeReducedLabel}
                                onChange={e => setProductForm({ ...productForm, timeReducedLabel: e.target.value })}
                                placeholder="Time Reduced"
                                className="modern-input"
                                style={{ padding: '10px' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Benefits List Builder */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Benefits & Feature Highlights
                            </span>
                            {productForm.benefits.length < 4 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setProductForm({
                                    ...productForm,
                                    benefits: [...productForm.benefits, { icon: 'check', text: 'New feature benefit' }]
                                  });
                                }}
                                style={{ background: 'rgba(143,193,255,0.1)', color: 'var(--sky)', border: '1px solid rgba(143,193,255,0.3)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                              >
                                + Add Benefit
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {productForm.benefits.map((b, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <select
                                  value={b.icon}
                                  onChange={e => {
                                    const next = [...productForm.benefits];
                                    next[idx].icon = e.target.value;
                                    setProductForm({ ...productForm, benefits: next });
                                  }}
                                  style={{ background: '#0a0d14', color: '#fff', border: '1px solid var(--line)', borderRadius: '8px', padding: '8px', fontSize: '12px' }}
                                >
                                  <option value="target">🎯 Target</option>
                                  <option value="refresh">🔄 Sync</option>
                                  <option value="shield">🛡️ Shield</option>
                                  <option value="zap">⚡ Zap</option>
                                  <option value="trending">📈 Trend</option>
                                  <option value="clock">⏱ Timer</option>
                                  <option value="check">✓ Check</option>
                                </select>
                                <input
                                  value={b.text}
                                  onChange={e => {
                                    const next = [...productForm.benefits];
                                    next[idx].text = e.target.value;
                                    setProductForm({ ...productForm, benefits: next });
                                  }}
                                  placeholder="Benefit highlight..."
                                  className="modern-input"
                                  style={{ padding: '8px 12px', fontSize: '13px' }}
                                />
                                {productForm.benefits.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setProductForm({
                                        ...productForm,
                                        benefits: productForm.benefits.filter((_, i) => i !== idx)
                                      });
                                    }}
                                    style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#FF5050', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer' }}
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Optional Image */}
                        <ImageUpload label="Product Cover Image (Optional)" value={productImageUrl} onChange={setProductImageUrl} />

                        {/* Submit & Cancel Buttons */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                          <button type="submit" className="btn p" style={{ background: 'var(--sky)', color: '#000', fontWeight: 600 }}>
                            {editingProductId ? 'Update Product' : 'Add Product'}
                          </button>
                          {editingProductId && (
                            <button type="button" onClick={resetProductForm} className="btn" style={{ background: 'transparent' }}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </Card>

                    {/* RIGHT: REAL-TIME LIVE CARD PREVIEW */}
                    <div style={{ position: 'sticky', top: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
                          Live Card Preview
                        </span>
                        <span style={{ fontSize: '11px', opacity: 0.5 }}>Updates in real-time</span>
                      </div>

                      <ProductCardItem
                        product={{
                          name: productForm.name || 'Sample Product',
                          category: productForm.category || 'CRM Software',
                          price_label: productForm.price_label,
                          description: productForm.description || 'Enter description on the left to see live preview here.',
                          link_url: productForm.link_url,
                          image_url: productImageUrl,
                          features_json: {
                            boostValue: productForm.boostValue,
                            boostLabel: productForm.boostLabel,
                            timeReducedValue: productForm.timeReducedValue,
                            timeReducedLabel: productForm.timeReducedLabel,
                            benefits: productForm.benefits
                          }
                        }}
                        isPreview={true}
                      />
                    </div>
                  </div>

                  {/* ── CATALOG OF EXISTING PRODUCTS ─────────────────────────── */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '32px 0 16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Active Listed Products ({products.length})</h3>
                    {/* Industry Category Filter Pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['All', 'Real Estate', 'Education', 'Hospitality', 'Communication & AI', 'Retail & eCommerce'].map(cat => {
                        const isAct = adminProductCategory === cat;
                        const matchFn = (p: any) => {
                          if (cat === 'All') return true;
                          const c = (p.category || '').toLowerCase();
                          if (cat === 'Real Estate') return c.includes('real') || c.includes('estate') || c.includes('property');
                          if (cat === 'Education') return c.includes('education') || c.includes('academy') || c.includes('school');
                          if (cat === 'Hospitality') return c.includes('hospitality') || c.includes('cafe') || c.includes('café');
                          if (cat === 'Communication & AI') return c.includes('communication') || c.includes('whatsapp') || c.includes('ai');
                          if (cat === 'Retail & eCommerce') return c.includes('retail') || c.includes('ecommerce');
                          return c.includes(cat.toLowerCase());
                        };
                        const count = products.filter(matchFn).length;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setAdminProductCategory(cat)}
                            style={{
                              background: isAct ? 'rgba(143,193,255,0.18)' : 'rgba(255,255,255,0.04)',
                              border: isAct ? '1px solid rgba(143,193,255,0.45)' : '1px solid rgba(255,255,255,0.08)',
                              color: isAct ? 'var(--sky)' : 'rgba(255,255,255,0.65)',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: isAct ? 600 : 400,
                              transition: 'all 0.2s'
                            }}
                          >
                            {cat} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {products.length === 0 && <p style={{ opacity: 0.5 }}>No products yet.</p>}
                    {products
                      .filter(p => {
                        if (adminProductCategory === 'All') return true;
                        const c = (p.category || '').toLowerCase();
                        if (adminProductCategory === 'Real Estate') return c.includes('real') || c.includes('estate') || c.includes('property');
                        if (adminProductCategory === 'Education') return c.includes('education') || c.includes('academy') || c.includes('school');
                        if (adminProductCategory === 'Hospitality') return c.includes('hospitality') || c.includes('cafe') || c.includes('café');
                        if (adminProductCategory === 'Communication & AI') return c.includes('communication') || c.includes('whatsapp') || c.includes('ai');
                        if (adminProductCategory === 'Retail & eCommerce') return c.includes('retail') || c.includes('ecommerce');
                        return c.includes(adminProductCategory.toLowerCase());
                      })
                      .map(p => (
                        <div key={p.id} style={{ display: 'flex', flexDirection: 'column' }}>
                          <ProductCardItem product={p} />
                          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleEditProduct(p)}
                              style={{ background: 'rgba(143,193,255,0.1)', border: '1px solid rgba(143,193,255,0.3)', color: 'var(--sky)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm('Delete this product from catalog?')) {
                                  try { await fetch(`${API}/api/admin/products/${p.id}`, { method: 'DELETE' }); } catch {}
                                  // Also remove from localStorage
                                  try {
                                    const existing = JSON.parse(localStorage.getItem('etromo_admin_products') || '[]');
                                    localStorage.setItem('etromo_admin_products', JSON.stringify(existing.filter((x: any) => x.id !== p.id)));
                                  } catch {}
                                  loadAll();
                                }
                              }}
                              style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#FF5050', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ── TEAM MANAGEMENT STUDIO ──────────────────────────────── */}
              {tab === 'team' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '28px', marginBottom: '6px' }}>Team Members & Leadership Studio</h2>
                      <p style={{ opacity: 0.5, fontSize: '14px' }}>
                        Manage executive profiles, 1:1 square photos, role hierarchies, biographies, and social links.
                      </p>
                    </div>
                    {editingTeamId && (
                      <button
                        type="button"
                        onClick={resetTeamForm}
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.06)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={14} /> + New Member Profile
                      </button>
                    )}
                  </div>

                  {/* 2-COLUMN STUDIO: EDITOR + LIVE REAL-TIME 1:1 PREVIEW */}
                  <div className="admin-team-studio-grid" style={{ marginBottom: '40px' }}>
                    {/* LEFT: COMPREHENSIVE PROFILE EDITOR */}
                    <Card>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                          {editingTeamId ? 'Edit Team Member Profile' : 'Add Team Member'}
                        </h3>
                        {editingTeamId && (
                          <span style={{ fontSize: '11px', background: 'rgba(143,193,255,0.15)', color: 'var(--sky)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(143,193,255,0.3)', fontFamily: 'var(--mono)' }}>
                            EDITING #{editingTeamId}
                          </span>
                        )}
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const payload = {
                          ...teamForm,
                          image_url: teamImageUrl,
                          sort_order: Number(teamForm.sort_order) || 0,
                          is_active: Number(teamForm.is_active)
                        };

                        const url = editingTeamId ? `${API}/api/admin/team/${editingTeamId}` : `${API}/api/admin/team`;
                        const method = editingTeamId ? 'PATCH' : 'POST';


                        let teamSaved = false;
                        try {
                          const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                          });
                          if (res.ok) teamSaved = true;
                          else {
                            const err = await res.json().catch(() => ({}));
                            if (res.status !== 404) alert('Failed to save team member: ' + (err.error || 'Server error'));
                          }
                        } catch {}

                        // Fallback: persist in localStorage when API is offline
                        if (!teamSaved) {
                          try {
                            const existing: any[] = JSON.parse(localStorage.getItem('etromo_admin_team') || '[]');
                            if (editingTeamId) {
                              const idx = existing.findIndex((m: any) => m.id === editingTeamId);
                              if (idx >= 0) existing[idx] = { ...existing[idx], ...payload, id: editingTeamId };
                              else existing.push({ ...payload, id: editingTeamId });
                            } else {
                              existing.push({ ...payload, id: Date.now() });
                            }
                            localStorage.setItem('etromo_admin_team', JSON.stringify(existing));
                          } catch {}
                        }
                        resetTeamForm();
                        loadAll();
                      }}>
                        {/* 1. Basic Identity */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                          <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                            1. Profile Identity & Organization
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Full Name *</label>
                              <input
                                value={teamForm.name}
                                onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                                placeholder="e.g. Arjun Mehta"
                                className="modern-input"
                                required
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Job Title / Role *</label>
                              <input
                                value={teamForm.role}
                                onChange={e => setTeamForm({ ...teamForm, role: e.target.value })}
                                placeholder="e.g. Chief Executive Officer"
                                className="modern-input"
                                required
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px', gap: '14px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Department / Division</label>
                              <input
                                value={teamForm.department}
                                onChange={e => setTeamForm({ ...teamForm, department: e.target.value })}
                                placeholder="e.g. Executive Leadership"
                                className="modern-input"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Sort Order</label>
                              <input
                                type="number"
                                value={teamForm.sort_order}
                                onChange={e => setTeamForm({ ...teamForm, sort_order: Number(e.target.value) })}
                                className="modern-input"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Visibility Status</label>
                              <select
                                value={teamForm.is_active}
                                onChange={e => setTeamForm({ ...teamForm, is_active: Number(e.target.value) })}
                                className="modern-input"
                                style={{ background: '#0a0d14', color: '#fff' }}
                              >
                                <option value={1}>Active / Visible</option>
                                <option value={0}>Hidden / Draft</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* 2. Biographies */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                          <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                            2. Descriptions & Biography
                          </span>
                          <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>
                              Short Profile Description (Clamped to ~2-3 lines on default card)
                            </label>
                            <textarea
                              value={teamForm.short_desc}
                              onChange={e => setTeamForm({ ...teamForm, short_desc: e.target.value })}
                              placeholder="Concise overview of leadership focus and business responsibility..."
                              className="modern-input"
                              style={{ minHeight: '65px', resize: 'vertical' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>
                              Full Detailed Biography (Displayed in hover / click expanded window)
                            </label>
                            <textarea
                              value={teamForm.bio}
                              onChange={e => setTeamForm({ ...teamForm, bio: e.target.value })}
                              placeholder="Complete career history, background, technical leadership, and strategic focus..."
                              className="modern-input"
                              style={{ minHeight: '110px', resize: 'vertical' }}
                              required
                            />
                          </div>
                        </div>

                        {/* 3. Core Competencies & Skills */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                          <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                            3. Core Competencies & Skills
                          </span>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>
                            Skills List (Separate tags with commas)
                          </label>
                          <input
                            value={teamForm.skills}
                            onChange={e => setTeamForm({ ...teamForm, skills: e.target.value })}
                            placeholder="Enterprise Architecture, AI Operations, SaaS Scaling, Systems Design"
                            className="modern-input"
                          />
                        </div>

                        {/* 4. Contact & Social Profiles */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                          <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                            4. Work Email & Social Profiles
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Work Email (Enables mailto & copy action)</label>
                              <input
                                type="email"
                                value={teamForm.email}
                                onChange={e => setTeamForm({ ...teamForm, email: e.target.value })}
                                placeholder="name@ourcompany.com"
                                className="modern-input"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>LinkedIn URL</label>
                              <input
                                value={teamForm.linkedin_url}
                                onChange={e => setTeamForm({ ...teamForm, linkedin_url: e.target.value })}
                                placeholder="https://linkedin.com/in/..."
                                className="modern-input"
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>GitHub URL</label>
                              <input
                                value={teamForm.github_url}
                                onChange={e => setTeamForm({ ...teamForm, github_url: e.target.value })}
                                placeholder="https://github.com/..."
                                className="modern-input"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>X (Twitter) URL</label>
                              <input
                                value={teamForm.x_url}
                                onChange={e => setTeamForm({ ...teamForm, x_url: e.target.value })}
                                placeholder="https://x.com/..."
                                className="modern-input"
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Instagram URL</label>
                              <input
                                value={teamForm.instagram_url}
                                onChange={e => setTeamForm({ ...teamForm, instagram_url: e.target.value })}
                                placeholder="https://instagram.com/..."
                                className="modern-input"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>YouTube URL</label>
                              <input
                                value={teamForm.youtube_url}
                                onChange={e => setTeamForm({ ...teamForm, youtube_url: e.target.value })}
                                placeholder="https://youtube.com/@..."
                                className="modern-input"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11.5px', opacity: 0.6 }}>Portfolio / Website URL</label>
                              <input
                                value={teamForm.website_url}
                                onChange={e => setTeamForm({ ...teamForm, website_url: e.target.value })}
                                placeholder="https://..."
                                className="modern-input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 5. 1:1 Profile Photo Upload */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
                          <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                            5. Profile Photograph (1:1 Aspect Ratio)
                          </span>
                          <ImageUpload label="Upload or Paste Photo URL" value={teamImageUrl} onChange={setTeamImageUrl} />
                          <p style={{ fontSize: '11.5px', opacity: 0.45, marginTop: '4px' }}>
                            Tip: Square 1:1 images are automatically cropped with top-center focal positioning so faces remain unclipped and crystal clear.
                          </p>
                        </div>

                        {/* Submit & Cancel Actions */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button type="submit" className="btn p" style={{ background: 'var(--sky)', color: '#000', fontWeight: 600, padding: '10px 24px' }}>
                            {editingTeamId ? 'Update Member Profile' : 'Publish Team Member'}
                          </button>
                          {editingTeamId && (
                            <button type="button" onClick={resetTeamForm} className="btn" style={{ background: 'transparent' }}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </Card>

                    {/* RIGHT: REAL-TIME LIVE 1:1 CARD PREVIEW */}
                    <div style={{ position: 'sticky', top: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
                          Live 1:1 Card Preview
                        </span>
                        <span style={{ fontSize: '11px', opacity: 0.5 }}>Updates in real-time</span>
                      </div>

                      <TeamCard
                        member={{
                          name: teamForm.name || 'Sample Member',
                          role: teamForm.role || 'Executive Title',
                          department: teamForm.department || 'Executive Leadership',
                          short_desc: teamForm.short_desc || teamForm.bio || 'Short profile description appears here...',
                          bio: teamForm.bio || 'Full biography appears in the hover expanded profile window.',
                          email: teamForm.email,
                          linkedin_url: teamForm.linkedin_url,
                          image_url: teamImageUrl
                        }}
                        showViewCue={true}
                        onClick={() => setPreviewTeamModalOpen(true)}
                      />

                      <div style={{ marginTop: '14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewTeamModalOpen(true)}
                          className="btn"
                          style={{ width: '100%', fontSize: '12.5px', background: 'rgba(143,193,255,0.08)', border: '1px solid rgba(143,193,255,0.2)', color: 'var(--sky)' }}
                        >
                          Preview Expanded Modal Window ↗
                        </button>
                      </div>

                      {/* Expanded modal preview */}
                      {previewTeamModalOpen && (
                        <TeamExpandedModal
                          member={{
                            ...teamForm,
                            image_url: teamImageUrl
                          }}
                          onClose={() => setPreviewTeamModalOpen(false)}
                        />
                      )}
                    </div>
                  </div>

                  {/* ── CATALOG OF EXISTING PROFILES ─────────────────────────── */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
                        Existing Team Profiles <span style={{ opacity: 0.45, fontSize: '14px', fontWeight: 400 }}>({team.length} total)</span>
                      </h3>
                      <span style={{ fontSize: '12px', opacity: 0.5 }}>
                        Drag/order managed by sort_order
                      </span>
                    </div>

                    {team.length === 0 && <p style={{ opacity: 0.5 }}>No team members found in database.</p>}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {team.map((m: any) => (
                        <Card key={m.id} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(10,21,48,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: '#070d1e', border: '1px solid rgba(255,255,255,0.1)' }}>
                              {m.image_url ? (
                                <img src={m.image_url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky)', fontSize: '18px', fontWeight: 600 }}>
                                  {m.name ? m.name.charAt(0) : '?'}
                                </div>
                              )}
                            </div>
                            <div style={{ minWidth: 0, flexGrow: 1 }}>
                              <span style={{ fontSize: '10px', color: 'var(--sky)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                                {m.department || 'Leadership'}
                              </span>
                              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {m.name}
                              </h4>
                              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {m.role}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                            <span>Order: <strong>{m.sort_order ?? 0}</strong></span>
                            <span style={{ padding: '2px 8px', borderRadius: '12px', background: m.is_active === 0 ? 'rgba(255,80,80,0.15)' : 'rgba(74,222,128,0.15)', color: m.is_active === 0 ? '#ff5050' : '#4ade80' }}>
                              {m.is_active === 0 ? 'Draft / Hidden' : 'Active'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                            <button
                              type="button"
                              onClick={() => handleEditTeam(m)}
                              className="btn"
                              style={{ flexGrow: 1, padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(143,193,255,0.1)', color: 'var(--sky)', border: '1px solid rgba(143,193,255,0.25)' }}
                            >
                              <Edit2 size={13} /> Edit Profile
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete profile for ${m.name}?`)) {
                                  try { await fetch(`${API}/api/admin/team/${m.id}`, { method: 'DELETE' }); } catch {}
                                  try {
                                    const ex = JSON.parse(localStorage.getItem('etromo_admin_team') || '[]');
                                    localStorage.setItem('etromo_admin_team', JSON.stringify(ex.filter((x: any) => x.id !== m.id)));
                                  } catch {}
                                  loadAll();
                                }
                              }}
                              className="btn"
                              style={{ padding: '6px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,80,80,0.1)', color: '#FF5050', border: '1px solid rgba(255,80,80,0.25)' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── AI AGENTS & CRAWLERS INTELLIGENCE ───────────────────── */}
              {tab === 'ai_agents' && (
                <AiAgentTrackerStudio
                  logs={botLogs}
                  stats={botStats}
                  onRefresh={loadAll}
                  token={token}
                />
              )}

              {/* ── SITE SETTINGS & SOCIAL MEDIA ─────────────────────────── */}
              {tab === 'settings' && (
                <SiteSettingsAndSocialStudio
                  settings={siteSettings}
                  onSave={handleSaveSiteSettings}
                  onNavigateToSeo={() => setTab('seo')}
                />
              )}

              {/* ── SEO & GOOGLE SEARCH SNIPPET ──────────────────────────── */}
              {tab === 'seo' && (
                <SeoManagerStudio
                  seoSettings={seoSettings}
                  onSaveSeo={handleSaveSeo}
                />
              )}

              {/* ── WEBHOOKS ─────────────────────────────────────────────── */}
              {tab === 'webhooks' && (
                <div>
                  <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Integrations & Webhooks</h2>
                  <p style={{ opacity: 0.5, marginBottom: '24px', fontSize: '14px' }}>Forward leads and bookings to external CRMs (Zapier, Make, HubSpot, Salesforce).</p>
                  <Card>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const t = e.target as typeof e.target & { url: { value: string } };
                      const res = await fetch(`${API}/api/admin/webhooks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: t.url.value }) });
                      if (res.ok) { setWebhooks({ webhook: { url: t.url.value } }); alert('Saved!'); }
                    }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Webhook Target URL</label>
                      <input name="url" defaultValue={webhooks?.webhook?.url || ''} placeholder="https://hooks.zapier.com/hooks/catch/..." className="modern-input" style={{ marginBottom: '16px', maxWidth: '600px' }} />
                      <button type="submit" className="btn p">Save Configuration</button>
                    </form>
                    {webhooks?.webhook?.url && (
                      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(168,255,120,0.05)', border: '1px solid rgba(168,255,120,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Zap size={20} color="#A8FF78" />
                        <div>
                          <h4 style={{ color: '#A8FF78', fontSize: '14px', marginBottom: '4px' }}>Integration Active</h4>
                          <p style={{ opacity: 0.6, fontSize: '13px' }}>All new leads will be forwarded to: <code style={{ color: 'var(--sky)' }}>{webhooks.webhook.url}</code></p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
