import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import './Partners.css';

export function PartnersHero() {
  return (
    <header className="partners-hero" id="top">
      <div className="partners-hero-orb" aria-hidden="true" />
      <div className="partners-hero-flute" aria-hidden="true" />
      <div className="wrap partners-hero-wrap">
        {/* Highlighted Newly Launched Beta Button */}
        <div className="partners-beta-tag-row">
          <Link to="/partner-apply" className="partners-beta-pill-btn">
            <span className="partners-beta-pulse-dot" aria-hidden="true" />
            <span className="partners-beta-badge-label">NEWLY LAUNCHED</span>
            <span className="partners-beta-divider">|</span>
            <span className="partners-beta-text">Test Beta Program · Currently in Planning</span>
            <ChevronRight size={14} className="partners-beta-arrow" aria-hidden="true" />
          </Link>
        </div>

        <p className="mono partners-eyebrow">Partner Ecosystem & Alliances</p>
        <h1 id="partners-title">Build. Connect. <em>Grow.</em></h1>
        <p className="partners-hero-copy">
          A new approach to bringing software and businesses together. Great software deserves more than a great product. It needs the right people, the right distribution, and the right support to reach the businesses it was built for.
        </p>
        <div className="partners-hero-actions">
          <a className="btn p partners-btn" href="#pathways">
            Explore Opportunities <ChevronRight size={16} aria-hidden="true" />
          </a>
          <Link className="btn partners-btn partners-btn-secondary" to="/partner-apply">
            Express Interest
          </Link>
          <Link className="btn partners-btn partners-btn-beta" to="/partner-apply">
            <span className="beta-live-dot" aria-hidden="true" />
            <span>Join Beta Testing</span>
          </Link>
        </div>
        <div className="partners-notice-pill">
          <span className="partners-notice-dot" aria-hidden="true" />
          <span className="partners-notice-text">
            <strong>Newly Launched (Test Beta Version):</strong> The Partner Ecosystem is currently in active planning. Developers and Tech Partners who register during beta receive early review, priority API access, and dedicated onboarding support.
          </span>
        </div>
      </div>
    </header>
  );
}

