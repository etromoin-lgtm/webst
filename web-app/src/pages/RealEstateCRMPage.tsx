import { Link } from 'react-router-dom';
import {
  Layers,
  Activity,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Building,
  TrendingUp
} from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';

export function ProductsHero() {
  return (
    <header className="hero" id="top">
      <div className="orb" style={{ background: 'radial-gradient(circle, var(--electric), transparent 65%)' }}></div>
      <div className="flute"></div>
      <div className="horizon"></div>
      <div className="wrap">
        <h1 style={{ fontSize: 'clamp(48px, 8vw, 90px)' }}>Real Estate <em>CRM.</em></h1>
        <p className="sub" style={{ marginTop: '24px' }}>
          The complete operating system for real estate developers and channel partners. Stop losing leads in spreadsheets and start closing deals with an automated, intelligent pipeline.
        </p>
        <div className="cta" style={{ marginTop: '40px' }}>
          <Link className="btn p" to="/contact">Request a Demo</Link>
        </div>
      </div>
    </header>
  );
}

export function ProductBeforeAfter() {
  return (
    <section>
      <div className="wrap">
        <div className="head rv" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2>The Problem & <em>The Solution.</em></h2>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Before */}
          <div className="card rv" style={{ background: 'rgba(255, 50, 50, 0.05)', borderColor: 'rgba(255, 50, 50, 0.1)' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '24px', color: '#ff6b6b' }}>Before (The Chaos)</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#ff6b6b' }}>✕</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>Leads from Meta & Google scattered across multiple Excel sheets.</p>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#ff6b6b' }}>✕</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>Missed follow-ups and delayed responses costing expensive conversions.</p>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#ff6b6b' }}>✕</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>No clear tracking of site visits or client requirements.</p>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#ff6b6b' }}>✕</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>Disconnected team communication and lack of accountability.</p>
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="card rv" style={{ background: 'rgba(50, 255, 150, 0.05)', borderColor: 'rgba(50, 255, 150, 0.1)' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '24px', color: '#4ade80' }}>After (Our CRM)</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>Unified pipeline with instant lead syncing from Meta, 99acres, and Zapier.</p>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>Automated CRM follow-ups, notifications, and scheduled site visits.</p>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>Share property details, brochures, and inventory directly through the CRM.</p>
              </li>
              <li style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: '#4ade80' }}>✓</span>
                <p style={{ fontSize: '15px', opacity: 0.8 }}>Admin & Employee portals with strict role-based access control.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseProduct() {
  return (
    <section style={{ overflow: 'hidden' }}>
      <div className="wrap">
        <div className="rv" style={{ textAlign: 'left', maxWidth: '80ch', marginBottom: '64px' }}>
          <h2>Why choose <em>Our CRM?</em></h2>
          <p style={{ marginTop: '16px', fontSize: '18px', opacity: 0.9 }}>
            Generic CRMs are built for everyone, which means they work perfectly for no one. We built a platform exclusively around the real estate sales lifecycle.
          </p>
          <p style={{ marginTop: '16px', opacity: 0.8, lineHeight: 1.6 }}>
            Instead of spending months customizing complex software, you get a ready-to-deploy system that understands brokers, site visits, and property pipelines from day one. It seamlessly ties into your existing marketing channels and protects your database through intelligent role-based access.
          </p>
          
          <div style={{ marginTop: '40px', display: 'flex', gap: '24px', overflow: 'hidden', position: 'relative', width: '100%', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)' }}>
            <div style={{ display: 'flex', gap: '48px', animation: 'scroll 10s linear infinite', whiteSpace: 'nowrap' }}>
              <Layers size={32} color="var(--sky)" opacity={0.4} />
              <Activity size={32} color="var(--sky)" opacity={0.4} />
              <Cpu size={32} color="var(--sky)" opacity={0.4} />
              <ShieldCheck size={32} color="var(--sky)" opacity={0.4} />
              <CheckCircle2 size={32} color="var(--sky)" opacity={0.4} />
              <Building size={32} color="var(--sky)" opacity={0.4} />
              <TrendingUp size={32} color="var(--sky)" opacity={0.4} />
              {/* Duplicate for infinite effect */}
              <Layers size={32} color="var(--sky)" opacity={0.4} />
              <Activity size={32} color="var(--sky)" opacity={0.4} />
              <Cpu size={32} color="var(--sky)" opacity={0.4} />
              <ShieldCheck size={32} color="var(--sky)" opacity={0.4} />
            </div>
            <style>
              {`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}
            </style>
          </div>
        </div>
        
        <div className="rv">
          <div className="grid" style={{ gap: '24px' }}>
            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: '300', color: 'var(--sky)', lineHeight: 1 }}>5</div>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Organizations</h3>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>currently using our software to power their sales.</p>
              </div>
            </div>
            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: '300', color: 'var(--sky)', lineHeight: 1 }}>40<span style={{ fontSize: '24px' }}>%</span></div>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Time Reduced</h3>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>in lead assignment and manual follow-up workflows.</p>
              </div>
            </div>
            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: '300', color: 'var(--sky)', lineHeight: 1 }}>35<span style={{ fontSize: '24px' }}>+</span></div>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Active Employees</h3>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>relying on the platform daily for their operations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RealEstateCRMPage() {
  return (
    <>
      <PageSEO
        title="Real Estate CRM Pro"
        description="The complete operating system for real estate developers and channel partners. Automated lead pipelines and follow-ups."
        url="/products/real-estate-crm"
      />
      <ProductsHero />
      <ProductBeforeAfter />
      <WhyChooseProduct />
    </>
  );
}

export default RealEstateCRMPage;
