# Client Portal & Admin Management System Architecture

## 1. Executive Summary & Objective
Yeh architecture document ek comprehensive, mobile-friendly **Client Portal** aur **Admin Management Dashboard** ka complete blueprint provide karta hai. Is system se client apne sabhi projects ka live progress, payment history, feature changelog, support tickets, direct email communication aur dynamically generated PDF reports (work history & invoices) track kar sakta hai. Admin panel se company client ke sabhi works, updates, messages aur billings ko centralized manage kar sakti hai.

---

## 2. High-Level System Architecture

```mermaid
graph TB
    subgraph Users["End Users"]
        Client["📱/💻 Client (Mobile-Friendly Portal)"]
        Admin["💻 Company Admin / Project Managers"]
    end

    subgraph Frontend["Frontend Layer (Responsive Web UI)"]
        CP_UI["Client Portal Dashboard\n- Live Project Tracking & Progress %\n- Features & Change History\n- Payments & Invoices\n- Support Ticket & Complaints\n- Direct Message Center\n- Integrated Email Center\n- PDF Downloads Archive"]
        AP_UI["Admin Management Panel\n- Multi-Client Directory\n- Project & Milestone Manager\n- Payment Ledger & Billing Engine\n- Ticket Resolver & SLA Tracker\n- Direct Notification Dispatcher\n- Email Inbox & Outbox\n- Dynamic PDF Generator"]
    end

    subgraph GatewayAuth["API Gateway & Security"]
        Auth["Authentication & Role-Based Access Control (RBAC)\n- JWT / Session / OTP\n- Strict Multi-Tenant Client Data Isolation"]
    end

    subgraph Services["Backend Core Microservices / Modules"]
        ProjectSvc["Project & Milestone Service"]
        PaymentSvc["Payment & Invoicing Service"]
        TicketSvc["Support & Complaint Service"]
        MessagingSvc["Direct Client Messaging Service"]
        EmailSvc["Bidirectional Email Service"]
        PDFSvc["Dynamic PDF Generation Engine"]
    end

    subgraph Infrastructure["Infrastructure & Third-Party Integrations"]
        MailServer["Email Provider\n(SMTP / IMAP / Webhooks / Resend / Google Workspace)"]
        CloudStorage[("Cloud Object Storage\n(Secure S3 / GCP Storage for Invoices, Work PDFs & Attachments)")]
        PrimaryDB[("Relational / Document DB\n(PostgreSQL / MongoDB)")]
    end

    Client -->|HTTPS / WSS| CP_UI
    Admin -->|HTTPS / WSS| AP_UI

    CP_UI --> GatewayAuth
    AP_UI --> GatewayAuth

    GatewayAuth --> ProjectSvc
    GatewayAuth --> PaymentSvc
    GatewayAuth --> TicketSvc
    GatewayAuth --> MessagingSvc
    GatewayAuth --> EmailSvc
    GatewayAuth --> PDFSvc

    EmailSvc <--> MailServer
    PDFSvc --> CloudStorage
    TicketSvc --> CloudStorage

    ProjectSvc --> PrimaryDB
    PaymentSvc --> PrimaryDB
    TicketSvc --> PrimaryDB
    MessagingSvc --> PrimaryDB
    EmailSvc --> PrimaryDB
    PDFSvc --> PrimaryDB
```

---

## 3. Module-by-Module Functional Specifications

### 3.1. Client Portal (Mobile-First Experience)
- **Overview Dashboard:** Total projects count, active project progress bar (`0%` to `100%`), payment status badge (Paid / Remaining), recent updates feed.
- **Project Progress & History:** Milestones timeline, newly implemented features, completed deliverables, historical changelog.
- **Payments & Invoicing:** Complete list of past payments, pending dues, transaction references, direct PDF receipt downloads.
- **Support & Complaint Center:** Form to raise new issues with attachments (screenshots/docs), ticket priority, real-time status updates (Open, In Review, In Progress, Resolved).
- **Direct Messages & Notifications:** In-app alert bell, announcements from admin, read/unread status.
- **Integrated Email Client:** Dedicated tab to compose and view email threads directly within portal without leaving dashboard.
- **Document Vault:** Organized repository of all generated Work Summary PDFs, Contracts, Handover Reports and Invoices.

