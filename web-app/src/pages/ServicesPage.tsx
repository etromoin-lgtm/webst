import { Link } from 'react-router-dom';
import { Cpu, Layers, Activity, TrendingUp, Building } from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import './ServicesPage.css';

export function ServicesHero() {
  return (
    <header className="services-hero" id="top">
      <div className="services-hero-orb" aria-hidden="true" />
      <div className="services-hero-flute" aria-hidden="true" />
      <div className="wrap services-hero-wrap">
        <p className="mono services-eyebrow">Capabilities & Systems Architecture</p>
        <h1 id="services-title">Engineering. Automation. <em>Growth.</em></h1>
        <p className="services-hero-copy">
          We don't just build software. We design and deploy end-to-end operational systems. From custom enterprise applications to AI-driven workflow automation, we engineer solutions that scale.
        </p>
        <div className="services-hero-actions">
          <a className="btn p services-btn" href="#engineering">Explore Services</a>
          <Link className="btn services-btn services-btn-secondary" to="/contact">Discuss a Project</Link>
        </div>
      </div>
    </header>
  );
}

export function ServiceEngineering() {
  return (
    <section id="engineering" className="service-capability-section">
      <div className="wrap service-capability-layout">
        <div className="rv service-capability-intro">
          <p className="mono" style={{ color: 'var(--sky)' }}>01 · Architecture</p>
          <h2>Custom Software <em>Engineering.</em></h2>
          <p>Bespoke software development tailored to your exact operational needs. We build robust, scalable, and secure applications.</p>
        </div>
        <div className="rv">
          <div className="service-cards-stack">
            <div className="service-sharp-card">
              <span className="service-sharp-icon">
                <Cpu size={22} />
              </span>
              <h3>Full-Stack Web Apps</h3>
              <p>End-to-end development of custom SaaS products and internal portals built for high performance and durability.</p>
            </div>
            <div className="service-sharp-card">
              <span className="service-sharp-icon">
                <Layers size={22} />
              </span>
              <h3>API & Systems Integration</h3>
              <p>Seamlessly connecting your fragmented software ecosystem into a unified, secure data flow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceAutomation() {
  return (
    <section className="service-capability-section">
      <div className="wrap service-capability-layout">
        <div className="rv service-capability-intro">
          <p className="mono" style={{ color: 'var(--sky)' }}>02 · Intelligence</p>
          <h2>AI & Workflow <em>Automation.</em></h2>
          <p>Eliminate manual data entry and human error. We integrate artificial intelligence into your daily operations to accelerate output.</p>
        </div>
        <div className="rv">
          <div className="service-cards-stack">
            <div className="service-sharp-card">
              <span className="service-sharp-icon">
                <Activity size={22} />
              </span>
              <h3>Process Automation</h3>
              <p>Automating repetitive tasks across sales, marketing, and customer support with deterministic workflows.</p>
            </div>
            <div className="service-sharp-card">
              <span className="service-sharp-icon">
                <Cpu size={22} />
              </span>
              <h3>AI Agent Deployment</h3>
              <p>Deploying specialized LLM-based agents to handle inquiries, analyze complex datasets, and assist your internal teams.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceGrowth() {
  return (
    <section className="service-capability-section">
      <div className="wrap service-capability-layout">
        <div className="rv service-capability-intro">
          <p className="mono" style={{ color: 'var(--sky)' }}>03 · Distribution</p>
          <h2>Digital <em>Growth.</em></h2>
          <p>Marketing that drives measurable operational results. We build funnels that feed directly into your CRMs and sales pipelines.</p>
        </div>
        <div className="rv">
          <div className="service-cards-stack">
            <div className="service-sharp-card">
              <span className="service-sharp-icon">
                <TrendingUp size={22} />
              </span>
              <h3>Performance Campaigns</h3>
              <p>Data-driven acquisition campaigns designed to generate high-intent leads and measurable ROI.</p>
            </div>
            <div className="service-sharp-card">
              <span className="service-sharp-icon">
                <Building size={22} />
              </span>
              <h3>B2B Lead Generation</h3>
              <p>Strategic multi-channel outreach and automated lead qualification pipelines configured to scale.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesTechStack() {
  const tools = [
    { name: 'Meta', icon: 'meta' },
    { name: 'WhatsApp', icon: 'whatsapp' },
    { name: 'LinkedIn', icon: 'linkedin' },
    { name: 'Google Ads', icon: 'googleads' },
    { name: 'HubSpot', icon: 'hubspot' },
    { name: 'Salesforce', icon: 'salesforce' },
    { name: 'OpenAI', icon: 'openai' },
    { name: 'Anthropic', icon: 'anthropic' },
    { name: 'n8n', icon: 'n8n' },
    { name: 'Make', icon: 'make' },
    { name: 'Zapier', icon: 'zapier' }
  ];

  return (
    <section className="service-capability-section" style={{ textAlign: 'center' }}>
      <div className="wrap rv">
        <div className="head" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="mono" style={{ color: 'var(--sky)', marginBottom: '12px' }}>Enterprise Integrations</p>
          <h2>Powered by the <em>best tools.</em></h2>
        </div>
        <div className="service-tools-grid">
          {tools.map(t => (
            <div key={t.name} className="service-tool-card">
              <img src={`https://cdn.simpleicons.org/${t.icon}/F4F6F9`} alt={t.name} style={{ width: '36px', height: '36px', marginBottom: '14px', opacity: 0.9 }} />
              <span className="mono" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesCTA() {
  return (
    <section className="final">
      <div className="wrap rv" style={{ textAlign: 'center' }}>
        <h2 style={{ margin: '24px auto 36px', fontSize: 'clamp(44px, 7vw, 96px)', maxWidth: '18ch' }}>
          Ready to transform your <em>operations?</em>
        </h2>
        <div className="cta" style={{ justifyContent: 'center' }}>
          <Link className="btn p services-btn" to="/contact">Start a Conversation</Link>
        </div>
      </div>
    </section>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageSEO
        title="Services & Custom Engineering"
        description="Bespoke software engineering, AI automation, and digital growth services designed to scale modern businesses."
        url="/services"
      />
      <ServicesHero />
      <ServiceEngineering />
      <ServiceAutomation />
      <ServiceGrowth />
      <ServicesTechStack />
      <ServicesCTA />
    </>
  );
}

export default ServicesPage;
