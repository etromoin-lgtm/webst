const db = require('./config/database');

const sampleCaseStudies = [
  {
    slug: 'propstream-lead-automation',
    title: 'Modernizing Lead Distribution & Follow-ups for PropStream Realty',
    subtitle: 'Centralized fragmented lead pipelines across Meta, Google Ads, and 9 property portals into an automated routing engine with sub-minute first-response times.',
    category: 'CRM & Business Automation',
    industry: 'Real Estate & PropTech',
    client_name: 'PropStream Realty Network',
    is_client_confidential: 0,
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    duration: '10 Weeks',
    services: JSON.stringify(['Workflow Architecture', 'Custom CRM Integration', 'Automated WhatsApp Dispatch', 'Real-Time BI Dashboard']),
    technologies: JSON.stringify(['React 19', 'Node.js', 'PostgreSQL', 'WhatsApp Cloud API', 'Redis', 'Docker']),
    business_type: 'Multi-Brokerage Enterprise',
    challenge_overview: 'PropStream operated with 45+ agents across 4 metropolitan regions. Leads generated from Google Ads, Meta Ads, and third-party property listings were manually copied from email alerts into disparate spreadsheets. Response latency exceeded 4.5 hours, and over 38% of inbound inquiries went completely unattended.',
    challenge_points: JSON.stringify([
      'Average response time was 4 hours and 35 minutes, causing severe drop-off in high-intent buyer inquiries.',
      '38% of inbound leads received no documented follow-up due to manual sheet distribution errors.',
      'Manual data entry consumed approximately 14 agent hours weekly per broker team.',
      'Executive leadership lacked real-time visibility into agent conversion bottlenecks and lead source ROI.'
    ]),
    goals_baseline: JSON.stringify([
      { metric: 'First-Response Time', initial_value: '275', unit: 'Minutes', period: 'Q3 2025 Baseline', target: '< 5 Minutes', source: 'Internal audit log' },
      { metric: 'Lead Follow-up Rate', initial_value: '62', unit: '%', period: 'Q3 2025 Baseline', target: '> 95%', source: 'Brokerage CRM report' },
      { metric: 'Weekly Manual Admin Time', initial_value: '14', unit: 'Hours/Agent', period: 'Q3 2025 Baseline', target: '< 3 Hours/Agent', source: 'Agent time-tracking survey' }
    ]),
    approach_phases: JSON.stringify([
      {
        phase_number: 1,
        title: 'Discovery & Pipeline Audit',
        duration: 'Weeks 1-2',
        description: 'Audited lead capture endpoints across all 9 marketing channels and mapped broker assignment logic.',
        deliverables: ['Integration Architecture Map', 'Data Normalization Specification']
      },
      {
        phase_number: 2,
        title: 'Automated Ingestion & Normalization Engine',
        duration: 'Weeks 3-5',
        description: 'Constructed asynchronous webhook listener and rules-based routing engine with zero data loss guarantee.',
        deliverables: ['Webhook Gateway', 'Round-robin Distribution Engine']
      },
      {
        phase_number: 3,
        title: 'Agent Mobile & WhatsApp Integration',
        duration: 'Weeks 6-8',
        description: 'Integrated WhatsApp Cloud API and mobile push notifications for one-tap lead qualification.',
        deliverables: ['WhatsApp Dispatch Workflow', 'Agent Mobile Quick-Response UI']
      },
      {
        phase_number: 4,
        title: 'Staging, Training & Production Rollout',
        duration: 'Weeks 9-10',
        description: 'Phased rollout across 4 regions with real-time telemetry and SLA alerting.',
        deliverables: ['Executive Telemetry Dashboard', 'Agent Training Certification']
      }
    ]),
    solution_overview: 'We engineered a resilient lead acceleration hub that ingests webhooks in sub-200ms, normalizes metadata across advertising networks, scores lead urgency, and delivers contacts directly to agents via WhatsApp and SMS with automated conversational sequences.',
    solution_features: JSON.stringify([
      {
        title: 'Sub-Second Ingestion Gateway',
        description: 'High-throughput webhook processor capable of digesting lead spikes without dropped packets or timeout errors.'
      },
      {
        title: 'Contextual WhatsApp & SMS Dispatches',
        description: 'Instant conversational greetings triggered within 45 seconds of lead submission, capturing buyers at peak intent.'
      },
      {
        title: 'Intelligent Round-Robin Allocation',
        description: 'Assigns leads dynamically based on agent past performance, regional specialty, and real-time availability.'
      },
      {
        title: 'Executive Operational Telemetry',
        description: 'Live SLA compliance tracking, response time benchmarking, and pipeline velocity visualizer.'
      }
    ]),
    solution_architecture_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    before_after_metrics: JSON.stringify([
      {
        id: 'metric-1',
        name: 'Average First-Response Time',
        type: 'duration',
        before: 275,
        after: 2.4,
        unit: 'Minutes',
        direction: 'lower_is_better',
        period: '90-Day Post-Launch Window',
        change_display: '-99.1% Reduction',
        evidence: 'Timestamped Twilio & Webhook Server Logs',
        verified: true,
        show_public: true,
        notes: 'Calculated across 14,280 inbound leads.'
      },
      {
        id: 'metric-2',
        name: 'Inbound Lead Follow-up Coverage',
        type: 'percentage',
        before: 62.0,
        after: 98.6,
        unit: '%',
        direction: 'higher_is_better',
        period: 'Q4 2025 Review',
        change_display: '+36.6 pt (+59.0% Rel.)',
        evidence: 'CRM Delivery & Interaction Records',
        verified: true,
        show_public: true,
        notes: 'Absolute change: +36.6 percentage points. Relative increase: +59.0%.'
      },
      {
        id: 'metric-3',
        name: 'Viewing Tour Conversion Rate',
        type: 'percentage',
        before: 4.2,
        after: 9.8,
        unit: '%',
        direction: 'higher_is_better',
        period: 'Quarterly Broker Audit',
        change_display: '+5.6 pt (+133.3% Rel.)',
        evidence: 'Signed Showing Agreements & Calendar Logs',
        verified: true,
        show_public: true,
        notes: 'Absolute change: +5.6 percentage points. Relative increase: +133.3%.'
      },
      {
        id: 'metric-4',
        name: 'Weekly Administrative Overhead',
        type: 'duration',
        before: 14.0,
        after: 2.1,
        unit: 'Hours/Agent',
        direction: 'lower_is_better',
        period: 'Monthly Operational Survey',
        change_display: '-85.0% Reduction',
        evidence: 'Agent Timesheet Audits',
        verified: true,
        show_public: true,
        notes: 'Reclaimed 11.9 productive hours per agent weekly.'
      }
    ]),
    key_results: JSON.stringify([
      { metric: '-99.1%', label: 'Response Time Drop', unit: 'Min', context: 'From 275 min down to 2.4 min instantaneous routing', verified: true },
      { metric: '+133%', label: 'Viewing Conversion Lift', unit: 'Lift', context: 'Tour bookings surged from 4.2% to 9.8%', verified: true },
      { metric: '+36.6 pt', label: 'Follow-up Coverage', unit: 'pts', context: '98.6% of all incoming inquiries successfully engaged', verified: true },
      { metric: '11.9 hrs', label: 'Weekly Time Reclaimed', unit: 'Hrs', context: 'Admin time saved per agent each week', verified: true }
    ]),
    methodology: 'Evaluated across 14,280 inbound leads over a 90-day assessment window comparing Q4 2025 to baseline Q3 2025. Data independently validated via database timestamp logs, WhatsApp webhook receipts, and broker calendar bookings.',
    lessons_learned: JSON.stringify([
      'Instant WhatsApp greetings generated 4.1x higher engagement than traditional email notifications.',
      'Enforcing strict 5-minute agent acceptance SLAs with automatic re-routing prevented orphaned leads.',
      'Normalizing property address strings at ingestion reduced duplicate leads by 23% across regional databases.'
    ]),
    external_links: JSON.stringify([
      {
        id: 'link-1',
        label: 'Visit PropStream Official Website',
        url: 'https://www.propstream.com',
        type: 'Client Website',
        display: true,
        favicon_url: 'https://www.google.com/s2/favicons?domain=propstream.com&sz=128',
        favicon_status: 'found',
        override_icon: '',
        verified: true
      }
    ]),
    custom_tables: JSON.stringify([
      {
        id: 'table-1',
        title: 'Lead Channel Response Latency Benchmarks',
        columns: ['Channel Source', 'Pre-Implementation Baseline', 'Post-Deployment Latency', 'Verified SLA Improvement'],
        rows: [
          ['Google Search Ads', '184 Minutes', '1.8 Minutes', '-99.0%'],
          ['Meta Instant Forms', '310 Minutes', '2.1 Minutes', '-99.3%'],
          ['Third-Party Property Portals', '240 Minutes', '3.2 Minutes', '-98.7%'],
          ['Direct Website Inbound', '120 Minutes', '1.5 Minutes', '-98.8%']
        ],
        notes: 'Averaged across 4 metropolitan operational branches.',
        visible: true
      }
    ]),
    testimonial: JSON.stringify({
      quote: 'The response time difference was night and day. In competitive real estate markets, reaching the prospect before competitors is everything. Our viewing bookings more than doubled in the first quarter.',
      author: 'Marcus Vance',
      role: 'Managing Director',
      company: 'PropStream Realty Network',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }),
    status: 'published',
    featured: 1,
    sort_order: 1,
    author: 'Enterprise Systems Practice',
    seo_title: 'Case Study: Real Estate Lead Distribution & Follow-ups | Etromo',
    seo_description: 'Discover how Etromo decreased response times by 99% and increased tour conversion by 133% for PropStream Realty.'
  },
  {
    slug: 'aura-hospitality-pos-kitchen-automation',
    title: 'High-Volume POS & Kitchen Workflow Synchronization for Aura Hospitality',
    subtitle: 'Unified multi-terminal table ordering, real-time kitchen display routing, and offline-first inventory tracking across a multi-outlet luxury bistro chain.',
    category: 'Autonomous Systems & IoT',
    industry: 'Hospitality & F&B',
    client_name: 'Aura Hospitality Group',
    is_client_confidential: 0,
    cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
    duration: '8 Weeks',
    services: JSON.stringify(['Custom POS Architecture', 'Kitchen Display Systems (KDS)', 'Stock Depletion Engine', 'Offline-First Synchronization']),
    technologies: JSON.stringify(['TypeScript', 'React', 'Node.js', 'WebSockets', 'SQLite Local Sync', 'Thermal Print Engine']),
    business_type: 'Multi-Location Restaurant Group',
    challenge_overview: 'Aura Hospitality experienced intense dinner rush bottlenecks where waiter handoffs to kitchen stations created 22-minute prep delays, lost paper tickets, and inventory blind spots between bar stock and floor consumption.',
    challenge_points: JSON.stringify([
      'Paper tickets routinely went missing during 300+ seat dinner rushes, triggering customer complaints.',
      'Kitchen station prep coordination took 22+ minutes from order placement to cook start.',
      'Inventory depletion had to be reconciled manually at close of business, masking ingredient leakage.',
      'Internet dropouts during peak service halted card payments and caused terminal lockouts.'
    ]),
    goals_baseline: JSON.stringify([
      { metric: 'Order-to-Kitchen Delay', initial_value: '6.5', unit: 'Minutes', period: 'Pre-deployment Audit', target: '< 30 Seconds', source: 'Floor observation log' },
      { metric: 'Average Prep Time', initial_value: '24.8', unit: 'Minutes', period: 'Pre-deployment Audit', target: '< 15 Minutes', source: 'Chef station audit' },
      { metric: 'Daily Ticket Error Rate', initial_value: '5.8', unit: '%', period: 'Pre-deployment Audit', target: '< 1.0%', source: 'Manager comped meal log' }
    ]),
    approach_phases: JSON.stringify([
      {
        phase_number: 1,
        title: 'Floor Workflows & Station Mapping',
        duration: 'Weeks 1-2',
        description: 'Analyzed service rhythms, kitchen stations (Grill, Saute, Pastry, Bar), and waiter travel paths.',
        deliverables: ['Physical Workflow Diagram', 'KDS Station Routing Matrix']
      },
      {
        phase_number: 2,
        title: 'Offline-First Terminal & WebSockets Architecture',
        duration: 'Weeks 3-5',
        description: 'Engineered a local SQLite sync daemon ensuring zero downtime when external internet drops.',
        deliverables: ['Local Sync Gateway', 'Real-Time WebSocket Protocol']
      },
      {
        phase_number: 3,
        title: 'Hardware Integration & KDS Screen Testing',
        duration: 'Weeks 6-7',
        description: 'Deployed industrial touchscreen KDS displays with color-coded ticket aging alerts.',
        deliverables: ['Custom KDS Firmware', 'Thermal Printer Protocol Handler']
      },
      {
        phase_number: 4,
        title: 'Live Service Pilot & Multi-Branch Launch',
        duration: 'Week 8',
        description: 'Conducted live dinner rush deployment with fallback telemetry and kitchen staff onboarding.',
        deliverables: ['Operational Readiness Sign-off', 'Inventory Live Sync Daemon']
      }
    ]),
    solution_overview: 'We built a custom, hardware-integrated hospitality management stack featuring real-time kitchen display screens, offline-resilient waiter tablets, and automatic inventory subtraction on item fire.',
    solution_features: JSON.stringify([
      {
        title: 'Real-Time Multi-Station KDS',
        description: 'Routes dishes to designated preparation stations with color-coded SLA timers and course hold/fire buttons.'
      },
      {
        title: 'Offline-First Local Sync Architecture',
        description: 'Ensures servers can fire orders and take payments even if internet connectivity drops completely.'
      },
      {
        title: 'Automated Recipe Ingredient Depletion',
        description: 'Deducts stock item weights automatically upon cooking confirmation, eliminating end-of-shift reconciliation.'
      },
      {
        title: 'Waiter Mobile Handheld Ordering',
        description: 'Enables tableside ordering with direct seat-number billing, cutting waiter trips to wall terminals.'
      }
    ]),
    solution_architecture_image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80',
    before_after_metrics: JSON.stringify([
      {
        id: 'metric-1',
        name: 'Order-to-Kitchen Transit Latency',
        type: 'duration',
        before: 6.5,
        after: 0.2,
        unit: 'Minutes',
        direction: 'lower_is_better',
        period: '60-Day Post-Launch Service',
        change_display: '-96.9% Reduction',
        evidence: 'POS System Digital Audit Timestamps',
        verified: true,
        show_public: true,
        notes: 'Reduced from 6.5 minutes physical slip handoff to 12 seconds digital fire.'
      },
      {
        id: 'metric-2',
        name: 'Average Meal Preparation Time',
        type: 'duration',
        before: 24.8,
        after: 13.5,
        unit: 'Minutes',
        direction: 'lower_is_better',
        period: 'Peak Dinner Rushes',
        change_display: '-45.6% Improvement',
        evidence: 'Kitchen Display Screen Time Records',
        verified: true,
        show_public: true,
        notes: 'Dropped prep times by 11.3 minutes during 7pm-10pm peak rush.'
      },
      {
        id: 'metric-3',
        name: 'Order Void / Remake Error Rate',
        type: 'percentage',
        before: 5.8,
        after: 0.4,
        unit: '%',
        direction: 'lower_is_better',
        period: 'Quarterly Audit',
        change_display: '-5.4 pt (-93.1% Rel.)',
        evidence: 'Point-of-Sale Void Reports',
        verified: true,
        show_public: true,
        notes: 'Absolute drop: -5.4 percentage points. Relative reduction: -93.1%.'
      },
      {
        id: 'metric-4',
        name: 'Average Table Turnaround Duration',
        type: 'duration',
        before: 58.0,
        after: 41.0,
        unit: 'Minutes',
        direction: 'lower_is_better',
        period: 'Weekend Lunch & Dinner Cycles',
        change_display: '-29.3% Faster Turnaround',
        evidence: 'Reservation & Payment Timestamps',
        verified: true,
        show_public: true,
        notes: 'Allowed 28% higher table capacity during prime hours.'
      }
    ]),
    key_results: JSON.stringify([
      { metric: '-96.9%', label: 'Order Transit Latency', unit: 'Reduction', context: '12-second digital transmission vs 6.5 min manual slip handoff', verified: true },
      { metric: '13.5 min', label: 'Average Prep Time', unit: 'Time', context: 'Down from 24.8 mins without compromising culinary standard', verified: true },
      { metric: '-93.1%', label: 'Order Error Reduction', unit: 'Drop', context: 'Remakes dropped from 5.8% to under 0.4%', verified: true },
      { metric: '+28%', label: 'Prime Table Turns', unit: 'Capacity', context: 'Greater guest throughput during peak dining hours', verified: true }
    ]),
    methodology: 'Captured over 32,500 ticket transactions across 3 flagship dining locations. Latency metrics verified by POS server logs, KDS bump bar events, and guest checkout timestamps.',
    lessons_learned: JSON.stringify([
      'Kitchen staff adopted physical bump bars significantly faster than touchscreen interfaces due to grease and speed.',
      'Local network synchronization was paramount; 100% of order routing continued uninterrupted during two local ISP outages.',
      'Automated seat-number splitting eliminated 8 minutes of payment calculation at large banquets.'
    ]),
    external_links: JSON.stringify([
      {
        id: 'link-1',
        label: 'Aura Hospitality Portfolio',
        url: 'https://aurahospitality.com',
        type: 'Client Website',
        display: true,
        favicon_url: 'https://www.google.com/s2/favicons?domain=aurahospitality.com&sz=128',
        favicon_status: 'found',
        override_icon: '',
        verified: true
      }
    ]),
    custom_tables: JSON.stringify([
      {
        id: 'table-1',
        title: 'Dinner Rush Service Station Bottleneck Comparison',
        columns: ['Kitchen Section', 'Baseline Ticket Aging', 'Post-Optimization Aging', 'SLA Adherence'],
        rows: [
          ['Cold Appetizers & Salads', '12.4 Minutes', '4.2 Minutes', '99.4% On-Time'],
          ['Hot Line & Main Courses', '26.8 Minutes', '14.1 Minutes', '97.8% On-Time'],
          ['Cocktails & Bar Service', '9.5 Minutes', '2.8 Minutes', '99.8% On-Time'],
          ['Dessert & Pastry Station', '14.2 Minutes', '5.1 Minutes', '99.1% On-Time']
        ],
        notes: 'Monitored across Friday and Saturday dinner services (7:00 PM – 10:30 PM).',
        visible: true
      }
    ]),
    testimonial: JSON.stringify({
      quote: 'Our chefs no longer yell across the kitchen looking for lost paper checks. The KDS color alerts and tableside ordering gave our floor team peace of mind and cut dinner turnaround by nearly twenty minutes.',
      author: 'Chef Antoine Laurent',
      role: 'Executive Culinary Director',
      company: 'Aura Hospitality Group',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80'
    }),
    status: 'published',
    featured: 1,
    sort_order: 2,
    author: 'Autonomous Systems Practice',
    seo_title: 'Case Study: POS & Kitchen Workflow Automation | Etromo',
    seo_description: 'How Etromo eliminated dinner rush ticket delays by 96% and sped up preparation by 45% for Aura Hospitality.'
  },
  {
    slug: 'finsecure-kyc-pipeline-automation',
    title: 'Sub-Minute Enterprise KYC & AML Verification Pipeline for FinSecure',
    subtitle: 'Architected an automated document verification and sanction screening pipeline reducing compliance onboarding turnaround from 3 business days to 45 seconds.',
    category: 'Enterprise Cloud & Security',
    industry: 'Fintech & Banking',
    client_name: 'FinSecure Global Technologies',
    is_client_confidential: 0,
    cover_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
    duration: '14 Weeks',
    services: JSON.stringify(['Zero-Trust Architecture', 'Computer Vision Document OCR', 'Automated AML Sanction Screening', 'Cryptographic Audit Trail']),
    technologies: JSON.stringify(['Node.js Microservices', 'PostgreSQL', 'AWS KMS', 'Python OCR Engine', 'Redis Sentinel', 'Docker']),
    business_type: 'Licensed Cross-Border Financial Institution',
    challenge_overview: 'FinSecure faced severe onboarding friction where compliance analysts had to manually review passport scans, utility bills, and run manual checks against OFAC and global sanction databases. Review turnaround averaged 72 hours, triggering a 41% customer abandonment rate.',
    challenge_points: JSON.stringify([
      'Compliance turnaround averaged 72 hours (3 business days), stalling enterprise account opening.',
      'Customer dropout during onboarding peaked at 41.2% due to document resubmission delays.',
      'Compliance staff spent over 120 hours weekly manually verifying utility bills and registry documents.',
      'Audit readiness required painstaking manual consolidation across fragmented verification logs.'
    ]),
    goals_baseline: JSON.stringify([
      { metric: 'Onboarding Turnaround Time', initial_value: '4320', unit: 'Minutes (72h)', period: 'Q2 2025 Audit', target: '< 5 Minutes', source: 'Internal compliance SLA report' },
      { metric: 'Customer Drop-off Rate', initial_value: '41.2', unit: '%', period: 'Q2 2025 Audit', target: '< 10%', source: 'Funnel analytics dashboard' },
      { metric: 'Compliance Review Hours', initial_value: '120', unit: 'Hours/Week', period: 'Q2 2025 Audit', target: '< 20 Hours/Week', source: 'Resource allocation report' }
    ]),
    approach_phases: JSON.stringify([
      {
        phase_number: 1,
        title: 'Regulatory & Compliance Requirements Mapping',
        duration: 'Weeks 1-3',
        description: 'Collaborated with chief compliance officers to define precise document fraud indicators and sanction rules.',
        deliverables: ['Regulatory Matrix', 'Zero-Trust Security Blueprint']
      },
      {
        phase_number: 2,
        title: 'Computer Vision & OCR Extraction Engine',
        duration: 'Weeks 4-7',
        description: 'Engineered high-accuracy document parsing pipeline with liveness verification and tamper detection.',
        deliverables: ['Document Verification Microservice', 'Liveness Check API']
      },
      {
        phase_number: 3,
        title: 'Asynchronous Sanction & PEP Screening Gateway',
        duration: 'Weeks 8-11',
        description: 'Connected distributed watchlist feeds with fuzzy phonetic matching and automated adverse media scoring.',
        deliverables: ['AML Screening Gateway', 'Phonetic Matching Engine']
      },
      {
        phase_number: 4,
        title: 'Auditing, Penetration Testing & Production Switchover',
        duration: 'Weeks 12-14',
        description: 'Completed third-party penetration testing, SOC 2 compliance sign-off, and traffic cutover.',
        deliverables: ['Cryptographic Audit Vault', 'Penetration Test Report']
      }
    ]),
    solution_overview: 'An end-to-end automated verification engine combining computer vision document forensics, biometric liveness validation, and sub-second sanction list screening within an encrypted zero-trust enclave.',
    solution_features: JSON.stringify([
      {
        title: 'Forensic Document Inspection',
        description: 'Analyzes holograms, MRZ checksums, microprint integrity, and font irregularities to detect forged passports and IDs.'
      },
      {
        title: 'Real-Time Global Sanctions & PEP Check',
        description: 'Conducts parallel phonetic queries across OFAC, UN, EU, and Interpol watchlists in under 300 milliseconds.'
      },
      {
        title: 'Deterministic Risk Scoring Engine',
        description: 'Automatically approves 88% of low-risk applications while flagging edge cases with annotated analyst dossiers.'
      },
      {
        title: 'Immutable Cryptographic Audit Trail',
        description: 'Stores every verification decision hash in an append-only cryptographic ledger for regulatory examination.'
      }
    ]),
    solution_architecture_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    before_after_metrics: JSON.stringify([
      {
        id: 'metric-1',
        name: 'KYC Verification Turnaround Time',
        type: 'duration',
        before: 4320,
        after: 0.75,
        unit: 'Minutes',
        direction: 'lower_is_better',
        period: '120-Day Post-Launch Window',
        change_display: '-99.98% Reduction',
        evidence: 'SOC 2 Verified Gateway Telemetry',
        verified: true,
        show_public: true,
        notes: 'Turnaround dropped from 72 hours (4,320 mins) down to 45 seconds (0.75 min).'
      },
      {
        id: 'metric-2',
        name: 'Onboarding Drop-off Rate',
        type: 'percentage',
        before: 41.2,
        after: 8.6,
        unit: '%',
        direction: 'lower_is_better',
        period: 'Q4 2025 Funnel Analysis',
        change_display: '-32.6 pt (-79.1% Rel.)',
        evidence: 'Product Analytics Funnel Logs',
        verified: true,
        show_public: true,
        notes: 'Absolute decrease: -32.6 percentage points. Relative abandonment reduction: -79.1%.'
      },
      {
        id: 'metric-3',
        name: 'Weekly Manual Review Hours',
        type: 'duration',
        before: 120.0,
        after: 14.2,
        unit: 'Hours/Week',
        direction: 'lower_is_better',
        period: 'Compliance Operations Audit',
        change_display: '-88.2% Reduction',
        evidence: 'Time-Tracking & Task Resolution Logs',
        verified: true,
        show_public: true,
        notes: 'Reclaimed 105.8 weekly analyst hours for complex investigations.'
      },
      {
        id: 'metric-4',
        name: 'First-Pass Document Acceptance',
        type: 'percentage',
        before: 64.5,
        after: 92.1,
        unit: '%',
        direction: 'higher_is_better',
        period: 'Bi-Monthly Verification Log',
        change_display: '+27.6 pt (+42.8% Rel.)',
        evidence: 'OCR Confidence Matrix Telemetry',
        verified: true,
        show_public: true,
        notes: 'Absolute increase: +27.6 percentage points. Relative improvement: +42.8%.'
      }
    ]),
    key_results: JSON.stringify([
      { metric: '45 sec', label: 'Average Verification Time', unit: 'Time', context: 'From 72 hours down to sub-minute instantaneous approval', verified: true },
      { metric: '-79.1%', label: 'Drop-off Reduction', unit: 'Drop', context: 'Onboarding churn fell from 41.2% to 8.6%', verified: true },
      { metric: '88%', label: 'Straight-Through Processing', unit: 'Automation', context: 'High-confidence cases approved with zero human intervention', verified: true },
      { metric: '105 hrs', label: 'Weekly Analyst Hours Saved', unit: 'Hours', context: 'Compliance team redirected to high-risk investigations', verified: true }
    ]),
    methodology: 'Assessed across 28,400 user verifications submitted across 12 countries. Measurements independently validated through SOC 2 Type II audit logs, AWS CloudWatch metrics, and regulatory compliance sign-offs.',
    lessons_learned: JSON.stringify([
      'Real-time edge image quality feedback (glare detection, angle framing) boosted first-pass OCR readability by 34%.',
      'Phonetic transliteration algorithms were vital for resolving non-Latin name matches in global sanction databases.',
      'A two-tiered review queue allowed clear-cut applicants through in seconds while highlighting specific risk flags for analysts.'
    ]),
    external_links: JSON.stringify([
      {
        id: 'link-1',
        label: 'FinSecure Global Platform',
        url: 'https://finsecure.io',
        type: 'Client Website',
        display: true,
        favicon_url: 'https://www.google.com/s2/favicons?domain=finsecure.io&sz=128',
        favicon_status: 'found',
        override_icon: '',
        verified: true
      }
    ]),
    custom_tables: JSON.stringify([
      {
        id: 'table-1',
        title: 'Identity Verification Latency & Accuracy by Country Document Tier',
        columns: ['Jurisdiction', 'Pass Rate', 'Average Latency', 'False Positive Rate'],
        rows: [
          ['Tier 1 (US / UK / EU Passports)', '98.4%', '38 Seconds', '< 0.05%'],
          ['Tier 2 (APAC National IDs)', '94.2%', '47 Seconds', '< 0.12%'],
          ['Tier 3 (LATAM Driver Licenses)', '91.8%', '52 Seconds', '< 0.18%'],
          ['Global Watchlist Screening', '99.9%', '210 Milliseconds', '< 0.01%']
        ],
        notes: 'Audited across 28,400 global verification sessions.',
        visible: true
      }
    ]),
    testimonial: JSON.stringify({
      quote: 'Reducing our verification turnaround from three days to 45 seconds was a monumental growth catalyst. Our conversion numbers surged, and our compliance officers finally have the depth of data they need.',
      author: 'Elena Rostova',
      role: 'Chief Compliance Officer',
      company: 'FinSecure Global Technologies',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
    }),
    status: 'published',
    featured: 0,
    sort_order: 3,
    author: 'Fintech & Security Practice',
    seo_title: 'Case Study: Sub-Minute KYC & AML Pipeline | Etromo',
    seo_description: 'How Etromo reduced onboarding turnaround from 72 hours to 45 seconds and cut abandonment by 79% for FinSecure.'
  }
];

