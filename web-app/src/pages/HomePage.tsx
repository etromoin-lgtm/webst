import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Briefcase,
  ChevronRight,
  Clock,
  Cpu,
  Layers,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import TrustedByMarquee from '../components/home/TrustedByMarquee';
import FeaturedCaseStudiesSection from '../components/home/FeaturedCaseStudiesSection';
import './HomePage.css';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Etromo',
  url: 'https://www.etromo.com',
  logo: 'https://www.etromo.com/logo.png',
  sameAs: [
    'https://linkedin.com/company/etromo',
    'https://twitter.com/etromo',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-000-000-0000',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Etromo',
  url: 'https://www.etromo.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.etromo.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const servicesSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Industry SaaS Products',
    description: 'Ready-to-use software products designed for specific industries, starting with our flagship Real Estate CRM.',
    provider: { '@type': 'Organization', name: 'Etromo', url: 'https://www.etromo.com' },
    serviceType: 'SaaS',
    areaServed: 'Worldwide',
    url: 'https://www.etromo.com/products',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Custom Software Engineering',
    description: 'Bespoke software development, systems integration, and workflow automation tailored to exact operational needs.',
    provider: { '@type': 'Organization', name: 'Etromo', url: 'https://www.etromo.com' },
    serviceType: 'Custom Software Development',
    areaServed: 'Worldwide',
    url: 'https://www.etromo.com/services',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Digital Growth Services',
    description: 'Structured digital marketing and performance campaigns that capture leads and feed them directly into business systems.',
    provider: { '@type': 'Organization', name: 'Etromo', url: 'https://www.etromo.com' },
    serviceType: 'Digital Marketing',
    areaServed: 'Worldwide',
    url: 'https://www.etromo.com/services',
  },
];

