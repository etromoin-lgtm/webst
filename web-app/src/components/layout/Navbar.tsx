import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ShieldCheck, BookOpen, TrendingUp } from 'lucide-react';
import './Navbar.css';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top and close menu on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    setInsightsOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInsightsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.toLowerCase().startsWith('/gmcadmin')
  ) {
    return null;
  }

  const isInsightsActive =
    location.pathname.startsWith('/case-studies') ||
    location.pathname.startsWith('/resources') ||
    location.pathname.startsWith('/blog');

  return (
    <>
      <nav id="nav" className={scrolled ? 's' : ''}>
        <div className="wrap">
          <Link className="logo brand-logo-lockup" to="/" aria-label="Etromo Home">
            <img src="/logo.png" alt="Etromo Emblem" className="brand-logo-img" />
            <span className="brand-logo-text">Etromo<span className="brand-logo-dot" /></span>
          </Link>
          <div className="links">
            <Link to="/products">Products</Link>
            <Link to="/services">Services</Link>
            <Link to="/partners">Partners</Link>

            {/* Insights Dropdown */}
            <div
              ref={dropdownRef}
              className="nav-dropdown-wrapper"
              style={{ position: 'relative' }}
              onMouseEnter={() => setInsightsOpen(true)}
              onMouseLeave={() => setInsightsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setInsightsOpen(o => !o)}
                className={`nav-dropdown-trigger ${isInsightsActive ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isInsightsActive ? 'var(--h, #FFFFFF)' : 'inherit',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 0',
                  transition: 'color 0.2s ease'
                }}
                aria-expanded={insightsOpen}
                aria-haspopup="true"
              >
                Insights
                <ChevronDown
                  size={14}
                  style={{
                    transition: 'transform 0.25s ease',
                    transform: insightsOpen ? 'rotate(180deg)' : 'none',
                    opacity: 0.7
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {insightsOpen && (
                <div
                  className="nav-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: '-20px',
                    width: '280px',
                    background: 'rgba(9, 13, 24, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    padding: '10px',
                    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6), 0 0 20px rgba(143, 193, 255, 0.08)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    animation: 'fadeInSlide 0.2s ease-out'
                  }}
                >
                  <Link
                    to="/case-studies"
                    onClick={() => setInsightsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#34D399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.3 }}>Case Studies</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                        Real Challenges. Measurable Results.
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/resources"
                    onClick={() => setInsightsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(143, 193, 255, 0.12)',
                        color: 'var(--sky, #8FC1FF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.3 }}>Resources</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                        Playbooks, Architecture & Specs
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/blog"
                    onClick={() => setInsightsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 154, 158, 0.12)',
                        color: '#FF9A9E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.3 }}>Blog</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                        Engineering Insights & Updates
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about">About</Link>
            <Link
              to="/portal"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--sky, #8FC1FF)',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(143, 193, 255, 0.08)',
                border: '1px solid rgba(143, 193, 255, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Client Portal
            </Link>
            <Link className="btn g" to="/contact">Talk to us</Link>
          </div>
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link className="brand-logo-lockup" to="/" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Etromo" className="brand-logo-img" style={{ height: '30px' }} />
            <span className="brand-logo-text" style={{ fontSize: '19px' }}>Etromo<span className="brand-logo-dot" /></span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', padding: '6px' }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/services">Services</Link>
        <Link to="/partners">Partners</Link>

        {/* Mobile Insights Group */}
        <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', margin: '4px 0' }}>
          <div
            onClick={() => setMobileInsightsOpen(o => !o)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 4px', color: '#FFFFFF', fontWeight: 600 }}
          >
            <span>Insights</span>
            <ChevronDown size={16} style={{ transform: mobileInsightsOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </div>
          {mobileInsightsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '12px', marginTop: '6px' }}>
              <Link to="/case-studies" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', padding: '8px 0' }}>
                ↳ Case Studies
              </Link>
              <Link to="/resources" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', padding: '8px 0' }}>
                ↳ Resources
              </Link>
              <Link to="/blog" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', padding: '8px 0' }}>
                ↳ Blog Articles
              </Link>
            </div>
          )}
        </div>

        <Link to="/about">About</Link>
        <Link to="/portal" style={{ color: 'var(--sky, #8FC1FF)', fontWeight: 600 }}>
          Client Portal ↗
        </Link>
        <Link to="/contact" className="mobile-cta">Talk to us →</Link>
      </nav>
    </>
  );
}

export default Navbar;
