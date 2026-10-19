const db = require('../config/database');

// --- CLIENT AUTH & REGISTRATION ---
const registerClient = async (req, res) => {
  try {
    const { legal_name, brand_name, primary_email, phone, website, password, contact_name, has_previous_work, previous_work_details } = req.body;

    if (!primary_email || !password || !legal_name) {
      return res.status(400).json({ success: false, error: 'Email, Organization Name and Password are required.' });
    }

    // Check if organization or user exists
    const existingUser = await db.get('SELECT id FROM portal_users WHERE email = ?', [primary_email]);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists. Please log in.' });
    }

    // Create Organization
    const verificationStatus = has_previous_work ? 'PENDING_MATCH' : 'VERIFIED';
    const orgResult = await db.run(
      `INSERT INTO organizations (legal_name, brand_name, primary_email, phone, website, verification_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [legal_name, brand_name || legal_name, primary_email, phone || '', website || '', verificationStatus]
    );

    const orgId = orgResult.lastID;

    // Create User
    const userResult = await db.run(
      `INSERT INTO portal_users (organization_id, email, password_hash, full_name, phone, role)
       VALUES (?, ?, ?, ?, ?, 'CLIENT')`,
      [orgId, primary_email, password, contact_name || legal_name, phone || '']
    );

    const userId = userResult.lastID;

    // If customer claimed previous work, store in historical_record_claims for Admin review
    if (has_previous_work && previous_work_details) {
      await db.run(
        `INSERT INTO portal_historical_claims (organization_id, user_id, claim_type, declared_name, declared_reference_number, declared_old_email, approximate_date, notes, verification_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
        [
          orgId,
          userId,
          previous_work_details.claim_type || 'PROJECT',
          previous_work_details.declared_name || 'Previous Project',
          previous_work_details.reference_number || '',
          previous_work_details.old_email || primary_email,
          previous_work_details.approximate_date || '',
          previous_work_details.notes || ''
        ]
      );
    }

    // Audit log
    await db.run(
      `INSERT INTO portal_audit_logs (organization_id, actor_name, action, details)
       VALUES (?, ?, 'CLIENT_REGISTERED', ?)`,
      [orgId, contact_name || legal_name, `Client registered. Previous work claim: ${has_previous_work ? 'YES' : 'NO'}`]
    );

    res.status(201).json({
      success: true,
      token: `client-session-${userId}-${Date.now()}`,
      client: {
        id: userId,
        organization_id: orgId,
        full_name: contact_name || legal_name,
        email: primary_email,
        company: legal_name,
        verification_status: verificationStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.get(
      `SELECT u.*, o.legal_name as company_name, o.verification_status 
       FROM portal_users u 
       JOIN organizations o ON u.organization_id = o.id 
       WHERE u.email = ? AND u.password_hash = ? AND u.is_active = 1`,
      [email, password]
    );

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      token: `client-session-${user.id}-${Date.now()}`,
      client: {
        id: user.id,
        organization_id: user.organization_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        company: user.company_name,
        verification_status: user.verification_status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- CLIENT DASHBOARD OVERVIEW ---
const getClientDashboard = async (req, res) => {
  try {
    const orgId = req.params.orgId;

    const organization = await db.get('SELECT * FROM organizations WHERE id = ?', [orgId]);
    if (!organization) {
      return res.status(404).json({ success: false, error: 'Organization not found.' });
    }

    const products = await db.all('SELECT * FROM portal_product_purchases WHERE organization_id = ? ORDER BY purchase_date DESC', [orgId]);
    const projects = await db.all('SELECT * FROM portal_projects WHERE organization_id = ? ORDER BY is_historical_record ASC, created_at DESC', [orgId]);
    
    // Milestones for projects
    for (let p of projects) {
      p.milestones = await db.all('SELECT * FROM portal_milestones WHERE project_id = ? ORDER BY id ASC', [p.id]);
    }

    const invoices = await db.all('SELECT * FROM portal_invoices WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const documents = await db.all('SELECT * FROM portal_documents WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const tickets = await db.all('SELECT * FROM portal_tickets WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const messages = await db.all('SELECT * FROM portal_direct_messages WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const claims = await db.all('SELECT * FROM portal_historical_claims WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);

    // Financial calculations
    const totalPaid = invoices.reduce((acc, inv) => acc + (inv.amount_paid || 0), 0);
    const totalBilled = invoices.reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
    const totalBalance = totalBilled - totalPaid;

    res.json({
      success: true,
      data: {
        organization,
        products,
        projects,
        invoices,
        documents,
        tickets,
        messages,
        claims,
        financials: {
          totalBilled,
          totalPaid,
          totalBalance
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- TICKETING ACTIONS ---
const createTicket = async (req, res) => {
  try {
    const { organization_id, user_id, project_id, product_id, subject, priority, initial_message } = req.body;
    const ticketCode = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await db.run(
      `INSERT INTO portal_tickets (organization_id, user_id, project_id, product_id, ticket_code, subject, priority, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [organization_id, user_id, project_id || null, product_id || null, ticketCode, subject, priority || 'MEDIUM']
    );

    const ticketId = result.lastID;

    if (initial_message) {
      const user = await db.get('SELECT full_name FROM portal_users WHERE id = ?', [user_id]);
      await db.run(
        `INSERT INTO portal_ticket_messages (ticket_id, sender_name, sender_role, message_body)
         VALUES (?, ?, 'CLIENT', ?)`,
        [ticketId, user ? user.full_name : 'Client', initial_message]
      );
    }

    res.status(201).json({ success: true, ticket_id: ticketId, ticket_code: ticketCode });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getTicketDetails = async (req, res) => {
  try {
    const ticket = await db.get('SELECT * FROM portal_tickets WHERE id = ?', [req.params.id]);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    const messages = await db.all('SELECT * FROM portal_ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC', [req.params.id]);
    res.json({ success: true, ticket, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const replyTicket = async (req, res) => {
  try {
    const { sender_name, sender_role, message_body } = req.body;
    await db.run(
      `INSERT INTO portal_ticket_messages (ticket_id, sender_name, sender_role, message_body)
       VALUES (?, ?, ?, ?)`,
      [req.params.id, sender_name, sender_role || 'CLIENT', message_body]
    );

    if (sender_role === 'ADMIN') {
      await db.run("UPDATE portal_tickets SET status = 'IN_PROGRESS' WHERE id = ?", [req.params.id]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- MARK MESSAGE READ ---
const markMessageRead = async (req, res) => {
  try {
    await db.run('UPDATE portal_direct_messages SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  registerClient,
  loginClient,
  getClientDashboard,
  createTicket,
  getTicketDetails,
  replyTicket,
  markMessageRead
};