export function Pathways() {
  return (
    <section id="pathways" className="partners-section">
      <div className="wrap">
        <div className="head rv partners-section-heading">
          <p className="mono partners-section-eyebrow">[ PATHWAYS TO IMPACT ]</p>
          <h2>Two Ways to Create <em>Impact.</em></h2>
          <p className="partners-section-lead">
            Choose your entry point into the ecosystem. Whether you build exceptional software or develop customer relationships, we align your growth with lasting client value.
          </p>
        </div>
        <div className="partners-cards-grid">
          <div className="partner-card rv">
            <div className="partner-card-header">
              <span className="mono partner-badge">01 · Product Creators</span>
            </div>
            <h3>Turn great software into greater opportunities.</h3>
            <p className="partner-card-desc">
              For independent developers, software founders, and product-owning businesses. Reach the right customers and develop sustainable, structured distribution channels.
            </p>
            <div className="partner-card-footer">
              <Link to="/partner-apply" className="partner-card-btn">
                <span>Explore Creator Pathway</span>
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="partner-card rv">
            <div className="partner-card-header">
              <span className="mono partner-badge">02 · Growth Partners</span>
            </div>
            <h3>Bring better technology to businesses.</h3>
            <p className="partner-card-desc">
              For business development professionals and consultants. Connect organizations with suitable software products and build an enduring business around customer success.
            </p>
            <div className="partner-card-footer">
              <Link to="/partner-apply" className="partner-card-btn">
                <span>Explore Growth Pathway</span>
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Discover', desc: 'Creators present products, capabilities, pricing, and support.' },
    { num: '02', title: 'Review', desc: 'Products undergo review of functionality and technical considerations.' },
    { num: '03', title: 'Define', desc: 'Approved products receive clearly documented commercial terms.' },
    { num: '04', title: 'Connect', desc: 'Growth Partners explore relevant products to represent.' },
    { num: '05', title: 'Introduce', desc: 'Partners identify customers, arrange demos, and help evaluate.' },
    { num: '06', title: 'Onboard', desc: 'Coordinate account setup, implementation, and training.' },
    { num: '07', title: 'Grow', desc: 'Build sustainable relationships and transparent commercial processes.' },
  ];

  return (
    <section id="how-it-works">
      <div className="wrap two">
        <div className="rv">
          <h2 style={{ marginTop: '24px' }}>How the Ecosystem <em>Could Work.</em></h2>
          <p style={{ marginTop: '16px' }}>From software creation to business adoption. A structured journey designed to align product quality, commercial opportunities, and customer needs.</p>
        </div>
        <div className="cs rv" style={{ borderLeft: 'none', paddingLeft: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {steps.map(s => (
              <div key={s.num} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
                <span className="mono" style={{ color: 'var(--sky)' }}>{s.num}</span>
                <div>
                  <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>{s.title}</h4>
                  <p style={{ fontSize: '14px', opacity: 0.8 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PartnerBenefits() {
  return (
    <section>
      <div className="wrap">
        <div className="head rv">
          <h2>Run Your Own <em>Business.</em></h2>
        </div>
        <div className="rv" style={{ marginBottom: '48px', maxWidth: '70ch' }}>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            You are not an employee; you are running a mini-company. There are no sales quotas, no forced hours, and no micromanagement. You own your customer relationships, choose the products you believe in, and build a scalable business on your own terms.
          </p>
        </div>

        <div className="rv partner-benefits-table" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', borderRadius: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(160px, 1fr) minmax(160px, 1fr)', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,0.03)', minWidth: '480px' }}>
            <div style={{ padding: '20px' }}><span className="mono" style={{ color: 'var(--h)' }}>Benefit / Role</span></div>
            <div style={{ padding: '20px', borderLeft: '1px solid var(--line)' }}><span className="mono" style={{ color: 'var(--sky)' }}>Tech Partner</span></div>
            <div style={{ padding: '20px', borderLeft: '1px solid var(--line)' }}><span className="mono" style={{ color: 'var(--sky)' }}>Sales Partner</span></div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(160px, 1fr) minmax(160px, 1fr)', borderBottom: '1px solid var(--line)', minWidth: '480px' }}>
            <div style={{ padding: '20px', fontSize: '14px', color: 'var(--h)', fontWeight: 600 }}>Primary Focus</div>
            <div style={{ padding: '20px', fontSize: '14px', borderLeft: '1px solid var(--line)', opacity: 0.8 }}>Build and improve your product without worrying about cold calling.</div>
            <div style={{ padding: '20px', fontSize: '14px', borderLeft: '1px solid var(--line)', opacity: 0.8 }}>Build customer relationships without worrying about coding.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(160px, 1fr) minmax(160px, 1fr)', borderBottom: '1px solid var(--line)', minWidth: '480px' }}>
            <div style={{ padding: '20px', fontSize: '14px', color: 'var(--h)', fontWeight: 600 }}>Customer Ownership</div>
            <div style={{ padding: '20px', fontSize: '14px', borderLeft: '1px solid var(--line)', opacity: 0.8 }}>Own the product IP and the backend technical relationship.</div>
            <div style={{ padding: '20px', fontSize: '14px', borderLeft: '1px solid var(--line)', opacity: 0.8 }}>Own the frontline business relationship with your clients.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(160px, 1fr) minmax(160px, 1fr)', minWidth: '480px' }}>
            <div style={{ padding: '20px', fontSize: '14px', color: 'var(--h)', fontWeight: 600 }}>Revenue & Scale</div>
            <div style={{ padding: '20px', fontSize: '14px', borderLeft: '1px solid var(--line)', opacity: 0.8 }}>Retain the majority share of recurring subscriptions.</div>
            <div style={{ padding: '20px', fontSize: '14px', borderLeft: '1px solid var(--line)', opacity: 0.8 }}>Earn a lifetime recurring revenue share from every customer.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Principles() {
  return (
    <section>
      <div className="orb" style={{ width: '400px', height: '400px', right: '10%', top: '20%', background: 'radial-gradient(circle, var(--electric), transparent 65%)', opacity: 0.2 }}></div>
      <div className="wrap two">
        <div className="rv">
          <h2 style={{ marginTop: '24px' }}>Built Around Trust, Not Just <em>Transactions.</em></h2>
        </div>
        <div className="rv">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Product accountability</h3>
              <p style={{ fontSize: '15px', opacity: 0.8 }}>Products presented accurately with clear limitations, pricing, and support.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Transparent commercial terms</h3>
              <p style={{ fontSize: '15px', opacity: 0.8 }}>Written agreements explaining revenue share, timing, refunds, and conditions.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Customer-first distribution</h3>
              <p style={{ fontSize: '15px', opacity: 0.8 }}>Recommendations reflect business requirements rather than revenue share rates.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Sustainable growth</h3>
              <p style={{ fontSize: '15px', opacity: 0.8 }}>Focus remains on genuine adoption and value—not recruitment quotas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PartnerFAQ() {
  return (
    <section className="partners-section">
      <div className="wrap">
        <div className="head rv partners-section-heading">
          <p className="mono partners-section-eyebrow">[ COMMON QUESTIONS ]</p>
          <h2>Frequently Asked <em>Questions.</em></h2>
        </div>
        <div className="partner-faq-grid">
          <div className="partner-faq-item rv">
            <h4>What is the Partner Ecosystem?</h4>
            <p>A structured program connecting software creators, business growth professionals, and technology specialists through transparent commercial collaboration.</p>
          </div>
          <div className="partner-faq-item rv">
            <h4>Is the program currently available?</h4>
            <p>The program is currently in the active architecture stage. Final participation terms, qualification criteria, and rollout cohorts are being finalized.</p>
          </div>
          <div className="partner-faq-item rv">
            <h4>How do Growth Partners earn?</h4>
            <p>Partners earn recurring revenue share for every qualified client onboarded and maintained, paid reliably each subscription cycle.</p>
          </div>
          <div className="partner-faq-item rv">
            <h4>Is there a fee to participate?</h4>
            <p>Participation is based on capability and alignment rather than pay-to-play fees. All commercial terms are detailed in advance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PartnerDashboards() {
  return (
    <section className="partners-section">
      <div className="wrap">
        <div className="head rv partners-section-heading">
          <p className="mono partners-section-eyebrow">[ THE INTERFACE ]</p>
          <h2>The Platform <em>Experience.</em></h2>
        </div>
        
        <div className="partner-dashboards-grid">
          <div className="partner-card rv" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '36px 36px 0' }}>
              <span className="mono partner-badge" style={{ marginBottom: '10px' }}>Tech Partner Dashboard</span>
              <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>Manage Products & Payouts</h3>
            </div>
            <div style={{ margin: '20px 32px 32px', border: '1px solid var(--line)', borderRadius: '16px', background: 'rgba(5,8,15,0.85)', padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                 <span style={{ fontSize: '14px', opacity: 0.7 }}>Active Subscriptions</span>
                 <span style={{ fontSize: '24px', fontWeight: 500 }}>342</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                 <span style={{ fontSize: '14px', opacity: 0.7 }}>Monthly MRR</span>
                 <span style={{ fontSize: '16px', color: 'var(--sky)', fontWeight: 600 }}>₹1,24,500</span>
               </div>
               <div style={{ marginTop: '16px', height: '4px', background: 'var(--line)', borderRadius: '2px', overflow: 'hidden' }}>
                 <div style={{ width: '70%', height: '100%', background: 'var(--sky)' }}></div>
               </div>
            </div>
          </div>
          
          <div className="partner-card rv" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '36px 36px 0' }}>
              <span className="mono partner-badge" style={{ marginBottom: '10px' }}>Sales Partner Dashboard</span>
              <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>Track Active Customers</h3>
            </div>
            <div style={{ margin: '20px 32px 32px', border: '1px solid var(--line)', borderRadius: '16px', background: 'rgba(5,8,15,0.85)', padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                 <span style={{ fontSize: '14px', opacity: 0.7 }}>Your Clients</span>
                 <span style={{ fontSize: '24px', fontWeight: 500 }}>28</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                 <span style={{ fontSize: '14px', opacity: 0.7 }}>Recurring Share</span>
                 <span style={{ fontSize: '16px', color: 'var(--sky)', fontWeight: 600 }}>₹32,000/mo</span>
               </div>
               <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                 <div style={{ flex: 1, height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                 <div style={{ flex: 2, height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
               </div>
            </div>
          </div>
        </div>
          


        <div className="rv" style={{ border: '1px solid var(--line)', borderRadius: '24px', padding: '48px', background: 'rgba(255,255,255,0.01)' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Example: Subscription Split</h3>
          <p style={{ fontSize: '15px', opacity: 0.8, marginBottom: '32px', maxWidth: '60ch' }}>
            A transparent example of how revenue is distributed when a Growth Partner successfully brings a customer to a Product Creator's software.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <span className="mono" style={{ fontSize: '12px', opacity: 0.6, display: 'block', marginBottom: '16px' }}>Customer Pays</span>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>₹10,000<span style={{ fontSize: '16px', opacity: 0.5 }}>/mo</span></div>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>For a standard SaaS product subscription.</p>
            </div>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <span className="mono" style={{ fontSize: '12px', color: 'var(--sky)', display: 'block', marginBottom: '16px' }}>Creator Keeps</span>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>₹7,000<span style={{ fontSize: '16px', opacity: 0.5 }}>/mo</span></div>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>For building, hosting, and supporting the product.</p>
            </div>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <span className="mono" style={{ fontSize: '12px', color: 'var(--sky)', display: 'block', marginBottom: '16px' }}>Partner Earns</span>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>₹3,000<span style={{ fontSize: '16px', opacity: 0.5 }}>/mo</span></div>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>Recurring revenue share for the life of the customer.</p>
            </div>
          </div>
          <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '24px' }}>* Split percentages are defined by the Product Creator and clearly visible before a Growth Partner begins selling.</p>
        </div>
      </div>
    </section>
  );
}

export function PartnerCTA() {
  return (
    <section className="final" id="interest">
      <div className="wrap rv">
        <h2 style={{ margin: '24px 0 24px', fontSize: 'clamp(40px, 6vw, 80px)' }}>Be Part of What Comes <em>Next.</em></h2>
        <p style={{ fontSize: '20px', maxWidth: '60ch', opacity: 0.8, margin: '0 auto 40px' }}>
          The future of software depends on how well we connect it with people. If this vision aligns with your ambitions, express your interest.
        </p>
        <div className="cta" style={{ justifyContent: 'center', gap: '14px' }}>
          <Link className="btn p partners-btn" to="/partner-apply">Express Your Interest</Link>
          <Link className="btn partners-btn partners-btn-secondary" to="/products">Explore Solutions</Link>
        </div>
      </div>
    </section>
  );
}

export function PartnersPage() {
  return (
    <>
      <PageSEO
        title="Partner Ecosystem"
        description="Join our ecosystem of software creators and growth partners. Expand your distribution and build recurring revenue."
        url="/partners"
      />
      <PartnersHero />
      <Pathways />
      <HowItWorks />
      <PartnerBenefits />
      <Principles />
      <PartnerDashboards />
      <PartnerFAQ />
      <PartnerCTA />
    </>
  );
}

export default PartnersPage;
