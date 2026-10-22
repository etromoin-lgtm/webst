import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building,
  Mail,
  Lock,
  User,
  Phone,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import './ClientPortal.css';

export function ClientRegisterPage() {
  const navigate = useNavigate();

  // Step 1: Basic info
  const [legalName, setLegalName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Previous work questionnaire
  const [hasWorkedBefore, setHasWorkedBefore] = useState<boolean | null>(null);
  const [claimType, setClaimType] = useState('PROJECT');
  const [declaredName, setDeclaredName] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [approxDate, setApproxDate] = useState('');
  const [notes, setNotes] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName || !email || !password || !contactName) {
      setError('Please fill in all mandatory organization and account fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasWorkedBefore === null) {
      setError('Please indicate whether you have worked with us or purchased a product before.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: any = {
        legal_name: legalName,
        brand_name: legalName,
        contact_name: contactName,
        primary_email: email,
        phone,
        website,
        password,
        has_previous_work: hasWorkedBefore
      };

      if (hasWorkedBefore) {
        payload.previous_work_details = {
          claim_type: claimType,
          declared_name: declaredName,
          reference_number: refNumber,
          old_email: oldEmail || email,
          approximate_date: approxDate,
          notes
        };
      }

      try {
        const res = await fetch('/api/portal/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.token) {
            localStorage.setItem('client_token', data.token);
            localStorage.setItem('client_session', JSON.stringify(data.client));
            navigate('/portal/dashboard');
            return;
          }
        }
      } catch {
        // Backend offline or returned HTML
      }

      // Offline / Static resilience: save registered organization locally
      const clientSession = {
        id: Date.now(),
        organization_id: Date.now(),
        full_name: contactName || legalName,
        email: email.trim(),
        company: legalName,
        verification_status: hasWorkedBefore ? 'PENDING_MATCH' : 'VERIFIED'
      };
      try {
        const stored = JSON.parse(localStorage.getItem('etromo_registered_clients') || '{}');
        stored[email.trim().toLowerCase()] = { ...clientSession, password };
        localStorage.setItem('etromo_registered_clients', JSON.stringify(stored));
      } catch {}

      localStorage.setItem('client_token', `client-token-${Date.now()}`);
      localStorage.setItem('client_session', JSON.stringify(clientSession));
      navigate('/portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-auth-wrapper">
      <div className="portal-auth-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <img src="/logo.png" alt="Etromo" style={{ height: '36px', width: 'auto' }} />
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff', fontFamily: 'var(--brand-font)' }}>Etromo.</span>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            {step === 1 ? 'Client Portal Registration' : 'Previous Engagement Check'}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            {step === 1
              ? 'Enter your organization & primary contact credentials.'
              : 'Help us connect your historical deliverables, projects, and products.'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#FCA5A5', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="portal-field-label">Organization / Legal Name *</label>
                <div className="portal-input-container">
                  <Building size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Enterprises Inc"
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="portal-field-label">Authorized Contact Person *</label>
                <div className="portal-input-container">
                  <User size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="portal-field-label">Business Work Email *</label>
                <div className="portal-input-container">
                  <Mail size={16} />
                  <input
                    type="email"
                    required
                    placeholder="john@acme.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="portal-field-label">Direct Phone / WhatsApp</label>
                <div className="portal-input-container">
                  <Phone size={16} />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="portal-field-label">Company Website (Optional)</label>
              <div className="portal-input-container">
                <input
                  type="text"
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label className="portal-field-label">Portal Password *</label>
              <div className="portal-input-container">
                <Lock size={16} />
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="portal-primary-btn" style={{ width: '100%' }}>
              Continue to Relationship Check <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: Previous Work Questionnaire */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                Have you purchased any product from us, or has our team previously developed a project or automation workflow for you?
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setHasWorkedBefore(false)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: hasWorkedBefore === false ? '2px solid var(--electric, #2F6BFF)' : '1px solid rgba(255,255,255,0.1)',
                    background: hasWorkedBefore === false ? 'rgba(47, 107, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>No, We're Brand New</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Start fresh with a clean organization dashboard.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setHasWorkedBefore(true)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: hasWorkedBefore === true ? '2px solid var(--electric, #2F6BFF)' : '1px solid rgba(255,255,255,0.1)',
                    background: hasWorkedBefore === true ? 'rgba(47, 107, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>Yes, We Have Prior Work</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Link previous deliverables, licenses & projects.</p>
                </button>
              </div>
            </div>

            {hasWorkedBefore && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--sky, #8FC1FF)', fontSize: '13px' }}>
                  <HelpCircle size={16} />
                  <span>Provide identifying details for Admin record matching:</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label className="portal-field-label">Prior Engagement Type</label>
                    <select
                      value={claimType}
                      onChange={e => setClaimType(e.target.value)}
                      className="portal-input-container"
                      style={{ width: '100%', background: 'rgba(0,0,0,0.4)', color: '#fff' }}
                    >
                      <option value="PROJECT">Custom Project / Automation</option>
                      <option value="PRODUCT_PURCHASE">Product License Purchase</option>
                      <option value="MAINTENANCE">Maintenance & Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="portal-field-label">Project or Product Name</label>
                    <div className="portal-input-container">
                      <input
                        type="text"
                        placeholder="e.g. CRM Backend or Real Estate Suite"
                        value={declaredName}
                        onChange={e => setDeclaredName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label className="portal-field-label">Invoice Ref or Project ID (If known)</label>
                    <div className="portal-input-container">
                      <input
                        type="text"
                        placeholder="e.g. INV-2025-089 or PRJ-01"
                        value={refNumber}
                        onChange={e => setRefNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="portal-field-label">Approximate Completion Date</label>
                    <div className="portal-input-container">
                      <input
                        type="text"
                        placeholder="e.g. Mid 2025 / Q3"
                        value={approxDate}
                        onChange={e => setApproxDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="portal-field-label">Previous Registered Email (If different from current)</label>
                  <div className="portal-input-container">
                    <input
                      type="email"
                      placeholder="old-email@company.com"
                      value={oldEmail}
                      onChange={e => setOldEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="portal-field-label">Additional Verification Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Any specific feature or communication email used earlier..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '8px 12px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <p style={{ margin: '12px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                  <ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Note: Declared previous work requires admin verification to protect confidentiality before records appear on your dashboard.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="portal-secondary-btn"
                style={{ flex: 1 }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="portal-primary-btn"
                style={{ flex: 2 }}
              >
                {loading ? 'Creating Organization...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            Already have portal credentials?{' '}
            <Link to="/portal/login" style={{ color: 'var(--sky, #8FC1FF)', fontWeight: 600 }}>
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ClientLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const isAcmeDemo = cleanEmail === 'client@acme.com' && password === 'client123';

    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem('client_token', data.token);
          localStorage.setItem('client_session', JSON.stringify(data.client));
          navigate('/portal/dashboard');
          return;
        }
      }
    } catch {
      // Backend returned HTML or network error
    }

    // Local / Registered client fallback
    try {
      const stored = JSON.parse(localStorage.getItem('etromo_registered_clients') || '{}');
      const localMatch = stored[cleanEmail];
      if (localMatch && (localMatch.password === password || isAcmeDemo)) {
        const session = {
          id: localMatch.id || 1,
          organization_id: localMatch.organization_id || 1,
          full_name: localMatch.full_name || 'Client Lead',
          email: cleanEmail,
          company: localMatch.company || 'Acme Enterprises Inc',
          verification_status: 'VERIFIED'
        };
        localStorage.setItem('client_token', `client-token-${Date.now()}`);
        localStorage.setItem('client_session', JSON.stringify(session));
        navigate('/portal/dashboard');
        return;
      }
    } catch {}

    // Demo account fallback
    if (isAcmeDemo) {
      const session = {
        id: 1,
        organization_id: 1,
        full_name: 'John Doe',
        email: 'client@acme.com',
        company: 'Acme Enterprises Inc',
        verification_status: 'VERIFIED'
      };
      localStorage.setItem('client_token', `client-token-${Date.now()}`);
      localStorage.setItem('client_session', JSON.stringify(session));
      navigate('/portal/dashboard');
      return;
    }

    setError('Invalid email or password. For demo access use client@acme.com / client123');
    setLoading(false);
  };

  return (
    <div className="portal-login-split-page">
      {/* Left side: Artwork Showcase */}
      <div className="portal-login-split-left">
        <img
          src="/about/Our Vision.jpg"
          alt="Our Vision"
          className="portal-login-image-bg"
        />
        <div className="portal-login-image-overlay" />

        {/* Top Brand Link */}
        <Link to="/" className="portal-login-left-brand">
          <img src="/logo.png" alt="Etromo" style={{ height: '36px', width: 'auto' }} />
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: 'var(--brand-font)', letterSpacing: '-0.02em' }}>
            Etromo<span style={{ color: 'var(--electric, #2F6BFF)' }}>.</span>
          </span>
        </Link>

        {/* Vision Statement Overlay */}
        <div className="portal-login-left-content">
          <h2 className="portal-vision-quote">
            Building software that unlocks human potential beyond boundaries.
          </h2>
          <p className="portal-vision-sub">
            Your single pane of glass for real-time sprint deliveries, technical roadmaps, live staging environments, and contract licenses.
          </p>
        </div>
      </div>

      {/* Right side: Clean, Minimalist Login Card */}
      <div className="portal-login-split-right">
        <div className="portal-login-form-box">
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--sky, #8FC1FF)',
              marginBottom: '8px'
            }}>
              Client Workspace
            </span>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              margin: '0 0 8px 0'
            }}>
              Sign in to Portal
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(244, 246, 249, 0.65)',
              margin: 0,
              lineHeight: 1.5
            }}>
              Access project deliverables, releases, and milestones.
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              color: '#FCA5A5',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="portal-clean-field">
              <label className="portal-clean-label">Work Email Address</label>
              <div className="portal-clean-input-box">
                <Mail size={16} color="rgba(244, 246, 249, 0.5)" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="portal-clean-field" style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="portal-clean-label">Password</label>
                <Link
                  to="/contact"
                  style={{ fontSize: '12px', color: 'rgba(143, 193, 255, 0.85)', textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="portal-clean-input-box">
                <Lock size={16} color="rgba(244, 246, 249, 0.5)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(244, 246, 249, 0.5)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    outline: 'none'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="portal-clean-submit-btn"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Bottom Registration Notice */}
          <div style={{
            marginTop: '32px',
            paddingTop: '22px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '13px', color: 'rgba(244, 246, 249, 0.6)', margin: 0 }}>
              Don't have a portal account yet?{' '}
              <Link
                to="/portal/register"
                style={{ color: 'var(--sky, #8FC1FF)', fontWeight: 600, textDecoration: 'none' }}
              >
                Register Organization
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
