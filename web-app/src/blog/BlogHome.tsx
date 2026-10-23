import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import './Blog.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogItem {
  id: string | number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  image_alt?: string;
  published_date?: string;
  updated_at?: string;
  author?: { name: string; avatar?: string; role?: string };
  author_id?: string;
  readTime?: string;
  featured?: boolean;
  tags?: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Technology', 'Architecture Playbook', 'Security & Compliance',
                    'Messaging & AI', 'Autonomous Systems', 'Design', 'Business', 'AI', 'Productivity'];

const ITEMS_PER_PAGE = 9;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

function authorName(b: BlogItem) {
  return b.author?.name || b.author_id || 'Editorial Team';
}

function authorAvatar(b: BlogItem) {
  return b.author?.avatar || '/logo.png';
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bl-card" style={{ pointerEvents: 'none' }}>
      <div className="bl-card-img-wrap">
        <div className="bl-skeleton" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="bl-card-body" style={{ gap: 12 }}>
        <div className="bl-skeleton" style={{ height: 14, width: '40%' }} />
        <div className="bl-skeleton" style={{ height: 20, width: '90%' }} />
        <div className="bl-skeleton" style={{ height: 20, width: '75%' }} />
        <div className="bl-skeleton" style={{ height: 14, width: '55%', marginTop: 8 }} />
      </div>
    </div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ blog }: { blog: BlogItem }) {
  return (
    <Link to={`/blog/${blog.slug}`} className="bl-card">
      <div className="bl-card-img-wrap">
        <img
          src={blog.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=75'}
          alt={blog.image_alt || blog.title}
          className="bl-card-img"
          loading="lazy"
          width={800}
          height={450}
          onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=75'; }}
        />
      </div>
      <div className="bl-card-body">
        <span className="bl-badge">{blog.category}</span>
        <h3>{blog.title}</h3>
        {blog.excerpt && <p className="bl-excerpt">{blog.excerpt}</p>}
        <div className="bl-meta" style={{ marginTop: 'auto' }}>
          <img
            src={authorAvatar(blog)}
            alt={authorName(blog)}
            width={28}
            height={28}
            onError={e => { e.currentTarget.src = '/logo.png'; }}
          />
          <span className="bl-meta-name">{authorName(blog)}</span>
          <span className="bl-meta-dot">·</span>
          <time dateTime={blog.published_date}>{formatDate(blog.published_date)}</time>
          {blog.readTime && <><span className="bl-meta-dot">·</span><span>{blog.readTime}</span></>}
        </div>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogHome() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const searchRef = useRef<HTMLInputElement>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetch('/api/blogs')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (cancelled) return;
        if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError('Could not load articles. Please try again.');
        setLoading(false);
        console.warn('Blog fetch error:', err);
      });

    return () => { cancelled = true; };
  }, []);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeCategory, search]);

  // ── Derived data ─────────────────────────────────────────────────────────────

  const isFiltering = activeCategory !== 'All' || search.trim() !== '';

  const filtered = blogs.filter(b => {
    const q = search.toLowerCase();
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const matchSearch = !q ||
      (b.title || '').toLowerCase().includes(q) ||
      (b.excerpt || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Featured = first item marked featured, or just the first blog (only when not filtering)
  const featured = !isFiltering ? (blogs.find(b => b.featured) || blogs[0]) : null;
  const gridBlogs = !isFiltering
    ? filtered.filter(b => b.id !== featured?.id)
    : filtered;

  const pageCount = Math.ceil(gridBlogs.length / ITEMS_PER_PAGE);
  const paginated = gridBlogs.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page < pageCount;

  // ── JSON-LD ──────────────────────────────────────────────────────────────────

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Etromo Engineering Blog',
    'description': 'Technical playbooks, system architectures, and workflow automation insights.',
    'url': 'https://www.etromo.com/blog',
    'publisher': {
      '@type': 'Organization',
      'name': 'Etromo',
      'logo': { '@type': 'ImageObject', 'url': 'https://www.etromo.com/logo.png' }
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="blog-light-theme">
      <PageSEO
        title="Engineering Blog — Insights, Playbooks & Research"
        description="Technical playbooks, system architecture deep-dives, and workflow automation insights from the Etromo engineering group."
        url="/blog"
        type="website"
        jsonLd={jsonLd}
      />

      {/* ── Hero ── */}
      <header className="bl-index-hero hero">
        <div className="orb" style={{ width: 480, height: 480, top: -120, right: -80, background: 'radial-gradient(circle, rgba(143,193,255,0.12) 0%, transparent 70%)' }} />
        <div className="bl-wrap">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(143,193,255,0.08)', border: '1px solid rgba(143,193,255,0.18)', color: 'var(--bl-accent)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
            Ideas Worth Your Time
          </div>
          <h1>Engineering Insights<br />&amp; Architecture Playbooks</h1>
          <p style={{ marginTop: 16 }}>
            Technical deep-dives, system design frameworks, and operational research from the Etromo engineering group.
          </p>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="bl-wrap" style={{ paddingTop: 48, paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <nav className="bl-cat-bar" aria-label="Category filter">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`bl-cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="bl-search-wrap">
            <Search size={15} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              className="bl-search"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search articles"
              id="blog-search"
            />
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div>
            {!isFiltering && (
              <div className="bl-featured" style={{ pointerEvents: 'none', marginBottom: 72 }}>
                <div className="bl-featured-img-wrap"><div className="bl-skeleton" style={{ width: '100%', height: '100%' }} /></div>
                <div className="bl-featured-body" style={{ gap: 16 }}>
                  <div className="bl-skeleton" style={{ height: 16, width: '30%' }} />
                  <div className="bl-skeleton" style={{ height: 32, width: '90%' }} />
                  <div className="bl-skeleton" style={{ height: 32, width: '70%' }} />
                  <div className="bl-skeleton" style={{ height: 14, width: '50%', marginTop: 8 }} />
                </div>
              </div>
            )}
            <div className="bl-grid">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="bl-state-box">
            <p>{error}</p>
            <button
              className="bl-state-reset"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bl-state-box">
            <p>No articles match your current filters.</p>
            <button
              className="bl-state-reset"
              onClick={() => { setActiveCategory('All'); setSearch(''); searchRef.current?.focus(); }}
            >
              <RefreshCw size={14} /> Clear filters
            </button>
          </div>
        )}

        {/* ── Featured Article ── */}
        {!loading && !error && featured && !isFiltering && (
          <Link to={`/blog/${featured.slug}`} className="bl-featured" aria-label={`Read featured article: ${featured.title}`}>
            <div className="bl-featured-img-wrap">
              <img
                src={featured.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
                alt={featured.image_alt || featured.title}
                className="bl-featured-img"
                loading="eager"
                fetchPriority="high"
                width={1200}
                height={900}
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'; }}
              />
            </div>
            <div className="bl-featured-body">
              <div className="bl-featured-eyebrow">
                <span className="bl-badge">{featured.category}</span>
                {featured.readTime && <span style={{ fontSize: 12, color: 'var(--bl-faint)' }}>{featured.readTime}</span>}
              </div>
              <h2>{featured.title}</h2>
              {featured.excerpt && <p className="bl-excerpt">{featured.excerpt}</p>}
              <div className="bl-meta">
                <img
                  src={authorAvatar(featured)}
                  alt={authorName(featured)}
                  width={28}
                  height={28}
                  onError={e => { e.currentTarget.src = '/logo.png'; }}
                />
                <span className="bl-meta-name">{authorName(featured)}</span>
                <span className="bl-meta-dot">·</span>
                <time dateTime={featured.published_date}>{formatDate(featured.published_date)}</time>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--bl-accent)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                Read article <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        )}

        {/* ── Article Grid ── */}
        {!loading && !error && paginated.length > 0 && (
          <>
            <div className="bl-section-header">
              <h2 id="articles">{isFiltering ? `Results (${filtered.length})` : 'Latest Articles'}</h2>
              {!isFiltering && blogs.length > 0 && <span>{blogs.length} articles</span>}
            </div>

            <main aria-label="Article list">
              <div className="bl-grid">
                {paginated.map(b => <ArticleCard key={`${b.id}-${b.slug}`} blog={b} />)}
              </div>
            </main>

            {/* Load more */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginBottom: 80 }}>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 28px', borderRadius: 10,
                    border: '1px solid var(--bl-border)',
                    background: 'var(--bl-surface)',
                    color: 'var(--bl-muted)',
                    fontSize: 14, fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--bl-sans)',
                    transition: 'border-color 0.2s, color 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bl-accent)'; e.currentTarget.style.color = 'var(--bl-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bl-border)'; e.currentTarget.style.color = 'var(--bl-muted)'; }}
                >
                  <Loader2 size={15} style={{ display: 'none' }} />
                  Load more articles <ArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Newsletter ── */}
        {!loading && (
          <div className="bl-newsletter">
            <h3>Stay ahead of the build</h3>
            <p>Engineering deep-dives and architecture playbooks delivered to your inbox.</p>
            <form onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" aria-label="Email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
