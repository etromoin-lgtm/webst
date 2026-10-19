# B2B Client Portal & Admin Management System — Final Architecture & Specification

## 1. Executive Overview & Design Philosophy

This system solves the challenge of handling diverse B2B customer relationships without splintering user identities or creating redundant accounts. Instead of rigid, mutually exclusive user types, the system adopts an **Organization-Centric, Relationship-Agnostic Model**.

A single client organization can simultaneously:
1. Own off-the-shelf software or workflow **Products**.
2. Hold a ledger of previous / historical and active custom **Projects**.
3. Raise technical **Support Tickets** or product complaints tied to specific assets.
4. Commission **New Engagements** or renewals.

All of this is supported by a robust verification gate for historical records, on-demand PDF reporting, and bidirectional email/messaging.

---

## 2. Customer Relationship & State Matrix

```mermaid
graph TD
    Org[Client Organization Entity]

    subgraph CategoryOverlap["Non-Exclusive Relationship States"]
        Cat1["Type 1: Product Customer\n- Owned Licenses\n- Warranty / Subscriptions\n- Product Docs"]
        Cat2["Type 2: Project Client\n- Commissioned Work\n- Milestones & Deliverables\n- Maintenance & SLA"]
        Cat3["Type 3: New / Returning Inquirer\n- Submitted Requirements\n- Historical Work Claims\n- Pending Verification"]
    end

    Org --> Cat1
    Org --> Cat2
    Org --> Cat3

    Cat1 -.->|Can commission| Cat2
    Cat3 -.->|Verified into| Cat1
    Cat3 -.->|Verified into| Cat2
```

---

## 3. High-Level System Architecture

```mermaid
graph TB
    subgraph Clients["Clients / Customer Team"]
        CP_Web["💻 Web Dashboard"]
        CP_Mob["📱 Mobile Responsive Portal"]
    end

    subgraph InternalStaff["Internal Team / Admins"]
        Admin_UI["🖥️ Centralized Admin Panel\n(CRM, Projects, Products, Billing, Tickets)"]
    end

    subgraph SecurityGateway["Edge Gateway & Security Layer"]
        AuthSvc["Auth & RBAC Service\n- Multi-tenant Organization Isolation\n- Role Permissions (Org Owner, Member, Admin)"]
        VerificationGate["Historical Record Verification Gate\n(Claims quarantined until Admin approval)"]
    end

    subgraph CoreServices["Backend Application Microservices"]
        OrgSvc["Organization & Account Service"]
        ProductSvc["Product Catalog & Entitlements Service"]
        ProjectSvc["Project & Milestone Tracker (Historical & Active)"]
        ClaimSvc["Claim Review & Record Linker"]
        BillingSvc["Invoicing, Payment & Ledger Service"]
        SupportSvc["Ticket & Complaint Resolution Service"]
        DocSvc["PDF Generation & Document Vault Service"]
        CommSvc["Email & Direct Messaging Broker"]
    end

    subgraph DataAndStorage["Data & Asset Layer"]
        PrimaryDB[("Relational PostgreSQL\n- Organizations, Users, Products\n- Projects, Milestones, Claims\n- Invoices, Tickets, Audits")]
        BlobStore[("Secure Cloud Storage\n- Project Deliverables & Reports\n- Invoices & Receipts\n- Claim Evidence & Attachments")]
        MailGateway["Mail Gateway\n(SMTP / IMAP / Webhook Engine)"]
    end

    CP_Web & CP_Mob --> SecurityGateway
    Admin_UI --> SecurityGateway

    SecurityGateway --> CoreServices
    CoreServices --> DataAndStorage
    CommSvc <--> MailGateway
```

---

## 4. Complete Customer Onboarding & Historical Claim Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer (New / Returning)
    participant RegPortal as Registration Portal
    participant Auth as Auth & Organization Svc
    participant ClaimEngine as Claims Engine
    actor Admin as 👨‍💼 Company Admin
    participant AdminPanel as Admin Panel
    participant ClientDash as Client Dashboard

    Customer->>RegPortal: Step 1: Sign up (Name, Business Email, Company, Phone)
    RegPortal->>Customer: Step 2: Questionnaire ("Worked with us / bought before?")
    
    alt Customer Answers "NO" (Fresh Client)
        Customer->>RegPortal: Submits registration as New Customer
        RegPortal->>Auth: Create verified Org & User Account
        Auth->>ClientDash: Initialize Clean Dashboard (Empty states + "Start First Project")
    else Customer Answers "YES" (Returning / Historical Client)
        Customer->>RegPortal: Enters claim details (Prev Project Name, Approx Dates, Invoice Ref, Old Email)
        RegPortal->>ClaimEngine: Store as 'historical_record_claims' (Status: PENDING_VERIFICATION)
        Note over ClaimEngine: Quarantine: Old project data is NOT shown to user yet!
        RegPortal->>Auth: Create Org & User Account with unverified status on past claims
        ClaimEngine->>AdminPanel: Dispatch "New History Claim Review" notification
        Admin->>AdminPanel: Step 4: Admin reviews claim & cross-checks offline / CRM records
        alt Admin Approves Claim
            Admin->>AdminPanel: Click "Link Record to Verified Account"
            AdminPanel->>ClaimEngine: Execute link: Claim -> Verified Project / Product Purchase
            ClaimEngine->>ClientDash: Unlock Historical Projects, Deliverables & Invoices
            ClaimEngine-->>Customer: Send verification confirmation email
        else Admin Rejects or Requests Info
            Admin->>AdminPanel: Reject or request clarification
            AdminPanel-->>Customer: Notify reason for non-match
        end
    end
