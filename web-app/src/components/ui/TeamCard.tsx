import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  LinkedinIcon,
  GithubIcon,
  XIcon,
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  GlobeIcon,
  MailIcon
} from '../../SocialIcons';
import './TeamCard.css';

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  department?: string;
  short_desc?: string;
  bio?: string;
  email?: string;
  linkedin_url?: string;
  github_url?: string;
  x_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  website_url?: string;
  image_url?: string;
  skills?: string | string[];
  sort_order?: number;
  is_active?: number;
}

export interface TeamCardProps {
  member: TeamMember;
  index?: number;
  isActive?: boolean;
  onHover?: (m: TeamMember) => void;
  onLeave?: () => void;
  onClick?: (m: TeamMember) => void;
  showViewCue?: boolean;
}

export function TeamCard({
  member,
  index = 0,
  isActive = false,
  onHover,
  onLeave,
  onClick
}: TeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent flip if clicking an explicit interactive anchor or button
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    setIsFlipped(prev => !prev);
    onClick?.(member);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        return;
      }
      e.preventDefault();
      setIsFlipped(prev => !prev);
      onClick?.(member);
    }
  };

  // Build the list of active social links based only on available member fields
  const socialLinks = [
    {
      key: 'linkedin',
      url: member.linkedin_url,
      label: `${member.name}'s LinkedIn Profile`,
      icon: <LinkedinIcon size={16} />
    },
    {
      key: 'github',
      url: member.github_url,
      label: `${member.name}'s GitHub Profile`,
      icon: <GithubIcon size={16} />
    },
    {
      key: 'x',
      url: member.x_url,
      label: `${member.name}'s X (Twitter) Profile`,
      icon: <XIcon size={15} />
    },
    {
      key: 'instagram',
      url: member.instagram_url,
      label: `${member.name}'s Instagram Profile`,
      icon: <InstagramIcon size={16} />
    },
    {
      key: 'facebook',
      url: member.facebook_url,
      label: `${member.name}'s Facebook Profile`,
      icon: <FacebookIcon size={16} />
    },
    {
      key: 'youtube',
      url: member.youtube_url,
      label: `${member.name}'s YouTube Channel`,
      icon: <YoutubeIcon size={16} />
    },
    {
      key: 'website',
      url: member.website_url,
      label: `${member.name}'s Website`,
      icon: <GlobeIcon size={16} />
    },
    {
      key: 'email',
      url: member.email ? `mailto:${member.email}` : undefined,
      label: `Email ${member.name} (${member.email})`,
      icon: <MailIcon size={16} />,
      isMail: true
    }
  ].filter(item => Boolean(item.url));

  return (
    <div
      className={`team-flip-card-wrap ${isActive ? 'is-active' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
      aria-label={`${member.name}, ${member.role}. ${
        isFlipped
          ? 'Card is showing detailed bio and contacts. Click or press Enter to flip back.'
          : 'Card is showing portrait. Click or press Enter to flip and view full biography and social profiles.'
      }`}
      onMouseEnter={() => onHover?.(member)}
      onMouseLeave={() => onLeave?.()}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`team-flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* ──────────────── FRONT FACE (PORTRAIT & CORE ROLE) ──────────────── */}
        <div
          className="team-flip-card-face team-flip-card-front"
          aria-hidden={isFlipped}
        >
          {/* Subtle Radiant Ambient Aura */}
          <div className="team-card-radiant-glow" aria-hidden="true" />

          {/* Portrait Image Layer / Fallback Avatar */}
          <div className="team-card-image-layer">
            {member.image_url && !imgError ? (
              <img
                src={member.image_url}
                alt={member.name}
                loading="lazy"
                className="team-card-photo"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="team-card-fallback-avatar">
                <span className="team-card-initials">{initials}</span>
                <span className="team-card-fallback-role">
                  {member.department || 'Team Member'}
                </span>
              </div>
            )}
          </div>

          {/* Deep Navy/Black Gradient Scrim */}
          <div className="team-card-gradient-overlay" aria-hidden="true" />

          {/* Bottom Card Identity & Interactive Cue */}
          <div className="team-card-bottom-content">
            <h3 className="team-card-person-name">{member.name}</h3>
            <p className="team-card-person-role">{member.role}</p>

            {member.short_desc && (
              <p className="team-card-person-desc">{member.short_desc}</p>
            )}

            <div className="team-card-pill-btn-wrap">
              <span className="team-card-pill-btn">
                <span>Profile & Bio</span>
                <span className="team-card-pill-arrow">→</span>
              </span>
            </div>
          </div>
        </div>

        {/* ──────────────── BACK FACE (BIOGRAPHY, EXPERTISE & SOCIALS) ──────────────── */}
        <div
          className="team-flip-card-face team-flip-card-back"
          aria-hidden={!isFlipped}
        >
          {/* Back Identity */}
          <div className="team-card-back-identity">
            <h3 className="team-card-back-name">{member.name}</h3>
            <p className="team-card-back-role">{member.role}</p>
          </div>

          {/* Scrollable Content: Bio, Skills & Work Email */}
          <div className="team-card-back-body">
            {/* Biography */}
            <div className="team-card-back-section">
              <span className="team-card-back-kicker">BIOGRAPHY</span>
              <p className="team-card-back-bio">
                {member.bio ||
                  member.short_desc ||
                  'Experienced software and operations leader driving technological excellence and practical innovation.'}
              </p>
            </div>

            {/* Core Competencies & Skills */}
            {skillsList.length > 0 && (
              <div className="team-card-back-section">
                <span className="team-card-back-kicker">EXPERTISE</span>
                <div className="team-card-skills-wrap">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="team-card-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Email */}
            {member.email && (
              <div className="team-card-back-section">
                <span className="team-card-back-kicker">DIRECT EMAIL</span>
                <a
                  href={`mailto:${member.email}`}
                  className="team-card-email-link"
                  tabIndex={isFlipped ? 0 : -1}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MailIcon size={14} />
                  <span>{member.email}</span>
                </a>
              </div>
            )}
          </div>

          {/* Back Footer: Social Media Links & Return Button */}
          <div className="team-card-back-footer">
            {socialLinks.length > 0 && (
              <div className="team-card-social-grid">
                {socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.url}
                    target={item.isMail ? '_self' : '_blank'}
                    rel={item.isMail ? undefined : 'noopener noreferrer'}
                    className="team-card-social-icon-btn"
                    aria-label={item.label}
                    title={item.label}
                    tabIndex={isFlipped ? 0 : -1}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            )}

            <button
              type="button"
              className="team-card-return-pill"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              tabIndex={isFlipped ? 0 : -1}
            >
              <span>Back to Profile</span>
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
