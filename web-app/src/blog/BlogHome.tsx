import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './Blog.css';

// Mock Data for realistic UI
const MOCK_BLOGS = [
  {
    id: '1',
    slug: 'future-of-ai-in-real-estate',
    title: 'The Future of AI in Real Estate Operations',
    excerpt: 'How artificial intelligence is transforming property management, lead qualification, and customer follow-ups in 2026.',
    category: 'Technology',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    published_date: '2026-10-05T10:00:00Z',
    author: { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    readTime: '6 min read'
  },
  {
    id: '2',
    slug: 'design-systems-scale',
    title: 'Scaling Design Systems Across Enterprise Teams',
    excerpt: 'A comprehensive guide to building, maintaining, and evolving design systems that empower developers without stifling creativity.',
    category: 'Design',
    image_url: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    published_date: '2026-10-01T10:00:00Z',
    author: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    readTime: '8 min read'
  },
  {
    id: '3',
    slug: 'automation-workflows',
    title: '5 Automation Workflows That Will Save You 10 Hours a Week',
    excerpt: 'Stop doing manual data entry. These five simple Zapier and n8n workflows will revolutionize how your team operates.',
    category: 'Productivity',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    published_date: '2026-09-28T10:00:00Z',
    author: { name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    readTime: '5 min read'
  }
];

const CATEGORIES = ['All', 'Technology', 'Design', 'Business', 'AI', 'Tutorials'];

export default function BlogHome() {
  const [blogs, setBlogs] = useState(MOCK_BLOGS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Fetch blogs from API if available
  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      })
      .catch(console.error);
  }, []);

  const featuredBlog = blogs[0];
  const regularBlogs = blogs.slice(1);

  const filteredBlogs = regularBlogs.filter(b => 
    (activeCategory === 'All' || b.category === activeCategory) &&
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="blog-light-theme">
      {/* Blog Navigation / Header could go here, overriding the main dark nav */}
      
      <div className="blog-container">
      {/* Hero Section */}
      <header className="hero" id="top">
        <div className="orb"></div>
        <div className="flute"></div>
        <div className="horizon"></div>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', background: 'rgba(143, 193, 255, 0.1)', color: 'var(--sky)', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(143, 193, 255, 0.2)', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>Insights & Ideas</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', maxWidth: '20ch', lineHeight: 1.1, marginBottom: '24px' }}>Ideas Worth <em>Your Time</em></h1>
          <p className="sub" style={{ margin: '0 auto 40px', maxWidth: '600px' }}>
            Insights on engineering, design, and building operational software ecosystems.
          </p>
        </div>
      </header>

        {/* Categories & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '99px', 
                  border: '1px solid var(--blog-border)', 
                  background: activeCategory === cat ? 'var(--blog-text-main)' : 'var(--blog-surface)',
                  color: activeCategory === cat ? 'white' : 'var(--blog-text-main)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--blog-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '12px 16px 12px 48px',
                borderRadius: '99px',
                border: '1px solid var(--blog-border)',
                outline: 'none',
                width: '300px',
                fontSize: '15px'
              }}
            />
          </div>
        </div>

        {/* Featured Story */}
        {featuredBlog && activeCategory === 'All' && !search && (
          <Link to={`/blog/${featuredBlog.slug}`} className="blog-featured">
            <img src={featuredBlog.image_url} alt={featuredBlog.title} className="blog-featured-img" />
            <div className="blog-featured-content">
              <span className="blog-badge">{featuredBlog.category}</span>
              <h2>{featuredBlog.title}</h2>
              <p className="excerpt">{featuredBlog.excerpt}</p>
              <div className="blog-meta">
                <img src={featuredBlog.author?.avatar || 'https://via.placeholder.com/100'} alt={featuredBlog.author?.name} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--blog-text-main)' }}>{featuredBlog.author?.name || 'Editorial Team'}</strong>
                  <span>{new Date(featuredBlog.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {featuredBlog.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Latest Articles Grid */}
        <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--blog-border)', paddingBottom: '16px' }}>Latest Articles</h3>
        <div className="blog-grid">
          {filteredBlogs.map(blog => (
            <Link to={`/blog/${blog.slug}`} key={blog.id} className="blog-card">
              <div className="blog-card-img-wrapper">
                <img src={blog.image_url} alt={blog.title} className="blog-card-img" />
              </div>
              <div className="blog-card-content">
                <span className="blog-badge">{blog.category}</span>
                <h3>{blog.title}</h3>
                <p className="excerpt">{blog.excerpt}</p>
                <div className="blog-meta">
                  <img src={blog.author?.avatar || 'https://via.placeholder.com/100'} alt={blog.author?.name} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--blog-text-main)' }}>{blog.author?.name || 'Editorial Team'}</strong>
                    <span>{new Date(blog.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="blog-newsletter">
          <h3>Get the best insights delivered to your inbox</h3>
          <p>Join 10,000+ professionals receiving our weekly newsletter.</p>
          <form onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>

      </div>
    </div>
  );
}
