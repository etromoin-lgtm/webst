import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import { getFaviconUrl, extractDomain, getFallbackInitials } from '../../utils/favicon';
import type { CaseStudy } from '../../types/caseStudy';
import './FeaturedCaseStudiesSection.css';

export const FeaturedCaseStudiesSection: React.FC = () => {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/case-studies?featured_on_homepage=true');
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.case_studies) && json.case_studies.length > 0) {
          setStudies(json.case_studies.slice(0, 3));
        } else if (isMounted) {
          // If none specifically flagged yet, fetch top 3 published
          const fallbackRes = await fetch('/api/case-studies');
          const fallbackJson = await fallbackRes.json();
          if (isMounted && fallbackJson.success && Array.isArray(fallbackJson.case_studies)) {
            setStudies(fallbackJson.case_studies.slice(0, 3));
          }
        }
      } catch {
        // Handled silently
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  if (!loading && studies.length === 0) {
    return null;
  }

  return (
    <section className="home-section featured-studies-section" id="case-studies" aria-labelledby="featured-studies-title">
      <div className="wrap">
        <div className="section-heading rv">
          <p className="mono">Proven Case Studies</p>
          <h2 id="featured-studies-title">
            Real client systems. Verified production <em>results.</em>
          </h2>
          <p>
            Every system we architect is benchmarked against real operational baseline metrics. Here is what happens when business bottlenecks are eliminated.
          </p>
        </div>

        <div className="featured-studies-grid">
          {studies.map((cs, idx) => {
            const liveUrl = cs.embedded_link || cs.external_links?.find(l => l.url)?.url;
            const domain = liveUrl ? extractDomain(liveUrl) : '';
            const favicon = liveUrl ? getFaviconUrl(liveUrl, cs.custom_favicon_url, 48) : '';
            const primaryMetric = cs.key_results?.[0];
            const beforeAfter = cs.before_after_metrics?.[0];

            return (
              <article key={cs.id || cs.slug} className="featured-study-card rv" style={{ transitionDelay: `${idx * 80}ms` }}>
                {/* Header: Live Favicon + Client Name + External Link */}
                <div className="featured-study-header">
                  <div className="featured-client-identity">
                    <div className="featured-favicon-wrapper">
                      {favicon ? (
                        <img
                          src={favicon}
                          alt=""
                          className="featured-favicon-img"
                          loading="lazy"
                          onError={(e: any) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector('.featured-initials');
                              if (fallback) fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <span className="featured-initials" style={{ display: favicon ? 'none' : 'flex' }}>
                        {getFallbackInitials(cs.client_name)}
                      </span>
                    </div>

                    <div>
                      <span className="featured-client-name">{cs.client_name}</span>
                      <span className="featured-client-category">{cs.category}</span>
                    </div>
                  </div>

                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="featured-live-badge"
                      title={`Visit live production site: ${domain}`}
                    >
                      <span>{domain || 'Live Site'}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Cover visual if available */}
                {cs.cover_image && (
                  <div className="featured-cover-wrapper">
                    <img src={cs.cover_image} alt={cs.title} className="featured-cover-img" loading="lazy" />
                    <div className="featured-cover-gradient" />
                  </div>
                )}

                {/* Content */}
                <div className="featured-study-body">
                  <h3 className="featured-study-title">
                    <Link to={`/case-studies/${cs.slug}`}>
                      {cs.title}
                    </Link>
                  </h3>
                  <p className="featured-study-summary">
                    {cs.subtitle || cs.challenge_overview || 'Custom workflow integration & scalable automation architecture.'}
                  </p>

                  {/* Highlight Metric Box */}
                  {(primaryMetric || beforeAfter) && (
                    <div className="featured-metric-highlight">
                      <div className="metric-primary-value">
                        {primaryMetric?.metric || beforeAfter?.change_display || 'Verified'}
                      </div>
                      <div className="metric-primary-label">
                        {primaryMetric?.label || beforeAfter?.name || 'Measured Improvement'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="featured-study-footer">
                  <Link to={`/case-studies/${cs.slug}`} className="featured-read-link">
                    Explore Architecture Case Study <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Case Studies Link */}
        <div className="featured-studies-more-cta rv">
          <Link to="/case-studies" className="btn p">
            View all architecture case studies & benchmarks <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCaseStudiesSection;
