Website Information Architecture, User Flows & Brand Kit
B2B SaaS and digital technology company · Working draft v1 · 9 October 2026
0. Scope and conventions
This document is the foundation layer of the website: what exists, where it lives, how each audience moves through it, and how it looks and sounds. Wireframes, final copy and the build all derive from it.
• Part 1 (sections 1–4): strategy, sitemap, navigation, user flows.
• Part 2: page-by-page blueprints (every page, in section order).
• Part 3: brand kit.
• Part 4: technical phasing, SEO map, open questions and checklist.
Conventions
• [SUPPLY: …] marks a fact only the business can provide (company name, prices, team, contact details, policies). Nothing here invents these.
• Phase tags: L = launch (CMS-driven, no new backend), L+ = fast follow once content exists, F = future (needs authentication, database or payments).
• Truthfulness rule: no invented customers, testimonials, statistics, screenshots of live software, certifications or prices. Product visuals are labelled ‘Illustrative interface’ until real screens exist.
• [DECISION] marks a business rule that changes the design and must be settled by the founders.
1. Strategy
1.1 Positioning in one line
A practical technology partner: industry-specific software, custom builds and growth services, backed by a reviewed network of product creators and sales partners.
1.2 Four doors, one story
The company has three business areas plus a content engine. Each becomes a clearly separated ‘door’ so visitors never confuse what is for sale, what is a service, and what is a partnership.
Door
Business area
Visitor question
Primary destination
Buy
SaaS products (own and partner)
‘Is there software for my kind of business?’
/products
Build and grow
Technology and digital services
‘Can you build or run this for me?’
/services
Join
Partner ecosystem
‘Can I list or sell software here?’
/partners
Learn
Insights and resources
‘Can I trust their thinking?’
/insights, /resources
Every page follows the same arc: understand the problem → discover the right solution → see how it works → build confidence → take action. Confidence comes from transparent scope, terms and process, not from invented proof.
1.3 Audiences
Audience
Goal
Typical entry
Primary CTA
Business owner or decision-maker
Fix a business problem in their industry
Home, industry page, search
Book a Consultation
Software buyer or operations manager
Shortlist and evaluate software
/products, product page via search
Book a Demo / Request Pricing
Marketing or growth lead
Improve lead generation and tracking
Service pages, blog
Request a Proposal
Tech Partner (developer, SaaS founder)
List a product and reach customers
/partners/tech-partner
Apply as a Tech Partner
Sales Partner (consultant, agency)
Represent products and earn commissions
/partners/sales-partner
Apply as a Sales Partner
Researcher or learner
Answer a question, compare options
Blog, guide, case study
Read related product or service
1.4 Offer taxonomy and ownership labelling (critical)
The site must never imply that every listed product is built by the company. Every product card, product page, comparison row and search result carries two labels, always visible and never colour-only.
Label 1: Provider
• Company Product: built, owned and supported by the company.
• Partner Product: built and supported by an independent Tech Partner, listed after review.
• Custom Solution: built to a client’s specification as a project.
Label 2: Commercial model
• One-Time Purchase (licence or implementation fee; support and maintenance terms disclosed separately).
• Monthly Subscription.
• Annual Subscription.
• Custom Pricing / Request a Quote.
Partner Product disclosure line (on cards and the top of every partner product page):
Built and supported by [Partner name]. Listed on [Company] after review. Contract, support and data handling are covered by the partner’s terms and the listing agreement.
[DECISION] What exactly does ‘reviewed’ cover (identity, ownership evidence, technical check, support readiness)? The disclosure must say only what the review actually verifies.
Service vs product disambiguation. Two topics exist as both software and a managed service. Each pair cross-links with a short ‘Which do I need?’ block.
Topic
Software (product)
Managed service
Social media
/products/social-media-management (tool you operate)
/services/social-media-management (team that runs it for you)
WhatsApp
/products/whatsapp-crm (CRM and inbox tool)
/services/whatsapp-automation (setup, workflows, integration)
2. Sitemap
Primary navigation is fixed at eight items. Industries are not a ninth nav item; they live inside the Products and Services mega menus and on the home page, with an /industries hub reachable from both.
/                                         Home                              L

/products                                 Product catalogue                 L
  /products/real-estate-crm               Company/Partner [SUPPLY]          L
  /products/hospital-management                                             L
  /products/school-management                                               L
  /products/hotel-management                                                L
  /products/hostel-pg-management                                            L
  /products/social-media-management                                         L
  /products/whatsapp-crm                                                    L
  /products/[slug]                        Template for further products     L
  /products/compare                       Side-by-side (max 3)              L+

/services                                 Services overview + finder        L
  /services/custom-software-development                                     L
  /services/digital-marketing                                               L
  /services/performance-marketing                                           L
  /services/social-media-management                                         L
  /services/whatsapp-automation                                             L
  /services/ai-automation                                                   L
  /services/crm-integration                                                 L
  /services/technology-consulting                                           L

/industries                               Industry hub                      L
  /industries/real-estate                                                   L
  /industries/healthcare                                                    L
  /industries/education                                                     L
  /industries/hospitality                                                   L
  /industries/hostels-pg                                                    L
  /industries/digital-marketing                                             L

/partners                                 Ecosystem overview                L
  /partners/tech-partner                                                    L
    /partners/tech-partner/apply          Multi-step application            L
  /partners/sales-partner                                                   L
    /partners/sales-partner/apply         Multi-step application            L
  /partners/faq                           Combined partner FAQ              L+

/insights                                 Case studies, analysis            L
  /insights/[slug]                        Insight / case study template     L+
  /insights/category/[slug]               Only when 5+ items exist          L+

/resources                                Educational library               L
  /resources/blogs                        Blog listing                      L
    /resources/blogs/[slug]               Article template                  L
  /resources/guides                       Guides and checklists             L+
  /resources/tutorials                    Product tutorials                 F

/about                                    Story, mission, team, ecosystem   L
  /about/careers                          Only if hiring                    F

/contact                                  Enquiry hub (intent-aware)        L
  /contact/thank-you                      Confirmation (noindex)            L

/legal/privacy  /legal/terms  /legal/cookies  /legal/partner-terms           L

/portal/login                             Partner portal (noindex)          F
  /portal/tech                            Tech Partner dashboard            F
  /portal/sales                           Sales Partner dashboard           F

