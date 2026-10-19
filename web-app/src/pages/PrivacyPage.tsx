import PageSEO from '../components/layout/PageSEO';

export function PrivacyPage() {
  return (
    <div style={{ minHeight: '80vh', paddingTop: '160px', paddingBottom: '160px', position: 'relative' }}>
      <PageSEO
        title="Privacy Policy"
        description="Learn how Etromo handles data privacy, collection, and security for users and clients."
        url="/privacy"
      />
      <div className="wrap" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '24px' }}>Privacy Policy</h1>
        <p style={{ opacity: 0.6, marginBottom: '48px' }}>Last updated: October 2026</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '16px', lineHeight: 1.6, opacity: 0.8 }}>
          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>1. Data Collection</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you. Types of Data collected may include: Personal Data, Usage Data, and Tracking & Cookies Data.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>2. Use of Data</h2>
            <p>Etromo uses the collected data for various purposes: to provide and maintain our Service, to notify you about changes to our Service, to provide customer support, to gather analysis or valuable information so that we can improve our Service, and to monitor the usage of our Service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>3. Transfer of Data</h2>
            <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>4. Security of Data</h2>
            <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
