import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Eye,
  Check,
  AlertCircle,
  Save
} from 'lucide-react';
import type {
  CaseStudy,
  CaseStudyExternalLink,
  CaseStudyBeforeAfterMetric,
  CaseStudyKeyResult,
  CaseStudyGoal,
  CaseStudyPhase,
  CaseStudyFeature,
  CaseStudyStatus
} from '../../types/caseStudy';
import { calculateMetricChange } from '../../utils/metricCalculator';
import FaviconLink from '../ui/FaviconLink';
import { getFaviconUrl, extractDomain, getFallbackInitials } from '../../utils/favicon';
import { getApiBase } from '../../utils/apiConfig';

const API_BASE = getApiBase();

interface CaseStudiesStudioProps {
  onStatsChange?: () => void;
}

export const CaseStudiesStudio: React.FC<CaseStudiesStudioProps> = ({ onStatsChange }) => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Editor mode
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<CaseStudy>({
    slug: '',
    title: '',
    subtitle: '',
    category: 'CRM & Business Automation',
    industry: 'Real Estate & PropTech',
    client_name: '',
    is_client_confidential: false,
    cover_image: '',
    duration: '8 Weeks',
    services: [],
    technologies: [],
    business_type: 'B2B Enterprise',
    challenge_overview: '',
    challenge_points: [],
    goals_baseline: [],
    approach_phases: [],
    solution_overview: '',
    solution_features: [],
    solution_architecture_image: '',
    before_after_metrics: [],
    key_results: [],
    methodology: '',
    lessons_learned: [],
    external_links: [],
    custom_tables: [],
    testimonial: null,
    status: 'published',
    featured: false,
    featured_on_homepage: false,
    featured_in_trusted_by: false,
    embedded_link: '',
    custom_favicon_url: '',
    sort_order: 1,
    author: 'Engineering Team',
    seo_title: '',
    seo_description: ''
  });

  // Favicon detection loading state map: linkId -> boolean
  const [detectingFavicon, setDetectingFavicon] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/case-studies?all=true`);
      const data = await res.json();
      if (data.success && data.case_studies) {
        setCaseStudies(data.case_studies);
      }
    } catch (err) {
      console.error('Failed to load case studies:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      slug: '',
      title: '',
      subtitle: '',
      category: 'CRM & Business Automation',
      industry: 'Enterprise Technology',
      client_name: '',
      is_client_confidential: false,
      cover_image: '',
      duration: '8 Weeks',
      services: ['Workflow Architecture', 'Custom Integration'],
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      business_type: 'B2B Enterprise',
      challenge_overview: '',
      challenge_points: ['Critical latency during peak business operations'],
      goals_baseline: [
        { metric: 'Initial SLA Latency', initial_value: '180', unit: 'Minutes', period: 'Pre-Deployment Baseline', target: '< 5 Minutes', source: 'Internal log' }
      ],
      approach_phases: [
        { phase_number: 1, title: 'Discovery & Architecture', duration: 'Weeks 1-2', description: 'System audit and requirements breakdown', deliverables: ['Architecture Spec'] }
      ],
      solution_overview: '',
      solution_features: [
        { title: 'Asynchronous Event Pipeline', description: 'Real-time processing with zero data loss.' }
      ],
      solution_architecture_image: '',
      before_after_metrics: [
        {
          id: 'metric-1',
          name: 'Processing Latency',
          type: 'duration',
          before: 180,
          after: 2.5,
          unit: 'Minutes',
          direction: 'lower_is_better',
          period: '90-Day Audit',
          change_display: '-98.6% Reduction',
          evidence: 'Production Server Timestamps',
          verified: true,
          show_public: true,
          notes: 'Measured over 10,000 transactions.'
        }
      ],
      key_results: [
        { metric: '-98.6%', label: 'Turnaround Latency', unit: 'Reduction', context: 'From 180 mins to 2.5 mins', verified: true }
      ],
      methodology: 'Verified against continuous production telemetry and database logs.',
      lessons_learned: ['Early data normalization prevented downstream queue bottlenecks.'],
      external_links: [],
      custom_tables: [],
      testimonial: null,
      status: 'published',
      featured: false,
      featured_on_homepage: false,
      featured_in_trusted_by: false,
      embedded_link: '',
      custom_favicon_url: '',
      sort_order: (caseStudies.length || 0) + 1,
      author: 'Engineering Team',
      seo_title: '',
      seo_description: ''
    });
    setActiveStep(1);
    setIsEditing(true);
    setSaveError(null);
  };

  const handleEdit = (cs: CaseStudy) => {
    setForm({
      ...cs,
      services: Array.isArray(cs.services) ? cs.services : [],
      technologies: Array.isArray(cs.technologies) ? cs.technologies : [],
      challenge_points: Array.isArray(cs.challenge_points) ? cs.challenge_points : [],
      goals_baseline: Array.isArray(cs.goals_baseline) ? cs.goals_baseline : [],
      approach_phases: Array.isArray(cs.approach_phases) ? cs.approach_phases : [],
      solution_features: Array.isArray(cs.solution_features) ? cs.solution_features : [],
      before_after_metrics: Array.isArray(cs.before_after_metrics) ? cs.before_after_metrics : [],
      key_results: Array.isArray(cs.key_results) ? cs.key_results : [],
      lessons_learned: Array.isArray(cs.lessons_learned) ? cs.lessons_learned : [],
      external_links: Array.isArray(cs.external_links) ? cs.external_links : [],
      custom_tables: Array.isArray(cs.custom_tables) ? cs.custom_tables : []
    });
    setActiveStep(1);
    setIsEditing(true);
    setSaveError(null);
  };

  const handleDuplicate = async (cs: CaseStudy) => {
    if (!cs.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/case-studies/${cs.id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadCaseStudies();
        if (onStatsChange) onStatsChange();
      }
    } catch (err) {
      console.error('Error duplicating case study:', err);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm('Are you sure you want to delete this case study? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/case-studies/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await loadCaseStudies();
        if (onStatsChange) onStatsChange();
      }
    } catch (err) {
      console.error('Error deleting case study:', err);
    }
  };

  // Favicon detector trigger
  const handleDetectFavicon = async (linkIndex: number) => {
    const link = form.external_links[linkIndex];
    if (!link || !link.url) return;

    setDetectingFavicon(prev => ({ ...prev, [link.id || linkIndex]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/case-studies/detect-favicon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link.url })
      });
      const data = await res.json();

      const updatedLinks = [...form.external_links];
      if (data.success && data.favicon_url) {
        updatedLinks[linkIndex] = {
          ...link,
          favicon_url: data.favicon_url,
          favicon_status: 'found',
          verified: true
        };
      } else {
        updatedLinks[linkIndex] = {
          ...link,
          favicon_status: data.status || 'not_found'
        };
      }
      setForm({ ...form, external_links: updatedLinks });
    } catch (err) {
      console.error('Favicon detection error:', err);
    } finally {
      setDetectingFavicon(prev => ({ ...prev, [link.id || linkIndex]: false }));
    }
  };

  // Save form
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.title.trim()) {
      setSaveError('Title is required');
      return;
    }
    if (!form.slug.trim()) {
      form.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    setSaving(true);
    setSaveError(null);

    try {
      const isUpdate = Boolean(form.id);
      const url = isUpdate ? `${API_BASE}/api/case-studies/${form.id}` : `${API_BASE}/api/case-studies`;
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        await loadCaseStudies();
        if (onStatsChange) onStatsChange();
        if (!isUpdate && data.case_study) {
          setForm(data.case_study);
        }
      } else {
        setSaveError(data.error || 'Failed to save case study');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Server error while saving');
    } finally {
      setSaving(false);
    }
  };

  // Filtered case studies
  const filteredCaseStudies = caseStudies.filter(cs => {
    const matchesSearch =
      search === '' ||
      cs.title.toLowerCase().includes(search.toLowerCase()) ||
      cs.client_name.toLowerCase().includes(search.toLowerCase()) ||
      cs.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || cs.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || cs.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(caseStudies.map(c => c.category))).filter(Boolean);

  // ─────────────────────────────────────────────────────────────
  // RENDER: EDITOR VIEW
  // ─────────────────────────────────────────────────────────────
  if (isEditing) {
    const steps = [
      { num: 1, label: 'Basic Info' },
      { num: 2, label: 'Client & Links' },
      { num: 3, label: 'Challenge & Goals' },
      { num: 4, label: 'Approach' },
      { num: 5, label: 'Solution' },
      { num: 6, label: 'Before & After' },
      { num: 7, label: 'Results & Methodology' },
      { num: 8, label: 'Tables & Review' },
      { num: 9, label: 'Publish & SEO' }
    ];

    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Editor Top Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--sky, #8FC1FF)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px'
              }}
            >
              ← Back to Case Studies List
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              {form.id ? `Edit: ${form.title}` : 'Create New Case Study'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {form.slug && (
              <a
                href={`http://localhost:5173/case-studies/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  textDecoration: 'none'
                }}
              >
                <Eye size={14} /> Public Preview
              </a>
            )}

            <button
              onClick={() => handleSave()}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                background: saveSuccess ? '#10B981' : 'var(--paper, #FFFFFF)',
                color: '#000000',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {saving ? <RefreshCw size={14} className="spin" /> : saveSuccess ? <Check size={14} /> : <Save size={14} />}
              {saving ? 'Saving...' : saveSuccess ? 'Saved Successfully!' : 'Save Case Study'}
            </button>
          </div>
        </div>

        {saveError && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#F87171',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={15} /> {saveError}
          </div>
        )}

        {/* Step Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: activeStep === s.num ? 'rgba(143, 193, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: activeStep === s.num ? '1px solid var(--sky, #8FC1FF)' : '1px solid rgba(255, 255, 255, 0.06)',
                color: activeStep === s.num ? 'var(--sky, #8FC1FF)' : 'rgba(255, 255, 255, 0.65)',
                fontSize: '13px',
                fontWeight: activeStep === s.num ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ opacity: 0.5 }}>0{s.num}.</span> {s.label}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '32px'
          }}
        >
          {/* ── STEP 1: BASIC INFORMATION ── */}
          {activeStep === 1 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
                1. Project Identity & Basic Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                    CASE STUDY TITLE *
                  </label>
                  <input
                    className="modern-input"
                    value={form.title}
                    onChange={e => {
                      const title = e.target.value;
                      setForm(f => ({
                        ...f,
                        title,
                        slug: f.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      }));
                    }}
                    placeholder="e.g. Modernizing Lead Distribution for PropStream Realty"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                    URL SLUG * (unique path)
                  </label>
                  <input
                    className="modern-input"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. propstream-lead-automation"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  EXECUTIVE SUMMARY / SUBTITLE
                </label>
                <textarea
                  className="modern-input"
                  rows={3}
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="A concise, high-level summary of the transformation and verified outcome."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                    CATEGORY
                  </label>
                  <input
                    className="modern-input"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. CRM & Business Automation"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                    INDUSTRY
                  </label>
                  <input
                    className="modern-input"
                    value={form.industry}
                    onChange={e => setForm({ ...form, industry: e.target.value })}
                    placeholder="e.g. Real Estate & PropTech"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                    PROJECT DURATION
                  </label>
                  <input
                    className="modern-input"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 10 Weeks"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  COVER IMAGE URL
                </label>
                <input
                  className="modern-input"
                  value={form.cover_image}
                  onChange={e => setForm({ ...form, cover_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
                {form.cover_image && (
                  <div style={{ marginTop: '12px', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={form.cover_image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: CLIENT & EXTERNAL LINKS (WITH AUTOMATIC FAVICON) ── */}
          {activeStep === 2 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                2. Client Website Links & Automatic Favicon Detection
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '24px' }}>
                Add verified client and live product links. The system automatically extracts hostnames and securely resolves high-resolution favicons.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                    CLIENT ORGANIZATION NAME
                  </label>
                  <input
                    className="modern-input"
                    value={form.client_name}
                    onChange={e => setForm({ ...form, client_name: e.target.value })}
                    placeholder="e.g. PropStream Realty Network"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#FFFFFF' }}>
                    <input
                      type="checkbox"
                      checked={form.is_client_confidential}
                      onChange={e => setForm({ ...form, is_client_confidential: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>Anonymize Client (Display as Confidential Global Enterprise)</span>
                  </label>
                </div>
              </div>

              {/* ── LIVE PROJECT EMBEDDED LINK & HOMEPAGE PROMOTION ── */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(47, 107, 255, 0.08) 0%, rgba(143, 193, 255, 0.03) 100%)',
                  border: '1px solid rgba(143, 193, 255, 0.25)',
                  borderRadius: '14px',
                  padding: '24px',
                  marginBottom: '32px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      Live Project / Embedded Website Link
                    </h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                      Enter the client's live project or corporate URL. The system extracts their brand favicon to display across the website and marquee.
                    </p>
                  </div>
                  {form.embedded_link && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#34D399' }}>Live Favicon Detected</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(200px, 1fr)', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--sky, #8FC1FF)', marginBottom: '6px' }}>
                      EMBEDDED PROJECT / CLIENT WEBSITE URL *
                    </label>
                    <input
                      className="modern-input"
                      value={form.embedded_link || ''}
                      onChange={e => setForm({ ...form, embedded_link: e.target.value })}
                      placeholder="e.g. https://propstream.com or https://clientapp.io"
                      style={{ fontFamily: 'monospace', fontSize: '13px' }}
                    />
                  </div>

                  {/* Real-time Favicon Detection Box */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {form.embedded_link ? (
                        <img
                          src={getFaviconUrl(form.embedded_link, form.custom_favicon_url, 64)}
                          alt="Favicon"
                          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                          onError={(e: any) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
                          {getFallbackInitials(form.client_name)}
                        </span>
                      )}
                    </div>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>Extracted Domain</span>
                      <span style={{ display: 'block', fontSize: '13px', color: '#FFFFFF', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {form.embedded_link ? extractDomain(form.embedded_link) : 'None provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* The Two Homepage Promotion Checkboxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '10px',
                      background: form.featured_on_homepage ? 'rgba(47, 107, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: form.featured_on_homepage ? '1px solid rgba(47, 107, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(form.featured_on_homepage)}
                      onChange={e => setForm({ ...form, featured_on_homepage: e.target.checked })}
                      style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--electric, #2F6BFF)' }}
                    />
                    <div>
                      <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        Featured on Homepage Section
                      </span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                        Display full case study card with live client favicon & key metrics on homepage.
                      </span>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: '10px',
                      background: form.featured_in_trusted_by ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: form.featured_in_trusted_by ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(form.featured_in_trusted_by)}
                      onChange={e => setForm({ ...form, featured_in_trusted_by: e.target.checked })}
                      style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#10B981' }}
                    />
                    <div>
                      <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        Featured in 'Trusted By' Continuous Marquee
                      </span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                        Automatically stream client company name & live extracted favicon in homepage moving ticker.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Links list */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    External Reference Links ({form.external_links.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newLink: CaseStudyExternalLink = {
                        id: `link-${Date.now()}`,
                        label: 'Visit Client Website',
                        url: '',
                        type: 'Client Website',
                        display: true,
                        favicon_status: 'loading',
                        verified: false
                      };
                      setForm({ ...form, external_links: [...form.external_links, newLink] });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'rgba(143, 193, 255, 0.12)',
                      border: '1px solid rgba(143, 193, 255, 0.25)',
                      color: 'var(--sky, #8FC1FF)',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} /> Add Website Link
                  </button>
                </div>

                {form.external_links.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                    No external links added yet. Click "+ Add Website Link" above.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {form.external_links.map((link, idx) => (
                      <div
                        key={link.id || idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.025)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          padding: '20px'
                        }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.2fr auto', gap: '12px', alignItems: 'end', marginBottom: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>LINK LABEL</label>
                            <input
                              className="modern-input"
                              value={link.label}
                              onChange={e => {
                                const updated = [...form.external_links];
                                updated[idx].label = e.target.value;
                                setForm({ ...form, external_links: updated });
                              }}
                              placeholder="e.g. Visit Client Website"
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>FULL URL</label>
                            <input
                              className="modern-input"
                              value={link.url}
                              onChange={e => {
                                const updated = [...form.external_links];
                                updated[idx].url = e.target.value;
                                setForm({ ...form, external_links: updated });
                              }}
                              placeholder="https://www.example.com"
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>LINK TYPE</label>
                            <select
                              value={link.type}
                              onChange={e => {
                                const updated = [...form.external_links];
                                updated[idx].type = e.target.value as any;
                                setForm({ ...form, external_links: updated });
                              }}
                              style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0a0d14', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                              <option value="Client Website">Client Website</option>
                              <option value="Live Product">Live Product</option>
                              <option value="Project Demo">Project Demo</option>
                              <option value="Partner Website">Partner Website</option>
                              <option value="Other External Reference">Other Reference</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleDetectFavicon(idx)}
                              disabled={detectingFavicon[link.id || idx]}
                              title="Detect Favicon from URL"
                              style={{
                                padding: '14px 16px',
                                borderRadius: '10px',
                                background: 'rgba(143, 193, 255, 0.15)',
                                border: '1px solid rgba(143, 193, 255, 0.3)',
                                color: 'var(--sky, #8FC1FF)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <RefreshCw size={13} className={detectingFavicon[link.id || idx] ? 'spin' : ''} />
                              {detectingFavicon[link.id || idx] ? 'Detecting...' : 'Detect Favicon'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = form.external_links.filter((_, i) => i !== idx);
                                setForm({ ...form, external_links: updated });
                              }}
                              style={{
                                padding: '14px',
                                borderRadius: '10px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#EF4444',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Live Favicon Preview & Overrides */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Public Preview:</span>
                            <FaviconLink link={link} variant="button" />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={link.display}
                                onChange={e => {
                                  const updated = [...form.external_links];
                                  updated[idx].display = e.target.checked;
                                  setForm({ ...form, external_links: updated });
                                }}
                              />
                              Show on Case Study
                            </label>

                            <input
                              value={link.override_icon || ''}
                              onChange={e => {
                                const updated = [...form.external_links];
                                updated[idx].override_icon = e.target.value;
                                setForm({ ...form, external_links: updated });
                              }}
                              placeholder="Custom icon override URL..."
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#FFF',
                                fontSize: '11px',
                                width: '200px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: CHALLENGE & GOALS ── */}
          {activeStep === 3 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
                3. The Challenge & Measurable Goals
              </h3>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  CHALLENGE OVERVIEW NARRATIVE
                </label>
                <textarea
                  className="modern-input"
                  rows={4}
                  value={form.challenge_overview}
                  onChange={e => setForm({ ...form, challenge_overview: e.target.value })}
                  placeholder="Detail the client's original situation, operational limitations, and business friction points."
                />
              </div>

              {/* Challenge bullet points */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, opacity: 0.6 }}>
                    CORE PROBLEM BULLETS
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, challenge_points: [...form.challenge_points, ''] })}
                    style={{ background: 'none', border: 'none', color: 'var(--sky, #8FC1FF)', fontSize: '12px', cursor: 'pointer' }}
                  >
                    + Add Bullet
                  </button>
                </div>
                {form.challenge_points.map((pt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      className="modern-input"
                      value={pt}
                      onChange={e => {
                        const updated = [...form.challenge_points];
                        updated[idx] = e.target.value;
                        setForm({ ...form, challenge_points: updated });
                      }}
                      placeholder="e.g. Average response time exceeded 4 hours, causing 38% lead drop-off."
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, challenge_points: form.challenge_points.filter((_, i) => i !== idx) })}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0 8px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Baseline Goals */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    Goals and Baseline Audits ({form.goals_baseline.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newGoal: CaseStudyGoal = {
                        metric: 'Metric Name',
                        initial_value: '0',
                        unit: 'Units',
                        period: 'Baseline Period',
                        target: 'Target Goal',
                        source: 'Audit Log'
                      };
                      setForm({ ...form, goals_baseline: [...form.goals_baseline, newGoal] });
                    }}
                    style={{
                      background: 'rgba(143,193,255,0.12)',
                      border: '1px solid rgba(143,193,255,0.25)',
                      color: 'var(--sky, #8FC1FF)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Goal Baseline
                  </button>
                </div>

                {form.goals_baseline.map((g, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr 1fr auto',
                      gap: '10px',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      alignItems: 'center'
                    }}
                  >
                    <input
                      className="modern-input"
                      value={g.metric}
                      onChange={e => {
                        const updated = [...form.goals_baseline];
                        updated[idx].metric = e.target.value;
                        setForm({ ...form, goals_baseline: updated });
                      }}
                      placeholder="Metric"
                    />
                    <input
                      className="modern-input"
                      value={g.initial_value}
                      onChange={e => {
                        const updated = [...form.goals_baseline];
                        updated[idx].initial_value = e.target.value;
                        setForm({ ...form, goals_baseline: updated });
                      }}
                      placeholder="Baseline"
                    />
                    <input
                      className="modern-input"
                      value={g.unit}
                      onChange={e => {
                        const updated = [...form.goals_baseline];
                        updated[idx].unit = e.target.value;
                        setForm({ ...form, goals_baseline: updated });
                      }}
                      placeholder="Unit"
                    />
                    <input
                      className="modern-input"
                      value={g.target || ''}
                      onChange={e => {
                        const updated = [...form.goals_baseline];
                        updated[idx].target = e.target.value;
                        setForm({ ...form, goals_baseline: updated });
                      }}
                      placeholder="Target"
                    />
                    <input
                      className="modern-input"
                      value={g.source || ''}
                      onChange={e => {
                        const updated = [...form.goals_baseline];
                        updated[idx].source = e.target.value;
                        setForm({ ...form, goals_baseline: updated });
                      }}
                      placeholder="Audit Source"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, goals_baseline: form.goals_baseline.filter((_, i) => i !== idx) })}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: APPROACH & PHASES ── */}
          {activeStep === 4 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  4. Engineering Approach & Delivery Phases ({form.approach_phases.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newPhase: CaseStudyPhase = {
                      phase_number: form.approach_phases.length + 1,
                      title: 'New Phase',
                      duration: '2 Weeks',
                      description: 'Phase activities and implementation.',
                      deliverables: ['Deliverable Spec']
                    };
                    setForm({ ...form, approach_phases: [...form.approach_phases, newPhase] });
                  }}
                  style={{
                    background: 'rgba(143,193,255,0.12)',
                    border: '1px solid rgba(143,193,255,0.25)',
                    color: 'var(--sky, #8FC1FF)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Phase
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {form.approach_phases.map((ph, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 2fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <input
                        className="modern-input"
                        type="number"
                        value={ph.phase_number}
                        onChange={e => {
                          const updated = [...form.approach_phases];
                          updated[idx].phase_number = Number(e.target.value);
                          setForm({ ...form, approach_phases: updated });
                        }}
                      />
                      <input
                        className="modern-input"
                        value={ph.title}
                        onChange={e => {
                          const updated = [...form.approach_phases];
                          updated[idx].title = e.target.value;
                          setForm({ ...form, approach_phases: updated });
                        }}
                        placeholder="Phase Title"
                      />
                      <input
                        className="modern-input"
                        value={ph.duration}
                        onChange={e => {
                          const updated = [...form.approach_phases];
                          updated[idx].duration = e.target.value;
                          setForm({ ...form, approach_phases: updated });
                        }}
                        placeholder="Duration (e.g. Weeks 1-2)"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, approach_phases: form.approach_phases.filter((_, i) => i !== idx) })}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <textarea
                      className="modern-input"
                      rows={2}
                      value={ph.description}
                      onChange={e => {
                        const updated = [...form.approach_phases];
                        updated[idx].description = e.target.value;
                        setForm({ ...form, approach_phases: updated });
                      }}
                      placeholder="Phase description and methodology..."
                      style={{ marginBottom: '10px' }}
                    />

                    <div>
                      <input
                        className="modern-input"
                        value={(ph.deliverables || []).join(', ')}
                        onChange={e => {
                          const updated = [...form.approach_phases];
                          updated[idx].deliverables = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setForm({ ...form, approach_phases: updated });
                        }}
                        placeholder="Deliverables (comma separated, e.g. Architecture Spec, Webhook Gateway)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 5: SOLUTION & ARCHITECTURE ── */}
          {activeStep === 5 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
                5. Solution & Architecture
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  SOLUTION OVERVIEW
                </label>
                <textarea
                  className="modern-input"
                  rows={4}
                  value={form.solution_overview}
                  onChange={e => setForm({ ...form, solution_overview: e.target.value })}
                  placeholder="Describe the end-to-end technical system engineered to resolve the challenge."
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  ARCHITECTURE DIAGRAM / SCREENSHOT URL
                </label>
                <input
                  className="modern-input"
                  value={form.solution_architecture_image || ''}
                  onChange={e => setForm({ ...form, solution_architecture_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Solution features */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    Core Technical Capabilities ({form.solution_features.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newFeat: CaseStudyFeature = {
                        title: 'Feature Title',
                        description: 'Feature description.'
                      };
                      setForm({ ...form, solution_features: [...form.solution_features, newFeat] });
                    }}
                    style={{
                      background: 'rgba(143,193,255,0.12)',
                      border: '1px solid rgba(143,193,255,0.25)',
                      color: 'var(--sky, #8FC1FF)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Capability
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {form.solution_features.map((feat, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <input
                          className="modern-input"
                          value={feat.title}
                          onChange={e => {
                            const updated = [...form.solution_features];
                            updated[idx].title = e.target.value;
                            setForm({ ...form, solution_features: updated });
                          }}
                          placeholder="Feature Headline"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, solution_features: form.solution_features.filter((_, i) => i !== idx) })}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea
                        className="modern-input"
                        rows={2}
                        value={feat.description}
                        onChange={e => {
                          const updated = [...form.solution_features];
                          updated[idx].description = e.target.value;
                          setForm({ ...form, solution_features: updated });
                        }}
                        placeholder="Feature details..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 6: BEFORE-AND-AFTER METRICS (AUTOMATIC MATH ENGINE) ── */}
          {activeStep === 6 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    6. Before-and-After Metrics & Automated Math Calculation
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>
                    Calculates absolute change, percentage points, and relative change according to Section 6.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newMetric: CaseStudyBeforeAfterMetric = {
                      id: `metric-${Date.now()}`,
                      name: 'Metric Name',
                      type: 'duration',
                      before: 100,
                      after: 20,
                      unit: 'Minutes',
                      direction: 'lower_is_better',
                      period: '90-Day Audit',
                      evidence: 'Database Log',
                      verified: true,
                      show_public: true,
                      notes: ''
                    };
                    setForm({ ...form, before_after_metrics: [...form.before_after_metrics, newMetric] });
                  }}
                  style={{
                    background: 'rgba(143,193,255,0.12)',
                    border: '1px solid rgba(143,193,255,0.25)',
                    color: 'var(--sky, #8FC1FF)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Add Benchmark Row
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                {form.before_after_metrics.map((m, idx) => {
                  const calc = calculateMetricChange(m.before, m.after, m.type, m.direction, m.unit);

                  return (
                    <div
                      key={m.id || idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '20px'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1.2fr auto', gap: '10px', alignItems: 'end', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>METRIC NAME</label>
                          <input
                            className="modern-input"
                            value={m.name}
                            onChange={e => {
                              const updated = [...form.before_after_metrics];
                              updated[idx].name = e.target.value;
                              setForm({ ...form, before_after_metrics: updated });
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>TYPE</label>
                          <select
                            value={m.type}
                            onChange={e => {
                              const updated = [...form.before_after_metrics];
                              updated[idx].type = e.target.value as any;
                              setForm({ ...form, before_after_metrics: updated });
                            }}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0a0d14', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <option value="duration">Duration / Time</option>
                            <option value="percentage">Percentage (%)</option>
                            <option value="count">Count / Quantity</option>
                            <option value="currency">Currency</option>
                            <option value="score">Score</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>BEFORE</label>
                          <input
                            type="number"
                            step="any"
                            className="modern-input"
                            value={m.before}
                            onChange={e => {
                              const updated = [...form.before_after_metrics];
                              updated[idx].before = Number(e.target.value);
                              setForm({ ...form, before_after_metrics: updated });
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>AFTER</label>
                          <input
                            type="number"
                            step="any"
                            className="modern-input"
                            value={m.after}
                            onChange={e => {
                              const updated = [...form.before_after_metrics];
                              updated[idx].after = Number(e.target.value);
                              setForm({ ...form, before_after_metrics: updated });
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>UNIT</label>
                          <input
                            className="modern-input"
                            value={m.unit}
                            onChange={e => {
                              const updated = [...form.before_after_metrics];
                              updated[idx].unit = e.target.value;
                              setForm({ ...form, before_after_metrics: updated });
                            }}
                            placeholder="Mins / %"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>DIRECTION</label>
                          <select
                            value={m.direction}
                            onChange={e => {
                              const updated = [...form.before_after_metrics];
                              updated[idx].direction = e.target.value as any;
                              setForm({ ...form, before_after_metrics: updated });
                            }}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0a0d14', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <option value="lower_is_better">Lower is better (Reduction)</option>
                            <option value="higher_is_better">Higher is better (Increase)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => setForm({ ...form, before_after_metrics: form.before_after_metrics.filter((_, i) => i !== idx) })}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', paddingBottom: '16px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Automated Math Preview Bar */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Calculated Change:</span>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 700,
                              background: calc.isImprovement ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: calc.isImprovement ? '#34D399' : '#F87171'
                            }}
                          >
                            {calc.displayFormatted}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <input
                            value={m.evidence || ''}
                            onChange={e => {
                              const updated = [...form.before_after_metrics];
                              updated[idx].evidence = e.target.value;
                              setForm({ ...form, before_after_metrics: updated });
                            }}
                            placeholder="Evidence source..."
                            style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '11px', width: '180px' }}
                          />

                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#FFFFFF', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={m.verified}
                              onChange={e => {
                                const updated = [...form.before_after_metrics];
                                updated[idx].verified = e.target.checked;
                                setForm({ ...form, before_after_metrics: updated });
                              }}
                            />
                            Verified
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#FFFFFF', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={m.show_public}
                              onChange={e => {
                                const updated = [...form.before_after_metrics];
                                updated[idx].show_public = e.target.checked;
                                setForm({ ...form, before_after_metrics: updated });
                              }}
                            />
                            Public
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 7: RESULTS & METHODOLOGY ── */}
          {activeStep === 7 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  7. Key Result Callouts & Methodology ({form.key_results.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newRes: CaseStudyKeyResult = {
                      metric: '+50%',
                      label: 'Outcome Label',
                      context: 'Contextual description of result.',
                      verified: true
                    };
                    setForm({ ...form, key_results: [...form.key_results, newRes] });
                  }}
                  style={{
                    background: 'rgba(143,193,255,0.12)',
                    border: '1px solid rgba(143,193,255,0.25)',
                    color: 'var(--sky, #8FC1FF)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Key Result
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {form.key_results.map((kr, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input
                        className="modern-input"
                        value={kr.metric}
                        onChange={e => {
                          const updated = [...form.key_results];
                          updated[idx].metric = e.target.value;
                          setForm({ ...form, key_results: updated });
                        }}
                        placeholder="e.g. -99.1%"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, key_results: form.key_results.filter((_, i) => i !== idx) })}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <input
                      className="modern-input"
                      value={kr.label}
                      onChange={e => {
                        const updated = [...form.key_results];
                        updated[idx].label = e.target.value;
                        setForm({ ...form, key_results: updated });
                      }}
                      placeholder="Headline (e.g. Response Time Drop)"
                      style={{ marginBottom: '8px' }}
                    />

                    <input
                      className="modern-input"
                      value={kr.context}
                      onChange={e => {
                        const updated = [...form.key_results];
                        updated[idx].context = e.target.value;
                        setForm({ ...form, key_results: updated });
                      }}
                      placeholder="Context (e.g. Reduced from 275 min down to 2.4 min)"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  MEASUREMENT METHODOLOGY & DISCLOSURES
                </label>
                <textarea
                  className="modern-input"
                  rows={4}
                  value={form.methodology}
                  onChange={e => setForm({ ...form, methodology: e.target.value })}
                  placeholder="Detail sample sizes, evaluation windows, baseline dates, calculation methods, and data audit sources."
                />
              </div>
            </div>
          )}

          {/* ── STEP 8: CUSTOM TABLES & TESTIMONIAL ── */}
          {activeStep === 8 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
                8. Custom Tables & Client Testimonial
              </h3>

              {/* Testimonial */}
              <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', marginBottom: '32px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 16px' }}>
                  Client Executive Testimonial
                </h4>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>QUOTE</label>
                  <textarea
                    className="modern-input"
                    rows={3}
                    value={form.testimonial?.quote || ''}
                    onChange={e => setForm({ ...form, testimonial: { ...(form.testimonial || { author: '', role: '', company: '' }), quote: e.target.value } })}
                    placeholder="Executive quote regarding business outcome..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <input
                    className="modern-input"
                    value={form.testimonial?.author || ''}
                    onChange={e => setForm({ ...form, testimonial: { ...(form.testimonial || { quote: '', role: '', company: '' }), author: e.target.value } })}
                    placeholder="Author Name"
                  />
                  <input
                    className="modern-input"
                    value={form.testimonial?.role || ''}
                    onChange={e => setForm({ ...form, testimonial: { ...(form.testimonial || { quote: '', author: '', company: '' }), role: e.target.value } })}
                    placeholder="Author Role"
                  />
                  <input
                    className="modern-input"
                    value={form.testimonial?.company || ''}
                    onChange={e => setForm({ ...form, testimonial: { ...(form.testimonial || { quote: '', author: '', role: '' }), company: e.target.value } })}
                    placeholder="Company"
                  />
                </div>
              </div>

              {/* Architectural lessons learned */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    Architectural Lessons Learned ({form.lessons_learned.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, lessons_learned: [...form.lessons_learned, ''] })}
                    style={{ background: 'none', border: 'none', color: 'var(--sky, #8FC1FF)', fontSize: '12px', cursor: 'pointer' }}
                  >
                    + Add Lesson
                  </button>
                </div>
                {form.lessons_learned.map((ls, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      className="modern-input"
                      value={ls}
                      onChange={e => {
                        const updated = [...form.lessons_learned];
                        updated[idx] = e.target.value;
                        setForm({ ...form, lessons_learned: updated });
                      }}
                      placeholder="e.g. Asynchronous event queues eliminated 100% of webhook timeout errors."
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, lessons_learned: form.lessons_learned.filter((_, i) => i !== idx) })}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 9: SEO & PUBLISHING ── */}
          {activeStep === 9 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
                9. SEO Metadata & Publishing Controls
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                    PUBLISHING STATUS
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as CaseStudyStatus })}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#0a0d14', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved for Scheduling</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#FFFFFF', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({ ...form, featured: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>Highlight as Featured Project (pinned at top)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--sky, #8FC1FF)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(form.featured_on_homepage)}
                      onChange={e => setForm({ ...form, featured_on_homepage: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--electric, #2F6BFF)' }}
                    />
                    <span>Featured in Homepage "Case Studies" Showcase</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#34D399', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(form.featured_in_trusted_by)}
                      onChange={e => setForm({ ...form, featured_in_trusted_by: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#10B981' }}
                    />
                    <span>Featured in Homepage "Trusted By" Continuous Marquee</span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  SEO META TITLE
                </label>
                <input
                  className="modern-input"
                  value={form.seo_title || ''}
                  onChange={e => setForm({ ...form, seo_title: e.target.value })}
                  placeholder="e.g. Real Estate Lead Automation Case Study | Etromo"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, opacity: 0.6, marginBottom: '6px' }}>
                  SEO META DESCRIPTION
                </label>
                <textarea
                  className="modern-input"
                  rows={3}
                  value={form.seo_description || ''}
                  onChange={e => setForm({ ...form, seo_description: e.target.value })}
                  placeholder="Meta description for search engine result snippets (150-160 chars)."
                />
              </div>
            </div>
          )}

          {/* Form Bottom Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveStep(s => Math.max(1, s - 1))}
              disabled={activeStep === 1}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: activeStep === 1 ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                cursor: activeStep === 1 ? 'default' : 'pointer'
              }}
            >
              ← Previous Step
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              {activeStep < 9 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(s => Math.min(9, s + 1))}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'var(--paper, #FFFFFF)',
                    color: '#000000',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : 'Finish & Save Case Study'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: LISTING DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 6px' }}>
            Case Studies Publishing System
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
            Manage verified business cases, client website links, favicons, and metric calculations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadCaseStudies}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>

          <button
            onClick={resetForm}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'var(--paper, #FFFFFF)',
              color: '#000000',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Plus size={15} /> New Case Study
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '16px',
          borderRadius: '12px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input
            type="text"
            placeholder="Search by title, client or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 40px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0a0d14', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0a0d14', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Case Studies Table */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.03)' }}>
                <th style={{ padding: '14px 18px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Project Title & Client
                </th>
                <th style={{ padding: '14px 18px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Category & Industry
                </th>
                <th style={{ padding: '14px 18px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Primary Outcome
                </th>
                <th style={{ padding: '14px 18px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Status
                </th>
                <th style={{ padding: '14px 18px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    Loading case studies...
                  </td>
                </tr>
              ) : filteredCaseStudies.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    No case studies found. Click "+ New Case Study" to create one.
                  </td>
                </tr>
              ) : (
                filteredCaseStudies.map(cs => {
                  const clientLink = (cs.external_links || []).find(l => l.display);
                  const primaryRes = cs.key_results?.[0];

                  return (
                    <tr
                      key={cs.id || cs.slug}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                          {cs.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', flexWrap: 'wrap' }}>
                          {cs.embedded_link && (
                            <img
                              src={getFaviconUrl(cs.embedded_link, cs.custom_favicon_url, 32)}
                              alt=""
                              style={{ width: '16px', height: '16px', borderRadius: '4px', objectFit: 'contain' }}
                              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          <span>{cs.client_name}</span>
                          {cs.featured_on_homepage && (
                            <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(47, 107, 255, 0.2)', color: 'var(--sky, #8FC1FF)', fontWeight: 700 }}>
                              HP FEATURED
                            </span>
                          )}
                          {cs.featured_in_trusted_by && (
                            <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontWeight: 700 }}>
                              TRUSTED BY
                            </span>
                          )}
                          {clientLink && !cs.embedded_link && (
                            <>
                              <span>•</span>
                              <FaviconLink link={clientLink} />
                            </>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ color: 'var(--sky, #8FC1FF)', fontSize: '12px', fontWeight: 500 }}>
                          {cs.category}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '11px', marginTop: '2px' }}>
                          {cs.industry}
                        </div>
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        {primaryRes ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: '#34D399', fontFamily: 'var(--mono, monospace)' }}>
                              {primaryRes.metric}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                              {primaryRes.label}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', opacity: 0.4 }}>No metric added</span>
                        )}
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            background:
                              cs.status === 'published'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : cs.status === 'draft'
                                ? 'rgba(255, 217, 125, 0.15)'
                                : 'rgba(143, 193, 255, 0.15)',
                            color:
                              cs.status === 'published'
                                ? '#34D399'
                                : cs.status === 'draft'
                                ? '#FFD97D'
                                : 'var(--sky, #8FC1FF)'
                          }}
                        >
                          {cs.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <a
                            href={`http://localhost:5173/case-studies/${cs.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="View public page"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: 'rgba(255, 255, 255, 0.7)',
                              display: 'flex'
                            }}
                          >
                            <ExternalLink size={14} />
                          </a>

                          <button
                            onClick={() => handleEdit(cs)}
                            title="Edit Case Study"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'rgba(143, 193, 255, 0.1)',
                              border: 'none',
                              color: 'var(--sky, #8FC1FF)',
                              cursor: 'pointer',
                              display: 'flex'
                            }}
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => handleDuplicate(cs)}
                            title="Duplicate as Draft"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: 'none',
                              color: 'rgba(255, 255, 255, 0.7)',
                              cursor: 'pointer',
                              display: 'flex'
                            }}
                          >
                            <Copy size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(cs.id)}
                            title="Delete Case Study"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              display: 'flex'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
  );
};

export default CaseStudiesStudio;
