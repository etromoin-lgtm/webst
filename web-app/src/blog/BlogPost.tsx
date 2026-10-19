import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Share2, Bookmark } from 'lucide-react';
import { TwitterIcon, LinkedinIcon } from '../SocialIcons';
import './Blog.css';

const DUMMY_HTML = `
  <p>The real estate industry has traditionally been slow to adopt new technologies. But in 2026, the landscape has fundamentally shifted. Artificial intelligence is no longer a buzzword—it is the baseline for competitive operations.</p>
  
  <h2>The Data-Driven Pipeline</h2>
  <p>Before implementing intelligent systems, developers and brokers relied on fragmented data across Excel sheets, WhatsApp messages, and disconnected CRMs. Today, AI unifies this data.</p>
  
  <blockquote>
    "The companies that will survive the next decade are those that treat their lead data as an interconnected nervous system rather than isolated spreadsheets."
  </blockquote>
  
  <p>By automating the initial qualification process, sales teams are saving an average of 14 hours per week, allowing them to focus entirely on closing deals and building relationships.</p>

  <h3>Comparing Legacy and Modern Systems</h3>
  <p>Let's look at a direct comparison of traditional operations versus an AI-driven workflow.</p>
  
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>Legacy Systems</th>
        <th>AI-Powered CRM</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Lead Qualification</td>
        <td>Manual calls (Days)</td>
        <td>Instant via WhatsApp Bot (Seconds)</td>
      </tr>
      <tr>
        <td>Data Entry</td>
        <td>Manual typing</td>
        <td>Auto-extraction from sources</td>
      </tr>
      <tr>
        <td>Follow-ups</td>
        <td>Calendar reminders</td>
        <td>Predictive scheduling</td>
      </tr>
      <tr>
        <td>Reporting</td>
        <td>End of month Excel exports</td>
        <td>Real-time dashboard analytics</td>
      </tr>
    </tbody>
  </table>

  <h3>Visualizing the Impact</h3>
  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Dashboard Analytics Visualization" />
  
  <h2>Video Walkthrough</h2>
  <p>Watch our team explain how we implemented this for a Top 10 Developer in Dubai.</p>
  <div class="youtube-container">
    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>

  <h2>Conclusion</h2>
  <p>The transition to intelligent workflows isn't just about saving time; it's about providing a superior customer experience. The future belongs to those who adapt.</p>
`;

const MOCK_POST = {
  title: 'The Future of AI in Real Estate Operations',
  category: 'Technology',
  published_date: '2026-10-05T10:00:00Z',
  image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  content: DUMMY_HTML,
  author: {
    name: 'Sarah Jenkins',
    role: 'Head of Product Strategy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    bio: 'Sarah has over a decade of experience designing enterprise software systems for the real estate sector. She previously led automation teams at top tech firms.'
  }
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(MOCK_POST);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch post from API
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.blog) {
          setPost(data.blog);
        }
      })
      .catch(console.error);
  }, [slug]);

  const toc = [
    { id: 'the-data-driven-pipeline', title: 'The Data-Driven Pipeline' },
    { id: 'comparing-legacy-and-modern-systems', title: 'Comparing Legacy and Modern Systems' },
    { id: 'visualizing-the-impact', title: 'Visualizing the Impact' },
    { id: 'video-walkthrough', title: 'Video Walkthrough' },
    { id: 'conclusion', title: 'Conclusion' }
  ];

  return (
    <div className="blog-light-theme">
      {/* Blog Hero */}
      <div style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '400px', maxHeight: '700px', marginBottom: '100px' }}>
        {post.image_url ? (
          <img src={post.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--ink)' }}></div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,8,15,0.3) 0%, #05080f 100%)' }}></div>
        
        <div className="wrap" style={{ position: 'absolute', bottom: '-60px', left: 0, right: 0, zIndex: 10 }}>
          <div style={{ background: 'rgba(15, 20, 30, 0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '48px', maxWidth: '900px', margin: '0 auto', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              {post.category && <span style={{ background: 'rgba(143,193,255,0.15)', color: 'var(--sky)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{post.category}</span>}
              <span style={{ opacity: 0.6, fontSize: '14px', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>{new Date(post.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.15, fontWeight: '300', letterSpacing: '-0.02em', marginBottom: '24px' }}>{post.title}</h1>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
              <ChevronLeft size={14} /> Back to Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="blog-container">
        <article className="blog-article-container">

          <div className="blog-article-layout">
            {/* Main Content */}
            <div className="blog-rich-content" dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>

            {/* Sidebar */}
            <aside className="blog-sidebar">
              <div className="blog-toc">
                <h4>Table of Contents</h4>
                <ul>
                  {toc.map(item => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '32px', padding: '24px', background: 'var(--blog-surface)', borderRadius: '16px', border: '1px solid var(--blog-border)' }}>
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--blog-text-muted)', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>Share Article</h4>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blog-text-muted)', display: 'flex', alignItems: 'center' }} title="Share on Twitter"><TwitterIcon size={20} /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blog-text-muted)', display: 'flex', alignItems: 'center' }} title="Share on LinkedIn"><LinkedinIcon size={20} /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blog-text-muted)' }}><Share2 size={20} /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blog-text-muted)', marginLeft: 'auto' }}><Bookmark size={20} /></button>
                </div>
              </div>
            </aside>
          </div>

          {/* Author Bio Box */}
          <div className="blog-author-box">
            <img src={post.author.avatar} alt={post.author.name} />
            <div>
              <h4>{post.author.name}</h4>
              <span style={{ color: 'var(--blog-accent)', fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>{post.author.role}</span>
              <p>{post.author.bio}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