### 3.2. Admin Management Panel
- **Client Management (CRM):** Onboarding new clients, setting access credentials, assigning projects.
- **Milestone & Progress Manager:** Updating completion %, marking features as shipped, writing milestone update notes.
- **Financial Ledger & Billing:** Recording received payments, logging balance amounts, triggering auto-calculated invoices.
- **Issue & Ticket Management:** Assigning complaints, replying to client tickets, resolving tickets.
- **Direct Message Dispatcher:** Sending targeted notices or urgent announcements to individual clients or all clients.
- **Email Synchronization:** Direct view of emails sent to/from clients with full thread history.
- **PDF Generation Suite:** On-demand creation of individual project reports, consolidated client lifetime work reports, and invoice receipts.

---

## 4. End-to-End Workflow Diagrams

### 4.1. Project Milestone & Progress Update Flow

```mermaid
flowchart TD
    A[Admin logs into Admin Panel] --> B[Selects Client & Project]
    B --> C{Action Needed}
    C -->|Update Progress| D[Sets New Completion % & Milestone Status]
    C -->|Add New Feature| E[Logs Feature Details into Changelog]
    C -->|Attach Work Proof| F[Uploads Screenshots / Code Artifacts]

    D --> G[Database Updated]
    E --> G
    F --> G

    G --> H[Notification Service Triggers]
    H --> I[In-App Bell Notification to Client]
    H --> J[Instant Email Update to Client]
    I --> K[Client Opens Mobile Portal & Views Progress]
    J --> K
```

---

### 4.2. Direct Messaging & Announcement Flow

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 👨‍💼 Admin
    participant AdminUI as Admin Panel UI
    participant MsgSvc as Messaging Service
    participant DB as Message & Audit DB
    actor Client as 📱 Client
    participant ClientUI as Client Portal UI

    Admin->>AdminUI: Compose Message (Target Client, Subject, Body, Priority)
    AdminUI->>MsgSvc: Dispatch Direct Message
    MsgSvc->>DB: Save Message (Status: Unread)
    MsgSvc-->>ClientUI: Realtime WebSocket / Push Notification
    MsgSvc-->>Client: Email Notification with Message Summary
    Client->>ClientUI: Opens Portal & Clicks Notification Badge
    ClientUI->>MsgSvc: Acknowledge Read Status
    MsgSvc->>DB: Update Read Timestamp
    MsgSvc-->>AdminUI: Indicator: "Seen by Client at hh:mm"
```

---

### 4.3. Support / Complaint Ticketing System Flow

```mermaid
flowchart TD
    ClientStart[Client encounters issue in product] --> RaiseTicket[Raises Ticket from Portal with Screenshots]
    RaiseTicket --> Validate[System validates & assigns Ticket ID e.g. TCK-1092]
    Validate --> DBStore[(Store in Ticket DB)]
    
    DBStore --> AdminAlert[Admin Panel Badge Alert + Admin Email Notification]
    AdminAlert --> AdminReview[Admin reviews issue & changes status to 'In Progress']
    AdminReview --> AdminReply[Admin adds comment / resolution fix]
    
    AdminReply --> ClientUpdate[Portal reflects updated status + Email sent to Client]
    ClientUpdate --> ClientVerify{Is Client Satisfied?}
    ClientVerify -->|Yes| CloseTicket[Ticket Marked as Resolved & Closed]
    ClientVerify -->|No| ReOpen[Client adds follow-up remark]
    ReOpen --> AdminReview
```

---

### 4.4. Integrated Bidirectional Email System

```mermaid
flowchart LR
    subgraph ClientFlow["Client Portal"]
        CP_Compose["Compose Email in Portal"]
        CP_Inbox["View Inbox & Thread"]
    end

    subgraph MailCore["Email Management Subsystem"]
        SMTP_Out["Outbound SMTP Service"]
        IMAP_Webhook["Inbound Webhook / Parser"]
        EmailStorage[("Email Archive DB")]
    end

    subgraph AdminFlow["Admin Panel"]
        AP_Inbox["View Client Threads in Admin UI"]
        AP_Reply["Reply Directly from Admin UI"]
    end

    CP_Compose -->|Send| SMTP_Out
    SMTP_Out --> EmailStorage
    SMTP_Out --> AP_Inbox

    AP_Reply -->|Send| SMTP_Out
    SMTP_Out --> CP_Inbox

    IMAP_Webhook -->|Parse external email response| EmailStorage
    EmailStorage --> CP_Inbox
    EmailStorage --> AP_Inbox
