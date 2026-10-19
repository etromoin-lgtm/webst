import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Search } from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';

export function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const resources = [
    {
      id: 1,
      title: 'Enterprise CRM Migration & Data Normalization Playbook',
      category: 'Architecture Playbook',
      type: 'Technical Guide',
      readTime: '18 min read',
      description: 'A comprehensive operational framework for decoupling legacy lead pipelines, mitigating data loss, and implementing resilient webhook queues.',
      updated: 'October 2025',
      downloadable: true
    },
    {
      id: 2,
      title: 'Sub-Minute KYC & Zero-Trust AML Architecture Whitepaper',
      category: 'Security & Compliance',
      type: 'Whitepaper',
      readTime: '24 min read',
      description: 'Architecting cryptographic audit vaults, real-time sanction list screening, and computer vision document verification pipelines.',
      updated: 'September 2025',
      downloadable: true
    },
    {
      id: 3,
      title: 'High-Volume Kitchen Display Systems & Offline-First Sync Specification',
      category: 'Autonomous Systems',
      type: 'Engineering Spec',
      readTime: '14 min read',
      description: 'Designing distributed local SQLite edge daemons for uninterrupted point-of-sale transaction processing during network loss.',
      updated: 'August 2025',
      downloadable: true
    },
    {
      id: 4,
      title: 'WhatsApp Cloud API for High-Velocity Sales: Production Engineering Guide',
      category: 'Messaging & AI',
      type: 'Integration Guide',
      readTime: '12 min read',
      description: 'Technical walkthrough of Meta Cloud API webhook reliability, session state management, rate limit buffering, and message templates.',
      updated: 'November 2025',
      downloadable: true
    }
  ];

  const categories = ['All', 'Architecture Playbook', 'Security & Compliance', 'Autonomous Systems', 'Messaging & AI'];

  const filtered = resources.filter(r => {
    const matchesSearch =
      search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <>
      <PageSEO
        title="Engineering Resources & Architecture Playbooks"
        description="Access technical whitepapers, system architecture specifications, and implementation playbooks from Etromo engineering."
        url="/resources"
      />

      <section className="hero" style={{ minHeight: '75vh', padding: '150px 0 80px' }}>
        <div className="orb" />
        <div className="flute" />
        <div className="wrap">
          <div style={{ maxWidth: '760px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(143, 193, 255, 0.1)',
                border: '1px solid rgba(143, 193, 255, 0.25)',
                color: 'var(--sky, #8FC1FF)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '28px'
              }}
            >
              <BookOpen size={14} /> TECHNICAL RESOURCES
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 500, lineHeight: 1.1, color: '#FFFFFF', marginBottom: '20px' }}>
              Engineering Frameworks & Playbooks
            </h1>

            <p className="sub" style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px', marginBottom: '32px' }}>
              Practical architectural blueprints, security checklists, and technical documentation produced directly by our engineering teams.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 140px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="wrap">
          {/* Filter / Search Bar */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '40px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: selectedCategory === cat ? 600 : 400,
                    border: selectedCategory === cat ? '1px solid var(--sky, #8FC1FF)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: selectedCategory === cat ? 'rgba(143, 193, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedCategory === cat ? 'var(--sky, #8FC1FF)' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Resources Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {filtered.map(r => (
              <div
                key={r.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, border-color 0.25s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(143, 193, 255, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--sky, #8FC1FF)', fontWeight: 600 }}>
                    {r.type}
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
                    {r.readTime}
                  </span>
                </div>

                <h3 style={{ fontSize: '19px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.35, marginBottom: '12px' }}>
                  {r.title}
                </h3>

                <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.65)', marginBottom: '24px', flexGrow: 1 }}>
                  {r.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>Updated {r.updated}</span>
                  <Link
                    to="/contact"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--sky, #8FC1FF)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Request Document <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ResourcesPage;
