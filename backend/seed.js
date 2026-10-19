/**
 * Demo Data Seeder
 * Run with: node seed.js
 * Seeds all modules with realistic sample data
 */
const db = require('./database');

async function seed() {
  console.log('⟳ Seeding demo data...\n');

  // ─── TEAM MEMBERS ───────────────────────────────────────────────────────
  const team = [
    {
      name: 'Arjun Mehta',
      role: 'Chief Executive Officer',
      department: 'Executive Leadership',
      short_desc: 'Over 12 years building enterprise B2B SaaS across real estate, fintech, and workflow automation.',
      bio: 'Arjun has spent over 12 years building B2B SaaS products across real estate, fintech, and operations software. He founded this company with a singular belief: that the gap between generic software and real business needs could be bridged through focused, industry-specific systems architecture. Prior to this, he led product strategy at high-growth South Asian technology scaleups.',
      email: 'arjun.mehta@ourcompany.com',
      linkedin_url: 'https://linkedin.com/in/arjun-mehta',
      x_url: 'https://x.com/arjunmehta',
      skills: 'B2B SaaS Strategy, Enterprise Sales, Product Architecture, Venture Scaling',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
      sort: 1
    },
    {
      name: 'Priya Sharma',
      role: 'Chief Technology Officer',
      department: 'Engineering & AI',
      short_desc: 'Systems architect leading engineering with a focus on high reliability, cloud infrastructure, and pragmatic AI.',
      bio: 'A systems architect by training, Priya leads our engineering culture with a focus on reliability, fault-tolerant infrastructure, and pragmatic AI automation. She has built and scaled distributed systems for enterprise operations across South Asia and the Middle East, with a master\'s degree in Computer Systems.',
      email: 'priya.sharma@ourcompany.com',
      linkedin_url: 'https://linkedin.com/in/priya-sharma-tech',
      github_url: 'https://github.com/priyasharma',
      skills: 'Distributed Systems, Cloud Architecture, AI Agent Workflows, PostgreSQL & SQLite',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      sort: 2
    },
    {
      name: 'Rahul Joshi',
      role: 'Head of Product & Design',
      department: 'Product & Design',
      short_desc: 'Deep expertise in user research and human-centered design, ensuring every workflow is friction-free.',
      bio: 'Rahul brings deep expertise in user research, design systems, and product strategy. He ensures every interface and workflow we deploy is grounded in real customer workflow observations and measurable business outcomes rather than assumptions. He previously designed critical tools for enterprise logistics.',
      email: 'rahul.joshi@ourcompany.com',
      linkedin_url: 'https://linkedin.com/in/rahul-joshi-design',
      website_url: 'https://rahuljoshi.design',
      skills: 'Design Systems, User Research, Interaction Design, Product Discovery',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
      sort: 3
    },
    {
      name: 'Kavya Nair',
      role: 'Head of Partnerships',
      department: 'Growth & Ecosystem',
      short_desc: 'Manages technology and sales partner ecosystems, enabling software creators and consultants to grow.',
      bio: 'Kavya manages our growing partner ecosystem, onboarding tech partners and sales agents who share our commitment to operational excellence. She has an extensive background in enterprise sales, strategic alliances, and channel distribution across B2B software verticals.',
      email: 'kavya.nair@ourcompany.com',
      linkedin_url: 'https://linkedin.com/in/kavya-nair-growth',
      skills: 'Channel Distribution, Partner Enablement, B2B Commercial Strategy, Client Success',
      image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80',
      sort: 4
    },
  ];

  for (const m of team) {
    try {
      const r = await db.run(
        `INSERT OR REPLACE INTO team_members (
          name, role, department, short_desc, bio, email,
          linkedin_url, github_url, x_url, website_url,
          image_url, skills, sort_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          m.name, m.role, m.department, m.short_desc, m.bio, m.email,
          m.linkedin_url, m.github_url || null, m.x_url || null, m.website_url || null,
          m.image_url, m.skills, m.sort
        ]
      );
      if (r.changes) console.log(`  ✓ Team: ${m.name}`);
    } catch (e) { console.log(`  ✗ Team: ${m.name} — ${e.message}`); }
  }

  // ─── BLOG POSTS ─────────────────────────────────────────────────────────
  const blogs = [
    {
      title: 'Why Real Estate Teams Lose Deals to Manual Follow-Ups',
      category: 'Industry Insight',
      slug: 'real-estate-manual-followup-problem',
      content: `<h2>The Follow-Up Problem Is Bigger Than You Think</h2><p>In real estate, timing is everything. A lead who doesn't hear back within 24 hours is a lead who has already called three other agents. Yet most real estate teams are still managing follow-ups through WhatsApp reminders, sticky notes, and shared spreadsheets.</p><p>The result? Inconsistent outreach, missed opportunities, and a sales team that spends more time chasing internal updates than actually selling.</p><h2>What a CRM Actually Does</h2><p>A purpose-built real estate CRM doesn't just store contacts — it orchestrates the entire buyer journey. From the first site visit inquiry to the final document submission, every touchpoint is tracked, timed, and acted upon automatically.</p><p>The best teams we've worked with don't have more salespeople. They have better systems.</p><h2>How to Evaluate What's Right for You</h2><p>Before purchasing any software, ask yourself: does this tool fit the way my team already works, or does it ask my team to change their entire process to fit the tool? The answer should always be the former.</p>`,
      image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'WhatsApp as a Business Operating System: Not Just a Chat App',
      category: 'Technology',
      slug: 'whatsapp-business-operating-system',
      content: `<h2>Your Customers Are Already on WhatsApp</h2><p>With over 2 billion active users, WhatsApp is no longer just a messaging app — it is the primary communication channel for a significant portion of the world's commerce. Businesses that treat it as a serious customer engagement platform have a structural advantage over those who still rely solely on email and phone calls.</p><h2>The Difference Between WhatsApp and WhatsApp Business API</h2><p>The standard WhatsApp Business app is useful for a single operator managing a small flow of inquiries. But when your team grows beyond three or four people, or when your message volume exceeds a few hundred per day, you need the API layer.</p><p>With the Business API, you can route incoming messages to the right agent, automate replies for common questions, run broadcast campaigns, and analyse message-level performance — all from a single dashboard.</p><h2>What We've Built</h2><p>Our WhatsApp CRM gives growing businesses access to the full power of the Business API without the complexity. Set up in under a day, runs without technical maintenance, and scales alongside your team.</p>`,
      image_url: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop&q=60',
    },
    {
      title: 'The Operational Blueprint for a Modern Café Group',
      category: 'Case Study',
      slug: 'modern-cafe-group-operations-blueprint',
      content: `<h2>Beyond the Point of Sale</h2><p>Running a single café location is hard. Running five is an entirely different operational challenge. Most POS systems solve the transaction layer but leave everything else — inventory, staff scheduling, customer loyalty, and inter-branch reporting — to spreadsheets and WhatsApp groups.</p><h2>What Changes at Scale</h2><p>The moment you operate more than one location, you need real-time visibility across all of them. Is branch 3 running low on oat milk? Did the weekend shift at branch 1 hit its revenue target? Are your loyalty customers returning at the rate you projected?</p><p>These questions can't be answered from a POS system alone. They require a connected operational layer that sits above individual transactions and gives management the full picture.</p><h2>The Café Management Platform</h2><p>We built our Café Management CRM specifically for this gap — a system that connects inventory, staff, customer profiles, and financial reporting into a single interface that a non-technical business owner can actually use.</p>`,
      image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60',
    },
  ];

  for (const b of blogs) {
    try {
      const r = await db.run(
        'INSERT OR IGNORE INTO blogs (title, content, author_id, slug, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
        [b.title, b.content, 'Admin', b.slug, b.image_url, b.category]
      );
      if (r.changes) console.log(`  ✓ Blog: ${b.title}`);
    } catch (e) { console.log(`  ✗ Blog: ${b.title} — ${e.message}`); }
  }

  // ─── PRODUCTS ───────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Real Estate CRM Pro',
      category: 'CRM Software',
      description: 'The complete operating system for real estate developers and channel partners. Unified lead pipeline, automated follow-ups, site visit tracking, document management, and commission calculations.',
      price_label: 'Subscription Based',
      link_url: '/products/real-estate-crm',
      image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60',
      features_json: JSON.stringify({
        boostValue: '+65%',
        boostLabel: 'Lead Conversion',
        timeReducedValue: '-40%',
        timeReducedLabel: 'Time Reduced',
        benefits: [
          { icon: 'target', text: 'Instant Lead Capture from Meta & Google' },
          { icon: 'refresh', text: 'Automated Follow-ups & WhatsApp Broadcasts' },
          { icon: 'shield', text: 'Role-Based Access & Database Security' }
        ]
      })
    },
    {
      name: 'WhatsApp CRM',
      category: 'Communication Platform',
      description: 'Turn WhatsApp into a full-featured customer operations platform. Manage multi-agent routing, automated message flows, broadcast campaigns, and performance analytics.',
      price_label: 'One-Time + Subscription',
      link_url: '/products/whatsapp-crm',
      image_url: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop&q=60',
      features_json: JSON.stringify({
        boostValue: '3.5x',
        boostLabel: 'Response Speed',
        timeReducedValue: '-60%',
        timeReducedLabel: 'Resolution Time',
        benefits: [
          { icon: 'zap', text: 'Official WhatsApp Business Cloud API Integration' },
          { icon: 'refresh', text: 'Multi-Agent Routing & Shared Inbox' },
          { icon: 'trending', text: 'High-Open-Rate Automated Broadcasts' }
        ]
      })
    },
    {
      name: 'Café Management Suite',
      category: 'Operations Software',
      description: 'An integrated management platform for modern café groups and restaurant chains. Multi-branch inventory, loyalty programs, staff scheduling, and digital menus.',
      price_label: 'Subscription Based',
      link_url: '/products/cafe-crm',
      image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60',
      features_json: JSON.stringify({
        boostValue: '+32%',
        boostLabel: 'Repeat Customers',
        timeReducedValue: '-50%',
        timeReducedLabel: 'Inventory Waste',
        benefits: [
          { icon: 'target', text: 'Centralized Multi-Outlet Inventory Control' },
          { icon: 'trending', text: 'Integrated Loyalty Programs & Digital Menus' },
          { icon: 'shield', text: 'Real-time Cross-Branch Sales Analytics' }
        ]
      })
    },
  ];

  for (const p of products) {
    try {
      const r = await db.run(
        'INSERT OR REPLACE INTO products (name, description, category, image_url, price_label, link_url, features_json) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.name, p.description, p.category, p.image_url, p.price_label, p.link_url, p.features_json]
      );
      if (r.changes) console.log(`  ✓ Product: ${p.name}`);
    } catch (e) { console.log(`  ✗ Product: ${p.name} — ${e.message}`); }
  }

  // ─── CONTACT MESSAGES ───────────────────────────────────────────────────
  const contacts = [
    { name: 'Farrukh Tashkentov', email: 'farrukh@nexusprops.uz', company: 'Nexus Properties UZ', message: 'We are a real estate developer based in Tashkent with a portfolio of 8 residential projects. We are currently looking to automate our channel partner follow-up workflow. Can we schedule a demo of your Real Estate CRM?' },
    { name: 'Ayesha Rahman', email: 'ayesha@cafeblend.pk', company: 'Café Blend Group', message: 'I manage four café locations in Karachi. We are struggling with inventory tracking across branches and customer loyalty integration. Your café management product looks exactly like what we need. Please get in touch.' },
  ];

  for (const c of contacts) {
    try {
      const r = await db.run(
        'INSERT OR IGNORE INTO contacts (name, email, company, message) VALUES (?, ?, ?, ?)',
        [c.name, c.email, c.company, c.message]
      );
      if (r.changes) console.log(`  ✓ Contact: ${c.name}`);
    } catch (e) { console.log(`  ✗ Contact: ${c.name} — ${e.message}`); }
  }

  // ─── BOOKINGS ───────────────────────────────────────────────────────────
  const bookings = [
    { name: 'Rohan Kapoor', email: 'rohan@kapoordigital.in', company: 'Kapoor Digital', country: 'India', phone: '+91-9812345678', topics: ['Custom Software', 'AI Workflows'], message: 'Looking to automate our internal operations. Happy to discuss scope on the call.', date: new Date(Date.now() + 3 * 86400000).toISOString(), time: '11:00 AM - 01:00 PM' },
    { name: 'Sara Al-Mansoori', email: 'sara@ventures.ae', company: 'Gulf Ventures LLC', country: 'UAE', phone: '+971-501234567', topics: ['Partner Ecosystem', 'Systems Architecture'], message: 'We are interested in becoming a regional technology partner. Let\'s discuss the partnership structure.', date: new Date(Date.now() + 5 * 86400000).toISOString(), time: '03:00 PM - 05:00 PM' },
  ];

  for (const b of bookings) {
    try {
      const r = await db.run(
        'INSERT INTO bookings (name, email, phone, company, country, topics, message, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [b.name, b.email, b.phone, b.company, b.country, JSON.stringify(b.topics), b.message, b.date, b.time]
      );
      if (r.changes) console.log(`  ✓ Booking: ${b.name}`);
    } catch (e) { console.log(`  ✗ Booking: ${b.name} — ${e.message}`); }
  }

  console.log('\n✅ Demo data seeded successfully!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
