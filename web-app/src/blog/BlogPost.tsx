import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Link2,
  FileDown, BookOpen, Clock, Calendar
} from 'lucide-react';
import { TwitterIcon, LinkedinIcon } from '../SocialIcons';
import PageSEO from '../components/layout/PageSEO';
import './Blog.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
}

interface Blog {
  id: number | string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  image_alt?: string;
  published_date?: string;
  updated_at?: string;
  author?: Author;
  author_id?: string;
  readTime?: string;
  tags?: string[] | string;
  seo_title?: string;
  seo_description?: string;
  pdf_url?: string;
  featured?: boolean;
}

interface TocItem { id: string; text: string; level: 2 | 3; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso?: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', opts || { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

function isSameDay(a?: string, b?: string) {
  if (!a || !b) return true;
  try { return new Date(a).toDateString() === new Date(b).toDateString(); } catch { return true; }
}

function parseTags(tags?: string[] | string): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  return tags.split(',').map(t => t.trim()).filter(Boolean);
}

// Inject id attributes into h2/h3 for TOC + anchors
function processContent(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  const processed = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_m, tag, attrs, inner) => {
      const plain = inner.replace(/<[^>]*>/g, '').trim();
      let base = plain
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 64)
        || 'section';

      const count = used.get(base) || 0;
      const id = count === 0 ? base : `${base}-${count}`;
      used.set(base, count + 1);

      const level = tag.toLowerCase() === 'h2' ? 2 : 3;
      toc.push({ id, text: plain, level });

      // Append copy-link button inside heading
      const copyBtn = `<button class="bl-anchor" onclick="navigator.clipboard&&navigator.clipboard.writeText(location.origin+location.pathname+'#${id}');this.title='Copied!';setTimeout(()=>this.title='Copy link',2000)" title="Copy link" aria-label="Copy link to section">⌗</button>`;
      return `<${tag}${attrs} id="${id}">${inner}${copyBtn}</${tag}>`;
    }
  );

  return { html: processed, toc };
}

// ─── TOC Component ────────────────────────────────────────────────────────────

