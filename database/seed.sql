-- Initial Seed Data for SQLite Database

-- Team Members
INSERT OR IGNORE INTO team_members (
  id, name, role, department, short_desc, bio, email, linkedin_url, x_url, skills, image_url, sort_order, is_active
) VALUES
(
  1,
  'Arjun Mehta',
  'Chief Executive Officer',
  'Executive Leadership',
  'Over 12 years building enterprise B2B SaaS across real estate, fintech, and workflow automation.',
  'Arjun has spent over 12 years building B2B SaaS products across real estate, fintech, and operations software. He founded this company with a singular belief: that the gap between generic software and real business needs could be bridged through focused, industry-specific systems architecture.',
  'arjun.mehta@ourcompany.com',
  'https://linkedin.com/in/arjun-mehta',
  'https://x.com/arjunmehta',
  'B2B SaaS Strategy, Enterprise Sales, Product Architecture, Venture Scaling',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  1,
  1
),
(
  2,
  'Priya Sharma',
  'Chief Technology Officer',
  'Engineering & AI',
  'Systems architect leading engineering with a focus on high reliability, cloud infrastructure, and pragmatic AI.',
  'A systems architect by training, Priya leads our engineering culture with a focus on reliability, fault-tolerant infrastructure, and pragmatic AI automation.',
  'priya.sharma@ourcompany.com',
  'https://linkedin.com/in/priya-sharma-tech',
  NULL,
  'Distributed Systems, Cloud Architecture, AI Agent Workflows, PostgreSQL & SQLite',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  2,
  1
);

-- Products
INSERT OR IGNORE INTO products (
  id, name, category, description, price_label, link_url, image_url, features_json
) VALUES
(
  1,
  'Real Estate CRM Pro',
  'CRM Software',
  'The complete operating system for real estate developers and channel partners. Unified lead pipeline, automated follow-ups, site visit tracking, document management, and commission calculations.',
  'Subscription Based',
  '/products/real-estate-crm',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60',
  '{"boostValue":"+65%","boostLabel":"Lead Conversion","timeReducedValue":"-40%","timeReducedLabel":"Time Reduced","benefits":[{"icon":"target","text":"Instant Lead Capture from Meta & Google"},{"icon":"refresh","text":"Automated Follow-ups & WhatsApp Broadcasts"},{"icon":"shield","text":"Role-Based Access & Database Security"}]}'
),
(
  2,
  'WhatsApp CRM',
  'Communication Platform',
  'Turn WhatsApp into a full-featured customer operations platform. Manage multi-agent routing, automated message flows, broadcast campaigns, and performance analytics.',
  'One-Time + Subscription',
  '/products/whatsapp-crm',
  'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop&q=60',
  '{"boostValue":"3.5x","boostLabel":"Response Speed","timeReducedValue":"-60%","timeReducedLabel":"Resolution Time","benefits":[{"icon":"zap","text":"Official WhatsApp Business Cloud API Integration"},{"icon":"refresh","text":"Multi-Agent Routing & Shared Inbox"},{"icon":"trending","text":"High-Open-Rate Automated Broadcasts"}]}'
),
(
  3,
  'Café Management Suite',
  'Operations Software',
  'An integrated management platform for modern café groups and restaurant chains. Multi-branch inventory, loyalty programs, staff scheduling, and digital menus.',
  'Subscription Based',
  '/products/cafe-crm',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60',
  '{"boostValue":"+32%","boostLabel":"Repeat Customers","timeReducedValue":"-50%","timeReducedLabel":"Inventory Waste","benefits":[{"icon":"target","text":"Centralized Multi-Outlet Inventory Control"},{"icon":"trending","text":"Integrated Loyalty Programs & Digital Menus"},{"icon":"shield","text":"Real-time Cross-Branch Sales Analytics"}]}'
);
