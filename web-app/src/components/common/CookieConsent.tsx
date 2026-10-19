import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('etromo_cookie_consent');
    if (!consent) {
      setShowConsent(true);
    }

    const handleOpen = () => setShowConsent(true);
    window.addEventListener('open-cookie-preferences', handleOpen);
    return () => window.removeEventListener('open-cookie-preferences', handleOpen);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('etromo_cookie_consent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('etromo_cookie_consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', right: '24px', maxWidth: '400px', background: '#1C1D21', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 48px rgba(0,0,0,0.6)', zIndex: 9999 }}>
      <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>We value your privacy</h4>
      <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.5, marginBottom: '24px' }}>
        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handleAccept} className="btn p" style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '8px', justifyContent: 'center', cursor: 'pointer' }}>Accept</button>
        <button onClick={handleDecline} className="btn" style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', justifyContent: 'center', cursor: 'pointer' }}>Decline</button>
      </div>
    </div>
  );
}

export default CookieConsent;
