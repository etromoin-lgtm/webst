const db = require('../config/database');

// --- GET ALL ORGANIZATIONS & CLIENTS ---
const getClientsList = async (req, res) => {
  try {
    const orgs = await db.all(`
      SELECT o.*, 
        (SELECT COUNT(*) FROM portal_projects WHERE organization_id = o.id) as project_count,
        (SELECT COUNT(*) FROM portal_product_purchases WHERE organization_id = o.id) as product_count,
        (SELECT COUNT(*) FROM portal_tickets WHERE organization_id = o.id AND status != 'RESOLVED') as open_tickets_count,
        (SELECT COUNT(*) FROM portal_historical_claims WHERE organization_id = o.id AND verification_status = 'PENDING') as pending_claims_count
      FROM organizations o
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, clients: orgs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- GET SPECIFIC CLIENT FULL PROFILE ---
const getClientFullProfile = async (req, res) => {
  try {
    const orgId = req.params.orgId;
    const organization = await db.get('SELECT * FROM organizations WHERE id = ?', [orgId]);
    if (!organization) return res.status(404).json({ success: false, error: 'Client organization not found' });

    const users = await db.all('SELECT id, email, full_name, phone, role, is_active, created_at FROM portal_users WHERE organization_id = ?', [orgId]);
    const products = await db.all('SELECT * FROM portal_product_purchases WHERE organization_id = ? ORDER BY purchase_date DESC', [orgId]);
    const projects = await db.all('SELECT * FROM portal_projects WHERE organization_id = ? ORDER BY is_historical_record ASC, created_at DESC', [orgId]);
    
    for (let p of projects) {
      p.milestones = await db.all('SELECT * FROM portal_milestones WHERE project_id = ? ORDER BY id ASC', [p.id]);
    }

    const invoices = await db.all('SELECT * FROM portal_invoices WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const documents = await db.all('SELECT * FROM portal_documents WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const tickets = await db.all('SELECT * FROM portal_tickets WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const messages = await db.all('SELECT * FROM portal_direct_messages WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const claims = await db.all('SELECT * FROM portal_historical_claims WHERE organization_id = ? ORDER BY created_at DESC', [orgId]);
    const audits = await db.all('SELECT * FROM portal_audit_logs WHERE organization_id = ? ORDER BY created_at DESC LIMIT 20', [orgId]);

    res.json({
      success: true,
      profile: {
        organization,
        users,
        products,
        projects,
        invoices,
        documents,
        tickets,
        messages,
        claims,
        audits
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- ADD PROJECT (HISTORICAL OR ACTIVE) ---
const addProject = async (req, res) => {
  try {
    const {
      organization_id,
      name,
      scope_summary,
      project_type,
      progress_percentage,
      status,
      is_historical_record,
      start_date,
      target_or_completion_date,
      assigned_admin_name
    } = req.body;

    const projectCode = `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const result = await db.run(
      `INSERT INTO portal_projects (organization_id, project_code, name, scope_summary, project_type, progress_percentage, status, is_historical_record, start_date, target_or_completion_date, assigned_admin_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        organization_id,
        projectCode,
        name,
        scope_summary || '',
        project_type || 'CUSTOM_DEV',
        progress_percentage || 0,
        status || 'IN_PROGRESS',
        is_historical_record ? 1 : 0,
        start_date || '',
        target_or_completion_date || '',
        assigned_admin_name || 'Engineering Team'
      ]
    );

    // Audit log
    await db.run(
      `INSERT INTO portal_audit_logs (organization_id, actor_name, action, details)
       VALUES (?, 'Admin', 'PROJECT_CREATED', ?)`,
      [organization_id, `Added project: ${name} (Historical: ${is_historical_record ? 'YES' : 'NO'})`]
    );

    res.status(201).json({ success: true, project_id: result.lastID, project_code: projectCode });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- UPDATE PROJECT FULL DETAILS & PROGRESS ---
const updateProject = async (req, res) => {
  try {
    const {
      name,
      scope_summary,
      project_type,
      progress_percentage,
      status,
      target_or_completion_date,
      is_historical_record
    } = req.body;

    await db.run(
      `UPDATE portal_projects 
       SET name = COALESCE(?, name),
           scope_summary = COALESCE(?, scope_summary),
           project_type = COALESCE(?, project_type),
           progress_percentage = COALESCE(?, progress_percentage),
           status = COALESCE(?, status),
           target_or_completion_date = COALESCE(?, target_or_completion_date),
           is_historical_record = COALESCE(?, is_historical_record)
       WHERE id = ?`,
      [
        name !== undefined ? name : null,
        scope_summary !== undefined ? scope_summary : null,
        project_type !== undefined ? project_type : null,
        progress_percentage !== undefined ? progress_percentage : null,
        status !== undefined ? status : null,
        target_or_completion_date !== undefined ? target_or_completion_date : null,
        is_historical_record !== undefined ? (is_historical_record ? 1 : 0) : null,
        req.params.id
      ]
    );

    const project = await db.get('SELECT * FROM portal_projects WHERE id = ?', [req.params.id]);

    // Audit log
    if (project) {
      await db.run(
        `INSERT INTO portal_audit_logs (organization_id, actor_name, action, details)
         VALUES (?, 'Admin', 'PROJECT_UPDATED', ?)`,
        [project.organization_id, `Updated project '${project.name}': ${project.progress_percentage}% (${project.status})`]
      );
    }

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- DELETE PROJECT ---
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await db.get('SELECT * FROM portal_projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Delete associated milestones
    await db.run('DELETE FROM portal_project_milestones WHERE project_id = ?', [projectId]);
    // Delete project
    await db.run('DELETE FROM portal_projects WHERE id = ?', [projectId]);

    // Audit log
    await db.run(
      `INSERT INTO portal_audit_logs (organization_id, actor_name, action, details)
       VALUES (?, 'Admin', 'PROJECT_DELETED', ?)`,
      [project.organization_id, `Deleted project: ${project.name} (${project.project_code})`]
    );

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- ADD MILESTONE ---
const addMilestone = async (req, res) => {
  try {
    const { project_id, title, notes, status, completion_date } = req.body;
    const result = await db.run(
      `INSERT INTO portal_milestones (project_id, title, notes, status, completion_date)
       VALUES (?, ?, ?, ?, ?)`,
      [project_id, title, notes || '', status || 'PENDING', completion_date || '']
    );
    res.status(201).json({ success: true, milestone_id: result.lastID });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- ADD PRODUCT PURCHASE ---
const addProductPurchase = async (req, res) => {
  try {
    const { organization_id, product_name, license_key, purchase_date, entitlement_type, status, price_paid } = req.body;
    const key = license_key || `ETRO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const result = await db.run(
      `INSERT INTO portal_product_purchases (organization_id, product_name, license_key, purchase_date, entitlement_type, status, price_paid)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [organization_id, product_name, key, purchase_date || new Date().toISOString().split('T')[0], entitlement_type || 'LIFETIME', status || 'ACTIVE', price_paid || '$0']
    );

    await db.run(
      `INSERT INTO portal_audit_logs (organization_id, actor_name, action, details)
       VALUES (?, 'Admin', 'PRODUCT_PURCHASE_ADDED', ?)`,
      [organization_id, `Assigned product: ${product_name} (${key})`]
    );

    res.status(201).json({ success: true, purchase_id: result.lastID });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- UPLOAD / RECORD DOCUMENT (PDF, REPORT) ---
const addDocument = async (req, res) => {
  try {
    const { organization_id, project_id, title, document_type, file_url, file_size, version } = req.body;
    const result = await db.run(
      `INSERT INTO portal_documents (organization_id, project_id, title, document_type, file_url, file_size, version)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [organization_id, project_id || null, title, document_type || 'REPORT', file_url || '/uploads/report.pdf', file_size || '1.0 MB', version || 'v1.0']
    );
    res.status(201).json({ success: true, document_id: result.lastID });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- ADD INVOICE & PAYMENT ---
const addInvoice = async (req, res) => {
  try {
    const { organization_id, project_id, invoice_number, title, total_amount, amount_paid, due_date, status } = req.body;
    const invNumber = invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const result = await db.run(
      `INSERT INTO portal_invoices (organization_id, project_id, invoice_number, title, total_amount, amount_paid, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [organization_id, project_id || null, invNumber, title, total_amount || 0, amount_paid || 0, due_date || '', status || 'PAID']
    );

    await db.run(
      `INSERT INTO portal_audit_logs (organization_id, actor_name, action, details)
       VALUES (?, 'Admin', 'INVOICE_LOGGED', ?)`,
      [organization_id, `Created invoice ${invNumber} ($${total_amount})`]
    );

    res.status(201).json({ success: true, invoice_id: result.lastID });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- DIRECT MESSAGE TO CLIENT ---
const sendDirectMessage = async (req, res) => {
  try {
    const { organization_id, sender_name, title, message_body, priority } = req.body;
    const result = await db.run(
      `INSERT INTO portal_direct_messages (organization_id, sender_name, title, message_body, priority)
       VALUES (?, ?, ?, ?, ?)`,
      [organization_id, sender_name || 'Admin', title, message_body, priority || 'NORMAL']
    );

    res.status(201).json({ success: true, message_id: result.lastID });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- REVIEW HISTORICAL CLAIM (APPROVE OR REJECT) ---
const reviewClaim = async (req, res) => {
  try {
    const { status, admin_decision_notes } = req.body;
    const claim = await db.get('SELECT * FROM portal_historical_claims WHERE id = ?', [req.params.id]);
    if (!claim) return res.status(404).json({ success: false, error: 'Claim not found' });

    await db.run(
      `UPDATE portal_historical_claims 
       SET verification_status = ?, admin_decision_notes = ? 
       WHERE id = ?`,
      [status, admin_decision_notes || '', req.params.id]
    );

    if (status === 'APPROVED') {
      // Mark organization as fully verified
      await db.run("UPDATE organizations SET verification_status = 'VERIFIED' WHERE id = ?", [claim.organization_id]);
      
      // Auto-create historical project placeholder if not exists
      const pCode = `PRJ-HIST-${Math.floor(100 + Math.random() * 900)}`;
      await db.run(
        `INSERT INTO portal_projects (organization_id, project_code, name, scope_summary, project_type, progress_percentage, status, is_historical_record, target_or_completion_date)
         VALUES (?, ?, ?, ?, 'AUTOMATION', 100, 'COMPLETED', 1, ?)`,
        [claim.organization_id, pCode, claim.declared_name, `Verified historical work claim: ${claim.notes || 'Prior client engagement'}`, claim.approximate_date || 'Past Engagement']
      );
    }

    await db.run(
      `INSERT INTO portal_audit_logs (organization_id, actor_name, action, details)
       VALUES (?, 'Admin', 'CLAIM_REVIEWED', ?)`,
      [claim.organization_id, `Historical claim for '${claim.declared_name}' ${status}`]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getClientsList,
  getClientFullProfile,
  addProject,
  updateProject,
  deleteProject,
  addMilestone,
  addProductPurchase,
  addDocument,
  addInvoice,
  sendDirectMessage,
  reviewClaim
};