async function seed() {
  console.log('Seeding Case Studies...');
  await db.run(`CREATE TABLE IF NOT EXISTS case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    industry TEXT NOT NULL,
    client_name TEXT NOT NULL,
    is_client_confidential INTEGER DEFAULT 0,
    cover_image TEXT,
    duration TEXT,
    services TEXT,
    technologies TEXT,
    business_type TEXT,
    challenge_overview TEXT,
    challenge_points TEXT,
    goals_baseline TEXT,
    approach_phases TEXT,
    solution_overview TEXT,
    solution_features TEXT,
    solution_architecture_image TEXT,
    before_after_metrics TEXT,
    key_results TEXT,
    methodology TEXT,
    lessons_learned TEXT,
    external_links TEXT,
    custom_tables TEXT,
    testimonial TEXT,
    status TEXT DEFAULT 'published',
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    author TEXT DEFAULT 'Engineering Team',
    seo_title TEXT,
    seo_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  for (const cs of sampleCaseStudies) {
    const existing = await db.get('SELECT id FROM case_studies WHERE slug = ?', [cs.slug]);
    if (!existing) {
      await db.run(
        `INSERT INTO case_studies (
          slug, title, subtitle, category, industry, client_name, is_client_confidential,
          cover_image, duration, services, technologies, business_type,
          challenge_overview, challenge_points, goals_baseline, approach_phases,
          solution_overview, solution_features, solution_architecture_image,
          before_after_metrics, key_results, methodology, lessons_learned,
          external_links, custom_tables, testimonial, status, featured, sort_order,
          author, seo_title, seo_description
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?
        )`,
        [
          cs.slug,
          cs.title,
          cs.subtitle,
          cs.category,
          cs.industry,
          cs.client_name,
          cs.is_client_confidential,
          cs.cover_image,
          cs.duration,
          cs.services,
          cs.technologies,
          cs.business_type,
          cs.challenge_overview,
          cs.challenge_points,
          cs.goals_baseline,
          cs.approach_phases,
          cs.solution_overview,
          cs.solution_features,
          cs.solution_architecture_image,
          cs.before_after_metrics,
          cs.key_results,
          cs.methodology,
          cs.lessons_learned,
          cs.external_links,
          cs.custom_tables,
          cs.testimonial,
          cs.status,
          cs.featured,
          cs.sort_order,
          cs.author,
          cs.seo_title,
          cs.seo_description
        ]
      );
      console.log(`Seeded case study: ${cs.slug}`);
    } else {
      console.log(`Case study already exists: ${cs.slug}`);
    }
  }
  console.log('Case Studies seeding completed successfully!');
}

seed().catch(console.error);
