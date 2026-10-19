import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  Cpu,
  Target,
  CheckCircle2,
  Quote,
  Share2,
  Check,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import FaviconLink from '../components/ui/FaviconLink';
import { getFaviconUrl, extractDomain } from '../utils/favicon';
import BeforeAfterTable from '../components/case-studies/BeforeAfterTable';
import CustomDataTable from '../components/case-studies/CustomDataTable';
import CaseStudyCard from '../components/case-studies/CaseStudyCard';
import type { CaseStudy } from '../types/caseStudy';
import './CaseStudies.css';

const API_BASE = '';

export function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [related, setRelated] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API_BASE}/api/case-studies/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.case_study) {
          setCaseStudy(data.case_study);
          loadRelated(data.case_study.slug);
        } else {
          setError('Case study not found');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load case study');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const loadRelated = async (currentSlug: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/case-studies`);
      const data = await res.json();
      if (data.success && data.case_studies) {
        const others = data.case_studies
          .filter((cs: CaseStudy) => cs.slug !== currentSlug)
          .slice(0, 3);
        setRelated(others);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}>
        Loading case study...
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: '#FFFFFF', marginBottom: '16px' }}>Case Study Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>The requested project documentation could not be retrieved or is in draft mode.</p>
        <Link to="/case-studies" className="btn p">
          ← Back to All Case Studies
        </Link>
      </div>
    );
  }

  const clientDisplayName = caseStudy.is_client_confidential
    ? 'Confidential Global Client'
    : caseStudy.client_name;

  const publicLinks = (caseStudy.external_links || []).filter(l => l.display);

  const sections = [
    { id: 'overview', label: '1. Overview' },
    { id: 'challenge', label: '2. The Challenge' },
    { id: 'goals', label: '3. Goals & Baseline' },
    { id: 'approach', label: '4. Our Approach' },
    { id: 'solution', label: '5. The Solution' },
    { id: 'benchmarks', label: '6. Benchmarks' },
    { id: 'results', label: '7. Verified Results' },
    { id: 'methodology', label: '8. Methodology' },
    { id: 'lessons', label: '9. Lessons & Review' },
  ];

  return (
    <>
      <PageSEO
        title={caseStudy.seo_title || `${caseStudy.title} | Case Study`}
        description={caseStudy.seo_description || caseStudy.subtitle}
        url={`/case-studies/${caseStudy.slug}`}
      />

      <article style={{ background: 'var(--ink, #05080F)', color: '#FFFFFF', paddingTop: '100px' }}>
        {/* ── SECTION 1: PROJECT HERO ── */}
        <header
          style={{
            padding: '40px 0 60px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(143,193,255,0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div className="wrap">
            {/* Breadcrumbs & Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/case-studies" style={{ color: 'var(--sky, #8FC1FF)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={13} /> Case Studies
                </Link>
                <span>/</span>
                <span>{caseStudy.category}</span>
                <span>/</span>
                <span style={{ color: '#FFFFFF', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {caseStudy.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleShare}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? <Check size={13} style={{ color: '#34D399' }} /> : <Share2 size={13} />}
                  {copied ? 'Link Copied!' : 'Share Case Study'}
                </button>
              </div>
            </div>

            {/* Category Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(143, 193, 255, 0.12)',
                  border: '1px solid rgba(143, 193, 255, 0.25)',
                  color: 'var(--sky, #8FC1FF)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {caseStudy.category}
              </span>

              {caseStudy.duration && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <Clock size={13} /> {caseStudy.duration} Implementation
                </span>
              )}

              {caseStudy.featured && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 217, 125, 0.15)', color: '#FFD97D', fontSize: '11px', fontWeight: 600 }}>
                  Featured Project
                </span>
              )}
            </div>

            {/* Title & Subtitle */}
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 54px)',
                fontWeight: 600,
                lineHeight: 1.15,
                color: '#FFFFFF',
                maxWidth: '960px',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}
            >
              {caseStudy.title}
            </h1>

            <p
              style={{
                fontSize: '19px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.75)',
                maxWidth: '820px',
                marginBottom: '32px'
              }}
            >
              {caseStudy.subtitle}
            </p>

            {/* External Links & Live Project Bar (Client Links with Favicons) */}
            {(caseStudy.embedded_link || publicLinks.length > 0) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '36px'
                }}
              >
                {caseStudy.embedded_link && (
                  <a
                    href={caseStudy.embedded_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: 'rgba(47, 107, 255, 0.15)',
                      border: '1px solid rgba(143, 193, 255, 0.3)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    title="Visit live client project"
                  >
                    <img
                      src={getFaviconUrl(caseStudy.embedded_link, caseStudy.custom_favicon_url, 32)}
                      alt=""
                      style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'contain' }}
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span>Visit Live Project ({extractDomain(caseStudy.embedded_link)})</span>
                    <ExternalLink size={13} style={{ color: 'var(--sky, #8FC1FF)' }} />
                  </a>
                )}
                {publicLinks.map(link => (
                  <FaviconLink key={link.id || link.url} link={link} variant="button" showTypeBadge />
                ))}
              </div>
            )}

            {/* Cover Visual */}
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
                maxHeight: '560px',
                background: '#0a0d14'
              }}
            >
              <img
                src={caseStudy.cover_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'}
                alt={caseStudy.title}
                style={{ width: '100%', height: '100%', maxHeight: '560px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT LAYOUT WITH DESKTOP STICKY OUTLINE ── */}
        <div className="wrap" style={{ padding: '60px 0 120px' }}>
          <div className="case-study-grid-layout">
            {/* Main Narrative Column */}
            <div style={{ minWidth: 0 }}>
              {/* Mobile Collapsible Table of Contents (< 1024px) */}
              <div className="case-study-mobile-toc">
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(o => !o)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                  aria-expanded={mobileTocOpen}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={15} style={{ color: 'var(--sky, #8FC1FF)' }} />
                    Table of Contents ({sections.length} Sections)
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: mobileTocOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      opacity: 0.7
                    }}
                  />
                </button>

                {mobileTocOpen && (
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '6px'
                    }}
                  >
                    {sections.map(s => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={`case-study-toc-link ${activeSection === s.id ? 'active' : ''}`}
                        onClick={() => {
                          setActiveSection(s.id);
                          setMobileTocOpen(false);
                        }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* ── SECTION 2: PROJECT OVERVIEW (METADATA) ── */}
              <section id="overview" style={{ padding: '0 0 56px', border: 0 }}>
                <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
                  Project Overview
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '4px' }}>
                      Client Organization
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                      {clientDisplayName}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '4px' }}>
                      Industry
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                      {caseStudy.industry || 'Technology'}
                    </span>
                  </div>

                  {caseStudy.business_type && (
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '4px' }}>
                        Business Model
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                        {caseStudy.business_type}
                      </span>
                    </div>
                  )}

                  {caseStudy.duration && (
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '4px' }}>
                        Delivery Timeline
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                        {caseStudy.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Services & Tech Tags */}
                {((caseStudy.services && caseStudy.services.length > 0) || (caseStudy.technologies && caseStudy.technologies.length > 0)) && (
                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {caseStudy.services && caseStudy.services.length > 0 && (
                      <div>
                        <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '8px' }}>
                          Delivered Capabilities:
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {caseStudy.services.map((srv, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.85)'
                              }}
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                      <div>
                        <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '8px' }}>
                          Core Technology Stack:
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {caseStudy.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                background: 'rgba(143, 193, 255, 0.06)',
                                border: '1px solid rgba(143, 193, 255, 0.18)',
                                fontSize: '12px',
                                color: 'var(--sky, #8FC1FF)',
                                fontFamily: 'var(--mono, monospace)'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* ── SECTION 3: THE CHALLENGE ── */}
              <section id="challenge" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#EF4444' }}>
                    THE PROBLEM
                  </span>
                </div>

                <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '18px' }}>
                  Operational Bottlenecks & Business Pain Points
                </h3>

                <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
                  {caseStudy.challenge_overview}
                </p>

                {caseStudy.challenge_points && caseStudy.challenge_points.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      background: 'rgba(239, 68, 68, 0.03)',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                      borderRadius: '16px',
                      padding: '24px'
                    }}
                  >
                    {caseStudy.challenge_points.map((pt, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ color: '#EF4444', fontSize: '18px', lineHeight: 1 }}>•</span>
                        <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.85)' }}>
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ── SECTION 4: GOALS AND BASELINE ── */}
              {caseStudy.goals_baseline && caseStudy.goals_baseline.length > 0 && (
                <section id="goals" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Target size={16} style={{ color: 'var(--sky, #8FC1FF)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky, #8FC1FF)' }}>
                      INITIAL MEASUREMENTS
                    </span>
                  </div>

                  <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '18px' }}>
                    Project Goals & Baseline Audits
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {caseStudy.goals_baseline.map((g, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '20px'
                        }}
                      >
                        <h4 style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 12px' }}>{g.metric}</h4>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--mono, monospace)' }}>
                            {g.initial_value}
                          </span>
                          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>{g.unit}</span>
                        </div>
                        {g.target && (
                          <div style={{ fontSize: '12px', color: '#34D399', marginBottom: '4px' }}>
                            Target: <strong>{g.target}</strong>
                          </div>
                        )}
                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
                          Audited: {g.period} {g.source ? `(${g.source})` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── SECTION 5: OUR APPROACH ── */}
              {caseStudy.approach_phases && caseStudy.approach_phases.length > 0 && (
                <section id="approach" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Layers size={16} style={{ color: '#FFD97D' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FFD97D' }}>
                      EXECUTION PHASES
                    </span>
                  </div>

                  <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '18px' }}>
                    Engineering Approach & Project Delivery
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {caseStudy.approach_phases.map((ph, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.025)',
                          border: '1px solid rgba(255, 255, 255, 0.07)',
                          borderRadius: '16px',
                          padding: '24px',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'rgba(143, 193, 255, 0.15)',
                                color: 'var(--sky, #8FC1FF)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700
                              }}
                            >
                              {ph.phase_number || idx + 1}
                            </span>
                            <h4 style={{ fontSize: '17px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{ph.title}</h4>
                          </div>

                          {ph.duration && (
                            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '4px' }}>
                              {ph.duration}
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)', margin: '0 0 16px 40px' }}>
                          {ph.description}
                        </p>

                        {ph.deliverables && ph.deliverables.length > 0 && (
                          <div style={{ marginLeft: '40px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {ph.deliverables.map((d, dIdx) => (
                              <span
                                key={dIdx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '11px',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  background: 'rgba(16, 185, 129, 0.08)',
                                  color: '#34D399',
                                  border: '1px solid rgba(16, 185, 129, 0.2)'
                                }}
                              >
                                <CheckCircle2 size={12} /> {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── SECTION 6: THE SOLUTION ── */}
              <section id="solution" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Cpu size={16} style={{ color: '#34D399' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#34D399' }}>
                    THE SOLUTION
                  </span>
                </div>

                <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '18px' }}>
                  System Architecture & Implemented Capabilities
                </h3>

                <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '28px' }}>
                  {caseStudy.solution_overview}
                </p>

                {caseStudy.solution_architecture_image && (
                  <div
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '32px',
                      background: '#0d131f'
                    }}
                  >
                    <img
                      src={caseStudy.solution_architecture_image}
                      alt="System Architecture Diagram"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.4)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                      Production Architecture & Data Flow Diagram
                    </div>
                  </div>
                )}

                {caseStudy.solution_features && caseStudy.solution_features.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {caseStudy.solution_features.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.07)',
                          borderRadius: '16px',
                          padding: '24px'
                        }}
                      >
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                          {feat.title}
                        </h4>
                        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.65)', margin: 0 }}>
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ── SECTION 7: BEFORE-AND-AFTER COMPARISON TABLE ── */}
              <section id="benchmarks" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <ShieldCheck size={16} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#10B981' }}>
                    AUDITED COMPARISON
                  </span>
                </div>

                <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                  Before-and-After Verified Benchmarks
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '24px' }}>
                  Numerical comparisons audited directly against system logs and client operational reports.
                </p>

                <BeforeAfterTable metrics={caseStudy.before_after_metrics || []} />

                {/* Custom Tables if present */}
                {caseStudy.custom_tables && caseStudy.custom_tables.map(table => (
                  <CustomDataTable key={table.id} table={table} />
                ))}
              </section>

              {/* ── SECTION 8: RESULTS AND BUSINESS IMPACT ── */}
              {caseStudy.key_results && caseStudy.key_results.length > 0 && (
                <section id="results" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--sky, #8FC1FF)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky, #8FC1FF)' }}>
                      VERIFIED OUTCOMES
                    </span>
                  </div>

                  <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '24px' }}>
                    Measurable Business Impact
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {caseStudy.key_results.map((kr, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '24px',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#34D399',
                              fontFamily: 'var(--mono, monospace)',
                              letterSpacing: '-0.02em'
                            }}
                          >
                            {kr.metric}
                          </span>
                          {kr.verified && (
                            <span title="Verified Data Point" style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <ShieldCheck size={16} style={{ color: '#10B981' }} />
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 6px' }}>
                          {kr.label}
                        </h4>

                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.5 }}>
                          {kr.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── SECTION 9: EVIDENCE AND METHODOLOGY ── */}
              {caseStudy.methodology && (
                <section id="methodology" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
                    Evidence & Measurement Methodology
                  </h3>
                  <div
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      fontSize: '14px',
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.75)'
                    }}
                  >
                    {caseStudy.methodology}
                  </div>
                </section>
              )}

              {/* ── SECTION 10: LESSONS LEARNED & TESTIMONIAL ── */}
              <section id="lessons" style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {caseStudy.lessons_learned && caseStudy.lessons_learned.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
                      Key Architectural Lessons & Recommendations
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {caseStudy.lessons_learned.map((ls, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                        >
                          <span style={{ color: 'var(--sky, #8FC1FF)', fontWeight: 700, fontSize: '13px' }}>0{idx + 1}.</span>
                          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>{ls}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {caseStudy.testimonial && (
                  <div
                    style={{
                      padding: '32px',
                      borderRadius: '20px',
                      background: 'radial-gradient(ellipse at 50% 0%, rgba(143,193,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(143, 193, 255, 0.2)',
                      position: 'relative'
                    }}
                  >
                    <Quote size={32} style={{ color: 'var(--sky, #8FC1FF)', opacity: 0.4, marginBottom: '16px' }} />
                    <p style={{ fontSize: '17px', fontStyle: 'italic', lineHeight: 1.7, color: '#FFFFFF', marginBottom: '24px' }}>
                      "{caseStudy.testimonial.quote}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {caseStudy.testimonial.avatar && (
                        <img
                          src={caseStudy.testimonial.avatar}
                          alt={caseStudy.testimonial.author}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>{caseStudy.testimonial.author}</div>
                        <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)' }}>
                          {caseStudy.testimonial.role}, {caseStudy.testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Desktop Sticky Outline Sidebar */}
            <aside className="case-study-toc-sidebar">
              <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '16px' }}>
                TABLE OF CONTENTS
              </h4>

              <div className="case-study-toc-links">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`case-study-toc-link ${activeSection === s.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(s.id)}
                  >
                    {s.label}
                  </a>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />

              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '16px', lineHeight: 1.5 }}>
                Published by <strong style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{caseStudy.author || 'Enterprise Systems Practice'}</strong>
              </div>

              <Link
                to="/contact"
                className="btn p"
                style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '12px', boxSizing: 'border-box' }}
              >
                Discuss Your Project →
              </Link>
            </aside>
          </div>
        </div>

        {/* ── SECTION 11: RELATED PROJECTS ── */}
        {related.length > 0 && (
          <section style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.01)' }}>
            <div className="wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--sky, #8FC1FF)' }}>
                    EXPLORE MORE WORK
                  </span>
                  <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 0' }}>
                    Related Case Studies
                  </h3>
                </div>

                <Link to="/case-studies" style={{ color: 'var(--sky, #8FC1FF)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  All Projects <ArrowRight size={14} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px'
                }}
              >
                {related.map(r => (
                  <CaseStudyCard key={r.id || r.slug} caseStudy={r} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 12: CLOSING CTA ── */}
        <section className="final" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="wrap">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 500, color: '#FFFFFF', marginBottom: '20px' }}>
              Working on a Similar Challenge?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.65)', maxWidth: '520px', margin: '0 auto 36px' }}>
              Collaborate directly with our systems engineers to architect solutions with verified outcomes.
            </p>
            <div className="cta" style={{ justifyContent: 'center' }}>
              <Link to="/contact" className="btn p">
                Discuss Your Project →
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

export default CaseStudyDetailPage;
