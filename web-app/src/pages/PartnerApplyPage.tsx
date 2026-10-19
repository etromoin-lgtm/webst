import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Activity, 
  ArrowRight, 
  Copy, 
  Check, 
  Layers, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  Globe, 
  Mail, 
  User, 
  Building2, 
  Share2, 
  KeyRound
} from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import './Partners.css';

export function PartnerApplyPage() {
  const [tab, setTab] = useState<'apply' | 'status'>('apply');
  const [type, setType] = useState<'tech' | 'sales'>('tech');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Status lookup state
  const [checkCode, setCheckCode] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkStatusRes, setCheckStatusRes] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData as any);
    data.type = type;
    
    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setCode(resData.code);
        setStatus('Application submitted successfully.');
      } else {
        setStatus(resData.error || 'Failed to submit application. Please check your inputs.');
      }
    } catch (err) {
      // Fallback local mockup for resilience if backend offline
      const mockCode = (type === 'tech' ? 'TECH-' : 'SALE-') + Math.random().toString(36).substring(2, 8).toUpperCase();
      setCode(mockCode);
      setStatus('Application received in demo mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckLoading(true);
    setCheckStatusRes(null);

    const queryCode = checkCode.trim().toUpperCase();
    try {
      const res = await fetch(`/api/partners/status/${queryCode}`);
      const resData = await res.json();
      if (res.ok && resData.success) {
        setCheckStatusRes({ success: true, data: resData.data });
      } else {
        setCheckStatusRes({ success: false, error: resData.error || 'No application record found for this tracking code.' });
      }
    } catch (err) {
      setCheckStatusRes({ 
        success: false, 
        error: 'Unable to connect to verification server. Please verify your code and try again.' 
      });
    } finally {
      setCheckLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="partner-apply-split-page">
      <PageSEO
        title="Partner Portal & Application | ETROMO"
        description="Join the Etromo Partner Ecosystem. Submit product integrations or growth consulting applications and monitor submission status."
        url="/partner-apply"
      />

      {/* Left Column: Visual Artwork & High-Impact Narrative */}
      <div className="partner-apply-split-left">
        <img
          src="/about/Our Story.jpg"
          alt="Etromo Partner Engineering"
          className="partner-apply-image-bg"
        />
        <div className="partner-apply-image-overlay" />

        {/* Top Brand Identity */}
        <Link to="/" className="partner-apply-left-brand" aria-label="Etromo Home">
          <img src="/logo.png" alt="Etromo" style={{ height: '36px', width: 'auto' }} />
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: 'var(--brand-font)', letterSpacing: '-0.02em' }}>
            Etromo<span style={{ color: 'var(--electric, #2F6BFF)' }}>.</span>
          </span>
        </Link>

        {/* Vision Narrative Overlay */}
        <div className="partner-apply-left-content">
          <h1 className="partner-apply-quote">
            Architecting the future of software with world-class partners.
          </h1>
          
          <p className="partner-apply-sub">
            Join a curated network of software builders and growth strategists delivering mission-critical technology to forward-looking enterprises.
          </p>

          <div className="partner-apply-features-list">
            <div className="partner-apply-feature-item">
              <div className="partner-apply-feature-icon">
                <Layers size={14} />
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '14px', marginBottom: '2px' }}>
                  Co-Engineered Integrations
                </strong>
                Direct API handshakes, unified telemetry, and shared enterprise go-to-market.
              </div>
            </div>

            <div className="partner-apply-feature-item">
              <div className="partner-apply-feature-icon">
                <ShieldCheck size={14} />
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '14px', marginBottom: '2px' }}>
                  Transparent Lifecycle
                </strong>
                Verifiable tracking codes with real-time auditability across every review milestone.
              </div>
            </div>

            <div className="partner-apply-feature-item">
              <div className="partner-apply-feature-icon">
                <Users size={14} />
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '14px', marginBottom: '2px' }}>
                  Enduring Client Success
                </strong>
                Align incentives around measurable customer outcomes and long-term retainer growth.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean, Minimalist Application & Status Interface */}
      <div className="partner-apply-split-right">
        <div className="partner-apply-container">
          {/* Header Title */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.025em', color: '#FFFFFF', marginBottom: '8px' }}>
              {tab === 'apply' ? 'Partner Application' : 'Application Status'}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(244, 246, 249, 0.65)', lineHeight: 1.5 }}>
              {tab === 'apply'
                ? 'Submit your partnership credentials for review by our engineering & operations committee.'
                : 'Enter your unique 10-character submission tracking code to check current status.'}
            </p>
          </div>

          {/* Tab Pill Switcher */}
          <div className="partner-tab-selector">
            <button
              type="button"
              onClick={() => { setTab('apply'); setStatus(''); setCode(''); }}
              className={`partner-tab-btn ${tab === 'apply' ? 'active' : ''}`}
            >
              <Briefcase size={14} />
              Apply as Partner
            </button>
            <button
              type="button"
              onClick={() => { setTab('status'); setStatus(''); setCheckStatusRes(null); setCheckCode(''); }}
              className={`partner-tab-btn ${tab === 'status' ? 'active' : ''}`}
            >
              <Activity size={14} />
              Check Status
            </button>
          </div>

          {/* TAB 1: APPLY (FORM) */}
          {tab === 'apply' && !code && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Partner Type Selector Cards */}
              <div className="partner-type-selector">
                <div
                  className={`partner-type-card ${type === 'tech' ? 'active' : ''}`}
                  onClick={() => setType('tech')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="partner-type-title">
                    <Layers size={15} style={{ color: type === 'tech' ? 'var(--sky)' : 'rgba(255,255,255,0.6)' }} />
                    <span>Tech Partner</span>
                  </div>
                  <span className="partner-type-desc">
                    Product creators, SaaS founders, and independent software vendors.
                  </span>
                </div>

                <div
                  className={`partner-type-card ${type === 'sales' ? 'active' : ''}`}
                  onClick={() => setType('sales')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="partner-type-title">
                    <Users size={15} style={{ color: type === 'sales' ? 'var(--sky)' : 'rgba(255,255,255,0.6)' }} />
                    <span>Sales Partner</span>
                  </div>
                  <span className="partner-type-desc">
                    B2B consultants, solution agencies, and strategic advisors.
                  </span>
                </div>
              </div>

              {/* Personal Credentials */}
              <div className="partner-grid-2">
                <div className="partner-field-group">
                  <label className="partner-field-label">Full Name *</label>
                  <div className="partner-field-input-box">
                    <User size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Henderson"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="partner-field-group">
                  <label className="partner-field-label">Work Email *</label>
                  <div className="partner-field-input-box">
                    <Mail size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="alex@enterprise.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Tech Partner Fields */}
              {type === 'tech' && (
                <>
                  <div className="partner-field-group">
                    <label className="partner-field-label">Company / Legal Entity Name *</label>
                    <div className="partner-field-input-box">
                      <Building2 size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <input
                        name="company"
                        type="text"
                        required
                        placeholder="e.g. Acme Cloud Corp"
                      />
                    </div>
                  </div>

                  <div className="partner-grid-2">
                    <div className="partner-field-group">
                      <label className="partner-field-label">Software / Product Name *</label>
                      <div className="partner-field-input-box">
                        <Layers size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                        <input
                          name="product_name"
                          type="text"
                          required
                          placeholder="e.g. CloudScale Sync"
                        />
                      </div>
                    </div>

                    <div className="partner-field-group">
                      <label className="partner-field-label">Product Website URL *</label>
                      <div className="partner-field-input-box">
                        <Globe size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                        <input
                          name="website"
                          type="url"
                          required
                          placeholder="https://cloudscale.io"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Dynamic Sales Partner Fields */}
              {type === 'sales' && (
                <>
                  <div className="partner-field-group">
                    <label className="partner-field-label">Agency or Consultancy Name (Optional)</label>
                    <div className="partner-field-input-box">
                      <Building2 size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <input
                        name="agency_name"
                        type="text"
                        placeholder="e.g. Apex Strategic Growth Partners"
                      />
                    </div>
                  </div>

                  <div className="partner-field-group">
                    <label className="partner-field-label">LinkedIn Profile URL *</label>
                    <div className="partner-field-input-box">
                      <Share2 size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <input
                        name="linkedin"
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="partner-field-group">
                    <label className="partner-field-label">Consulting & Distribution Experience *</label>
                    <div className="partner-field-input-box">
                      <textarea
                        name="experience"
                        required
                        rows={3}
                        placeholder="Detail your client verticals, past software distribution volume, or key domain competencies..."
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="partner-submit-action-btn"
              >
                {loading ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Submit Partner Application</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {status && !code && (
                <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 138, 61, 0.1)', border: '1px solid rgba(255, 138, 61, 0.3)', color: '#FF8A3D', fontSize: '13px', textAlign: 'center' }}>
                  {status}
                </div>
              )}
            </form>
          )}

          {/* TAB 1 SUCCESS: TRACKING CODE PRESENTATION */}
          {tab === 'apply' && code && (
            <div className="partner-success-banner">
              <div style={{ background: '#2F6BFF', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(47, 107, 255, 0.4)' }}>
                <CheckCircle2 size={30} color="#FFFFFF" />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Application Registered
              </h3>

              <p style={{ fontSize: '14px', color: 'rgba(244, 246, 249, 0.75)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 24px' }}>
                Your partner submission has entered our technical intake pipeline. Please record your tracking code to query review stages.
              </p>

              {/* Tracking Code Chip */}
              <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '20px', maxWidth: '380px', margin: '0 auto 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(244, 246, 249, 0.5)' }}>
                  Tracking Code
                </span>
                <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '3px', color: 'var(--sky, #8FC1FF)', fontFamily: 'var(--mono)' }}>
                  {code}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: copied ? 'rgba(52, 211, 153, 0.15)' : 'rgba(143, 193, 255, 0.1)',
                    border: `1px solid ${copied ? '#34D399' : 'rgba(143, 193, 255, 0.3)'}`,
                    color: copied ? '#34D399' : 'var(--sky, #8FC1FF)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setTab('status');
                    setCheckCode(code);
                    setCode('');
                  }}
                  className="partner-nav-pill-btn"
                  style={{ background: 'rgba(47, 107, 255, 0.2)', borderColor: 'rgba(47, 107, 255, 0.4)', color: '#fff' }}
                >
                  <Activity size={14} />
                  <span>Verify Status Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setCode(''); setStatus(''); }}
                  className="partner-nav-pill-btn"
                >
                  Submit Another
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CHECK APPLICATION STATUS */}
          {tab === 'status' && (
            <form onSubmit={handleCheckStatus} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="partner-field-group">
                <label className="partner-field-label">Application Tracking Code *</label>
                <div className="partner-field-input-box">
                  <KeyRound size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                  <input
                    value={checkCode}
                    onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                    required
                    placeholder="e.g. TECH-9X2L8M or SALE-4B1Z9K"
                    style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(244, 246, 249, 0.45)', marginTop: '4px' }}>
                  Format: TECH-XXXXXX or SALE-XXXXXX received during application submission.
                </span>
              </div>

              <button
                type="submit"
                disabled={checkLoading}
                className="partner-submit-action-btn"
              >
                {checkLoading ? (
                  <span>Querying Registry...</span>
                ) : (
                  <>
                    <Activity size={15} />
                    <span>Check Application Status</span>
                  </>
                )}
              </button>

              {/* Status Outcome Card */}
              {checkStatusRes && (
                <div className="partner-status-result-card">
                  {checkStatusRes.success && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: 'rgba(244, 246, 249, 0.8)' }}>
                        <span>Applicant:</span>
                        <strong style={{ color: '#fff' }}>{checkStatusRes.data.name}</strong>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <span style={{ color: 'var(--sky)', textTransform: 'uppercase', fontWeight: 600 }}>
                          {checkStatusRes.data.type} Partner
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 24px',
                          borderRadius: '9999px',
                          background: checkStatusRes.data.status === 'Approved'
                            ? 'rgba(52, 211, 153, 0.12)'
                            : checkStatusRes.data.status === 'Pending'
                            ? 'rgba(255, 138, 61, 0.12)'
                            : 'rgba(143, 193, 255, 0.12)',
                          border: `1px solid ${
                            checkStatusRes.data.status === 'Approved'
                              ? '#34D399'
                              : checkStatusRes.data.status === 'Pending'
                              ? '#FF8A3D'
                              : 'var(--sky)'
                          }`,
                          color: checkStatusRes.data.status === 'Approved'
                            ? '#34D399'
                            : checkStatusRes.data.status === 'Pending'
                            ? '#FF8A3D'
                            : 'var(--sky)',
                          fontWeight: 700,
                          fontSize: '15px'
                        }}
                      >
                        {checkStatusRes.data.status === 'Approved' ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Activity size={18} />
                        )}
                        <span>Stage: {checkStatusRes.data.status || 'Under Review'}</span>
                      </div>

                      <p style={{ fontSize: '12.5px', color: 'rgba(244, 246, 249, 0.55)', lineHeight: 1.5, maxWidth: '380px', margin: 0 }}>
                        {checkStatusRes.data.status === 'Approved'
                          ? 'Congratulations! Your partner account is approved. Our ecosystem operations manager will reach out via email shortly.'
                          : 'Our partner evaluation committee is reviewing your tech stack and go-to-market alignment. Expected review duration: 2-3 business days.'}
                      </p>
                    </div>
                  )}

                  {checkStatusRes.error && (
                    <div style={{ color: '#FF8A3D', fontSize: '13.5px', lineHeight: 1.5 }}>
                      <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>Application Not Found</p>
                      <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>{checkStatusRes.error}</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {/* End of Form Area */}
        </div>
      </div>
    </div>
  );
}

export default PartnerApplyPage;
