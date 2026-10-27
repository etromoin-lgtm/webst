import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from '../common/CookieConsent';
import { trackCurrentVisitor } from '../../utils/aiAgentTracker';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    trackCurrentVisitor();
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.rv');
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((e) => {
          e.forEach(x => {
            if (x.isIntersecting) {
              x.target.classList.add('in');
              io.unobserve(x.target);
            }
          });
        }, { threshold: 0.12 });
        els.forEach(el => io.observe(el));
      } else {
        els.forEach(el => el.classList.add('in'));
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isStandalonePortal = 
    location.pathname.startsWith('/portal') || 
    location.pathname === '/partner-apply' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.toLowerCase().startsWith('/gmcadmin');

  if (isStandalonePortal) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

export default Layout;