System: /404, /sitemap.xml, /robots.txt, /search (site search results)     L
Notes on the structure
• Book a Consultation is not a separate page. It routes to /contact?intent=consultation, which pre-selects the pathway and keeps one canonical contact URL. Product and service pages pass context, for example ?intent=demo&product=hospital-management.
• Industry pages are intent pages, not keyword pages. Each must carry unique content (workflows, journeys, FAQs). If an industry has no offering yet, it is not published.
• Insights vs blog: Insights hold evidence-backed material (case studies, analysis). Resources hold teaching material. If no real case study exists, Insights opens with clearly labelled illustrative scenarios and says so.
• Dashboards (F) are separate from the marketing site: different layout, authenticated, noindex.
Page count at launch: about 32 unique pages plus templates for additional products, articles and insights.
3. Global navigation and footer
3.1 Header (desktop)
Logo | Products ▾ | Services ▾ | Partners | Insights | Resources | About | Contact || Explore Products (text link) | Book a Consultation (primary button)
• Sticky header, 72px, no layout shift on scroll. A subtle bottom border appears after scroll; no heavy shadow.
• Between 1024 and 1279px the ‘Explore Products’ link is hidden to protect spacing; it remains in the hero and mega menu.
• Current section is marked with an underline and aria-current. The same header appears on every page, including legal pages.
• A ‘Skip to main content’ link is the first focusable element.
3.2 Products mega menu
Layout (3 columns):
1. By industry: Real Estate CRM, Hospital Management, School Management, Hotel Management, Hostel and PG Management, Social Media Management, WhatsApp CRM, Browse all products.
2. By provider and model: Company Products, Partner Products, Custom Solutions; One-time purchase, Subscription, Request pricing.
3. Preview panel: shows a concise Before / After comparison for the focused industry (two or three lines each), with a link to the industry page and the product page.
3.3 Services mega menu
1. Build: Custom Software Development, AI and Workflow Automation, CRM Setup and Integration, Technology Consulting.
2. Grow: Digital Marketing, Performance Marketing, Social Media Management.
3. Communicate: WhatsApp CRM and Automation.
4. Side panel: ‘Not sure what you need?’ with a link to the service finder on /services and a Book a Consultation button. The panel also links to the six industry pages.
3.4 Mega menu behaviour specification
Interaction
Behaviour
Mouse hover
Opens after 120ms hover intent; closes after 300ms grace so diagonal mouse travel does not dismiss it
Click or tap on trigger
Toggles open or closed (the trigger is a button; it does not navigate)
Keyboard
Enter or Space toggles; Tab moves through links; Esc closes and returns focus to the trigger; arrow keys move between links in a column
Before / After preview
Updates on hover and on focus; the same text is present in the DOM for screen readers; clicking a row goes to the industry page
Semantics
Disclosure pattern (button aria-expanded aria-controls), not role=menu
Motion
150ms fade and 4px translate; none under prefers-reduced-motion
Principle: hover is an enhancement, never the only route to any content.
3.5 Mobile navigation
• Hamburger opens a full-height sheet with focus contained; Esc or the close button dismisses it.
• Products and Services are tap-to-expand accordions. Inside, each industry row expands to show the Before / After text and two links (industry page, product page).
• The primary CTA is pinned at the bottom of the sheet. On long pages a slim sticky bar shows ‘Book a Consultation’ after the first scroll, hidden while a form is focused.
• Touch targets are at least 44×44px.
3.6 Footer
Five columns on desktop, stacked accordions on mobile.
Column
Contents
Company
One-paragraph overview, About, Careers (if live), Contact
Products
The seven launch products, Browse all, Compare
Services
The eight service pages
Ecosystem
Partner Program, Tech Partner, Sales Partner, Partner Terms, Partner FAQ
Learn
Insights, Case Studies, Blog, Guides, Industries
Bottom bar: Privacy Policy, Terms of Service, Cookie Policy, Partner Terms, Support information [SUPPLY: support channel and hours], social links [SUPPLY: real profiles only], copyright and registered entity name [SUPPLY].
Newsletter form appears only if the business will actually send updates and has a consent and unsubscribe process.
3.7 Modules reused on most pages
• Breadcrumbs on every page below the first level, with BreadcrumbList structured data.
• Related products and services block (data-driven from tags).
• Final CTA band with page-specific wording and a prefilled contact link.
• Ownership badge on every product reference.
• Cookie and consent banner (only for categories actually used).
4. User flows
Each flow lists entry points, steps, decision points, states and mobile behaviour. Every flow ends in a confirmation the user can see and an email confirmation.
4.1 Flow A: Business customer (industry-led)
Entry points: home hero, industry cards, mega menu, search landing on an industry or product page, paid campaign landing.
Path: Home → select industry card (Before / After preview) → industry page (challenges, traditional vs digital workflow) → recommended product or service → features, process and pricing model → Book Demo or Request Consultation → /contact?intent=… (prefilled) → submit → /contact/thank-you → confirmation email → follow-up.
Decision points
• Product fits → product page. Product does not fit → custom software or consulting page. Unsure → consultation.
• Pricing confirmed → show plans. Pricing not confirmed → ‘Request pricing’ (never a placeholder number).
States
State
Design
Inline validation
On blur, plain-language messages tied to the field with aria-describedby; summary at top on submit
Submitting
Button shows progress, is disabled, and the form is not cleared
Success
Thank-you page: reference number, what happens next, expected response time [SUPPLY: SLA], links to a relevant guide
Server error
Message with retry; entered data preserved; direct email fallback [SUPPLY]
Spam or rate limit
Neutral message, no hint about the detection method
Duplicate submit
Idempotency token prevents double records
Mobile: sticky CTA, single-column form, correct input types (email, tel), Before / After as tap-to-toggle tabs.
4.2 Flow B: Product buyer (catalogue-led)
Path: Products → search or filter (industry, provider, pricing model) → product card → product detail → compare plans or request pricing → demo (launch) or checkout (only when implemented) → onboarding information.
Decision points
• Checkout is hidden unless pricing, licensing, tax, invoicing and fulfilment are all live. At launch the end action is Book a Demo or Request Pricing.
• Partner Product enquiries: who receives and owns the lead (company, tech partner, or an assigned sales partner)? [DECISION] The answer must be stated on the form (‘Your enquiry will be shared with …’).
• Compare tray: up to 3 products, persists while browsing, collapses to a bottom sheet on mobile.
States
• Zero results: show active filters as removable chips, a ‘Clear all’ action and a ‘Tell us what you need’ link.
• Loading: skeleton cards, no layout jump.
• Pricing unavailable: ‘Pricing on request’ with the commercial model still shown.
• Compare limit reached: inline message, not a modal.
Mobile: filters open as a bottom sheet with an applied-count badge; compare shows a stacked attribute view rather than a wide table.
4.3 Flow C: Tech Partner
Path: Partners → Tech Partner page → benefits, requirements, listing process, responsibilities → Apply → account and identity verification → product submission (details, ownership evidence, pricing, documentation, support) → technical and quality review → agreement → approved listing → manage product.
Application status model
Draft → Submitted → Verification → Changes requested → Technical review → Agreement sent → Approved → Published with side states Rejected (with reason), On hold and Suspended.
Phasing
• L: the apply page collects a structured application and sends it to an internal review queue by email; review is manual; status updates are emailed.
• F: the portal adds saved drafts, document upload, status tracking, enquiries and reports.
States: save and resume later; file type and size errors with the accepted formats; ownership evidence missing (clear checklist); rejection explains the reason and the reapplication path; withdrawal is available at every stage.
Mobile: the application is a stepped form with a progress indicator; each step saves; uploads work from the phone camera or files.
4.4 Flow D: Sales Partner
Path: Partners → Sales Partner page → commission model (with the illustrative calculator) → eligibility → Apply → verification → review approved products and terms → select products → training → register opportunities → track sales and active subscriptions → receive eligible commissions per the agreement.
Status model: Applied → Verification → Approved → Product authorisation (per product) → Training complete → Active.
Rules that shape the interface
• Commissions relate only to genuine product sales and active subscriptions. The site shows no recruitment-based or downline earnings. If a team feature is built, it is described as sales team management with its own explicit terms.
• Opportunity registration needs a conflict rule: for example, first registration wins for a defined validity window. [DECISION]
• The calculator is labelled ‘Illustration only, not an earnings promise’, shows its assumptions and lists the conditions (collected payments, cancellations, refunds, product-specific rules, deductions).
• Real commission figures are computed server-side from an auditable ledger, never from client-submitted values.
States: product not yet authorised (locked state with how to unlock); lead already registered by another partner (neutral message); commission pending, approved, paid, adjusted (with reason); payout on hold (what is needed to release it).
4.5 Flow E: Content discovery
Path: Resources or Insights → browse categories or search → open article or case study → contextual product or service link → contact with source recorded.
• Each article ends with one relevant CTA, plus a ‘Related’ block driven by tags and a product or service mapping.
• The enquiry captures the originating page as a hidden field, shown to the user in the privacy notice.
• Empty search: suggestions of popular topics and a link to ask the team.
• Mobile: table of contents collapses to a ‘On this page’ dropdown; the CTA appears after the second section and at the end, not as a pop-up.
4.6 Shared rules for every form and flow
Rule
Specification
Labels
Visible labels above fields; placeholders never replace labels
Required fields
Marked in text, not colour alone
Consent
Unticked checkbox with a link to the Privacy Policy; no pre-ticked marketing consent
Spam protection
Honeypot field, server-side rate limiting and a privacy-respecting challenge
Confirmation
Always on-page plus email
Analytics events
cta_click, form_start, form_submit, filter_apply, compare_add, calculator_use; no personal data in event payloads
Failure
Data is never lost on error; there is always a human fallback contact [SUPPLY]
5. Page blueprints: core commercial pages
Every blueprint lists purpose, primary CTA, section order, key components and what the business must supply. Copy direction is included where it is already decided; final long-form copy is written per page at the wireframe stage.
5.1 Home /
Purpose: orient a first-time visitor in ten seconds and route them to the right door (buy, build and grow, join, learn).
H1: Technology That Moves Your Business Forward.
Primary CTA: Explore Our Solutions. Secondary: Talk to Our Team. The header CTA stays Book a Consultation.
SEO: title ‘[Company] | Industry Software, Custom Development and Digital Growth’; target themes: industry-specific business software, custom software development, digital marketing services.
#
Section
Content and component
Rules
1
Hero
H1, supporting copy, two CTAs. One coherent product composition: a CRM-style pipeline view with a small connected-workflow strip beneath it (Lead → Follow-up → Booking → Report)
Labelled ‘Illustrative interface’. One composition only, no floating cards
2
Business challenges
Seven challenges in a two-column list, each with one sentence on the cost of leaving it unsolved: fragmented systems, manual operations, poor visibility, unorganised leads and follow-ups, rising acquisition costs, difficulty choosing software, limited technical resources. Closing line positions the company as a practical partner
No statistics unless sourced
3
Solutions by industry
Six cards (see table below). Hover or focus reveals a two-line Before / After; tap toggles on mobile
Every card links to its industry page
4
Products and platforms
Three groups: One-Time Purchase, Subscription, Custom-Built. Product cards use the standard anatomy (section 5.2)
Show only products that exist; unconfirmed prices read ‘Pricing on request’
5
Services
Eight tiles in Build / Grow / Communicate groups, each with an outcome line
Link to the matching service page
6
Before and after
Tabs for Real Estate, Education, Hospitality, Digital Marketing (Hostels and Healthcare optional). Before and After shown side by side on desktop, stacked with a toggle on mobile
Both states are always in the DOM; no numeric claims; footnote says outcomes depend on implementation
7
How we work
Eight-step timeline (Discover, Analyse, Strategise, Design, Develop, Test and Validate, Launch, Support and Improve). Each step: one sentence, ‘You provide’ and ‘We deliver’
Horizontal on desktop, vertical on mobile
8
Why choose us
Eight differentiators in a 2×4 grid, each linking to the page that demonstrates it
No superlatives, no ‘guaranteed’
9
Partner ecosystem
Two panels: Tech Partner, Sales Partner, plus a one-line flow diagram
CTA to each partner page
10
Insights and resources
Three latest insights and three latest resources from the CMS
Hide the section if nothing is published
11
Final CTA
‘Let’s Build a Better Way to Run Your Business.’ → Discuss Your Requirements
Links to /contact?intent=consultation
12
Footer
As specified in section 3.6

