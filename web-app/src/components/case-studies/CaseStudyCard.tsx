import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';
import type { CaseStudy } from '../../types/caseStudy';
import FaviconLink from '../ui/FaviconLink';
import { getFaviconUrl, extractDomain } from '../../utils/favicon';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy }) => {
  // Find approved public client website link
  const clientLink = caseStudy.external_links?.find(
    l => l.display && (l.type === 'Client Website' || l.type === 'Live Product')
  );

  // Extract top verified results
  const primaryResult = caseStudy.key_results?.[0];
  const secondaryResult = caseStudy.key_results?.[1];

  const clientDisplayName = caseStudy.is_client_confidential
    ? 'Confidential Enterprise Client'
    : caseStudy.client_name;

  return (
    <article
      className="case-study-card"
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        backdropFilter: 'blur(16px)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(143, 193, 255, 0.35)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 24px rgba(143, 193, 255, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Cover Visual */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#0d131f' }}>
        <img
          src={caseStudy.cover_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'}
          alt={caseStudy.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(5,8,15,0.1) 0%, rgba(5,8,15,0.85) 100%)'
          }}
        />

        {/* Category & Duration Badges */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(5, 8, 15, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--sky, #8FC1FF)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(8px)'
            }}
          >
            {caseStudy.category}
          </span>

          {caseStudy.duration && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(5, 8, 15, 0.7)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Clock size={11} /> {caseStudy.duration}
            </span>
          )}
        </div>

        {/* Client Name over Image Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: '0.02em'
            }}
          >
            {clientDisplayName}
          </span>
          {caseStudy.industry && (
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
              {caseStudy.industry}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3
          style={{
            fontSize: '19px',
            fontWeight: 600,
            lineHeight: 1.35,
            color: '#FFFFFF',
            marginBottom: '10px'
          }}
        >
          <Link
            to={`/case-studies/${caseStudy.slug}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {caseStudy.title}
          </Link>
        </h3>

        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.65)',
            marginBottom: '20px',
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {caseStudy.subtitle || caseStudy.challenge_overview}
        </p>

        {/* Results Metrics Box */}
        {(primaryResult || secondaryResult) && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '20px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            {primaryResult && (
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#34D399',
                      fontFamily: 'var(--mono, monospace)'
                    }}
                  >
                    {primaryResult.metric}
                  </span>
                  {primaryResult.verified && (
                    <span title="Verified Result" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <ShieldCheck size={13} style={{ color: '#10B981' }} />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                  {primaryResult.label}
                </div>
              </div>
            )}

            {secondaryResult && (
              <div style={{ flex: 1, borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--sky, #8FC1FF)',
                      fontFamily: 'var(--mono, monospace)'
                    }}
                  >
                    {secondaryResult.metric}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                  {secondaryResult.label}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card Footer: Client Link + Read Case Study */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            marginTop: 'auto',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {caseStudy.embedded_link ? (
            <a
              href={caseStudy.embedded_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--sky, #8FC1FF)',
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
              title="Visit live client project"
            >
              <img
                src={getFaviconUrl(caseStudy.embedded_link, caseStudy.custom_favicon_url, 32)}
                alt=""
                style={{ width: '15px', height: '15px', borderRadius: '3px', objectFit: 'contain' }}
                onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{extractDomain(caseStudy.embedded_link)}</span>
              <ArrowUpRight size={12} />
            </a>
          ) : clientLink ? (
            <FaviconLink link={clientLink} />
          ) : (
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
              Verified Outcome
            </span>
          )}

          <Link
            to={`/case-studies/${caseStudy.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              textDecoration: 'none',
              transition: 'gap 0.2s ease, color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--sky, #8FC1FF)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            Read Case Study <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CaseStudyCard;
