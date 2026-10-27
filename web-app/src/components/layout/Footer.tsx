import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import {
  InstagramIcon,
  LinkedinIcon,
  GithubIcon,
  YoutubeIcon,
  WhatsappIcon,
  MailIcon,
  XIcon,
  FacebookIcon
} from '../../SocialIcons';

export function Footer() {
  const [siteSettings, setSiteSettings] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('etromo_site_settings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then(data => {
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSiteSettings(data.settings);
          try {
            localStorage.setItem('etromo_site_settings', JSON.stringify(data.settings));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenCookies = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const email = siteSettings.email?.trim() || 'contact@etromo.com';
  const phone = siteSettings.phone?.trim() || '';
  const location = siteSettings.location?.trim() || '';

  // Resolve official destinations from siteSettings
  const socialLinks = {
    linkedin: siteSettings.linkedin_url?.trim() || 'https://www.linkedin.com/company/etromo',
    x: siteSettings.x_url?.trim() || siteSettings.twitter_url?.trim() || 'https://x.com/etromo',
    github: siteSettings.github_url?.trim() || 'https://github.com/etromo',
    instagram: siteSettings.instagram_url?.trim() || 'https://www.instagram.com/etromo',
    youtube: siteSettings.youtube_url?.trim() || '',
    whatsapp: siteSettings.whatsapp_url?.trim() || '',
    facebook: siteSettings.facebook_url?.trim() || ''
  };

  return (
    <footer className="footer-root">
      {/* Background ambient lighting */}
      <div className="footer-glow" aria-hidden="true" />

      <div className="wrap">
        {/* Top Conversion & Credibility Action Strip */}
        <div className="footer-top-strip rv">
          <div className="footer-top-text">
            <span className="footer-top-kicker">Next-Generation Engineering</span>
            <h3 className="footer-top-heading">Ready to architect intelligent software & systems?</h3>
          </div>
          <div className="footer-top-actions">
            <Link to="/contact" className="btn p footer-cta-btn" id="footer-start-project-cta">
              Start a Project <span>→</span>
            </Link>
            <a href={`mailto:${email}`} className="btn footer-email-btn" id="footer-email-cta">
              <MailIcon size={16} />
              <span>{email}</span>
            </a>
          </div>
        </div>

        {/* Main 4-Column Footer Architecture */}
        <div className="footer-main-grid rv">
          {/* 1. BRAND IDENTITY */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="footer-brand-lockup" aria-label="ETROMO Homepage">
              <img src="/logo.png" alt="ETROMO Emblem" className="footer-logo-img" />
              <span className="footer-logo-text">
                ETROMO
                <span className="brand-logo-dot" />
              </span>
            </Link>
            
            <p className="footer-tagline">
              Engineering intelligent software, digital products, and business systems.
            </p>

            {(location || phone) && (
              <div className="footer-meta-info">
                {location && (
                  <div className="footer-location-indicator">
                    <span className="footer-location-dot" aria-hidden="true" />
                    <span className="footer-region-text">{location}</span>
                  </div>
                )}
                {phone && (
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="footer-contact-item">
                    <span>{phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 2. EXPLORE (Primary Navigation) */}
          <div className="footer-col">
            <h4 className="footer-col-title">EXPLORE</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/products" className="footer-nav-link">Products</Link>
              </li>
              <li>
                <Link to="/services" className="footer-nav-link">Services</Link>
              </li>
              <li>
                <Link to="/case-studies" className="footer-nav-link">Case Studies</Link>
              </li>
              <li>
                <Link to="/resources" className="footer-nav-link">Resources</Link>
              </li>
              <li>
                <Link to="/blog" className="footer-nav-link">Blog & Editorial</Link>
              </li>
            </ul>
          </div>

          {/* 3. COMPANY */}
          <div className="footer-col">
            <h4 className="footer-col-title">COMPANY</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/about" className="footer-nav-link">About ETROMO</Link>
              </li>
              <li>
                <Link to="/partners" className="footer-nav-link">Partners</Link>
              </li>
              <li>
                <Link to="/contact?subject=Careers" className="footer-nav-link">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-nav-link">Contact</Link>
              </li>
            </ul>
          </div>

          {/* 4. GET STARTED & FOLLOW */}
          <div className="footer-col">
            <h4 className="footer-col-title">GET STARTED</h4>
            <ul className="footer-nav-list footer-conversion-list">
              <li>
                <Link to="/contact" className="footer-nav-link highlight">Start a Project</Link>
              </li>
              <li>
                <a href={`mailto:${email}`} className="footer-nav-link">Business Enquiries</a>
              </li>
              <li>
                <Link to="/partner-apply" className="footer-nav-link">Partnership Enquiries</Link>
              </li>
            </ul>

            <h4 className="footer-col-title footer-follow-title">FOLLOW</h4>
            <div className="footer-social-row">
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="footer-social-link" 
                aria-label="ETROMO on LinkedIn"
                title="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
              {socialLinks.x && (
                <a 
                  href={socialLinks.x} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="footer-social-link" 
                  aria-label="ETROMO on X (formerly Twitter)"
                  title="X (Twitter)"
                >
                  <XIcon size={18} />
                </a>
              )}
              <a 
                href={socialLinks.github} 
                target="_blank" 
                rel="noreferrer" 
                className="footer-social-link" 
                aria-label="ETROMO on GitHub"
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer" 
                className="footer-social-link" 
                aria-label="ETROMO on Instagram"
                title="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              {socialLinks.youtube && (
                <a 
                  href={socialLinks.youtube} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="footer-social-link" 
                  aria-label="ETROMO on YouTube"
                  title="YouTube"
                >
                  <YoutubeIcon size={18} />
                </a>
              )}
              {socialLinks.whatsapp && (
                <a 
                  href={socialLinks.whatsapp} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="footer-social-link" 
                  aria-label="ETROMO on WhatsApp"
                  title="WhatsApp"
                >
                  <WhatsappIcon size={18} />
                </a>
              )}
              {socialLinks.facebook && (
                <a 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="footer-social-link" 
                  aria-label="ETROMO on Facebook"
                  title="Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Oversized Wordmark Signature (Retained & Elevated) */}
        <div className="footer-wordmark-container rv">
          <div className="big" aria-hidden="true">ETROMO</div>
        </div>

        {/* Bottom Utility, Legal & Compliance Bar */}
        <div className="footer-bottom-bar rv">
          <div className="footer-copyright">
            © {currentYear} ETROMO. All rights reserved.
          </div>

          <div className="footer-legal-links">
            <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
            <span className="footer-legal-sep" aria-hidden="true">·</span>
            <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
            <span className="footer-legal-sep" aria-hidden="true">·</span>
            <button 
              type="button" 
              onClick={handleOpenCookies} 
              className="footer-cookie-btn"
              id="footer-cookie-preferences-btn"
            >
              Cookie Preferences
            </button>
          </div>

          <div className="footer-bottom-controls">
            <span className="footer-breathe-pill" title="Brand Equilibrium">
              <span className="footer-breathe-dot" />
              [ BREATHE ]
            </span>
            <button 
              type="button" 
              onClick={scrollToTop} 
              className="footer-back-to-top"
              aria-label="Scroll back to top of page"
            >
              <span>Back to top</span>
              <span className="footer-top-arrow">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
