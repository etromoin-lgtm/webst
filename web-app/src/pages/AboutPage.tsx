import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Compass,
  Eye,
  Handshake,
  MessageCircle,
  Scale,
} from 'lucide-react';
import PageSEO from '../components/layout/PageSEO';
import './AboutPage.css';

const principles = [
  {
    icon: <Compass size={20} aria-hidden="true" />,
    number: '01',
    title: 'Start with the real problem',
    description: 'Before talking about features, we want to understand the work behind the request: what is slowing the team down, where information gets lost, and what a better day would look like.',
  },
  {
    icon: <Scale size={20} aria-hidden="true" />,
    number: '02',
    title: 'Choose what fits—not what is fashionable',
    description: 'An existing product, a focused integration or a custom build can each be the right answer. We will explain the trade-offs and recommend the simplest useful path.',
  },
  {
    icon: <Eye size={20} aria-hidden="true" />,
    number: '03',
    title: 'Keep the work visible',
    description: 'You should know what is in scope, what is being worked on, what decisions are open and what happens next. We make progress reviewable as we go.',
  },
  {
    icon: <Handshake size={20} aria-hidden="true" />,
    number: '04',
    title: 'Leave you with clarity',
    description: 'A delivery should come with the context to use and maintain it: clear handover, useful documentation and an honest view of what is finished and what is not.',
  },
];

const steps = [
  {
    number: '01',
    name: 'Listen',
    description: 'Understand your workflow, current tools, constraints and the outcome that matters to your team.',
    result: 'A shared picture of the problem.',
  },
  {
    number: '02',
    name: 'Map',
    description: 'Identify where a product, a connection between systems or a tailored solution can make a difference.',
    result: 'Options, trade-offs and a proposed scope.',
  },
  {
    number: '03',
    name: 'Make',
    description: 'Build in reviewable stages, with regular opportunities to test the work against real use.',
    result: 'Working progress and clear next steps.',
  },
  {
    number: '04',
    name: 'Learn',
    description: 'Review what changed, compare it with the agreed goals and decide together what deserves attention next.',
    result: 'A considered handover and way forward.',
  },
];

const offerings = [
  {
    index: '01',
    title: 'Use a product',
    description: 'Industry-focused software for teams who want a more ready-to-use starting point.',
    link: '/products',
    linkLabel: 'Explore products',
  },
  {
    index: '02',
    title: 'Build or connect',
    description: 'Custom engineering, integrations and automation for workflows that need a closer fit.',
    link: '/services',
    linkLabel: 'Explore services',
  },
  {
    index: '03',
    title: 'Grow together',
    description: 'A partner ecosystem for product creators and people helping businesses find the right tools.',
    link: '/partners',
    linkLabel: 'Explore partnerships',
  },
];

const commitments = [
  'We will tell you when a simpler existing tool may be enough.',
  'We will agree on scope, responsibilities and assumptions before work begins.',
  'We will distinguish intended outcomes from results that have actually been measured.',
  'We will make room for your questions, feedback and changing understanding.',
];