```

---

### 4.5. Dynamic PDF Generation & Work History Architecture

```mermaid
flowchart TD
    Trigger[Admin or Client Clicks 'Generate / Download PDF'] --> TypeCheck{Select Document Type}
    
    TypeCheck -->|Per-Project Report| T1["Single Project Delivery PDF\n- Scope, Milestones, Completed Features, Dates"]
    TypeCheck -->|Lifetime Client History| T2["Consolidated Work Portfolio PDF\n- All projects done till date, Timelines, Total value"]
    TypeCheck -->|Invoice / Receipt| T3["Payment Statement PDF\n- Amount Paid, Balance Due, Tax ID, Transaction Ref"]

    T1 --> TemplateEngine["PDF Render Engine (Puppeteer / HTML-to-PDF / React-PDF)"]
    T2 --> TemplateEngine
    T3 --> TemplateEngine

    TemplateEngine --> Inject["Inject Company Branding, Logo, Watermarks, Authorized Signature"]
    Inject --> GenPDF["Generate High-Resolution PDF"]
    GenPDF --> S3Upload["Upload to Secure Cloud Storage with Pre-signed URL"]
    S3Upload --> SaveDocRecord["Save metadata to Document Archive DB (Version e.g., v1.0, v2.0)"]
    SaveDocRecord --> Deliver["Deliver to Client Vault & Send Direct Download Link via Email"]
```

---

## 5. Database Schema Design (Entity Relationship)

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : has_or_manages
    USERS ||--o{ PAYMENTS : pays_or_records
    USERS ||--o{ TICKETS : logs_or_handles
    USERS ||--o{ DIRECT_MESSAGES : sends_or_receives
    USERS ||--o{ EMAILS : exchanges
    USERS ||--o{ GENERATED_DOCUMENTS : owns

    PROJECTS ||--o{ MILESTONES : contains
    PROJECTS ||--o{ TICKETS : belongs_to
    PROJECTS ||--o{ PAYMENTS : billed_under
    PROJECTS ||--o{ GENERATED_DOCUMENTS : related_to

    USERS {
        uuid id PK
        string full_name
        string email UK
        string phone
        string role "Admin | Client"
        string company_name
        string status "Active | Suspended"
        timestamp created_at
    }

    PROJECTS {
        uuid id PK
        uuid client_id FK
        string title
        text description
        int progress_percentage "0 - 100"
        string status "Discovery | In_Progress | Review | Completed"
        date start_date
        date estimated_end_date
    }

    MILESTONES {
        uuid id PK
        uuid project_id FK
        string milestone_title
        text milestone_notes
        string status "Pending | In_Progress | Shipped"
        date completion_date
        timestamp updated_at
    }

    PAYMENTS {
        uuid id PK
        uuid client_id FK
        uuid project_id FK
        decimal total_project_cost
        decimal amount_paid
        decimal balance_remaining
        string payment_method
        string transaction_reference
        string payment_status "Paid | Partial | Due"
        timestamp paid_at
    }

    TICKETS {
        uuid id PK
        uuid client_id FK
        uuid project_id FK
        string ticket_code "e.g., TCK-101"
        string subject
        text message
        string priority "Low | Medium | High | Critical"
        string status "Open | In_Progress | Resolved | Closed"
        timestamp created_at
        timestamp resolved_at
    }

    DIRECT_MESSAGES {
        uuid id PK
        uuid client_id FK
        uuid sender_admin_id FK
        string title
        text body
        string message_type "Notice | Urgent | General"
        boolean is_read
        timestamp read_at
        timestamp created_at
    }

    EMAILS {
        uuid id PK
        uuid sender_id FK
        uuid receiver_id FK
        string thread_id
        string subject
        text body_html
        string direction "Inbound | Outbound"
        timestamp sent_at
    }

    GENERATED_DOCUMENTS {
        uuid id PK
        uuid client_id FK
        uuid project_id FK "Nullable for Lifetime Summaries"
        string doc_type "Work_History | Project_Report | Invoice_Receipt"
        string file_name
        string file_url
        string version
        decimal billed_amount "Optional"
        timestamp generated_at
    }
```

---

## 6. Security, Access Control & Privacy
1. **Multi-Tenant Data Isolation:** Har client ko sirf uske records (Projects, Tickets, Messages, PDFs) visible honge. Database queries mein `client_id` mandatory filter rahega.
2. **Role-Based Access Control (RBAC):**
   - **Client Role:** Read-only access to projects/invoices; Write access to create tickets and send emails/messages.
   - **Admin Role:** Full CRUD access to clients, projects, payments, ticket resolution, and PDF generation.
3. **Protected PDF Assets:** Generated PDFs public bucket mein nahi honge; unhein Pre-signed secure URLs (time-limited expiry) se deliver kiya jayega.
4. **Audit Logging:** Har milestone update, payment addition aur message dispatch ka immutable timestamped audit log maintain hoga.
