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
    badge: '3 CRM',
    hasDropdown: true,
    items: [
      {
        title: 'Real Estate CRM',
        desc: 'Lead distribution, site-visit dispatch & live pipeline tracking.',
        icon: Layers,
        tag: 'Flagship',
        href: '/products/real-estate-crm',
      },
      {
        title: 'WhatsApp AI CRM',
        desc: 'Conversational pipeline engine & multi-agent automation.',
        icon: Zap,
        tag: 'AI Powered',
        href: '/products/whatsapp-crm',
      },
      {
        title: 'Cafe & Retail OS',
        desc: 'Order routing, kitchen display & real-time inventory.',
        icon: Sparkles,
        href: '/products/cafe-crm',
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

  const cancelCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleCloseTimeout = () => {
    if (isLocked) return;
    cancelCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveTab(null);
      setHoveredTab(null);
    }, 250);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    setActiveTab(null);
    setHoveredTab(null);
    setIsLocked(false);
    cancelCloseTimeout();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navIslandRef.current && !navIslandRef.current.contains(e.target as Node)) {
        cancelCloseTimeout();
        setActiveTab(null);
        setHoveredTab(null);
        setIsLocked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      cancelCloseTimeout();
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.toLowerCase().startsWith('/gmcadmin')
  ) {
    return null;
  }

  const handleLinkSelect = () => {
    cancelCloseTimeout();
    setActiveTab(null);
    setHoveredTab(null);
    setIsLocked(false);
  };

  const activeItem = websiteNavItems.find((item) => item.id === activeTab);

  return (
    <>
      {/* Floating Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          {/* Three-column layout: Logo | Nav (center) | Actions */}
          <div className="relative flex items-center min-h-[44px]">

            {/* LEFT: Brand Logo */}
            <Link
              to="/"
              onClick={handleLinkSelect}
              className="brand-logo-lockup flex items-center gap-2.5 transition-transform hover:scale-[1.02] shrink-0 z-10"
              aria-label="Etromo Home"
            >
              <img
                src="/logo.png"
                alt="Etromo"
                className="brand-logo-img h-8 md:h-9 w-auto object-contain"
              />
              <span className="brand-logo-text text-lg md:text-xl font-bold tracking-tight text-white flex items-center">
                Etromo<span className="brand-logo-dot" />
              </span>
            </Link>

            {/* CENTER: Desktop Navigation Island (absolutely centered) */}
            <div
              ref={navIslandRef}
              className="hidden lg:block absolute left-1/2 -translate-x-1/2"
              onMouseEnter={cancelCloseTimeout}
              onMouseLeave={scheduleCloseTimeout}
            >
              <nav
                className="relative z-20 flex items-center gap-1 rounded-full border border-neutral-700/60 bg-neutral-950/80 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all"
              >
                {websiteNavItems.map((item) => {
                  const isOpen = activeTab === item.id;
                  const isHovered = hoveredTab === item.id;
                  const isRouteActive =
                    item.href &&
                    (item.href === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.href));

                  const content = (
                    <>
                      {isHovered && (
                        <motion.div
                          layoutId="nav-island-hover-pill"
                          className="absolute inset-0 z-[-1] rounded-full bg-neutral-800/80"
                          transition={{
                            type: 'spring',
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}

                      <span className="relative z-10">{item.label}</span>

                      {item.badge && (
                        <span className="relative z-10 rounded-md border border-neutral-700/60 bg-neutral-900 px-1 py-0.5 text-[9px] font-mono font-medium text-neutral-300">
                          {item.badge}
                        </span>
                      )}

                      {item.hasDropdown && (
                        <ChevronDown
                          className={`relative z-10 h-3.5 w-3.5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-white' : 'text-neutral-400'
                          }`}
                        />
                      )}
                    </>
                  );

                  const itemClasses = `relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-colors duration-200 cursor-pointer ${
                    isOpen || isHovered || isRouteActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`;

                  if (item.hasDropdown) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => {
                          cancelCloseTimeout();
                          setHoveredTab(item.id);
                          setActiveTab(item.id);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelCloseTimeout();
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
                        className={itemClasses}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                      >
                        {content}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      to={item.href || '#'}
                      onMouseEnter={() => {
                        cancelCloseTimeout();
                        setHoveredTab(item.id);
                        if (!isLocked) {
                          setActiveTab(null);
                        }
                      }}
                      onClick={handleLinkSelect}
                      className={itemClasses}
                    >
                      {content}
                    </Link>
                  );
                })}
              </nav>

              {/* Dropdown Panel — rendered inside the centered island wrapper */}
              <AnimatePresence>
                {activeItem?.hasDropdown && activeItem.items && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full z-50 pointer-events-auto"
                    onMouseEnter={cancelCloseTimeout}
                    onMouseLeave={scheduleCloseTimeout}
                  >
                    {/* Invisible hover bridge: fills gap between nav pill and panel */}
                    <div className="h-3 w-full" />

                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.97 }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                        mass: 0.6,
                      }}
                      className="overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-950/95 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl ring-1 ring-white/[0.06]"
                    >
                      <div className="w-[360px] p-2 space-y-0.5">
                        {activeItem.items.map((subItem) => {
                          const Icon = subItem.icon;
                          return (
                            <Link
                              key={subItem.title}
                              to={subItem.href}
                              onClick={handleLinkSelect}
                              className="group flex items-start gap-3 rounded-xl p-2.5 transition-all duration-150 hover:bg-neutral-900/90"
                            >
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-sky-400 transition-colors group-hover:border-sky-500/40 group-hover:bg-neutral-800 group-hover:text-white">
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-semibold text-neutral-100 group-hover:text-white">
                                    {subItem.title}
                                  </span>
                                  {subItem.tag && (
                                    <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-medium text-sky-400 border border-sky-500/20">
                                      {subItem.tag}
                                    </span>
                                  )}
                                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all text-neutral-400 group-hover:translate-x-0 group-hover:opacity-100" />
                                </div>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-400 line-clamp-2">
                                  {subItem.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Action Buttons */}
            <div className="flex items-center gap-3 ml-auto z-10">
              <Link
                to="/portal"
                onClick={handleLinkSelect}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-300 transition-all hover:bg-sky-500/20 hover:border-sky-400/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              >
                <span>Client Portal</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              </Link>

              <Link
                to="/contact"
                onClick={handleLinkSelect}
                className="btn g hidden sm:inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium tracking-tight"
              >
                Talk to us
              </Link>

              {/* Hamburger Button for Mobile */}
              <button
                className={`hamburger lg:hidden ${menuOpen ? 'open' : ''}`}
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
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="flex items-center justify-between w-full mb-4 pb-4 border-b border-neutral-800">
          <Link
            className="brand-logo-lockup"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            <img src="/logo.png" alt="Etromo" className="brand-logo-img h-7" />
            <span className="brand-logo-text text-lg">
              Etromo<span className="brand-logo-dot" />
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-neutral-400 hover:text-white p-2 text-xl"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        {/* Mobile Products Accordion */}
        <div className="p-2 bg-neutral-900/40 rounded-xl my-1 border border-neutral-800/60">
          <div
            onClick={() => setMobileProductsOpen((o) => !o)}
            className="flex justify-between items-center cursor-pointer p-2 text-white font-semibold text-base"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" /> Products
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`}
            />
          </div>
          {mobileProductsOpen && (
            <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-neutral-800 ml-2">
              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 py-1.5"
              >
                All Products
              </Link>
              <Link
                to="/products/real-estate-crm"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 py-1.5"
              >
                ↳ Real Estate CRM
              </Link>
              <Link
                to="/products/whatsapp-crm"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 py-1.5"
              >
                ↳ WhatsApp AI CRM
              </Link>
              <Link
                to="/products/cafe-crm"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 py-1.5"
              >
                ↳ Cafe & Retail OS
              </Link>
            </div>
          )}
        </div>

        <Link to="/services" onClick={() => setMenuOpen(false)}>
          Services
        </Link>

        {/* Mobile Insights Accordion */}
        <div className="p-2 bg-neutral-900/40 rounded-xl my-1 border border-neutral-800/60">
          <div
            onClick={() => setMobileInsightsOpen((o) => !o)}
            className="flex justify-between items-center cursor-pointer p-2 text-white font-semibold text-base"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" /> Insights
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${mobileInsightsOpen ? 'rotate-180' : ''}`}
            />
          </div>
          {mobileInsightsOpen && (
            <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-neutral-800 ml-2">
              <Link
                to="/case-studies"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 py-1.5"
              >
                ↳ Case Studies
              </Link>
              <Link
                to="/resources"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 py-1.5"
              >
                ↳ Resources Hub
              </Link>
              <Link
                to="/blog"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-300 py-1.5"
              >
                ↳ Engineering Blog
              </Link>
            </div>
          )}
        </div>

        <Link to="/partners" onClick={() => setMenuOpen(false)}>
          Partners
        </Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>
        <Link
          to="/portal"
          onClick={() => setMenuOpen(false)}
          className="text-sky-400 font-semibold flex items-center justify-between"
        >
          <span>Client Portal</span>
          <ExternalLink className="w-4 h-4" />
        </Link>

        <Link
          to="/contact"
          onClick={() => setMenuOpen(false)}
          className="mobile-cta text-center mt-3"
        >
          Talk to us →
        </Link>
      </nav>
    </>
  );
}

export default Navbar;