const questions = [
  {
    q: 'Do you build from scratch or customise existing platforms?',
    a: 'Both. We recommend whichever is faster and more cost-effective for you: an existing industry product, a customised platform, or a fully custom build.',
  },
  {
    q: 'Who owns the code and data in a custom project?',
    a: 'You own your data. Code ownership and licensing terms are agreed in writing before work starts, so there is no ambiguity later.',
  },
  {
    q: 'How long does a custom build take?',
    a: 'Most projects deliver a first working version in weeks, not quarters. We confirm an exact timeline with milestones at the end of the Design step.',
  },
  {
    q: 'How do you handle security and data privacy?',
    a: 'We apply role-based access, encrypted data and regular backups as standard, and we are happy to sign an NDA before discovery begins.',
  },
  {
    q: 'Can we start small and expand later?',
    a: 'Yes. Many clients begin with one workflow or a ready-made product and add automation, integrations and marketing as results come in.',
  },
  {
    q: 'Do you work with businesses in my industry?',
    a: "If your business depends on leads, orders, bookings, customers or repeatable processes, yes. We learn your industry's workflow in the Discover step.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const allJsonLd = [organizationSchema, websiteSchema, ...servicesSchema, faqSchema];

const challenges = [
  {
    icon: <Layers size={22} aria-hidden="true" />,
    title: 'Work lives in too many places',
    description: 'Enquiries, orders and requests arrive through WhatsApp, email, calls, forms and spreadsheets. Nobody has one complete view.',
  },
  {
    icon: <Clock size={22} aria-hidden="true" />,
    title: 'Follow-up depends on memory',
    description: 'When hand-offs are manual, customers wait hours or days for a reply—and the competitor who answers first wins.',
  },
  {
    icon: <Activity size={22} aria-hidden="true" />,
    title: 'Reports are guesswork',
    description: 'Customer history, stages and performance sit in disconnected tools, so decisions are made on instinct instead of data.',
  },
  {
    icon: <Zap size={22} aria-hidden="true" />,
    title: 'Skilled people doing admin',
    description: 'Copying data, chasing updates and reconciling reports can quietly consume a third of your team’s week.',
  },
];

const offerings = [
  {
    icon: <Briefcase size={24} aria-hidden="true" />,
    title: 'Industry SaaS',
    description: 'Ready-to-use software built for specific industries, so you get a proven workflow from day one instead of starting from a blank page.',
    detail: 'Our first product, a CRM for real estate, is live. More industry products are on the way.',
    bestFor: 'Teams that want to be running in days, not months.',
    link: '/products',
    linkText: 'Explore products',
  },
  {
    icon: <Cpu size={24} aria-hidden="true" />,
    title: 'Custom Engineering',
    description: 'Custom software, system integrations and AI workflow automation shaped around how your business actually works.',
    detail: 'Clean, typed, tested and documented code, so your system stays maintainable as you grow.',
    bestFor: 'Unique processes that off-the-shelf tools can’t handle.',
    link: '/services',
    linkText: 'Explore custom builds',
  },
  {
    icon: <TrendingUp size={24} aria-hidden="true" />,
    title: 'Digital Growth',
    description: 'Performance campaigns, SEO and funnel design that send qualified enquiries straight into your system, with no spreadsheet in between.',
    detail: 'Every lead is tracked from first click to closed deal.',
    bestFor: 'Businesses that want growth they can measure.',
    link: '/services',
    linkText: 'Explore growth services',
  },
];

const industries = [
  { name: 'Retail & eCommerce', description: 'Orders, stock and customer follow-up in one view.' },
  { name: 'Healthcare & Wellness', description: 'Appointments, reminders and patient follow-ups without phone tag.' },
  { name: 'Education & Training', description: 'Enquiries, admissions and fee reminders handled automatically.' },
  { name: 'Logistics & Supply Chain', description: 'Dispatch updates and status reports without chasing people.' },
  { name: 'Finance & Insurance', description: 'Lead intake, document collection and renewals on schedule.' },
  { name: 'Real Estate', description: 'Leads, site visits and bookings in a single pipeline.' },
  { name: 'Hospitality & Travel', description: 'Bookings, guest enquiries and repeat-customer follow-ups.' },
  { name: 'Professional Services', description: 'Proposals, onboarding, billing and client reporting connected.' },
];

const reasons = [
  {
    title: 'We start with your process',
    description: 'We map your real workflow and bottlenecks first. No assumptions, no forced templates.',
  },
  {
    title: 'We measure outcomes',
    description: 'We record your baseline before we build, then track follow-up speed, lead quality and hours saved after launch.',
  },
  {
    title: 'You see progress every two weeks',
    description: 'You test working features regularly, so there are no surprises at the end.',
  },
  {
    title: 'Built to last',
    description: 'Typed, tested, documented code and a clear handover, so you are never locked in or left guessing.',
  },
  {
    title: 'One team, one connected system',
    description: 'Software, automation and marketing planned together, so your tools and your lead flow actually work as one.',
  },
  {
    title: 'Honest advice',
    description: 'If an existing tool solves your problem, we will tell you. We only build what moves your numbers.',
  },
];

const processSteps = [
  {
    title: 'Discover',
    description: 'We study your workflow, tools, team and bottlenecks, and record your current numbers.',
    deliverable: 'Workflow map, prioritised problem list and baseline metrics.',
  },
  {
    title: 'Design',
    description: 'We architect the solution: data model, integrations, automation rules and user flows.',
    deliverable: 'Written blueprint, scope, milestones and timeline.',
  },
  {
    title: 'Build',
    description: 'We deliver in small working slices. Every two weeks you test real workflows and give feedback.',
    deliverable: 'A working demo at every milestone.',
  },
  {
    title: 'Launch',
    description: 'We migrate your data, train your team and go live with support on hand.',
    deliverable: 'A live system, a trained team and full documentation.',
  },
  {
    title: 'Improve',
    description: 'We measure results against your baseline and refine what the numbers show.',
    deliverable: 'A regular performance report and improvement roadmap.',
  },
];

function RunningNumber({
  target,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    const duration = 1600; // 1.6s smooth easing animation

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutExpo for crisp, high-end feel
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(ease * target);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [hasStarted, target]);

  return (
    <span ref={ref} className="running-counter">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const outcomes = [
  {
    target: 80,
    suffix: '%',
    decimals: 0,
    label: 'Faster turnaround time',
    detail: 'Dramatic reduction in internal cycle times and operational response speed across systems.',
  },
  {
    target: 35,
    suffix: '%+',
    decimals: 0,
    label: 'Less manual overhead',
    detail: 'Hours of repetitive paperwork, manual follow-ups, and data entry saved every week.',
  },
  {
    target: 2,
    suffix: '×',
    decimals: 0,
    label: 'Increase in efficiency',
    detail: 'Teams handle twice the operational throughput with zero additional operational headcount.',
  },
];

export function HomeHero() {
  return (
    <header className="hero" id="top" aria-labelledby="hero-title">
      <div className="orb" aria-hidden="true" />
      <div className="flute" aria-hidden="true" />
      <div className="horizon" aria-hidden="true" />
      <svg className="fig" viewBox="0 0 34 96" aria-hidden="true">
        <circle cx="17" cy="9" r="7" fill="#05080F" />
        <path d="M8 20h18l3 40h-4l-1 36h-6V64h-2v32H8L7 60H3z" fill="#05080F" />
      </svg>
      <div className="wrap hero-content">
        <p className="mono hero-eyebrow">Software · Automation · Digital Growth</p>
        <h1 id="hero-title">
          We build the systems that help your business run faster, leaner and <em>smarter.</em>
        </h1>
        <p className="hero-description">
          We design and build business software, workflow automation and growth systems—so enquiries get answered sooner, your team stops repeating manual work, and you can see what is driving results.
        </p>
        <div className="cta hero-cta">
          <Link className="btn p" to="/contact">
            Book a 30-minute discovery call <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function ProblemStatement() {
  return (
    <section className="home-section problem-section" id="problem" aria-labelledby="problem-title">
      <div className="wrap">
        <div className="section-heading rv">
          <p className="mono">The problem</p>
          <h2 id="problem-title">Most growing businesses don’t have a people problem. They have a <em>systems</em> problem.</h2>
          <p>Whatever your industry, the pattern is the same: good people, busy days, and work that slips between tools.</p>
        </div>
        <div className="challenge-grid">
          {challenges.map((challenge, index) => (
            <article className="challenge-item rv" key={challenge.title} style={{ transitionDelay: `${index * 70}ms` }}>
              <span className="challenge-icon">{challenge.icon}</span>
              <div>
                <span className="mono challenge-number">0{index + 1}</span>
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Capabilities() {
  return (
    <section className="home-section services-section" id="services" aria-labelledby="services-title">
      <div className="orb services-orb" aria-hidden="true" />
      <div className="wrap">
        <div className="section-heading rv">
          <p className="mono">What we do</p>
          <h2 id="services-title">Three ways we help your business <em>grow.</em></h2>
          <p>We focus on three things and do them properly. Use one, or combine them into a single connected system.</p>
        </div>
        <div className="offering-grid">
          {offerings.map((offering, index) => (
            <article className="offering-card card rv" key={offering.title} style={{ transitionDelay: `${index * 80}ms` }}>
              <div className="offering-topline">
                <span className="mono">0{index + 1} / 03</span>
                <span className="offering-icon">{offering.icon}</span>
              </div>
              <h3>{offering.title}</h3>
              <p className="offering-description">{offering.description}</p>
              <p className="offering-detail">{offering.detail}</p>
              <p className="offering-fit"><span className="mono">Best for</span>{offering.bestFor}</p>
              <Link to={offering.link} className="cap-link">
                {offering.linkText}<ChevronRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section className="home-section industries-section" id="industries" aria-labelledby="industries-title">
      <div className="wrap">
        <div className="section-heading rv">
          <p className="mono">Industries</p>
          <h2 id="industries-title">Different industries. One <em>bottleneck.</em></h2>
          <p>We start from your process, not a template. Here is where connected systems make the biggest difference.</p>
        </div>
        <div className="industry-grid">
          {industries.map((industry, index) => (
            <article className="industry-item rv" key={industry.name} style={{ transitionDelay: `${index * 45}ms` }}>
              <span className="mono">0{index + 1}</span>
              <div>
                <h3>{industry.name}</h3>
                <p>{industry.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="industry-note rv">
          Manufacturing, B2B, nonprofit or something else? If your business runs on repeatable processes, we can help.
        </p>
      </div>
    </section>
  );
}

export function WhyEtromo() {
  return (
    <section className="home-section why-section" id="why" aria-labelledby="why-title">
      <div className="orb why-orb" aria-hidden="true" />
      <div className="wrap">
        <div className="section-heading rv">
          <p className="mono">Why choose ETROMO</p>
          <h2 id="why-title">A partner who cares about your <em>outcomes.</em></h2>
          <p>Software only matters if it changes how your business performs. This is how we make sure it does.</p>
        </div>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <article className="reason-item rv" key={reason.title} style={{ transitionDelay: `${index * 55}ms` }}>
              <span className="mono">0{index + 1}</span>
              <div>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowWeWork() {
  return (
    <section className="home-section process-section" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section-heading rv">
          <p className="mono">How we work</p>
          <h2 id="process-title">A clear process, from first call to measurable <em>results.</em></h2>
          <p>You always know what stage we are at, what we are doing and what you will receive next.</p>
        </div>
        <ol className="process-grid">
          {processSteps.map((step, index) => (
            <li className="process-step rv" key={step.title} style={{ transitionDelay: `${index * 65}ms` }}>
              <span className="mono">STEP 0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <p className="process-deliverable"><span className="mono">You get</span>{step.deliverable}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Metrics() {
  return (
    <section className="home-section outcomes-section" id="outcomes" aria-labelledby="outcomes-title">
      <div className="wrap">
        <div className="section-heading rv" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
          <p className="mono">Outcomes</p>
          <h2 id="outcomes-title" style={{ margin: '0 auto' }}>What teams typically see after moving to one connected <em>system.</em></h2>
          <p style={{ margin: '20px auto 0' }}>These are the improvements we design every system to deliver. During discovery, we measure your starting point so you can track your own numbers.</p>
        </div>
        <div className="outcome-grid rv">
          {outcomes.map((outcome, index) => (
            <article className="outcome-item" key={outcome.label} style={{ transitionDelay: `${index * 80}ms` }}>
              <div className="outcome-value">
                <RunningNumber target={outcome.target} suffix={outcome.suffix} decimals={outcome.decimals} />
              </div>
              <h3>{outcome.label}</h3>
              <p>{outcome.detail}</p>
            </article>
          ))}
        </div>
        <p className="outcome-footnote mono rv" style={{ textAlign: 'center', margin: '36px auto 0', display: 'block' }}>
          Our source of truth for customer, deal and performance data.
        </p>
      </div>
    </section>
  );
}

export function PartnerEcosystem() {
  return (
    <section className="home-section partners-section" id="partners" aria-labelledby="partners-title">
      <div className="wrap">
        <div className="section-heading rv">
          <p className="mono">Partner with us</p>
          <h2 id="partners-title">Grow within the ETROMO <em>ecosystem.</em></h2>
        </div>
        <div className="partner-grid">
          <article className="partner-card card rv">
            <span className="partner-icon"><Users size={23} aria-hidden="true" /></span>
            <p className="mono">For SaaS founders & developers</p>
            <h3>Tech Partners</h3>
            <p>Reach a wider business audience through our listing and sales network.</p>
            <Link to="/partners" className="cap-link">Learn more<ChevronRight size={16} aria-hidden="true" /></Link>
          </article>
          <article className="partner-card card rv">
            <span className="partner-icon"><TrendingUp size={23} aria-hidden="true" /></span>
            <p className="mono">For consultants & agencies</p>
            <h3>Sales Partners</h3>
            <p>Represent our approved software catalogue and build long-term client relationships.</p>
            <Link to="/partners" className="cap-link">Learn more<ChevronRight size={16} aria-hidden="true" /></Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="home-section faq-section" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-wrap">
        <div className="section-heading rv">
          <p className="mono">Common questions</p>
          <h2 id="faq-title">Answers before you <em>ask.</em></h2>
        </div>
        <div className="faq-list rv">
          {questions.map(({ q, a }) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p className="faq-answer">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="home-section final" id="contact" aria-labelledby="cta-title">
      <div className="orb final-orb" aria-hidden="true" />
      <div className="wrap final-content rv" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <p className="mono" style={{ textAlign: 'center' }}>Start a conversation</p>
        <h2 id="cta-title" style={{ textAlign: 'center', margin: '0 auto' }}>Ready to see where your business is losing <em>time?</em></h2>
        <p style={{ textAlign: 'center', margin: '24px auto 32px' }}>Book a free 30-minute call. We will look at your workflow together and tell you honestly where a system can help.</p>
        <div className="cta" style={{ display: 'flex', justifyContent: 'center' }}>
          <Link className="btn p" to="/contact">
            Book a discovery call <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <PageSEO
        title="Intelligent Enterprise Software & Systems"
        description="ETROMO designs and builds business software, workflow automation and growth systems that help teams run faster, follow up sooner and measure results."
        url="/"
        image="/og-home.png"
        jsonLd={allJsonLd}
      />
      <div className="home-page">
        <HomeHero />
        <TrustedByMarquee />
        <ProblemStatement />
        <Capabilities />
        <FeaturedCaseStudiesSection />
        <IndustriesSection />
        <WhyEtromo />
        <HowWeWork />
        <Metrics />
        <PartnerEcosystem />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
}

export default HomePage;