```

---

## 5. Admin Panel — Customer History & Multi-Asset Management

```mermaid
flowchart TD
    AdminUser["👨‍💼 Admin Enters Client Profile"] --> ClientOverview["Organization Profile View\n- Verified Contacts\n- Owned Products (Count)\n- Previous Projects (Count)\n- Outstanding Balance"]

    ClientOverview --> A1["➕ Add Previous Project (Offline / Pre-portal work)"]
    ClientOverview --> A2["📁 Upload Project Report & Deliverables (PDF/ZIP)"]
    ClientOverview --> A3["🛒 Add Product Purchase & Service Entitlement"]
    ClientOverview --> A4["🔗 Link Historical Record to verified Organization"]
    ClientOverview --> A5["⚖️ Review Customer History Claims (Approve/Reject)"]
    ClientOverview --> A6["🔒 Add Internal Staff Notes (Visible only to admins)"]
    ClientOverview --> A7["🚀 Commission New Project under same Organization"]

    A1 --> AuditLog["Automatic Audit Log Entry\n(Captured: Admin ID, Timestamp, Action, Prev State, New State)"]
    A2 --> AuditLog
    A3 --> AuditLog
    A4 --> AuditLog
    A5 --> AuditLog
    A6 --> AuditLog
    A7 --> AuditLog
```

---

## 6. Client Unified Dashboard Architecture (One Place for Everything)

```mermaid
flowchart LR
    subgraph ClientNavigation["Unified Client Portal Dashboard"]
        Tab1["1. Overview\n(Products owned, active projects, balance, open tickets)"]
        Tab2["2. My Products\n(Purchases, licenses, docs, warranty/subscription)"]
        Tab3["3. My Projects\n(Active, Completed, and Verified Historical)"]
        Tab4["4. Reports & Deliverables\n(Admin-uploaded PDFs, handover files)"]
        Tab5["5. Billing & Invoices\n(Paid receipts, pending dues, financial statements)"]
        Tab6["6. Support Centre\n(Complaints, product bugs, project changes)"]
        Tab7["7. New Request\n(Purchase inquiry, new project, maintenance)"]
        Tab8["8. Company Profile\n(Business details, team members, security)"]
    end
```

### Dashboard View Matrix by Customer State:

| Section | New Customer (No History) | Product-Only Customer | Project Client (Past & Present) | Hybrid (Product + Projects) |
| :--- | :--- | :--- | :--- | :--- |
| **Overview** | Welcome banner, prompt to initiate first engagement | Active licenses summary, product health | Project progress %, active milestone tracker | Complete summary cards for both products & projects |
| **My Products** | Empty state with catalog & "Inquire Now" button | List of purchased products, license keys, documentation | Empty state (prompt to explore products) | Full list of owned products with active service tags |
| **My Projects** | Empty state with "Start Your First Project" CTA | Empty state | Active projects with % bars + Completed historical archive | Active and historical projects with milestone details |
| **Reports** | Empty state | User manuals, product compliance PDFs | Handover PDFs, architecture docs, deliverables | All project deliverables + product documentation |
| **Billing** | No records | Product invoice receipts | Milestone payment schedules, pending/paid project invoices | Unified ledger of product purchases + project invoices |
| **Support** | General inquiry form | Ticket form pre-filtered by owned products | Ticket form pre-filtered by active/past projects | Dual-mode ticket form (select either product or project) |
| **New Request** | New Project / Product quote submission | Add-on, upgrade, or custom automation request | New project scope request or maintenance contract | Unrestricted new request form |

---

## 7. Dynamic PDF Generation Engine (On-Demand & Historical)

```mermaid
flowchart TD
    Req["Request PDF: Admin or Client"] --> Mode{"Document Category"}

    Mode -->|Project Specific| D1["Project Milestone & Work Summary PDF\n- Scope, features built, delivery dates, team assigned"]
    Mode -->|Lifetime Portfolio| D2["Cumulative Client Portfolio Report\n- All historical + active projects completed by company"]
    Mode -->|Product Purchase| D3["Product Ownership Certificate & License PDF\n- Product version, license grant, warranty expiry"]
    Mode -->|Financial| D4["Official Tax Invoice & Payment Receipt PDF\n- Transaction IDs, milestone payments, balance ledger"]

    D1 & D2 & D3 & D4 --> PDFEngine["PDF Rendering Engine\n(Injects Letterhead, Logo, Client Org, Timestamps, Verification Hash)"]
    PDFEngine --> CloudStorage["Store in Cloud Object Storage (S3 / Blob)"]
    CloudStorage --> DocumentVault["Published to 'Reports & Deliverables' / 'Billing' Tab"]
    DocumentVault --> EmailNotice["Email notification with secure pre-signed download link"]
