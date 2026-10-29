import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowDown, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import CaseStudyCard from '../components/case-studies/CaseStudyCard';
import type { CaseStudy } from '../types/caseStudy';
import { API_BASE } from '../utils/apiConfig';
import './CaseStudies.css';

export function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'latest' | 'alphabetical'>('featured');

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/case-studies`);
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.case_studies) && data.case_studies.length > 0) {
          setCaseStudies(data.case_studies);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching case studies:', err);
    }

    // Fallback: check localStorage for saved case studies
    try {
      const ls = localStorage.getItem('etromo_admin_case_studies');
      if (ls) {
        const parsed = JSON.parse(ls);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const published = parsed.filter((cs: CaseStudy) => cs.status === 'published');
          if (published.length > 0) {
            setCaseStudies(published);
            setLoading(false);
            return;
          }
        }
      }
    } catch {}

    setCaseStudies([]);
    setLoading(false);
  };

  // Derive available categories and industries
  const categories = useMemo(() => {
    const set = new Set<string>();
    caseStudies.forEach(cs => {
      if (cs.category) set.add(cs.category);
    });
    return ['All', ...Array.from(set)];
  }, [caseStudies]);

  const industries = useMemo(() => {
    const set = new Set<string>();
    caseStudies.forEach(cs => {
      if (cs.industry) set.add(cs.industry);
    });
    return ['All', ...Array.from(set)];
  }, [caseStudies]);

  // Filtered and sorted case studies
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter(cs => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.services?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cs.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || cs.category === selectedCategory;

      const matchesIndustry =
        selectedIndustry === 'All' || cs.industry === selectedIndustry;

      return matchesSearch && matchesCategory && matchesIndustry;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return (a.sort_order || 0) - (b.sort_order || 0);
      }
      if (sortBy === 'latest') {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [caseStudies, searchQuery, selectedCategory, selectedIndustry, sortBy]);

  const isFiltering = searchQuery !== '' || selectedCategory !== 'All' || selectedIndustry !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedIndustry('All');
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('projects-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <PageSEO
        title="Case Studies & Measurable Results"
        description="Discover how Etromo helps enterprise organizations solve complex operational challenges, engineer bespoke platforms, and achieve verified business outcomes."
        url="/case-studies"
      />

      {/* ── 3.1 HERO SECTION ── */}
      <section className="hero case-studies-hero" style={{ minHeight: '85vh', padding: '160px 0 100px' }}>
        <div className="orb" />
        <div className="flute" />
        <div className="wrap">
          <div style={{ maxWidth: '820px' }}>
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
              <ShieldCheck size={14} /> CASE STUDIES
            </div>

            <h1 style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '24px' }}>
              Real Challenges.<br />
              <span style={{ background: 'linear-gradient(180deg, #FFFFFF 20%, #8FC1FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Measurable Results.
              </span>
            </h1>

            <p className="sub" style={{ fontSize: '18px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.72)', maxWidth: '640px', marginBottom: '40px' }}>
              Discover how we help businesses solve operational challenges, build digital products, and improve business performance through practical technology solutions.
            </p>

            <div className="cta" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={scrollToCatalog}
                className="btn p"
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Explore Case Studies <ArrowDown size={15} />
              </button>

              <Link
                to="/contact"
                className="btn"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.15)'
                }}
              >
                Discuss Your Project <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Authentic Visual Teaser Banner */}
          <div
            style={{
              marginTop: '64px',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Zero Vanity Metrics</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', margin: '4px 0 0' }}>All outcomes cross-referenced with production logs.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(143, 193, 255, 0.12)',
                  border: '1px solid rgba(143, 193, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sky, #8FC1FF)',
                  flexShrink: 0
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Audited Before & After</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', margin: '4px 0 0' }}>Clear separation of baseline data and verified lifts.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(255, 217, 125, 0.12)',
                  border: '1px solid rgba(255, 217, 125, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD97D',
                  flexShrink: 0
                }}
              >
                <Filter size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Live Product References</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', margin: '4px 0 0' }}>Direct client sites with automated favicon detection.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.2 PROJECT FILTERS & 3.3 PREVIEW LAYOUT ── */}
      <section id="projects-catalog" style={{ padding: '80px 0 160px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="wrap">
          {/* Controls Bar */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '48px',
              backdropFilter: 'blur(16px)'
            }}
          >
            {/* Top row: Search and Selects */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}
            >
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by title, client, industry or technology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Industry Dropdown */}
              <div>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0d131f',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="All">All Industries</option>
                  {industries.filter(i => i !== 'All').map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0d131f',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="featured">Sort by: Featured Projects</option>
                  <option value="latest">Sort by: Latest Published</option>
                  <option value="alphabetical">Sort by: Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Category Pills + Result Count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
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
                      fontSize: '12px',
                      fontWeight: selectedCategory === cat ? 600 : 400,
                      border: selectedCategory === cat ? '1px solid var(--sky, #8FC1FF)' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: selectedCategory === cat ? 'rgba(143, 193, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedCategory === cat ? 'var(--sky, #8FC1FF)' : 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Showing <strong style={{ color: '#FFFFFF' }}>{filteredCaseStudies.length}</strong> {filteredCaseStudies.length === 1 ? 'case study' : 'case studies'}
                </span>

                {isFiltering && (
                  <button
                    onClick={clearFilters}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--sky, #8FC1FF)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '4px 8px'
                    }}
                  >
                    <X size={12} /> Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Case Studies Grid */}
          {loading ? (
            <div style={{ padding: '80px 0', textAlign: 'center', opacity: 0.5 }}>
              Loading published case studies...
            </div>
          ) : filteredCaseStudies.length > 0 ? (
            <div
              className="case-studies-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '28px'
              }}
            >
              {filteredCaseStudies.map(cs => (
                <CaseStudyCard key={cs.id || cs.slug} caseStudy={cs} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px'
              }}
            >
              <h3 style={{ fontSize: '20px', color: '#FFFFFF', marginBottom: '8px' }}>No Case Studies Found</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', maxWidth: '420px', margin: '0 auto 20px' }}>
                No published case studies match your active search or filter criteria.
              </p>
              {isFiltering && (
                <button
                  onClick={clearFilters}
                  className="btn p"
                  style={{ cursor: 'pointer' }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="final" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="wrap">
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, color: '#FFFFFF', marginBottom: '20px' }}>
            Working on a Similar Challenge?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.65)', maxWidth: '520px', margin: '0 auto 36px' }}>
            Book a direct technical architecture session with our engineering practice leaders.
          </p>
          <div className="cta" style={{ justifyContent: 'center' }}>
            <Link to="/contact" className="btn p">
              Discuss Your Project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default CaseStudiesPage;
