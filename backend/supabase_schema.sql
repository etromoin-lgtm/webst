-- Supabase / PostgreSQL Complete Production Schema for ETROMO
-- Generated for full compatibility with both Supabase Database and local environments

-- 1. Partner Applications
CREATE TABLE IF NOT EXISTS partner_applications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    product_name VARCHAR(255),
    website VARCHAR(255),
    agency_name VARCHAR(255),
    experience TEXT,
    linkedin VARCHAR(255),
    code VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contact Inquiries
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Blogs & Engineering Articles
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(255),
    category VARCHAR(100) DEFAULT 'General',
    published_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'published'
);

-- 4. Products Catalog
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    features_json JSONB,
    image_url TEXT,
    price_label VARCHAR(100),
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Team Members
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    department VARCHAR(255),
    short_desc TEXT,
    bio TEXT,
    email VARCHAR(255),
    linkedin_url TEXT,
    github_url TEXT,
    x_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    youtube_url TEXT,
    website_url TEXT,
    image_url TEXT,
    skills TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bookings & Consultations
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    company VARCHAR(255),
    country VARCHAR(100),
    topics TEXT,
    message TEXT,
    date VARCHAR(100),
    time VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SEO Settings
CREATE TABLE IF NOT EXISTS seo_settings (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    og_image TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Global Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Comprehensive Case Studies
CREATE TABLE IF NOT EXISTS case_studies (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    category VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    is_client_confidential INTEGER DEFAULT 0,
    cover_image TEXT,
    duration VARCHAR(100),
    services TEXT,
    technologies TEXT,
    business_type VARCHAR(255),
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
    status VARCHAR(50) DEFAULT 'published',
    featured INTEGER DEFAULT 0,
    featured_on_homepage INTEGER DEFAULT 0,
    featured_in_trusted_by INTEGER DEFAULT 0,
    embedded_link TEXT,
    custom_favicon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    author VARCHAR(255) DEFAULT 'Engineering Team',
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Organizations (B2B Client Portal)
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    legal_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    tax_id VARCHAR(100),
    primary_email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(100),
    website VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Portal Users
CREATE TABLE IF NOT EXISTS portal_users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    role VARCHAR(50) DEFAULT 'CLIENT',
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Portal Projects
CREATE TABLE IF NOT EXISTS portal_projects (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    project_code VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    scope_summary TEXT,
    project_type VARCHAR(100) DEFAULT 'CUSTOM_DEV',
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    is_historical_record INTEGER DEFAULT 0,
    start_date VARCHAR(100),
    target_or_completion_date VARCHAR(100),
    assigned_admin_name VARCHAR(255) DEFAULT 'Engineering Team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Portal Milestones
CREATE TABLE IF NOT EXISTS portal_milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES portal_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    completion_date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Portal Product Purchases & Licenses
CREATE TABLE IF NOT EXISTS portal_product_purchases (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    license_key VARCHAR(255) UNIQUE,
    purchase_date VARCHAR(100),
    entitlement_type VARCHAR(50) DEFAULT 'LIFETIME',
    entitlement_end_date VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    price_paid VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Historical Verification Claims
CREATE TABLE IF NOT EXISTS portal_historical_claims (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES portal_users(id) ON DELETE SET NULL,
    claim_type VARCHAR(100) NOT NULL,
    declared_name VARCHAR(255) NOT NULL,
    declared_reference_number VARCHAR(255),
    declared_old_email VARCHAR(255),
    approximate_date VARCHAR(100),
    notes TEXT,
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    admin_decision_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Invoices & Billing
CREATE TABLE IF NOT EXISTS portal_invoices (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES portal_projects(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    amount_paid NUMERIC(12,2) DEFAULT 0,
    due_date VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Support Tickets
CREATE TABLE IF NOT EXISTS portal_tickets (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES portal_users(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES portal_projects(id) ON DELETE SET NULL,
    product_id INTEGER,
    ticket_code VARCHAR(100) UNIQUE,
    subject VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Support Messages
CREATE TABLE IF NOT EXISTS portal_ticket_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES portal_tickets(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    message_body TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Client Deliverables & Documents
CREATE TABLE IF NOT EXISTS portal_documents (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES portal_projects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) DEFAULT 'REPORT',
    file_url TEXT NOT NULL,
    file_size VARCHAR(100),
    version VARCHAR(50) DEFAULT 'v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Direct Client Messages
CREATE TABLE IF NOT EXISTS portal_direct_messages (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message_body TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    priority VARCHAR(50) DEFAULT 'NORMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Portal Audit Trail
CREATE TABLE IF NOT EXISTS portal_audit_logs (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Default Demo Data
INSERT INTO organizations (legal_name, brand_name, primary_email, phone, website, verification_status)
VALUES ('Acme Enterprises Inc', 'Acme Global', 'client@acme.com', '+1 (555) 234-5678', 'https://acme.com', 'VERIFIED')
ON CONFLICT (primary_email) DO NOTHING;

INSERT INTO portal_users (organization_id, email, password_hash, full_name, phone, role)
SELECT id, 'client@acme.com', 'client123', 'John Doe', '+1 (555) 234-5678', 'CLIENT'
FROM organizations WHERE primary_email = 'client@acme.com'
ON CONFLICT (email) DO NOTHING;