export function AboutPage() {
  return (
    <>
      <PageSEO
        title="About ETROMO | Technology That Fits Your Business"
        description="Learn how ETROMO approaches business software, automation and growth—with practical recommendations, clear scope and visible progress."
        url="/about"
      />
      <div className="about-page">
        <header className="about-hero" aria-labelledby="about-title">
          <div className="about-hero-orb" aria-hidden="true" />
          <div className="about-hero-flute" aria-hidden="true" />
          <div className="wrap about-hero-wrap">
            <p className="mono about-eyebrow">A little about ETROMO</p>
            <h1 id="about-title">Technology should make work feel more <em>human.</em></h1>
            <p className="about-hero-copy">
              We help businesses bring software, everyday workflows and growth efforts into better alignment—so people can spend less energy joining the dots and more on the work that matters.
            </p>
            <div className="about-hero-actions">
              <Link className="btn p" to="/contact">
                Tell us what you’re working through <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a className="btn about-secondary-btn" href="#our-belief">
                Get to know us <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </header>

        <div className="about-content">
          <section className="about-belief-section" id="our-belief" aria-labelledby="belief-title">
            <div className="wrap about-belief-layout">
              <div className="about-section-marker rv">
                <span className="mono">The belief</span>
                <span className="about-marker-line" aria-hidden="true" />
              </div>
              <div className="about-belief-copy rv">
                <h2 id="belief-title">
                  Good people shouldn’t have to work around <em>broken systems.</em>
                </h2>
                <p>
                  As a business grows, the small gaps between tools become part of the job. Someone copies a detail twice. An enquiry waits for a reply. A useful update gets buried in a chat.
                </p>
                <p>
                  We believe technology should ease that friction, not add a new layer of it. That means starting with how your business works today, being thoughtful about what needs to change, and making the next step understandable before anyone commits.
                </p>
                <p className="about-belief-signoff">
                  Less noise around the work. More room for people to do it well.
                </p>
              </div>
            </div>
          </section>

          <section className="about-principles-section" aria-labelledby="principles-title">
            <div className="wrap">
              <div className="about-section-heading rv">
                <p className="mono">How we try to earn trust</p>
                <h2 id="principles-title">A good partnership is built in the <em>details.</em></h2>
                <p>Trust is not a line on a page. It is what the working relationship feels like, from the first conversation to the handover.</p>
              </div>
              <div className="about-principles-grid">
                {principles.map((principle) => (
                  <article className="about-principle rv" key={principle.number}>
                    <div className="about-principle-top">
                      <span className="mono">{principle.number}</span>
                      <span className="about-principle-icon">{principle.icon}</span>
                    </div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="about-process-section" aria-labelledby="about-process-title">
            <div className="about-process-glow" aria-hidden="true" />
            <div className="wrap">
              <div className="about-section-heading rv">
                <p className="mono">What working together looks like</p>
                <h2 id="about-process-title">A clear path, with you in the <em>conversation.</em></h2>
                <p>No black box. We make the work understandable, invite feedback as it takes shape, and agree the next move together.</p>
              </div>
              <ol className="about-steps">
                {steps.map((step) => (
                  <li className="about-step rv" key={step.number}>
                    <span className="mono">STEP {step.number}</span>
                    <h3>{step.name}</h3>
                    <p>{step.description}</p>
                    <p className="about-step-result"><Check size={15} aria-hidden="true" />{step.result}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="about-choice-section" aria-labelledby="choice-title">
            <div className="wrap about-choice-layout">
              <div className="about-choice-intro rv">
                <p className="mono">A practical point of view</p>
                <h2 id="choice-title">The right answer might not be <em>more software.</em></h2>
                <p>
                  Sometimes the best next step is to improve a process or make better use of a tool you already have. Sometimes a purpose-built product or custom system is worth it. We want to understand the difference with you.
                </p>
              </div>
              <div className="about-choice-note card rv">
                <MessageCircle size={20} aria-hidden="true" />
                <p className="mono">A conversation, not a commitment</p>
                <p>
                  Bring us the messy version: the spreadsheets, the hand-offs, the parts that don’t quite work. We’ll listen first, ask questions, and be candid about whether and how we can help.
                </p>
                <Link className="about-inline-link" to="/contact">Start a conversation<ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
          </section>

          <section className="about-work-section" aria-labelledby="about-work-title">
            <div className="wrap">
              <div className="about-section-heading rv">
                <p className="mono">One practical partner, a few ways to begin</p>
                <h2 id="about-work-title">Meet your business where it <em>is.</em></h2>
              </div>
              <div className="about-offerings">
                {offerings.map((offering) => (
                  <article className="about-offering rv" key={offering.index}>
                    <span className="mono">{offering.index} / 03</span>
                    <h3>{offering.title}</h3>
                    <p>{offering.description}</p>
                    <Link className="about-inline-link" to={offering.link}>
                      {offering.linkLabel}<ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="about-commitments-section" aria-labelledby="commitments-title">
            <div className="wrap about-commitments-layout">
              <div className="about-section-heading rv">
                <p className="mono">Our side of the table</p>
                <h2 id="commitments-title">The kind of partner we want to <em>be.</em></h2>
              </div>
              <ul className="about-commitments rv">
                {commitments.map((commitment) => (
                  <li key={commitment}><Check size={17} aria-hidden="true" />{commitment}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="about-cta-section" aria-labelledby="about-cta-title">
            <div className="about-cta-orb" aria-hidden="true" />
            <div className="wrap about-cta-content rv">
              <p className="mono">The next step can be simple</p>
              <h2 id="about-cta-title">Tell us what’s getting in the way. We’ll take it from <em>there.</em></h2>
              <p>No pitch deck needed. Just a conversation about your team, the work and what you would like to make easier.</p>
              <Link className="btn p" to="/contact">Let’s talk<ArrowRight size={17} aria-hidden="true" /></Link>
              <Link className="about-cta-secondary" to="/services">Or explore how we can help <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