```

---

## 8. Integrated Email & Direct Notification Engine

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 👨‍💼 Admin Panel
    participant CommSvc as Communication Engine
    participant DB as Message & Email DB
    actor Client as 📱 Client Portal
    participant ExternalMail as External SMTP/IMAP

    rect rgb(240, 248, 255)
    Note over Admin, Client: Scenario A: Direct In-Portal Announcement / Message
    Admin->>CommSvc: Post one-to-one message (Priority: Normal/Urgent)
    CommSvc->>DB: Save to message log (unread)
    CommSvc-->>Client: WebSocket notification badge update
    Client->>CommSvc: Client opens and marks as read
    CommSvc->>Admin: Delivery & Read timestamp update
    end

    rect rgb(255, 250, 240)
    Note over Admin, ExternalMail: Scenario B: Bidirectional Email Synchronization
    Client->>CommSvc: Client sends email from Portal Email tab
    CommSvc->>ExternalMail: Outbound dispatch to Admin inbox
    Admin->>ExternalMail: Admin replies from regular email client or Admin UI
    ExternalMail->>CommSvc: Inbound webhook parses message & thread ID
    CommSvc->>DB: Store in email thread
    CommSvc-->>Client: Message visible inside Client Portal Email Inbox
    end
```

---

## 9. Comprehensive Database Architecture (Entity Relationship)

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : employs
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : has
    ORGANIZATIONS ||--o{ PRODUCT_PURCHASES : owns
    ORGANIZATIONS ||--o{ PROJECTS : commissions
    ORGANIZATIONS ||--o{ INQUIRIES : submits
    ORGANIZATIONS ||--o{ INVOICES : billed_to
    ORGANIZATIONS ||--o{ SUPPORT_TICKETS : raises
    ORGANIZATIONS ||--o{ HISTORICAL_RECORD_CLAIMS : declares
    ORGANIZATIONS ||--o{ AUDIT_LOGS : tracked_for

    PRODUCTS ||--o{ PRODUCT_PURCHASES : sold_as
    PRODUCTS ||--o{ SUPPORT_TICKETS : relates_to

    PROJECTS ||--o{ PROJECT_REPORTS : includes
    PROJECTS ||--o{ INVOICES : bills
    PROJECTS ||--o{ SUPPORT_TICKETS : relates_to

    INVOICES ||--o{ PAYMENTS : settles

    SUPPORT_TICKETS ||--o{ TICKET_MESSAGES : contains

    ORGANIZATIONS {
        uuid id PK
        string legal_name
        string brand_name
        string tax_id_or_gst
        string primary_email
        string phone
        string website
        string verification_status "UNVERIFIED | VERIFIED | RESTRICTED"
        timestamp created_at
    }

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string phone
        string global_role "SUPER_ADMIN | STAFF | CLIENT"
        boolean is_active
        timestamp created_at
    }

    ORGANIZATION_MEMBERS {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        string member_role "OWNER | BILLING_ADMIN | MEMBER"
        boolean is_primary_contact
    }

    PRODUCTS {
        uuid id PK
        string product_code UK
        string name
        text description
        string current_version
        decimal base_price
        boolean is_active
    }

    PRODUCT_PURCHASES {
        uuid id PK
        uuid organization_id FK
        uuid product_id FK
        string license_key UK
        date purchase_date
        string entitlement_type "PERPETUAL | SUBSCRIPTION | WARRANTY"
        date entitlement_end_date
        string status "ACTIVE | EXPIRED | TERMINATED"
        uuid invoice_id FK
    }

    PROJECTS {
        uuid id PK
        uuid organization_id FK
        string project_code UK
        string name
        text scope_summary
        string project_type "NEW_ENGAGEMENT | HISTORICAL_OFFLINE | AUTOMATION"
        int progress_percentage "0 to 100"
        string status "DISCOVERY | IN_PROGRESS | IN_REVIEW | COMPLETED | ARCHIVED"
        boolean is_historical_record "true if work completed before portal"
        date start_date
        date target_or_completion_date
        uuid assigned_admin_id FK
    }

    HISTORICAL_RECORD_CLAIMS {
        uuid id PK
        uuid organization_id FK
        uuid submitted_by_user_id FK
        string claim_type "PROJECT | PRODUCT_PURCHASE"
        string declared_name
        string declared_reference_number
        string declared_old_email
        date approximate_date
        text notes
        string verification_status "PENDING | APPROVED | REJECTED"
        uuid verified_by_admin_id FK
        timestamp verified_at
        text admin_decision_notes
    }

    PROJECT_REPORTS {
        uuid id PK
        uuid project_id FK
        string title
        string document_type "DELIVERABLE | HANDOVER_SUMMARY | ARCHITECTURE_DOC | AUDIT_REPORT"
        string file_url
        string file_size
        string version "e.g. v1.0, v2.1"
        uuid uploaded_by_admin_id FK
        timestamp uploaded_at
    }

    INVOICES {
        uuid id PK
        uuid organization_id FK
        uuid project_id FK "Nullable if Product Invoice"
        string invoice_number UK
        decimal subtotal
        decimal tax_amount
        decimal total_amount
        decimal balance_due
        date due_date
        string status "DRAFT | ISSUED | PARTIAL | PAID | VOID"
        string invoice_pdf_url
    }

    PAYMENTS {
        uuid id PK
        uuid invoice_id FK
        decimal amount
        string payment_method "BANK_TRANSFER | CARD | UPI | MANUAL"
        string transaction_reference
        timestamp paid_at
        string receipt_pdf_url
    }

    SUPPORT_TICKETS {
        uuid id PK
        uuid organization_id FK
        uuid created_by_user_id FK
        uuid project_id FK "Nullable if Product Issue"
        uuid product_id FK "Nullable if Project Issue"
        string ticket_code UK
        string subject
        string priority "LOW | MEDIUM | HIGH | CRITICAL"
        string status "OPEN | IN_PROGRESS | WAITING_CLIENT | RESOLVED | CLOSED"
        timestamp created_at
        timestamp resolved_at
    }

    TICKET_MESSAGES {
        uuid id PK
        uuid ticket_id FK
        uuid sender_user_id FK
        text message_body
        string attachment_url
        boolean is_internal_note "true for staff-only comments"
        timestamp sent_at
    }

    INQUIRIES {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        string request_type "NEW_PROJECT | PRODUCT_PURCHASE | ENHANCEMENT | MAINTENANCE"
        string title
        text requirements_description
        decimal budget_estimate
        string status "NEW | IN_REVIEW | PROPOSAL_SENT | CONVERTED | REJECTED"
        timestamp submitted_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid organization_id FK
        uuid actor_user_id FK
        string action "RECORD_LINKED | CLAIM_APPROVED | PROGRESS_UPDATED | INVOICE_GENERATED"
        string entity_name
        uuid entity_id
        jsonb previous_state
        jsonb new_state
        timestamp performed_at
    }
```

---

## 10. System Enforcement Rules & Guarantees

1. **Organization-Level Isolation:** Every user belongs to one or more `organizations`. Data is queried using `WHERE organization_id = :org_id`. Cross-organization visibility is strictly blocked at the API gateway layer.
2. **Historical Claims Quarantine:** Any previous work entered during onboarding is tagged `PENDING` in `historical_record_claims`. It is strictly invisible on the client's dashboard until an authorized Admin checks offline records, verifies authenticity, and clicks **Approve & Link**.
3. **No Duplicate Identity Creation:** If a client commissions 5 new projects over 3 years and buys 2 off-the-shelf products, everything stays under the identical Organization profile.
4. **Historical != Active:** Previous work loaded into the system (whether pre-portal offline work or completed projects) maintains status `COMPLETED / HISTORICAL`. They do not consume active project slots unless a new `INQUIRY` is converted into an active project engagement.
5. **Contextual Support Routing:** When a client opens the Support Centre, the dropdown asks: *"What is this related to?"* and populates only their verified owned Products and Projects, ensuring tickets are tied directly to root assets.
6. **Immutable Audit Trail:** All manual historical insertions, claim approvals, progress adjustments, and financial overrides log an immutable record to `audit_logs` capturing the actor, exact timestamp, and payload diff.
