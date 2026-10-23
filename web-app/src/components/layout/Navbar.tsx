"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Zap,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Code2,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Compass,
  Building2,
  GraduationCap,
  Coffee,
  ShoppingBag,
} from 'lucide-react';
import './Navbar.css';

interface NavDropdownItem {
  title: string;
  desc: string;
  icon: React.ElementType;
  tag?: string;
  href: string;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  badge?: string;
  hasDropdown: boolean;
  items?: NavDropdownItem[];
}

const websiteNavItems: NavItem[] = [
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    badge: 'By Industry',
    hasDropdown: true,
    items: [
      {
        title: 'Real Estate',
        desc: 'Lead distribution, site-visit dispatch & broker pipeline tracking.',
        icon: Building2,
        tag: 'Flagship',
        href: '/products?category=Real+Estate',
      },
      {
        title: 'Education & Training',
        desc: 'Student admissions, batch allocations & automated fee reminders.',
        icon: GraduationCap,
        tag: 'Popular',
        href: '/products?category=Education',
      },
      {
        title: 'Hospitality & Cafes',
        desc: 'Order routing, kitchen display, digital menus & inventory.',
        icon: Coffee,
        href: '/products?category=Hospitality',
      },
      {
        title: 'Communication & AI',
        desc: 'Official WhatsApp conversational pipeline & multi-agent automation.',
        icon: Zap,
        tag: 'AI Engine',
        href: '/products?category=Communication',
      },
      {
        title: 'Retail & eCommerce',
        desc: 'Omnichannel inventory sync, orders & customer retention.',
        icon: ShoppingBag,
        href: '/products?category=Retail',
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    hasDropdown: false,
  },
  {
    id: 'insights',
    label: 'Insights',
    hasDropdown: true,
    items: [
      {
        title: 'Case Studies',
        desc: 'Real enterprise challenges. Measurable business results.',
        icon: ShieldCheck,
        tag: 'Proven ROI',
        href: '/case-studies',
      },
      {
        title: 'Resources Hub',
        desc: 'Playbooks, technical architectures & whitepapers.',
        icon: BookOpen,
        href: '/resources',
      },
      {
        title: 'Engineering Blog',
        desc: 'Deep dives into full-stack speed, scale & resilience.',
        icon: Code2,
        href: '/blog',
      },
    ],
  },
  {
    id: 'partners',
    label: 'Partners',
    href: '/partners',
    hasDropdown: false,
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    hasDropdown: false,
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const navIslandRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    if (isLocked) return;
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveTab(null);
      setHoveredTab(null);
    }, 260);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    setActiveTab(null);
    setHoveredTab(null);
    setIsLocked(false);
    cancelClose();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navIslandRef.current && !navIslandRef.current.contains(e.target as Node)) {
        cancelClose();
        setActiveTab(null);
        setHoveredTab(null);
        setIsLocked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      cancelClose();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.toLowerCase().startsWith('/gmcadmin')
  ) {
    return null;
  }

  const closeAll = () => {
    cancelClose();
    setActiveTab(null);
    setHoveredTab(null);
    setIsLocked(false);
  };

  const activeItem = websiteNavItems.find((item) => item.id === activeTab);

  return (
    <>
      {/* ── HEADER ───────────────────────────────────────────────── */}
      <header className={`navbar-header${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-header-inner">

          {/* LEFT: Logo */}
          <div className="navbar-logo-col">
            <Link
              to="/"
              onClick={closeAll}
              className="brand-logo-lockup"
              aria-label="Etromo Home"
            >
              <img src="/logo.png" alt="Etromo" className="brand-logo-img" />
              <span className="brand-logo-text">
                Etromo<span className="brand-logo-dot" />
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation Island */}
          <div
            ref={navIslandRef}
            className="navbar-center-col"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <nav className="nav-island">
              {websiteNavItems.map((item) => {
                const isOpen = activeTab === item.id;
                const isHovered = hoveredTab === item.id;
                const isRouteActive =
                  item.href &&
                  (item.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.href));

                const pillClass = `nav-pill${isOpen || isHovered || isRouteActive ? ' active' : ''}`;

                const pillContent = (
                  <>
                    {isHovered && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="nav-pill-hover-bg"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span className="nav-pill-badge">{item.badge}</span>
                    )}
                    {item.hasDropdown && (
                      <ChevronDown className={`nav-pill-chevron${isOpen ? ' open' : ''}`} />
                    )}
                  </>
                );

                if (item.hasDropdown) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={pillClass}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onMouseEnter={() => {
                        cancelClose();
                        setHoveredTab(item.id);
                        setActiveTab(item.id);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelClose();
                        if (activeTab === item.id && isLocked) {
                          setIsLocked(false);
                          setActiveTab(null);
                          setHoveredTab(null);
                        } else {
                          setActiveTab(item.id);
                          setHoveredTab(item.id);
                          setIsLocked(true);
                        }
                      }}
                    >
                      {pillContent}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={item.href || '#'}
                    className={pillClass}
                    onMouseEnter={() => {
                      cancelClose();
                      setHoveredTab(item.id);
                      if (!isLocked) setActiveTab(null);
                    }}
                    onClick={closeAll}
                  >
                    {pillContent}
                  </Link>
                );
              })}
            </nav>

            {/* Dropdown panel — centered below the island */}
            <AnimatePresence>
              {activeItem?.hasDropdown && activeItem.items && (
                <div
                  className="nav-dropdown-wrapper"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  {/* Invisible hover bridge */}
                  <div className="nav-dropdown-bridge" />

                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }}
                    className="nav-dropdown-panel"
                  >
                    {activeItem.items.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.title}
                          to={sub.href}
                          className="nav-dropdown-item"
                          onClick={closeAll}
                        >
                          <div className="nav-dropdown-icon">
                            <Icon style={{ width: 16, height: 16 }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span className="nav-dropdown-title">{sub.title}</span>
                              {sub.tag && <span className="nav-dropdown-tag">{sub.tag}</span>}
                              <ArrowRight className="nav-dropdown-arrow" />
                            </div>
                            <p className="nav-dropdown-desc">{sub.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Actions */}
          <div className="navbar-right-col">
            <Link to="/portal" onClick={closeAll} className="btn-client-portal">
              <span>Client Portal</span>
              <span className="pulse-dot" />
            </Link>

            <Link
              to="/contact"
              onClick={closeAll}
              className="btn g btn-cta-talk"
            >
              Talk to us
            </Link>

            {/* Hamburger */}
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

        </div>
      </header>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
      <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link className="brand-logo-lockup" to="/" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Etromo" className="brand-logo-img" style={{ height: 28 }} />
            <span className="brand-logo-text" style={{ fontSize: 18 }}>Etromo<span className="brand-logo-dot" /></span>
          </Link>
          <button onClick={() => setMenuOpen(false)} style={{ color: 'rgba(163,163,163,1)', padding: 8, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close menu">✕</button>
        </div>

        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

        {/* Mobile Products Accordion */}
        <div style={{ padding: 8, background: 'rgba(18,18,18,0.4)', borderRadius: 12, margin: '4px 0', border: '1px solid rgba(40,40,40,0.6)' }}>
          <div onClick={() => setMobileProductsOpen((o) => !o)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: 8, color: '#fff', fontWeight: 600, fontSize: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Layers style={{ width: 16, height: 16, color: '#38bdf8' }} /> Products by Industry</span>
            <ChevronDown style={{ width: 16, height: 16, transform: mobileProductsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
          {mobileProductsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 16, marginTop: 4, borderLeft: '1px solid rgba(40,40,40,1)', marginLeft: 8 }}>
              <Link to="/products" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>All Industries & Products</Link>
              <Link to="/products?category=Real+Estate" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Real Estate</Link>
              <Link to="/products?category=Education" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Education & Training</Link>
              <Link to="/products?category=Hospitality" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Hospitality & Cafes</Link>
              <Link to="/products?category=Communication" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Communication & AI</Link>
              <Link to="/products?category=Retail" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Retail & eCommerce</Link>
            </div>
          )}
        </div>

        <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>

        {/* Mobile Insights Accordion */}
        <div style={{ padding: 8, background: 'rgba(18,18,18,0.4)', borderRadius: 12, margin: '4px 0', border: '1px solid rgba(40,40,40,0.6)' }}>
          <div onClick={() => setMobileInsightsOpen((o) => !o)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: 8, color: '#fff', fontWeight: 600, fontSize: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Compass style={{ width: 16, height: 16, color: '#34d399' }} /> Insights</span>
            <ChevronDown style={{ width: 16, height: 16, transform: mobileInsightsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
          {mobileInsightsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 16, marginTop: 4, borderLeft: '1px solid rgba(40,40,40,1)', marginLeft: 8 }}>
              <Link to="/case-studies" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Case Studies</Link>
              <Link to="/resources" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Resources Hub</Link>
              <Link to="/blog" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, color: 'rgba(200,200,200,1)', padding: '6px 0' }}>↳ Engineering Blog</Link>
            </div>
          )}
        </div>

        <Link to="/partners" onClick={() => setMenuOpen(false)}>Partners</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/portal" onClick={() => setMenuOpen(false)} style={{ color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Client Portal</span>
          <ExternalLink style={{ width: 16, height: 16 }} />
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)} className="mobile-cta" style={{ textAlign: 'center', marginTop: 12 }}>
          Talk to us →
        </Link>
      </nav>
    </>
  );
}

export default Navbar;