Industry card content
Industry
Challenge line
Solution line
Links
CTA
Real Estate
Leads sit across calls, sheets and chat apps
One CRM for leads, follow-ups and pipeline
Real Estate CRM, WhatsApp CRM, Performance Marketing
See the real estate workflow
Healthcare and Hospitals
Patient, billing and department data live in separate places
Hospital management software connecting front desk to billing [SUPPLY: confirmed modules]
Hospital Management, CRM Integration
Explore healthcare solutions
Education and Schools
Student records, fees and parent updates handled by hand
Centralised student, fee and communication management
School Management, WhatsApp Automation
Explore education solutions
Hotels and Hospitality
Bookings and guest details scattered across tools
Booking, guest and team coordination in one system
Hotel Management, Social Media Management
Explore hospitality solutions
Hostels and PG
Rent, occupancy and tenant records kept on paper or sheets
Occupancy, rent and tenant management with reminders
Hostel and PG Management, WhatsApp CRM
Explore property solutions
Marketing and Digital Businesses
Campaign results are hard to connect to actual leads
Structured tracking, reporting and campaign workflows
Digital Marketing, Performance Marketing, AI Automation
Explore growth solutions
5.2 Products catalogue /products
Purpose: a discovery catalogue that makes ownership and commercial model unmistakable.
H1: Business Software for Your Industry.
Primary CTA: View Product. Secondary: Book a Demo, Tell Us What You Need.
Section order
1. Introduction and label legend: two sentences on the ecosystem, then a legend explaining Company Product, Partner Product and Custom Solution.
2. Search and filters: search box; filters for Industry (Real Estate, Healthcare, Education, Hospitality, Property Management, Marketing), Pricing model (One-Time Purchase, Monthly Subscription, Annual Subscription, Custom Pricing) and Product type (Company, Partner, Custom).
3. Results grid with result count and sort (Relevance, A–Z).
4. Compare tray (L+): select up to three; compares industry, provider, model, key capabilities, ideal customer, onboarding, support terms.
5. Not finding it? Custom Solutions band linking to /services/custom-software-development.
6. List your own product: a compact Tech Partner invitation.
7. FAQ: how to read the labels, what ‘reviewed’ means, who supports partner products, how demos work, whether data is portable.
Product card anatomy (used site-wide)
Element
Rule
Provider badge
Company Product, Partner Product or Custom Solution; icon plus text
Model badge
One-Time, Monthly, Annual or Pricing on request
Name and industry
Name as H3; industry as a small label
Description
One or two lines
Key capabilities
Three, from confirmed features only
Ideal customer
One line
Provider line
‘Built and supported by …’
Pricing
A confirmed figure, or ‘Pricing on request’; one-time products show ‘Support and maintenance terms apply separately’
CTA
View Product; Compare checkbox
Behaviour: filters live in the query string (?industry=education&model=subscription) so views can be shared; filtered URLs are noindex and canonical to /products. No payment button appears on any card.
5.3 Product detail template /products/[slug]
Purpose: let a buyer decide whether to book a demo. Primary CTA: Book a Demo (or Request a Quote). Desktop shows a sticky sub-navigation (Overview, Features, How it works, Pricing, FAQ); mobile shows a ‘Jump to’ control.
#
Section
Required content
Rule
1
Product hero
Name, one-line value, provider and model badges, product visual, CTAs
Visual marked ‘Illustrative interface’ until real screens exist
2
Target audience
Ideal customer profile and size; who it is not for

3
Problems addressed
Three to five real operating problems

4
Key features
Grouped modules, each with a plain-language outcome
Confirmed features only
5
Interface previews
Three or four screen concepts of the product category
Never present a mockup as a live product
6
Before and after workflow
Product-specific comparison
No numeric claims
7
Use cases
Three scenarios by customer type
Labelled illustrative until real
8
How it works
Setup to daily use in four to six steps

9
Integrations
Only supported integrations
Section omitted if none
10
Security and data handling
Only verified measures: hosting, access control, backups, data ownership and export
No certification claims without evidence
11
Pricing
Plan table, or an enquiry block
Show model, billing cycle, what is excluded, support and maintenance terms
12
Onboarding and support
Implementation steps, training, support channels and hours [SUPPLY]

