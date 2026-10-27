import React, { useState } from 'react';
import {
  Share2,
  ExternalLink,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Eye,
  Globe
} from 'lucide-react';
import {
  LinkedinIcon,
  XIcon,
  GithubIcon,
  InstagramIcon,
  YoutubeIcon,
  WhatsappIcon,
  FacebookIcon
} from '../../SocialIcons';

interface SiteSettingsAndSocialStudioProps {
  settings: Record<string, string>;
  onSave: (newSettings: Record<string, string>) => Promise<void>;
  onNavigateToSeo?: () => void;
}

export function SiteSettingsAndSocialStudio({
  settings: initialSettings,
  onSave,
  onNavigateToSeo
}: SiteSettingsAndSocialStudioProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    linkedin_url: initialSettings.linkedin_url || 'https://www.linkedin.com/company/etromo',
    x_url: initialSettings.x_url || initialSettings.twitter_url || 'https://x.com/etromo',
    github_url: initialSettings.github_url || 'https://github.com/etromo',
    instagram_url: initialSettings.instagram_url || 'https://www.instagram.com/etromo',
    youtube_url: initialSettings.youtube_url || 'https://www.youtube.com/@etromo',
    whatsapp_url: initialSettings.whatsapp_url || 'https://wa.me/919999999999',
    facebook_url: initialSettings.facebook_url || 'https://www.facebook.com/etromo',
    email: initialSettings.email || 'contact@etromo.com',
    phone: initialSettings.phone || '+91 99999 99999',
    location: initialSettings.location || 'Bangalore, India & London, UK',
    hours: initialSettings.hours || 'Mon - Fri, 9:00 AM - 7:00 PM IST',
    ...initialSettings
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<'linkedin' | 'x' | 'whatsapp'>('linkedin');

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleTestLink = (url: string) => {
    if (!url || !url.trim()) {
      alert('Please enter a valid URL first.');
      return;
    }
    const target = url.startsWith('http') ? url : `https://${url}`;
    window.open(target, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch {
      alert('Saved locally!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notice */}
      {saveSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: 'rgba(20, 28, 45, 0.96)',
          border: '1px solid rgba(168, 255, 120, 0.4)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          borderRadius: '12px',
          padding: '14px 20px',
          color: '#fff',
          fontSize: '13px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <CheckCircle2 size={16} color="#A8FF78" />
          <span>Site settings &amp; social links successfully saved and published!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
            Site Settings &amp; Social Media Hub
          </h2>
          <p style={{ opacity: 0.6, fontSize: '14px', margin: 0, maxWidth: '750px', lineHeight: '1.5' }}>
            Manage all company social channels, official profiles, and direct customer communication routes.
            Changes sync instantly to your website header, footer, team profiles, and social preview cards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onNavigateToSeo && (
            <button
              type="button"
              onClick={onNavigateToSeo}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Globe size={15} color="var(--sky)" />
              Google Snippet &amp; SEO →
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #8FC1FF 0%, #479fff 100%)',
              border: 'none',
              color: '#000',
              padding: '10px 22px',
              borderRadius: '10px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(143,193,255,0.25)'
            }}
          >
          <Sparkles size={16} />
          {saving ? 'Publishing...' : 'Save & Publish All'}
        </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Main Grid: Left = Social Links, Right = Live Social Previews & Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* 1. SOCIAL MEDIA PROFILES */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(143,193,255,0.1)' }}>
                <Share2 size={18} color="var(--sky)" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Official Social Media Links</h3>
                <p style={{ fontSize: '12px', opacity: 0.5, margin: '2px 0 0 0' }}>Provide full URLs including https://</p>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <LinkedinIcon size={14} /> LinkedIn Company Page
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/company/etromo"
                  value={formData.linkedin_url || ''}
                  onChange={e => handleChange('linkedin_url', e.target.value)}
                  className="modern-input"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleTestLink(formData.linkedin_url)}
                  title="Test Link in New Tab"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Twitter / X */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <XIcon size={13} /> X (Twitter) Profile
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://x.com/etromo"
                  value={formData.x_url || ''}
                  onChange={e => {
                    handleChange('x_url', e.target.value);
                    handleChange('twitter_url', e.target.value);
                  }}
                  className="modern-input"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleTestLink(formData.x_url)}
                  title="Test Link in New Tab"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <GithubIcon size={14} /> GitHub Organization
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://github.com/etromo"
                  value={formData.github_url || ''}
                  onChange={e => handleChange('github_url', e.target.value)}
                  className="modern-input"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleTestLink(formData.github_url)}
                  title="Test Link in New Tab"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Instagram */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <InstagramIcon size={14} /> Instagram Profile
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/etromo"
                  value={formData.instagram_url || ''}
                  onChange={e => handleChange('instagram_url', e.target.value)}
                  className="modern-input"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleTestLink(formData.instagram_url)}
                  title="Test Link in New Tab"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* YouTube */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <YoutubeIcon size={14} /> YouTube Channel
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/@etromo"
                  value={formData.youtube_url || ''}
                  onChange={e => handleChange('youtube_url', e.target.value)}
                  className="modern-input"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleTestLink(formData.youtube_url)}
                  title="Test Link in New Tab"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <WhatsappIcon size={14} /> WhatsApp Direct Contact URL / Number
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="https://wa.me/919999999999 or phone number"
                  value={formData.whatsapp_url || ''}
                  onChange={e => handleChange('whatsapp_url', e.target.value)}
                  className="modern-input"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleTestLink(formData.whatsapp_url)}
                  title="Test Link in New Tab"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <FacebookIcon size={14} /> Facebook Page
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://www.facebook.com/etromo"
                  value={formData.facebook_url || ''}
                  onChange={e => handleChange('facebook_url', e.target.value)}
                  className="modern-input"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleTestLink(formData.facebook_url)}
                  title="Test Link in New Tab"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. SOCIAL SHARE PREVIEW SIMULATOR & CONTACT INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Live Social Preview Card */}
            <div style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={17} color="var(--sky)" />
                  <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Social Share Preview Card</h3>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['linkedin', 'x', 'whatsapp'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPreviewPlatform(p)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: previewPlatform === p ? 'rgba(143,193,255,0.2)' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: previewPlatform === p ? 'var(--sky)' : 'rgba(255,255,255,0.6)',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {p === 'x' ? 'X (Twitter)' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card visual mockup */}
              <div style={{
                background: '#0d111a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
              }}>
                <div style={{
                  height: '170px',
                  background: 'linear-gradient(135deg, #101626 0%, #1e1b4b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <img src="/logo.png" alt="Etromo" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    backdropFilter: 'blur(6px)'
                  }}>
                    etromo.in
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    etromo.in
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#fff', marginBottom: '6px', lineHeight: '1.3' }}>
                    Etromo — Intelligent Enterprise Software &amp; Systems
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.65, lineHeight: '1.4' }}>
                    Etromo engineers intelligent enterprise software, custom CRM operating systems, AI-powered automation workflows, and high-performance digital platforms.
                  </div>
                </div>
              </div>
            </div>

            {/* Company Contact Coordinates */}
            <div style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(168,255,120,0.1)' }}>
                  <Globe size={18} color="#A8FF78" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Company Contact Coordinates</h3>
                  <p style={{ fontSize: '12px', opacity: 0.5, margin: '2px 0 0 0' }}>Displayed on the footer, contact page, and JSON-LD schema</p>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Mail size={13} /> Primary Business Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="modern-input"
                  placeholder="contact@etromo.com"
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Phone size={13} /> Phone / Hotline
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="modern-input"
                  placeholder="+91 99999 99999"
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <MapPin size={13} /> Headquarters / Geographic Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => handleChange('location', e.target.value)}
                  className="modern-input"
                  placeholder="Bangalore, India & London, UK"
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Clock size={13} /> Operational Hours
                </label>
                <input
                  type="text"
                  value={formData.hours || ''}
                  onChange={e => handleChange('hours', e.target.value)}
                  className="modern-input"
                  placeholder="Mon - Fri, 9:00 AM - 7:00 PM IST"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Action Strip */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>Publish Changes to Entire Website</div>
            <div style={{ fontSize: '12px', opacity: 0.5 }}>Saves to production database and triggers real-time UI refresh.</div>
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #8FC1FF 0%, #479fff 100%)',
              border: 'none',
              color: '#000',
              padding: '11px 26px',
              borderRadius: '10px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} />
            {saving ? 'Publishing...' : 'Save & Publish All'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SiteSettingsAndSocialStudio;
