import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import type { TeamMember } from './TeamCard';
import {
  MailIcon,
  LinkedinIcon,
  GithubIcon,
  XIcon,
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  GlobeIcon
} from '../../SocialIcons';

export function TeamExpandedModal({
  member,
  onClose,
  onMouseEnter,
  onMouseLeave
}: {
  member: TeamMember | null;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!member) return null;

  const initials = member.name
    ? member.name
        .trim()
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'TM';

  const skillsList: string[] = member.skills
    ? Array.isArray(member.skills)
      ? member.skills
      : String(member.skills)
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
    : [];

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (member.email) {
      navigator.clipboard.writeText(member.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="team-modal-overlay"
      onClick={onClose}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="dialog"
      aria-modal="true"
      aria-label={`Detailed profile for ${member.name}`}
    >
      <div className="team-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="team-modal-close"
          onClick={onClose}
          aria-label="Close profile details"
          type="button"
        >
          <X size={18} />
        </button>

        <div className="team-modal-layout">
          {/* Left Column: 1:1 Photo & Contact Information */}
          <div className="team-modal-left">
            <div className="team-modal-photo-wrap">
              {member.image_url && !imgError ? (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="team-modal-photo"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="leadership-avatar-fallback">
                  <span className="leadership-avatar-initials">{initials}</span>
                  <span className="leadership-avatar-tag">Executive</span>
                </div>
              )}
            </div>

            <span className="leadership-dept-badge">
              [ {member.department || 'Executive Leadership'} ]
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginTop: '4px', marginBottom: '2px' }}>
              {member.name}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--sky)', marginBottom: '14px' }}>
              {member.role}
            </p>

            {/* Email contact if available */}
            {member.email && (
              <div className="team-modal-email-box">
                <span className="team-modal-section-title" style={{ marginBottom: '4px' }}>Work Email</span>
                <a
                  href={`mailto:${member.email}`}
                  className="team-modal-email-link"
                  title="Send email"
                >
                  <MailIcon size={14} color="var(--sky)" />
                  <span>{member.email}</span>
                </a>
                <button
                  type="button"
                  className="team-modal-copy-btn"
                  onClick={handleCopyEmail}
                >
                  {copied ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Full Bio, Skills, and Configured Social Links */}
          <div className="team-modal-right">
            <div className="team-modal-heading">
              <span className="leadership-dept-badge">
                PROFILE & EXPERTISE
              </span>
              <h3 className="team-modal-name">{member.name}</h3>
              <p className="team-modal-role">{member.role}</p>
            </div>

            {/* Full Biography */}
            <div className="team-modal-bio">
              {member.bio || member.short_desc || 'No detailed biography provided.'}
            </div>

            {/* Skills & Expertise */}
            {skillsList.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <span className="team-modal-section-title">Core Competencies & Expertise</span>
                <div className="team-skills-list">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="team-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Links with Recognizable Icons */}
            <div className="team-social-row">
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-social-icon-btn"
                  title="LinkedIn"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon size={17} />
                </a>
              )}
              {member.github_url && (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-social-icon-btn"
                  title="GitHub"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon size={17} />
                </a>
              )}
              {member.x_url && (
                <a
                  href={member.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-social-icon-btn"
                  title="X (Twitter)"
                  aria-label="X Profile"
                >
                  <XIcon size={16} />
                </a>
              )}
              {member.instagram_url && (
                <a
                  href={member.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-social-icon-btn"
                  title="Instagram"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon size={17} />
                </a>
              )}
              {member.facebook_url && (
                <a
                  href={member.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-social-icon-btn"
                  title="Facebook"
                  aria-label="Facebook Profile"
                >
                  <FacebookIcon size={17} />
                </a>
              )}
              {member.youtube_url && (
                <a
                  href={member.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-social-icon-btn"
                  title="YouTube"
                  aria-label="YouTube Channel"
                >
                  <YoutubeIcon size={17} />
                </a>
              )}
              {member.website_url && (
                <a
                  href={member.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-social-icon-btn"
                  title="Portfolio / Website"
                  aria-label="Personal Portfolio or Website"
                >
                  <GlobeIcon size={17} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamExpandedModal;