13
FAQ
Six to eight real questions
FAQPage data only for visible content
14
Related products
Same-industry and adjacent items
Ownership badge on each
15
Final CTA
Book a Demo / Request a Quote
Prefills product and industry
Partner Product pages add a disclosure banner above the hero, the partner’s profile and support contact, and a statement of who handles billing and data.
Product-specific requirements
Product
Primary buyer
Workflows the page must show
Extra requirements
Real Estate CRM
Brokers, developers, agencies
Lead capture, qualification, follow-up, site visit, booking, agent performance
Consent for outreach; supported lead sources [SUPPLY]
Hospital Management
Clinics and hospitals
Registration, appointments, billing, records, department coordination
Dedicated privacy and security block (see 5.6); no compliance claims without proof
School Management
Schools and coaching institutes
Admissions, student records, fees, attendance, parent communication
Note on handling children’s data
Hotel Management
Hotels, guesthouses
Reservations, guest records, housekeeping and department coordination, reporting
List booking-channel integrations only if supported
Hostel and PG Management
Owners and operators
Occupancy, tenant onboarding, rent and dues, maintenance requests
Reminder channels disclosed with consent rules
Social Media Management (software)
Agencies, marketing teams
Planning, scheduling, approvals, reporting
Supported platforms [SUPPLY]; platform API limits disclosed
WhatsApp CRM
Sales and support teams
Shared inbox, lead stages, reminders, message templates
Disclose WhatsApp Business Platform rules: opt-in, template approval, messaging charges, account limits
5.4 Services overview /services
Purpose: explain the portfolio, help visitors choose, and route to a service page. H1: Services That Build, Connect and Grow Your Business. Primary CTA: Book a Consultation.
1. Introduction: the three jobs services do (build, grow, connect).
2. Service finder: three questions (What do you need most? Do you already use software? What is your timeline?) returning one to three recommended services; falls back to ‘Talk to our team’.
3. Service groups: Build (custom software, AI automation, CRM integration, consulting), Grow (digital marketing, performance marketing, social media), Communicate (WhatsApp). Each card has an outcome line.
4. Expandable explainers (accordion): for each service, five short answers: what it is, why it matters now, who needs it, what you receive, how success is measured.
5. Comparison table: service, best for, typical output, how progress is measured, engagement model.
6. How we deliver: the eight-step process, condensed.
7. Engagement models: fixed-scope project, monthly retainer, subscription, advisory [SUPPLY: which are offered].
8. Software or service? the product / service disambiguation for social media and WhatsApp.
9. FAQ and final CTA.
5.5 Service detail template /services/[slug]
Sections: 1 Hero (outcome-led H1, CTA). 2 Problem it addresses. 3 Who needs it, and who does not. 4 What is included. 5 How we deliver (service-specific stages). 6 What you provide. 7 What you receive. 8 How success is measured (metrics, never guaranteed outcomes). 9 Engagement and pricing model. 10 Related industries and products. 11 FAQ. 12 Final CTA with prefilled intent.
Service page
Primary keyword theme
Page-specific requirements
Custom Software Development
custom software development
Decision aid: custom build vs off-the-shelf; path from requirements to deployment and maintenance; code and IP ownership terms [SUPPLY]; technology stack [SUPPLY]
Digital Marketing
digital marketing services for businesses
Side-by-side: inconsistent activity vs structured strategy; scope across visibility, content, audience, lead capture and conversion measurement
Performance Marketing
performance marketing services
Planning, execution, conversion tracking, budget optimisation, reporting; ad spend billed separately from fees; states plainly that campaigns are managed measurably but results are not guaranteed; sample report labelled illustrative
Social Media Management
social media management services
Content planning, creative, publishing workflow, community management, reporting; link to the software product
WhatsApp CRM and Automation
WhatsApp CRM, WhatsApp automation
Lead management, conversation workflows, follow-up reminders; mandatory disclosure of consent, template approval, platform policy and messaging limits
AI and Workflow Automation
business process automation, AI automation
Which rules-based workflows suit automation; where human approval stays; data-handling approach; where AI is not appropriate
CRM Setup and Integration
CRM implementation and integration
Supported systems [SUPPLY]; data mapping and migration; testing; ownership of integrations after handover
Technology Consulting
SaaS and technology consulting
Audit, roadmap, vendor selection; deliverables; whether discovery is a paid phase [DECISION]
5.6 Industries: hub and template
Hub /industries
• H1: Solutions by Industry.
• Six cards (as in 5.1), an ‘Industry not listed?’ band leading to custom software and consulting, and a short note on how industries map to products.
Industry page template /industries/[slug]
#
Section
Content
1
Hero
Problem-led H1, CTA, one relevant interface visual
2
Current challenges
Four to six real industry problems
3
Traditional workflow
A simple flow with the breakpoints marked
4
Consequences
What disconnected or manual work costs, in plain terms
5
Proposed digital workflow
The same flow, connected
6
Before and after
Interactive comparison (all text always available)
7
Products and services
Relevant items with ownership labels
8
Example user journey
A day-in-the-life scenario, labelled illustrative
9
Potential operational benefits
Phrased as ‘can help’, never as promised results
10
Implementation approach
Industry-specific timeline and what the customer provides
11
Suitable customer profiles
Good fit, and not yet a fit
12
FAQ
Real questions
13
CTA
Prefilled with industry
Industry-specific content
Industry
Traditional workflow breaks
Digital workflow stages
Compliance and trust note
Primary keyword
Real Estate
Leads in calls, sheets and chats; follow-ups depend on individuals; no pipeline view
Capture → Qualify → Follow up → Site visit → Negotiation → Booking → Report
Consent for outreach; messaging platform rules
real estate CRM software
Healthcare
Separate registration, billing and records; manual coordination between departments
Registration → Appointment → Consultation → Orders → Billing → Follow-up [SUPPLY: confirmed modules]
Patient-data privacy, access control, audit trails; mention applicable data-protection law (for example India’s DPDP Act, 2023) as a consideration, have counsel review, and claim no certification unless verified
hospital management software
Education
Disconnected student records, manual fee tracking, inconsistent parent communication
Admission → Enrolment → Fees → Attendance → Communication → Reports
Children’s data needs extra care and consent handling
school management system
Hospitality
Fragmented bookings and guest records; manual coordination
Reservation → Check-in → Service coordination → Check-out → Reporting
Guest ID and payment data handling
hotel management software
Hostels and PG
Rent, occupancy and tenant records on paper or sheets
Enquiry → Onboarding → Rent and dues → Maintenance requests → Move-out
Tenant ID documents; reminder consent
hostel and PG management software
Digital Marketing
Unclear campaign performance, disconnected analytics, leads not attributed
Plan → Execute → Track → Attribute → Optimise → Report
Ad platform policies; tracking consent
performance marketing services
Before and After component specification
• Desktop: two panels, labelled Before and After, with a connected item pairing (each Before line aligns with its After line).
• Mobile: a two-button toggle; the active state is announced with aria-pressed.
• Mega menu and industry cards reuse the same data, so wording is written once in the CMS.
• Under prefers-reduced-motion, the transition becomes an instant swap.
• Only improvements the actual solution supports appear. No revenue, conversion or time-saving figures unless backed by verified evidence.
6. Page blueprints: partners, content and company pages
6.1 Partners overview /partners
Purpose: explain the ecosystem honestly and send each visitor down the right pathway.
H1: Build, Sell, and Grow With Our Technology Ecosystem.
Supporting copy: Connect software creators with business opportunities and help organisations discover practical digital solutions.
Primary CTAs: Become a Tech Partner, Become a Sales Partner.
1. Hero with the two pathway buttons.
2. Ecosystem flow (drawn as a diagram): Tech Partner → Product Review → Approved Listing → Sales Partner or Direct Customer Discovery → Customer Onboarding → Ongoing Product Usage. Horizontal on desktop, vertical on mobile, each node expandable for one sentence of detail.
3. Governing statement: approval, listing, customer acquisition, support and commissions are governed by the applicable partner agreements.
4. Who does what (table): the Company, Tech Partner, Sales Partner and Customer, with rows for product ownership, support, billing, customer data and commissions. [DECISION] Every cell must be settled before this table is published.
5. Two pathway cards: Tech Partner and Sales Partner, each with who it is for, what you do, what you get, and a CTA.
6. Program principles: commissions relate only to genuine product sales and active subscriptions; no earnings from recruitment or downlines; products are reviewed before listing; no income is guaranteed.
7. FAQ: eligibility, review time [SUPPLY], fees [SUPPLY], who owns customer relationships, how disputes are handled.
8. Final CTA: apply, or book a call about the program.
6.2 Tech Partner /partners/tech-partner
Audience: independent developers, SaaS founders, software companies, product owners.
H1: Your Product. More Business Opportunities.
Primary CTA: Apply as a Tech Partner.
#
Section
Content
1
Hero
H1, supporting copy (‘Bring your software to a wider business audience through a structured product ecosystem…’), CTA, link to requirements
2
Benefits
The nine benefits from the brief, written without any sales guarantee: structured listing, additional discovery channel, connection to eligible sales partners, category visibility, standardised presentation, access to customer enquiries, defined commercial terms, clear review process, potential technical collaboration
3
Who should apply
Eligibility: product owner or authorised seller, working product, support capability, willingness to be reviewed; who is not a fit
4
Listing process
Eight-step timeline: create account, verification, product and ownership evidence, pricing and documentation, technical and quality review, agree terms, publish, manage enquiries. Each step shows what you submit and what we check; typical duration [SUPPLY]
5
What we review
A published checklist: ownership, identity, product stability, security basics, documentation, support readiness, accurate claims
6
Commercial terms summary
Listing fees, revenue share or commission structure, payment flow, term and exit [SUPPLY], with a link to the full Partner Terms
7
Responsibilities
Accurate product description, licensing, security, customer data, support and maintenance obligations stay with the partner
8
Dashboard concept
Ten screens: product portfolio, listing status, customer enquiries, sales partner requests, subscription and revenue reports, commission and payout reports, support requests, product updates, account verification, commercial agreements. Labelled Concept (future portal) until built; reports shown only if supported
9
FAQ
Review criteria, rejection reasons, who owns customers, exiting the program
10
Final CTA
Apply as a Tech Partner
Application /partners/tech-partner/apply is a stepped form with save and resume: 1 Account and contact; 2 Business and identity verification; 3 Product basics; 4 Ownership evidence; 5 Pricing and model; 6 Features and documentation; 7 Support and data handling; 8 Declarations and consent; Review and submit. The confirmation page lists the next steps and the expected review timeline [SUPPLY].
6.3 Sales Partner /partners/sales-partner
Audience: sales professionals, consultants, agencies, business development specialists.
H1: Sell Business Software. Build Long-Term Client Relationships.
Primary CTA: Apply as a Sales Partner.
#
Section
Content
1
Hero
H1 and supporting copy; no income figures in the hero
2
Benefits
Access to approved products, multiple products, training and sales material where available, lead and customer tracking, transparent commission rules, recurring commission on eligible active subscriptions, a dashboard, opportunity to build a professional sales operation under program rules
3
Who should apply
Eligibility and verification requirements; responsibilities and conduct rules
4
How it works
Ten-step process from the brief, shown as a numbered timeline
5
Commission model
One-time sale commission vs recurring subscription commission, defined in plain terms, with the conditions that affect eligibility and payout
6
Commission calculator
See specification below
7
Products you can represent
Approved products by industry with ownership labels; locked until authorised
8
Dashboard concept
Ten screens: product catalogue, training, customer pipeline, registered leads, sales performance, active subscriptions, commission statements, payout history, territory or authorisation details, support and account settings
9
Conduct and compliance
No misleading claims, consent for outreach, no income promises, termination and clawback rules [SUPPLY]
10
Team features
Only if built, described as sales team management on explicit, lawful terms; commissions come from genuine product sales
11
FAQ and final CTA
Apply as a Sales Partner
Commission calculator specification
Item
Specification
Inputs
Number of eligible active subscriptions; monthly subscription value per customer (₹); commission per eligible subscription per month (₹)
Outputs
Gross monthly commission; gross annual commission; total monthly subscription value managed
Default example
20 subscriptions × ₹500 = ₹10,000 gross per month before deductions or adjustments
Label
Visible heading ‘Illustration only. This is not an earnings promise.’
Assumptions panel
States the formula and that actual commission depends on signed terms, collected payments, cancellations, refunds, product-specific rules and applicable deductions
Validation
Whole numbers, minimum 0, sensible maximum; inline messages; ₹ formatting in the Indian number system
Accessibility
Labelled inputs, results in a polite live region, keyboard usable, no colour-only meaning
Data
Runs in the browser for illustration only; nothing is stored; real commissions are computed on the server from the commission ledger, never from user-entered values
6.4 Insights /insights
Purpose: show how the company thinks, with evidence. This is distinct from the blog.
1. Hero: H1 ‘Insights for Businesses Modernising Their Operations’, search box.
2. Featured insight and featured case study.
3. Category filters: Case Studies, Industry Insights, Digital Transformation, SaaS Strategy, Product Implementation, Business Operations, Technology Trends, Performance Analysis.
4. Recent publications grid with pagination or load more.
5. Related products and services chosen by tag.
6. CTA: newsletter (only if operated) or contact.
Empty state before real case studies exist: the page opens with a short, honest note and shows illustrative scenarios, each labelled ‘Illustrative scenario, not a real client’. Fictional clients are never presented as real.
Case study template /insights/[slug]
1 Client or anonymised profile (with permission). 2 Industry and context. 3 Initial challenges. 4 Existing workflow. 5 Business objectives. 6 Proposed solution. 7 Implementation process. 8 Products and services used (with ownership labels). 9 Outcomes supported by verified evidence. 10 Lessons learned. 11 Related solutions. 12 CTA.
Publishing rule: a case study needs written client approval and a source for every outcome. Any figure must carry its measurement period and method.
6.5 Resources /resources, /resources/blogs and articles
Resources hub: H1 ‘Guides, Checklists and Articles for Business Technology’. Sections: featured resource; type filters (blog, guide, checklist, tutorial, industry explainer, software selection, marketing learning); search; latest items; product documentation link if it exists; contextual CTA.
Blog listing /resources/blogs: featured article; search; topic filters; cards with date, reading time, author and category; related categories; pagination (preferred for SEO) or load more with real links; empty and no-result states.
Article template /resources/blogs/[slug]
Element
Requirement
H1 and intro
Descriptive H1; introduction states the question answered
Structure
Logical H2 and H3; table of contents for long articles (sticky on desktop, collapsible on mobile)
Content
Original and useful; real examples; relevant visuals with alt text
Links
Contextual internal links to a product, a service and a related article
Trust
Author name, role and short bio; published and updated dates
End of page
Related articles; one relevant CTA
Metadata
Article structured data, canonical URL, Open Graph image
Content standards: each article targets one real business question, avoids keyword stuffing, cites sources where facts are used, and is reviewed by a subject specialist before publication.
6.6 About /about
H1: A Technology Company Built Around How Businesses Actually Work. [SUPPLY: confirm or refine once the real story is known]
1. Our story: why the company exists and the opportunity it sees [SUPPLY: real history, founding context].
2. Mission: help businesses adopt useful software, improve operations and access technology that supports their goals.
3. Vision: a connected ecosystem of reliable digital products, technology services, product creators and business partners.
4. What we do: a simple diagram showing how products, custom software, growth services and the partner ecosystem relate.
5. How we work: the eight-step process with a link to the services page.
6. Values: practical innovation, transparency, product quality, customer-focused thinking, accountability, continuous improvement, long-term collaboration, each with one sentence on how it shows up in work.
7. Team: real names, roles, photographs, short bios, relevant experience and LinkedIn links [SUPPLY]. If the team is not ready to be shown, replace with a capabilities section (engineering, design, marketing, delivery, support) with no individual profiles. Never invent people or credentials.
8. Our ecosystem: how the company works with clients, product creators, sales partners and technical specialists.
9. CTAs: business enquiry, partnerships, careers (only if hiring).
6.7 Contact /contact
H1: Tell Us What You’re Working On. Primary CTA: Send Enquiry.
Layout: form on the left (desktop), verified contact details and what-happens-next on the right; stacked on mobile with the form first.
Enquiry pathways (chosen first; the choice sets the fields and the routing, and can be preset by ?intent=): SaaS product demonstration, Custom software project, Digital marketing services, Tech Partner enquiry, Sales Partner enquiry, General business enquiry. Partner pathways link to the full application forms rather than duplicating them.
Fields: name; business email; company name; industry; product or service of interest; estimated budget (optional); project requirements; preferred contact method (only the channels actually supported); consent checkbox with privacy notice link.
States: field-level validation, submitting, success (reference number, next steps, response time [SUPPLY]), recoverable server error, rate-limit notice, offline notice.
Backend requirements: server-side validation, spam protection, delivery to a monitored inbox or CRM, auto-acknowledgement email, retention policy matching the privacy policy.
Right column: verified email, phone, address and hours [SUPPLY], social links [SUPPLY]. Nothing appears here until it is real.
6.8 Legal and system pages
Page
Purpose
Notes
/legal/privacy
Data collected, purposes, retention, rights, processors
Needs legal review [SUPPLY]
/legal/terms
Website and service terms
Needs legal review
/legal/cookies
Cookie categories actually in use, consent controls
Match the real cookie set
/legal/partner-terms
Listing, commission, payout, conduct, termination
Referenced from partner pages and applications
/404
Helpful not-found page
Search box, four doors, popular pages
/search
Site search results
Grouped by products, services, resources; empty state with contact link
/portal/* (F)
Partner dashboards
Authenticated, noindex, server-side authorisation, separate layout
7. Brand kit
The company name and logo are not yet defined, so this kit is name-neutral. Replace [Company] once the name is final. Everything below is designed to be implemented as design tokens and reusable components.
7.1 Brand platform
Element
Definition
Role
A practical technology partner for businesses that want better systems, better customer acquisition and a clearer view of their operations
Brand line
Technology that moves your business forward.
Promise
Clear scope, honest terms and working software
Personality
Precise (exact, organised), Practical (business-first, no hype), Transparent (says what is and is not included), Steady (long-term, dependable)
What the brand is not
Hype-driven, futuristic for its own sake, or a vendor that hides pricing and limits
7.2 Voice and tone
Principles
1. Lead with the business problem, then the solution, then how it works.
2. Be specific. Name the workflow, the role, the outcome.
3. State limits plainly. What is included, what is not, what depends on the customer.
4. Use plain business English. Short sentences, active voice, sentence-case headings.
5. Never promise results. Use ‘can help’, ‘is designed to’, ‘supports’.
Prefer
Avoid
‘Leads in one place’
‘Seamless, next-gen lead intelligence’
‘Pricing on request’
Hidden or vague pricing
‘Can help reduce manual follow-up’
‘Guaranteed 10× growth’
‘Built and supported by [Partner]’
Language that implies partner products are ours
‘Illustrative example’
Fictional clients presented as real
Words to avoid: guaranteed, best in India, No. 1, revolutionary, cutting-edge, game-changing, unlock, supercharge, effortless, one-stop solution.
Tone by context
Context
Tone
Example
Marketing pages
Confident, concrete
‘Keep every lead, call and follow-up in one pipeline.’
Product pages
Clear, operational
‘Record admissions, fees and attendance without re-entering data.’
Partner pages
Direct, balanced
‘Commissions depend on the signed agreement and collected payments.’
Forms and errors
Calm, helpful
‘Enter a work email, for example name@company.com.’
Empty states
Useful
‘No products match these filters. Clear a filter or tell us what you need.’
Legal
Plain, precise
Short sentences, defined terms
CTA vocabulary: Book a Consultation (global primary), Explore Products (global secondary), Book a Demo, Request Pricing, Request a Proposal, Apply as a Tech Partner, Apply as a Sales Partner, Discuss Your Requirements. Use one verb-led label per button; avoid ‘Submit’ and ‘Click here’.
7.3 Logo
Directions to design
• A. Wordmark: a lightly customised geometric sans, medium weight, tight spacing, one small accent detail in Signal Indigo.
• B. Monogram: the company initial inside a square with one notched corner, suggesting forward motion; used as favicon and avatar.
• C. Linked-squares mark: abstract nodes joined by a line, representing the ecosystem. Use only if the name suggests it.
Recommendation: A plus B as a combined lockup, with B alone for small sizes.
Rule
Specification
Clear space
One monogram width on every side
Minimum size
Monogram 24px; horizontal lockup 96px wide
Versions
Full colour on light, reversed on navy, single-colour charcoal, single-colour white
Favicon
Monogram on navy, tested at 16px and 32px
Misuse
No stretching, outlines, gradients, shadows, rotation, recolouring outside the set, or placing on low-contrast photos
7.4 Colour
A restrained system: neutrals carry most of the page, navy and charcoal give authority, and one indigo accent marks action. Approximate proportion: 70% neutral, 20% navy or charcoal, 10% accent. Contrast ratios are estimates; verify with a checker before sign-off.
Token
Hex
Use
Contrast note
navy-900
#0A1630
Hero and footer surfaces, headings on light
15:1+ with white
navy-800
#101F42
Secondary dark surfaces, dark cards

ink-900
#171B26
Body text on light
16:1 with white
ink-600
#4A5160
Secondary text
about 7.8:1 with white
ink-400
#7A8190
Large text, icons, disabled labels
about 4:1; never for body text
white
#FFFFFF
Page and card background

neutral-50
#F6F7F9
Alternate section background

neutral-100
#ECEEF2
Subtle surfaces, table stripes

neutral-200
#DCDFE6
Borders and dividers

accent-600
#4A4FE0
Signal Indigo: primary buttons, links, focus
about 6:1 with white
accent-700
#3A3EC4
Hover

accent-800
#2E31A3
Pressed

accent-50
#EEF0FD
Tints, selected rows

accent-300
#9AA0F5
Links and accents on navy
about 7:1 on navy-900
success-600
#0F7B55
Success text and icons
about 5:1 with white
warning-700
#9A5B00
Warning text on #FFF4DB

error-600
#C42B3A
Error text and borders
about 5.5:1 with white
Rules
• Accent never appears as small text on navy; use accent-300 there.
• One gradient is permitted: a subtle vertical navy-900 to navy-800 on hero and footer surfaces. No accent gradients, glows or glass effects.
• Meaning is never colour-only. Provider badges pair colour with an icon and text:
    ◦ Company Product: navy fill, white text, building icon.
    ◦ Partner Product: white fill, indigo border and text, link icon.
    ◦ Custom Solution: neutral fill, charcoal text, wrench icon.
• Model badges (One-Time, Monthly, Annual, Pricing on request) are neutral outlines so they never compete with provider badges.
7.5 Typography
Role
Font
Notes
Headings
Instrument Sans (600, 700)
Distinct, compact, professional
Body and UI
Inter (400, 500, 600)
Readable at small sizes, excellent numerals
Data and labels
IBM Plex Mono (500)
Reference numbers, status tags, calculator output, code
Load through next/font with subsets, font-display: swap, a metric-matched fallback stack and no more than three families.
Style
Desktop
Mobile
Weight
Display (home hero)
56 / 60
36 / 40
700
H1
48 / 52
32 / 38
700
H2
36 / 42
28 / 34
600
H3
24 / 32
22 / 30
600
H4
20 / 28
18 / 26
600
Body large
18 / 28
17 / 27
400
Body
16 / 26
16 / 26
400
Small
14 / 22
14 / 22
400
Label (uppercase, +0.06em)
12 / 16
12 / 16
600
Rules: sentence case for headings, maximum 68 characters per line for body text, left-aligned copy, one H1 per page, no all-caps headings, no text over busy images.
7.6 Layout, spacing and shape
• Grid: 12 columns, 1200px content width (1320px for wide product visuals), 24px gutters, 16px side margins on mobile and 24px on tablet.
• Breakpoints: 360, 640, 768, 1024, 1280, 1536.
• Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding 96 desktop, 56 mobile.
• Radius: 6 for inputs and buttons, 10 for cards, 14 for large panels, full only for badges.
• Borders: 1px neutral-200; sharp, precise edges over soft shadows.
• Elevation: two levels only. shadow-sm: 0 1px 2px rgba(10,22,48,.06) and shadow-md: 0 8px 24px rgba(10,22,48,.08) for menus, popovers and dialogs.
• Rhythm: alternate white and neutral-50 section backgrounds; use navy for one or two key moments per page, not every section.
7.7 Iconography
• One library (Lucide) at 1.5px stroke, 20px in UI and 24px in feature blocks, rounded joins, charcoal by default, indigo for active states.
• A small custom set of six industry icons, drawn on the same 24px grid and stroke.
• Icons accompany text and never carry meaning alone; decorative icons are hidden from screen readers.
7.8 Imagery and product visuals
Topic
Rule
Photography
Only real photography with permission, and only where it adds meaning (for example a real team or real client site). No stock handshakes, no generic office scenes
Product mockups
Built from a shared UI frame so all products feel like one family. Realistic structure: tables, pipelines, calendars, ledgers. Sample data is plausible but clearly sample, and uses ₹ and Indian-context names without real individuals
Labelling
‘Illustrative interface’ caption on every mockup until real screens exist. Never present a mockup as a live product
Dashboards
Show states a real user needs: filters, empty rows, a status, a date range
Diagrams
1.5px navy lines, indigo for the active path, labelled nodes, no decorative arrows; each diagram has a text equivalent
Illustration
Avoid generic AI-style illustration; use diagrams and product interfaces instead
Performance
AVIF or WebP, responsive sizes, explicit dimensions, lazy-load below the fold
7.9 Component library
Component
Variants and rules
Button
Primary (indigo fill), Secondary (navy outline), Tertiary (text with arrow). Heights 40 and 48. States: default, hover, focus-visible, active, disabled, loading. Primary is used once per view
Header and mega menu
Section 3; hover, click and keyboard behaviour as specified
Cards
Product, industry, service, insight, article, partner pathway. Whole card clickable via a single primary link; no nested interactive traps
Badges
Provider, model, status (Draft, Under review, Approved, Published), content type
Tabs and toggles
Roving tabindex, arrow-key navigation; used for Before / After and industry tabs
Accordion
One heading button per item; used for FAQs and service explainers
Timeline
Horizontal and vertical forms for How We Work and listing processes
Comparison table
Stacked cards on mobile; sticky first column on desktop
Filters
Chips, checkbox groups, bottom sheet on mobile, result count announced
Search
Input with clear button, suggestions, empty state
Form fields
Text, email, tel, select, textarea, checkbox, radio, file upload, stepper. Visible labels, helper text, inline error text with icon
Calculator
Labelled inputs, live results, assumptions panel
Product frame
Browser-style frame for mockups, with a caption slot
Feedback
Inline alert, toast (for non-critical confirmations), banner, skeleton, empty state, error page
Navigation aids
Breadcrumbs, pagination, table of contents, sticky sub-nav
Overlays
Dialog and bottom sheet with focus management; cookie banner
Interaction states for every interactive element: default, hover, focus-visible, active, disabled, loading, error, selected. Focus ring: 2px accent-600 with a 2px white offset (on navy, accent-300).
7.10 Motion
• Durations 120ms (feedback), 200ms (reveal), 320ms (layout). Easing cubic-bezier(0.2, 0, 0, 1).
• Purposes: confirm an action, orient the user, reveal related content. Nothing animates only to decorate.
• One scroll-reveal pattern (fade plus 8px rise, once). No parallax, no autoplay loops, no animated backgrounds.
• Under prefers-reduced-motion, transitions become instant swaps and reveals are removed.
7.11 Starter design tokens
:root {
  --navy-900: #0A1630;  --navy-800: #101F42;
  --ink-900: #171B26;   --ink-600: #4A5160;  --ink-400: #7A8190;
  --neutral-50: #F6F7F9; --neutral-100: #ECEEF2; --neutral-200: #DCDFE6;
  --accent-600: #4A4FE0; --accent-700: #3A3EC4; --accent-800: #2E31A3;
  --accent-50: #EEF0FD;  --accent-300: #9AA0F5;
  --success-600: #0F7B55; --warning-700: #9A5B00; --error-600: #C42B3A;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px;
  --shadow-sm: 0 1px 2px rgba(10,22,48,.06);
  --shadow-md: 0 8px 24px rgba(10,22,48,.08);
  --ease: cubic-bezier(0.2, 0, 0, 1);
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
7.12 Brand do and do not
Do
Do not
Show structured, realistic product interfaces
Float random UI cards around a headline
Use one accent colour for action
Add gradients, glows or glass effects
Label illustrative content
Invent clients, logos, statistics or awards
Keep ownership labels on every product
Blur the line between our products and partner products
State terms and limits
Promise outcomes or earnings
8. Technical architecture and phasing
Principle: build the simplest architecture that supports what is real today, and structure it so the catalogue, CMS and partner portal can be added without rework.
8.1 Stack
Layer
Recommendation
Notes
Framework
Next.js (App Router) with TypeScript and React
Server-rendered or statically generated marketing pages
Styling
Tailwind CSS with the tokens in 7.11; shadcn/ui selectively customised
Do not ship default component styling
Content
Headless CMS with structured models (for example Sanity or Payload)
Editors manage products, services, industries, articles, case studies, FAQs and Before / After pairs
Forms
Server-side handlers with schema validation, honeypot, rate limiting and a privacy-respecting challenge
Delivery to a monitored inbox or CRM plus an acknowledgement email
Email
A transactional provider (for example Resend or Postmark)
Verified sending domain with SPF, DKIM and DMARC
Database
PostgreSQL with Drizzle or Prisma
Introduced when applications, enquiries or the portal need stored state
Auth
A managed authentication service
Introduced with the portal; role-based access
Payments
Chosen only when checkout is a real requirement
Depends on jurisdiction, tax and invoicing rules
Analytics
Consent-aware, privacy-first
Events defined in section 4.6
Hosting
Edge-capable host with CDN, compression and image optimisation

8.2 Delivery phases
Phase
Scope
Backend needed
L: Marketing site
All pages in the sitemap tagged L; CMS-driven content; contact form; partner application forms that email a review queue; calculator (client-side, illustrative); search over static content
Form handler, email, CMS
L+: Growth
Compare tool, Insights and article volume, category pages, guides, partner FAQ, richer product filters
Light database for enquiries and applications
F: Platform
Partner portal with verification, document upload, product listing management, opportunity registration, commission ledger and payouts; product checkout if the business model requires it
Auth, database, storage, payments, audit logging
Route organisation: two route groups, (marketing) and (portal), with separate layouts, middleware and caching rules. The portal is never indexed.
8.3 CMS content models
Model
Key fields
Product
name, slug, industry, provider type, owner or partner, commercial model, price (nullable), features, ideal customer, FAQs, related items, interface previews, integrations (verified), security statements (verified), status
Service
name, slug, group, outcome line, process steps, deliverables, metrics, engagement models, FAQs
Industry
name, slug, challenges, traditional and digital workflow steps, Before / After pairs, related products and services, FAQs
Before / After pair
industry, before items, after items, caveat text (single source for cards, menus and pages)
Article
title, slug, author, dates, reading time, category, body, related items, CTA
Insight / case study
profile, challenge, solution, outcomes with evidence reference, approval status, labelled illustrative flag
Author
name, role, bio, photo, links
Legal page
body, version, effective date
8.4 Portal data model and commission integrity (F)
Entities: Partner, Verification, Application, Agreement, Product listing, Opportunity, Customer subscription, Ledger entry, Payout, Audit log.
Commission rules
• Commissions are calculated on the server from trusted records (confirmed payments and subscription state), never from client-submitted values.
• The ledger is append-only. Corrections, refunds and cancellations are new adjusting entries with a reason and reference; entries are never edited.
• Every entry links to its source payment, product, agreement version and partner.
• Payment webhooks are idempotent and signature-verified.
• A scheduled reconciliation compares ledger totals with payment records and flags differences for review.
• Refund, cancellation, clawback, minimum payout and payout schedule rules are written, approved and encoded before real transactions are enabled.
• Role-based access is enforced on the server; every sensitive read and write is audit-logged.
9. SEO strategy
9.1 Metadata rules
• Title: 50–60 characters, primary theme first, brand last. Meta description: 130–155 characters, one benefit and one action.
• One H1 per page, logical H2 and H3, human-readable lowercase URLs, canonical on every page, Open Graph and Twitter metadata with a real image.
• Descriptive alt text on informative images; empty alt on decorative ones.
• Structured data only for content that is actually on the page. No review, rating or award markup unless real and verifiable.
9.2 Page-by-page SEO map
Page
Title pattern
H1
Primary theme
Schema
/
[Company] | Business Software, Custom Development and Digital Growth
Technology That Moves Your Business Forward.
business software and technology services
Organization, WebSite
/products
Business Software by Industry | [Company]
Business Software for Your Industry
industry-specific business software
CollectionPage, BreadcrumbList
/products/real-estate-crm
Real Estate CRM Software | [Company]
Real Estate CRM for Brokers and Developers
real estate CRM software
SoftwareApplication (when real), FAQPage, BreadcrumbList
/products/hospital-management
Hospital Management Software | [Company]
Hospital Management Software for Clinics and Hospitals
hospital management software
SoftwareApplication (when real), FAQPage
/products/school-management
School Management System | [Company]
School Management Software for Admissions, Fees and Records
school management system
SoftwareApplication (when real), FAQPage
/products/hotel-management
Hotel Management Software | [Company]
Hotel Management Software for Bookings and Operations
hotel management software
SoftwareApplication (when real), FAQPage
/products/hostel-pg-management
Hostel and PG Management Software | [Company]
Hostel and PG Management Software
hostel management software, PG management software
SoftwareApplication (when real), FAQPage
/products/social-media-management
Social Media Management Software | [Company]
Social Media Management Software for Agencies and Teams
social media management software
SoftwareApplication (when real), FAQPage
/products/whatsapp-crm
WhatsApp CRM Software | [Company]
WhatsApp CRM for Sales and Support Teams
WhatsApp CRM
SoftwareApplication (when real), FAQPage
/services
Technology and Digital Services | [Company]
Services That Build, Connect and Grow Your Business
technology and digital marketing services
CollectionPage
/services/custom-software-development
Custom Software Development | [Company]
Custom Software Built Around Your Workflow
custom software development
Service, FAQPage
/services/digital-marketing
Digital Marketing Services | [Company]
Digital Marketing With a Structured Plan
digital marketing services
Service, FAQPage
/services/performance-marketing
Performance Marketing Services | [Company]
Performance Marketing With Clear Tracking and Reporting
performance marketing services
Service, FAQPage
/services/social-media-management
Social Media Management Services | [Company]
Social Media Management, Planned and Reported
social media management services
Service
/services/whatsapp-automation
WhatsApp CRM and Automation | [Company]
WhatsApp Lead Management and Automation
WhatsApp automation
Service, FAQPage
/services/ai-automation
AI and Workflow Automation | [Company]
Automate Repetitive Workflows, Keep People in Control
business process automation
Service, FAQPage
/services/crm-integration
CRM Setup and Integration | [Company]
Connect Your CRM, Data and Daily Workflows
CRM implementation and integration
Service
/services/technology-consulting
Technology Consulting | [Company]
Technology Decisions, Made Clearly
technology and SaaS consulting
Service
/industries/[slug]
[Industry] Software and Services | [Company]
Problem-led, industry-specific
per industry (see 5.6)
WebPage, FAQPage, BreadcrumbList
/partners
Partner Ecosystem | [Company]
Build, Sell, and Grow With Our Technology Ecosystem.
software partner program
WebPage
/partners/tech-partner
List Your SaaS Product | [Company] Tech Partner Program
Your Product. More Business Opportunities.
list SaaS product, software partner
WebPage, FAQPage
/partners/sales-partner
Sell Business Software | [Company] Sales Partner Program
Sell Business Software. Build Long-Term Client Relationships.
software reseller program, SaaS sales partner
WebPage, FAQPage
/insights
Business Technology Insights | [Company]
Insights for Businesses Modernising Their Operations
digital transformation insights
CollectionPage
/resources/blogs
Blog | [Company]
Articles on Business Software and Digital Growth
topic clusters
Blog, CollectionPage
/resources/blogs/[slug]
Article-specific
Descriptive question or topic
one real business question
Article, BreadcrumbList
/about
About [Company]
A Technology Company Built Around How Businesses Actually Work
brand and entity
AboutPage, Organization
/contact
Contact [Company]
Tell Us What You’re Working On
brand, contact
ContactPage
9.3 Internal linking strategy
• Hub and spoke: industry page ↔ its product ↔ related services ↔ supporting articles. Links run both ways.
• Every product page links to its industry page, two related services and two relevant articles. Every service page links to its related industries and products.
• Every article links to at least one product or service in context, with descriptive anchor text.
• Breadcrumbs on all second-level pages and deeper. No orphan pages; every page reachable within three clicks from the home page.
• Footer and mega menus link to the core pages only, not every long-tail article.
9.4 Technical SEO
• Server-rendered or statically generated content; no critical content behind client-only rendering or hover.
• XML sitemap generated from CMS and routes; robots.txt blocks /portal, /contact/thank-you, internal search results and filtered catalogue URLs.
• Filtered and sorted URLs are noindex with a canonical to the base page. Paginated lists use real links.
• Redirect map and 301s maintained for any slug change.
• Avoid thin or duplicate pages. An industry or location page is published only with unique workflows, FAQs and journeys.
• FAQs use real customer questions, collected from enquiries and sales calls.
• Core Web Vitals targets: LCP under 2.5s, INP under 200ms, CLS under 0.1 on a mid-range mobile device.
10. Accessibility, performance and security requirements
Area
Requirement
Accessibility
WCAG 2.2 AA as the baseline. Semantic landmarks and headings; skip link; visible focus on every control; full keyboard operation, including mega menus, tabs, accordions, filters and the calculator; text contrast 4.5:1 and UI contrast 3:1; 44px touch targets; labels and error text tied to fields; status messages announced; no information conveyed by colour or hover alone; reduced-motion support; reflow at 320px and 200% zoom
Performance
Responsive AVIF or WebP images with dimensions; lazy-loading below the fold; initial JavaScript under about 150 KB gzipped on content pages; interactive widgets (Before / After, calculator, compare) loaded only where used; self-hosted, subsetted fonts; CDN caching and compression; performance budgets enforced in CI
Security and privacy
Server-side validation and output encoding; CSRF protection; rate limiting and spam control; secrets in a managed store; security headers (CSP, HSTS, frame, referrer and permissions policies); dependency scanning; least-privilege access; consent before non-essential cookies; data retention matched to the privacy policy; uploads scanned and stored privately (F); server-side authorisation on every portal route (F)
Reliability
Uptime and error monitoring; form delivery alerts so no enquiry is silently lost; backups for any stored data
11. Implemented now versus future functionality
Capability
L (launch)
L+
F
Public pages, mega menu, Before / After, product and service templates
Yes


Contact form and enquiry routing
Yes


Partner applications
Structured form to a review inbox
Stored in database
Portal with saved drafts and status
Commission calculator
Illustrative, client-side


Real commission statements, payouts
No
No
Yes, server-side ledger
Product catalogue filters and search
Yes (content-driven)
Compare tool
Saved comparisons
Checkout and payments
No (demo and quote only)

Only if the model requires it
Tech and Sales Partner dashboards
Concept previews, labelled

Yes
Blog, guides, case studies
Yes (when real content exists)
Volume and categories

Newsletter
Only if operated


Anything shown as a concept is visibly labelled Concept (future portal) so no visitor thinks a feature exists when it does not.
12. Information the business must provide
Item
Needed for
Priority
Company name, logo, registered entity, address, support email and phone
Header, footer, contact, legal
Before design sign-off
Which products are live, their provider (own or partner), real feature lists and modules
Products catalogue, product pages
Before copy
Pricing, billing cycle, support and maintenance terms per product
Pricing sections, cards
Before copy
Product screenshots or approved interface concepts
Previews
Before design
Supported integrations and verified security measures
Product pages
Before copy
Rule for who receives and owns partner-product leads
Product and contact flows
[DECISION]
What partner ‘review’ covers
Partner pages, disclosures
[DECISION]
Tech Partner fees or revenue share; Sales Partner commission rates, payout schedule, refund and cancellation rules, lead-conflict rule, territory rules
Partner pages, calculator assumptions
[DECISION]
Service scope, engagement models, whether discovery is paid
Service pages
Before copy
Real case studies and client permissions
Insights
Optional at launch
Team names, roles, bios, photos
About
Optional (capabilities section otherwise)
Founding story
About
Before copy
Legal documents reviewed by counsel
Footer, forms
Before launch
Response-time commitments, enquiry inbox owner
Contact, confirmations
Before launch
Social profiles that actually exist
Footer, contact
Optional
13. Implementation checklist and test plan
13.1 Build order
1. Foundation: tokens, typography, grid, core components, header, mega menu, footer, layouts.
2. Content models and CMS with seed content that is clearly marked as draft.
3. Home page and shared modules (Before / After, product card, service tile, timeline).
4. Products: catalogue, filters, product template, the seven launch pages.
5. Services: overview, template, the eight service pages.
6. Industries: hub, template, the six pages.
7. Partners: overview, Tech Partner, Sales Partner, calculator, application forms.
8. Contact and enquiry routing, thank-you page, email flows.
9. Insights, Resources, blog, About, legal, 404, search.
10. SEO, analytics, accessibility and performance hardening, then launch.
11. Later: compare tool, portal, ledger, payments.
13.2 Pre-launch checklist
[ ] Every navigation item leads to a complete, written page
[ ] Every product card shows a provider badge and a model badge
[ ] No fake logos, testimonials, statistics, awards, case studies, phone numbers or addresses
[ ] Every mockup labelled ‘Illustrative interface’; every concept screen labelled as concept
[ ] No guaranteed-result, income or compliance claims without evidence
[ ] WhatsApp, healthcare, education and advertising disclosures reviewed
[ ] Contact and partner forms deliver to a monitored inbox; failure alerts active
[ ] Legal pages reviewed by counsel and linked from forms
[ ] Metadata, canonicals, sitemap, robots and structured data validated
[ ] Cookie banner matches the cookies actually set
13.3 Test plan
Test type
What to verify
Tools or method
Critical-flow end to end
Contact enquiry for each pathway; partner applications; filter and search; calculator; Before / After
Playwright
Keyboard and screen reader
Mega menus, tabs, accordions, filters, forms, calculator, error states
Manual with NVDA and VoiceOver; axe
Responsive
360, 390, 768, 1024, 1280, 1536 widths; real iOS and Android devices; touch targets
Device lab or cloud devices
Performance
LCP, INP, CLS on throttled mobile; page weight and JavaScript budgets
Lighthouse CI, field data after launch
SEO
Rendered HTML contains content; canonicals; schema validity; internal links; no orphan pages
Crawl plus structured-data testing
Security
Input validation, rate limiting, headers, dependency audit; portal authorisation (F)
Automated scans and manual review
Content and claims review
Every claim has a source or is removed; disclosures present
Editorial checklist signed off by the business
Commission logic (F)
Ledger totals, adjustments, refund and cancellation cases, reconciliation
Unit and integration tests with a fixture set
14. Recommended next steps
1. Confirm the [DECISION] items in section 12, especially partner-product lead ownership and the commission and review rules.
2. Supply the company name and the list of live products with their provider and pricing model.
3. Approve this structure, then proceed to wireframes, starting with the home page, the catalogue and one product page, followed by full copy for each page in the order of 13.1.
15. Technology stack architecture (performance-first)
This section expands and, where they differ, replaces section 8.1. Goal: pages that feel instant when clicked, motion that feels premium without costing speed, and a base that scales from a marketing site to a partner platform. Node.js is used end to end, with TypeScript everywhere.
15.1 Performance targets
Metric
Target
Why
Navigation between pages
Feels instant: content visible within roughly 100–200ms of a click for prefetched pages
Static pages prefetched before the click
Largest Contentful Paint (mobile, 4G, mid-range phone)
Under 1.8s
Stricter than the 2.5s Google threshold
Interaction to Next Paint
Under 150ms
Filters, menus and tabs must respond immediately
Cumulative Layout Shift
Under 0.05
No jumping content, fonts or images
Time to First Byte
Under 200ms from the CDN
Static HTML served from the edge
JavaScript on content pages
Under about 150 KB gzipped initial
Motion and widgets load only where used
Lighthouse mobile (lab)
90+ on every marketing page
Enforced in CI
Honesty note: ‘instant’ here means perceived speed, achieved by prefetching and static delivery. The numbers above are targets to be proven with field data after launch, not guarantees.
15.2 Recommended stack
Layer
Choice
Reason
Language and runtime
TypeScript on current Node.js LTS
One language across web, API and workers; shared types
Web framework
Next.js (App Router) with React Server Components
Static generation, incremental regeneration, streaming, automatic link prefetching, one codebase for site and portal
UI primitives
Radix UI via shadcn/ui, heavily customised
Accessible behaviour (menus, dialogs, tabs) with our own premium styling
Styling
Tailwind CSS (v4) with the brand tokens from 7.11
Small CSS output, consistent system, no runtime styling cost
Motion
CSS and View Transitions first; Motion (Framer Motion’s successor) for component choreography; GSAP ScrollTrigger for a few scroll-driven sections; Rive for product animations
Detailed in 15.6
Icons
Lucide, tree-shaken
Matches the brand kit
Content
Headless CMS (Sanity or Payload) with webhook-driven revalidation
Editors publish without a rebuild or deploy
Database
PostgreSQL (managed, Mumbai region if the audience is mainly in India) with Drizzle ORM
Typed, lightweight queries; no heavy client
Cache and limits
Redis (for example Upstash)
Rate limiting, short-lived caching, job queue backing
Auth (portal)
Managed auth (Clerk, WorkOS or Better Auth) with role-based access
Do not build authentication from scratch
API and workers (portal, phase F)
Fastify (or NestJS on the Fastify adapter) on Node.js; BullMQ or a managed job service
Webhooks, ledger jobs, payouts, notifications
Validation and contracts
Zod schemas shared by forms, server and API
One source of truth for input rules
Email
Resend or Postmark
Deliverability and templates
Search
Pagefind at launch (static, no server); Typesense or Meilisearch later
Zero-latency search without infrastructure
File storage
S3-compatible object storage, private buckets, signed URLs
Partner documents (phase F)
Analytics
Consent-aware, privacy-first (Plausible or PostHog) loaded after interaction
No third-party scripts blocking render
Monitoring
Sentry for errors, real-user monitoring for Web Vitals, uptime checks
Prove the speed targets with real data
Monorepo and CI
pnpm and Turborepo, GitHub Actions, preview deployments
Fast builds, safe reviews
Testing
Vitest, Playwright, axe, Lighthouse CI
Section 13.3
15.3 System architecture
VISITOR (mobile / desktop)
   |
   v
CDN / EDGE  (static HTML, JS, CSS, AVIF/WebP, fonts; cached close to users)
   |  cache hit: served in milliseconds
   |  cache miss or dynamic: forwarded to origin
   v
NEXT.JS ON NODE.JS (server components, route handlers, server actions)
   |-- Marketing pages: pre-rendered, revalidated on demand
   |-- Form handlers: Zod validation, Turnstile check, rate limit -> email + store
   |-- Portal UI (phase F): authenticated, dynamic, never cached publicly
   |
   +--> HEADLESS CMS  --webhook--> on-demand revalidation of changed pages
   +--> POSTGRES (enquiries, applications; portal data in phase F)
   +--> REDIS (rate limits, cache, queue)
   +--> EMAIL PROVIDER
   |
   v  (phase F)
NODE.JS API + WORKERS (Fastify)
   |-- Auth and roles, partner and listing modules
   |-- Commission ledger, reconciliation, payout jobs
   |-- Payment and subscription webhooks (signed, idempotent)
   |-- Notifications and audit log
   +--> POSTGRES, OBJECT STORAGE, PAYMENT PROVIDER
Principle: start as a modular monolith inside Next.js. Extract the Node.js API and workers only when the portal, ledger and webhooks arrive, so there is no distributed-system cost before it is needed.
15.4 Rendering strategy per page type
Page type
Strategy
Notes
Home, About, Partners, Tech and Sales Partner
Static generation
Revalidated on CMS publish
Products catalogue
Static page plus client-side filtering over a small, pre-built JSON index
Filtering responds with no server round trip
Product, service and industry detail
Static generation with on-demand revalidation
Pre-built for every published slug
Blog, Insights, articles
Static generation with on-demand revalidation; pagination as real pages
Search via Pagefind
Contact and applications
Static shell, server action for submit
Page loads instantly; only the submit touches the server
Commission calculator
Client component, loaded only on its page
No server involved (illustrative)
Portal (phase F)
Dynamic, authenticated, server-side authorisation
Separate route group, noindex, no public caching
15.5 How navigation feels instant
1. Static HTML at the edge means no waiting on a server for any marketing page.
2. Automatic link prefetching: links in the viewport are prefetched, so the next page is already in the browser when the visitor clicks.
3. Hover and focus intent prefetch on mega-menu items and cards for pages not yet in view.
4. Persistent layout: header, footer and navigation never re-render between pages; only the page content swaps.
5. Page transitions with the browser View Transitions API (a short cross-fade, about 200ms), with a plain instant swap where unsupported or when reduced motion is on.
6. Skeletons and streaming for the few dynamic regions, sized to avoid layout shift.
7. Small route bundles: each route ships only its own code; heavy widgets (compare, calculator, motion sequences) load on demand.
8. Self-hosted, preloaded fonts with metric-matched fallbacks, and image dimensions set to prevent shift.
9. No client waterfalls: data is fetched on the server in parallel, never in a chain of client requests.
15.6 Motion system
Premium motion is restrained, smooth and purposeful. The rule is: animate only transform and opacity (GPU-friendly), never layout properties, and never block the main thread.
Tool
Use for
Cost control
CSS transitions and keyframes
Hover, focus, menu reveal, accordions, button feedback
Zero JavaScript
CSS scroll-driven animations
Simple scroll progress and reveals where supported
Progressive enhancement
View Transitions API
Page-to-page cross-fades; shared-element moves for cards to detail pages
Native, near-zero cost
Motion (React)
Before / After transitions, tab indicators, list reordering, filter result changes
Use the lazy, reduced feature set and load per component
GSAP with ScrollTrigger
The How We Work timeline and one or two hero or storytelling sequences
Loaded only on those pages, dynamically
Rive (or dotLottie)
Product workflow animations: a lead moving through a pipeline, a booking appearing on a calendar
Small vector files, play once when visible, pausable
Product frames as coded UI
Hero and product previews built from real HTML, CSS and SVG components rather than screenshots
Crisp at any size, tiny, themeable, animatable
WebGL / three.js
Not used by default
Only if a single hero truly needs it; otherwise it hurts mobile speed and battery
Motion moments (keep to these)
Moment
Behaviour
Hero product composition
Interface assembles once on load: pipeline columns appear, a lead card moves to the next stage, a report panel updates. Completes within about 2.5s, then stays still
Mega menu
150ms fade and 4px rise; Before / After preview cross-fades as focus moves
Industry card Before / After
Panel swap with a 200ms transition
Product catalogue filtering
Cards reflow smoothly; results count updates
How We Work timeline
Progress line fills as the section scrolls into view
Partner ecosystem flow
Nodes light up in sequence when first seen
Page navigation
200ms cross-fade
Calculator
Result number eases to its new value
Reconciling with the brand kit (7.10): the brand kit forbids autoplay loops and decorative motion. Product workflow animations are allowed because they explain something, play once when they enter the viewport, and offer a pause or replay control. Everything is removed or replaced with a static final state under prefers-reduced-motion. Smooth-scroll hijacking libraries are not used, because they hurt accessibility and responsiveness.
15.7 Engineering a premium UI
• Tokens first: the colour, type, spacing, radius and motion tokens from 7.11 become the Tailwind theme, so every component inherits the same precision.
• Radix-based components give correct keyboard and screen-reader behaviour; our styling provides the premium finish.
• Typography: self-hosted variable fonts through next/font, subsetted, with optical sizing for headings.
• Images: the framework’s image pipeline serving AVIF and WebP in responsive sizes; the hero image or composition under about 120 KB; no autoplay video. Where video is required, a short compressed loop with a poster image and play control.
• Sample-data product interfaces are real React components fed by fixture data, labelled ‘Illustrative interface’. They look sharper than screenshots, weigh little and can be animated.
• Third-party scripts (analytics, chat) load after first interaction or idle time, never in the critical path.
• Visual quality gate: design review at 360, 768, 1280 and 1536 widths before any page ships.
15.8 Node.js backend and scaling path
Stage
Where Node.js runs
Triggers the next stage
1. Launch (L)
Inside Next.js: route handlers and server actions for forms, email and CMS webhooks
Applications and enquiries need review tooling
2. Growth (L+)
Same app, plus Postgres and Redis; scheduled jobs for notifications
Partner portal approved for build
3. Platform (F)
Dedicated Fastify API and worker service, separate from the web app; Next.js portal calls it
Volume, ledger complexity, multiple teams
4. Scale
Horizontal scaling of stateless web and API instances; read replicas; queue-based processing; caching layers
Measured load, not assumptions
Module boundaries for the API (keep them separate from day one): auth and roles, partners and verification, product listings and review, opportunities and leads, subscriptions, commission ledger, payouts, notifications, audit log. Contracts are defined with shared Zod schemas and an OpenAPI description. Webhooks are signature-verified and idempotent. The commission rules in 8.4 apply unchanged.
15.9 Hosting, caching and region
• Region: if most visitors and partners are in India, run the web functions, database and cache in the Mumbai region and use a CDN with Indian points of presence. Latency to a distant database is the most common hidden cause of slow dynamic pages.
• Hosting options: (a) a managed Next.js platform for the best developer experience and edge caching, or (b) Node.js containers on a cloud provider behind a CDN for more cost and infrastructure control. Both support this architecture; choose on team skills and budget.
• Cache headers: long-lived immutable caching for fingerprinted assets; stale-while-revalidate for HTML; on-demand revalidation when the CMS publishes.
• Environments: local, preview per pull request, staging, production, each with separate secrets.
15.10 Repository layout
/apps
  /web        Next.js marketing site (and portal route group at first)
  /api        Fastify API and workers (phase F)
/packages
  /ui         Design system: tokens, components, motion primitives
  /content    CMS schemas, types, fixtures
  /validation Shared Zod schemas
  /config     ESLint, TypeScript, Tailwind presets
15.11 Quality gates in CI
• Type check, lint, unit tests, Playwright critical flows on every pull request.
• Lighthouse CI against performance budgets: fail the build if LCP, CLS or JavaScript budgets regress.
• Automated accessibility checks (axe) on every template.
• Bundle-size report per route; dependency and security scanning.
• Preview deployment for each pull request so design and content reviews use the real thing.
15.12 Alternatives considered
Option
Strength
Why it is not the primary choice
Astro (islands)
Often the lightest output for purely content-driven sites
Strong alternative for the marketing site alone. Next.js is preferred here because the same React components, auth and dashboards serve the future partner portal. If maximum marketing speed outweighs a unified codebase, use Astro for marketing and Next.js for the portal
React Router / Remix
Excellent data loading and forms
Less static-generation tooling for a CMS-driven site
Single-page app (Vite)
Fast after first load
Slower first paint and weaker SEO; unnecessary for marketing pages
WordPress or page builders
Quick to start
Harder to reach the speed, motion and component-quality targets; weaker fit for a portal
15.13 Risks and what to verify
• Versions move quickly. Confirm current stable versions of Next.js, React, Tailwind, Node.js LTS and the motion libraries at project start, and check that features such as View Transitions support are suitable for the browsers your visitors use.
• Motion is the main speed risk. Every animation must be tested on a mid-range Android phone, not only a developer laptop.
• Images and third-party scripts are the usual cause of regressions; budgets in CI catch them early.
• Database distance: keep the database in the same region as the functions.
• Over-engineering: do not add the API service, queues or search servers until the phase they belong to.