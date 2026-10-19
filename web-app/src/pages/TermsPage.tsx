import PageSEO from '../components/layout/PageSEO';

export function TermsPage() {
  return (
    <div style={{ minHeight: '80vh', paddingTop: '160px', paddingBottom: '160px', position: 'relative' }}>
      <PageSEO
        title="Terms and Conditions"
        description="Review the terms and conditions governing the use of Etromo services and software."
        url="/terms"
      />
      <div className="wrap" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '24px' }}>Terms and Conditions</h1>
        <p style={{ opacity: 0.6, marginBottom: '48px' }}>Last updated: October 2026</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '16px', lineHeight: 1.6, opacity: 0.8 }}>
          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>1. Introduction</h2>
            <p>Welcome to Etromo. These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.</p>
          </section>
          
          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>2. Intellectual Property Rights</h2>
            <p>Other than the content you own, under these Terms, Etromo and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>3. Restrictions</h2>
            <p>You are specifically restricted from publishing any Website material in any other media, selling, sublicensing and/or otherwise commercializing any Website material, or publicly performing and/or showing any Website material.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>4. No Warranties</h2>
            <p>This Website is provided "as is," with all faults, and Etromo expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '16px' }}>5. Limitation of Liability</h2>
            <p>In no event shall Etromo, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
