import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFaviconUrl, getFallbackInitials } from '../../utils/favicon';
import type { CaseStudy } from '../../types/caseStudy';
import './TrustedByMarquee.css';

interface TrustedItem {
  name: string;
  url: string;
  category?: string;
  slug?: string;
}

const FALLBACK_CLIENTS: TrustedItem[] = [
  { name: 'PropStream Realty', url: 'https://propstream.com', category: 'PropTech', slug: 'propstream-lead-automation' },
  { name: 'FinSecure Global', url: 'https://finsecure.io', category: 'Fintech & Security' },
  { name: 'ClinicaCare Health', url: 'https://clinicacare.com', category: 'Healthcare Systems' },
  { name: 'OmniLogistics Network', url: 'https://omnilogistics.com', category: 'Supply Chain' },
  { name: 'Nexus Hospitality', url: 'https://nexushospitality.com', category: 'Hospitality ERP' }
];

export const TrustedByMarquee: React.FC = () => {
  const [trustedItems, setTrustedItems] = useState<TrustedItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTrusted = async () => {
      try {
        const res = await fetch('/api/case-studies?featured_in_trusted_by=true');
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.case_studies) && json.case_studies.length > 0) {
          const mapped: TrustedItem[] = json.case_studies.map((cs: CaseStudy) => ({
            name: cs.client_name,
            url: cs.embedded_link || cs.external_links?.find(l => l.url)?.url || '',
            slug: cs.slug,
            category: cs.industry || cs.category
          }));
          setTrustedItems(mapped);
        } else if (isMounted) {
          setTrustedItems(FALLBACK_CLIENTS);
        }
      } catch {
        if (isMounted) {
          setTrustedItems(FALLBACK_CLIENTS);
        }
      }
    };

    fetchTrusted();
    return () => { isMounted = false; };
  }, []);

  const displayList: TrustedItem[] = trustedItems.length > 0 ? trustedItems : FALLBACK_CLIENTS;
  // Duplicate array 3 times to guarantee a seamless, stutter-free continuous infinite ticker
  const duplicatedList: TrustedItem[] = [...displayList, ...displayList, ...displayList];

  return (
    <section className="trusted-by-section" aria-label="Trusted by industry leaders">
      <div className="trusted-by-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%' }}>
        <p className="mono trusted-by-eyebrow" style={{ textAlign: 'center', margin: '0 auto', display: 'inline-block' }}>
          TRUSTED BY MODERN ENTERPRISES & SCALE-UPS
        </p>
      </div>

      <div className="trusted-by-slider-container">
        {/* Left & Right gradient masks for smooth edge fade */}
        <div className="trusted-by-mask-left" aria-hidden="true" />
        <div className="trusted-by-mask-right" aria-hidden="true" />

        <div className="trusted-by-track">
          {duplicatedList.map((item, index) => {
            const faviconSrc = item.url ? getFaviconUrl(item.url, undefined, 48) : '';

            const content = (
              <div className="trusted-by-item">
                <div className="trusted-favicon-box">
                  {faviconSrc ? (
                    <img
                      src={faviconSrc}
                      alt={`${item.name} logo`}
                      className="trusted-favicon-img"
                      loading="lazy"
                      onError={(e: any) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.trusted-initials-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <span
                    className="trusted-initials-fallback"
                    style={{ display: faviconSrc ? 'none' : 'flex' }}
                  >
                    {getFallbackInitials(item.name)}
                  </span>
                </div>
                <div className="trusted-text-box">
                  <span className="trusted-client-name">{item.name}</span>
                  {item.category && <span className="trusted-category">{item.category}</span>}
                </div>
              </div>
            );

            if (item.slug) {
              return (
                <Link
                  key={`${item.name}-${index}`}
                  to={`/case-studies/${item.slug}`}
                  className="trusted-item-link"
                  title={`View ${item.name} Case Study`}
                >
                  {content}
                </Link>
              );
            }

            if (item.url) {
              return (
                <a
                  key={`${item.name}-${index}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trusted-item-link"
                  title={`Visit ${item.name}`}
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={`${item.name}-${index}`} className="trusted-item-link">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustedByMarquee;