function TableOfContents({ toc, activeId }: { toc: TocItem[]; activeId: string }) {
  if (toc.length < 2) return null;
  return (
    <div className="bl-toc" role="navigation" aria-label="Table of contents">
      <div className="bl-toc-label">Contents</div>
      <ul>
        {toc.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`${item.level === 3 ? 'bl-toc-h3' : ''}${activeId === item.id ? ' bl-toc-active' : ''}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Related Card (compact) ───────────────────────────────────────────────────

function RelatedCard({ b }: { b: Blog }) {
  return (
    <Link to={`/blog/${b.slug}`} className="bl-card" style={{ fontSize: 14 }}>
      <div className="bl-card-img-wrap" style={{ aspectRatio: '16/9' }}>
        <img
          src={b.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=60'}
          alt={b.image_alt || b.title}
          className="bl-card-img"
          loading="lazy"
          width={600}
          height={337}
          onError={e => { e.currentTarget.src = '/logo.png'; }}
        />
      </div>
      <div className="bl-card-body">
        <span className="bl-badge">{b.category}</span>
        <h3 style={{ fontSize: 15 }}>{b.title}</h3>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [processedHtml, setProcessedHtml] = useState('');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const articleRef = useRef<HTMLElement>(null);

  // ── Fetch post ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setPost(null);
    setToc([]);
    setProcessedHtml('');
    window.scrollTo({ top: 0 });

    fetch(`/api/blogs/${slug}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (!data) return;
        if (data.success && data.blog) {
          setPost(data.blog);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  // ── Fetch related ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blogs/${slug}/related`)
      .then(r => r.ok ? r.json() : { blogs: [] })
      .then(data => setRelated(data.blogs || []))
      .catch(() => setRelated([]));
  }, [slug]);

  // ── Process content (TOC + anchors) ─────────────────────────────────────────
  useEffect(() => {
    if (!post?.content) return;
    const { html, toc: items } = processContent(post.content);
    setProcessedHtml(html);
    setToc(items);
  }, [post?.content]);

  // ── Reading progress ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pct = Math.min(100, Math.max(0, ((vh - top) / height) * 100));
      setProgress(pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  // ── Active TOC item via IntersectionObserver ──────────────────────────────────
  useEffect(() => {
    if (toc.length === 0) return;
    const headings = toc.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, [toc, processedHtml]);

  // ── Share helpers ─────────────────────────────────────────────────────────────
  const copyLink = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, []);

  const shareTwitter = useCallback(() => {
    if (!post) return;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener');
  }, [post]);

  const shareLinkedin = useCallback(() => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener');
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────────
  const tags = post ? parseTags(post.tags) : [];
  const author: Author = post?.author || {
    name: post?.author_id || 'Editorial Team',
    role: 'Etromo Engineering & Research',
    avatar: '/logo.png',
    bio: 'Technical playbooks, system architectures, and workflow automation insights from the Etromo engineering group.'
  };
  const showUpdated = post?.updated_at && !isSameDay(post.published_date, post.updated_at);

  // ── JSON-LD ───────────────────────────────────────────────────────────────────
  const jsonLd = post ? [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || '',
      image: post.image_url || '',
      author: { '@type': 'Person', name: author.name },
      publisher: {
        '@type': 'Organization',
        name: 'Etromo',
        logo: { '@type': 'ImageObject', url: 'https://www.etromo.com/logo.png' }
      },
      datePublished: post.published_date || '',
      dateModified: post.updated_at || post.published_date || '',
      mainEntityOfPage: `https://www.etromo.com/blog/${post.slug}`,
      url: `https://www.etromo.com/blog/${post.slug}`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.etromo.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.etromo.com/blog' },
        { '@type': 'ListItem', position: 3, name: post.category, item: `https://www.etromo.com/blog?category=${encodeURIComponent(post.category)}` },
        { '@type': 'ListItem', position: 4, name: post.title }
      ]
    }
  ] : undefined;

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="blog-light-theme" style={{ minHeight: '100vh' }}>
      <div className="bl-post-hero" style={{ background: 'var(--bl-surface)' }}>
        <div className="bl-skeleton" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
      </div>
      <div className="bl-post-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="bl-skeleton" style={{ height: i === 1 ? 14 : i === 2 ? 40 : 18, width: i === 1 ? '30%' : i === 2 ? '85%' : `${70 - i * 5}%` }} />)}
        </div>
      </div>
    </div>
  );

  // ── 404 ───────────────────────────────────────────────────────────────────────
  if (notFound || !post) return (
    <div className="blog-light-theme" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PageSEO title="Article Not Found" description="This article does not exist or has been removed." noindex />
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 56, marginBottom: 16 }}>📄</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.9)', marginBottom: 12 }}>Article not found</h1>
        <p style={{ color: 'var(--bl-muted)', marginBottom: 28 }}>This article doesn't exist or may have been removed.</p>
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, background: 'var(--bl-accent-dim)', border: '1px solid var(--bl-accent)', color: 'var(--bl-accent)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          <ChevronLeft size={16} /> Back to Blog
        </Link>
      </div>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div className="blog-light-theme">
      <PageSEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || ''}
        url={`/blog/${post.slug}`}
        image={post.image_url}
        type="article"
        canonical={`https://www.etromo.com/blog/${post.slug}`}
        jsonLd={jsonLd}
      />

      {/* Reading progress */}
      <div className="bl-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      {/* ── Hero image ── */}
      {post.image_url ? (
        <div className="bl-post-hero">
          <img
            src={post.image_url}
            alt={post.image_alt || post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            fetchPriority="high"
            loading="eager"
            width={1600}
            height={700}
          />
          <div className="bl-post-hero-overlay" />
        </div>
      ) : (
        <div className="bl-post-hero" style={{ background: 'linear-gradient(135deg, #05080f 0%, #0d1527 100%)' }}>
          <div className="bl-post-hero-overlay" />
        </div>
      )}

      {/* ── Header card (overlaps hero) ── */}
      <div className="bl-wrap">
        <div className="bl-post-header-card">
          {/* Breadcrumb */}
          <nav className="bl-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} className="bl-breadcrumb-sep" aria-hidden="true" />
            <Link to="/blog">Blog</Link>
            <ChevronRight size={12} className="bl-breadcrumb-sep" aria-hidden="true" />
            <span className="bl-badge" style={{ fontSize: 11 }}>{post.category}</span>
          </nav>

          <h1>{post.title}</h1>
          {post.subtitle && <p className="bl-post-subtitle">{post.subtitle}</p>}

          <div className="bl-post-bar">
            {/* Author + date */}
            <div className="bl-meta">
              <img
                src={author.avatar || '/logo.png'}
                alt={author.name}
                width={32}
                height={32}
                style={{ borderRadius: '50%', border: '1px solid var(--bl-accent)', objectFit: 'cover', width: 32, height: 32, flexShrink: 0 }}
                onError={e => { e.currentTarget.src = '/logo.png'; }}
              />
              <span className="bl-meta-name">{author.name}</span>
              <span className="bl-meta-dot">·</span>
              <div className="bl-date-row">
                <Calendar size={12} aria-hidden="true" />
                <time dateTime={post.published_date}>{fmt(post.published_date)}</time>
                {showUpdated && (
                  <span className="bl-updated-pill" title={`Updated ${fmt(post.updated_at)}`}>
                    Updated {fmt(post.updated_at, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              {post.readTime && (
                <>
                  <span className="bl-meta-dot">·</span>
                  <Clock size={12} aria-hidden="true" />
                  <span>{post.readTime}</span>
                </>
              )}
            </div>

            {/* Back link */}
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--bl-muted)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--bl-accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--bl-muted)'}
            >
              <ChevronLeft size={15} aria-hidden="true" /> All articles
            </Link>
          </div>
        </div>
      </div>

      {/* ── Article body + sidebar ── */}
      <div className="bl-post-layout">
        {/* Main content */}
        <article ref={articleRef} aria-label="Article content">
          <div
            className="bl-content"
            dangerouslySetInnerHTML={{ __html: processedHtml || post.content }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="bl-tags" style={{ marginTop: 48 }}>
              <BookOpen size={14} style={{ color: 'var(--bl-faint)', flexShrink: 0 }} />
              {tags.map(t => (
                <Link
                  key={t}
                  to={`/blog?search=${encodeURIComponent(t)}`}
                  className="bl-tag"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}

          {/* Resource download */}
          {post.pdf_url && (
            <div style={{ marginBottom: 40 }}>
              <div className="bl-section-header" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 14, letterSpacing: '0.1em' }}>Download</h2>
              </div>
              <a href={post.pdf_url} className="bl-resource-card" download rel="noopener">
                <div className="bl-resource-icon"><FileDown size={18} /></div>
                <div className="bl-resource-info">
                  <h4>Download PDF</h4>
                  <p>Full article — PDF format</p>
                </div>
                <ChevronRight size={18} style={{ marginLeft: 'auto', color: 'var(--bl-accent)' }} />
              </a>
            </div>
          )}

          {/* Author box */}
          <div className="bl-author-box">
            <img
              src={author.avatar || '/logo.png'}
              alt={author.name}
              width={64}
              height={64}
              onError={e => { e.currentTarget.src = '/logo.png'; }}
            />
            <div>
              <h4>{author.name}</h4>
              {author.role && <span className="bl-author-role">{author.role}</span>}
              {author.bio && <p>{author.bio}</p>}
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div style={{ marginBottom: 60 }}>
              <div className="bl-section-header" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 14, letterSpacing: '0.1em' }}>Related Articles</h2>
              </div>
              <div className="bl-related-grid">
                {related.map(b => <RelatedCard key={b.id} b={b} />)}
              </div>
            </div>
          )}

          {/* Prev / Next */}
          <div className="bl-prevnext">
            <Link to="/blog" className="bl-prevnext a" style={{ textDecoration: 'none' }}>
              <span className="bl-prevnext-label"><ChevronLeft size={12} style={{ display: 'inline' }} /> Back</span>
              <span className="bl-prevnext-title">All articles</span>
            </Link>
            <span />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="bl-sidebar" aria-label="Article tools">
          <TableOfContents toc={toc} activeId={activeId} />

          {/* Share */}
          <div className="bl-sidebar-panel">
            <div className="bl-sidebar-panel-label">Share</div>
            <div className="bl-share-row">
              <button className="bl-share-btn" onClick={shareTwitter} title="Share on X / Twitter" aria-label="Share on X / Twitter">
                <TwitterIcon size={15} />
              </button>
              <button className="bl-share-btn" onClick={shareLinkedin} title="Share on LinkedIn" aria-label="Share on LinkedIn">
                <LinkedinIcon size={15} />
              </button>
              <button
                className="bl-share-btn"
                onClick={copyLink}
                title={copied ? 'Copied!' : 'Copy link'}
                aria-label={copied ? 'Link copied' : 'Copy link'}
                style={copied ? { background: 'rgba(52,211,153,0.15)', borderColor: 'rgba(52,211,153,0.4)', color: '#34D399' } : {}}
              >
                <Link2 size={15} />
              </button>
              {post.pdf_url ? (
                <a href={post.pdf_url} className="bl-share-btn" download title="Download PDF" aria-label="Download PDF">
                  <FileDown size={15} />
                </a>
              ) : (
                <a
                  href={`/api/blogs/${post.slug}/pdf`}
                  className="bl-share-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download PDF"
                  aria-label="Download PDF"
                >
                  <FileDown size={15} />
                </a>
              )}
            </div>

            <a
              href={post.pdf_url || `/api/blogs/${post.slug}/pdf`}
              className="bl-pdf-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileDown size={14} /> Download PDF
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
