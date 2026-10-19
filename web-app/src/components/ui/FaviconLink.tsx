import React, { useState } from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import type { CaseStudyExternalLink } from '../../types/caseStudy';

interface FaviconLinkProps {
  link: CaseStudyExternalLink;
  variant?: 'inline' | 'button' | 'badge';
  className?: string;
  showTypeBadge?: boolean;
}

export const FaviconLink: React.FC<FaviconLinkProps> = ({
  link,
  variant = 'inline',
  className = '',
  showTypeBadge = false
}) => {
  const [imgError, setImgError] = useState(false);

  // Extract display domain for accessible tooltip/subtext
  let domain = '';
  try {
    const parsed = new URL(link.url.startsWith('http') ? link.url : `https://${link.url}`);
    domain = parsed.hostname.replace(/^www\./, '');
  } catch {
    domain = link.url;
  }

  const iconSrc = link.override_icon || link.favicon_url;
  const hasIcon = Boolean(iconSrc && !imgError && link.favicon_status !== 'invalid_url');

  if (variant === 'button') {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${link.label} (opens ${domain} in a new tab)`}
        className={`favicon-btn ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 18px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '999px',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: '500',
          textDecoration: 'none',
          transition: 'all 0.25s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(143, 193, 255, 0.4)';
          e.currentTarget.style.background = 'rgba(143, 193, 255, 0.08)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <span
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {hasIcon ? (
            <img
              src={iconSrc}
              alt=""
              onError={() => setImgError(true)}
              style={{
                width: '16px',
                height: '16px',
                objectFit: 'contain',
                display: 'block'
              }}
              loading="lazy"
            />
          ) : (
            <Globe size={13} style={{ color: 'var(--sky, #8FC1FF)' }} />
          )}
        </span>
        <span style={{ fontWeight: 600 }}>{link.label}</span>
        {showTypeBadge && link.type && (
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {link.type}
          </span>
        )}
        <ExternalLink size={13} style={{ opacity: 0.6, marginLeft: '2px' }} />
      </a>
    );
  }

  // Default inline link
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.label} (opens ${domain} in a new tab)`}
      className={`favicon-link-inline ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--sky, #8FC1FF)',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'color 0.2s ease, opacity 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.85';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      <span
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '5px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        {hasIcon ? (
          <img
            src={iconSrc}
            alt=""
            onError={() => setImgError(true)}
            style={{
              width: '14px',
              height: '14px',
              objectFit: 'contain',
              display: 'block'
            }}
            loading="lazy"
          />
        ) : (
          <Globe size={12} style={{ color: 'var(--sky, #8FC1FF)' }} />
        )}
      </span>
      <span>{link.label}</span>
      <ExternalLink size={12} style={{ opacity: 0.7 }} />
    </a>
  );
};

export default FaviconLink;
