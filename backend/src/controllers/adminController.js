const db = require('../config/database');
const { getWebhookConfig, setWebhookUrl } = require('../services/webhookService');

// Admin Auth
const login = (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    if (typeof req.recordLoginSuccess === 'function') {
      req.recordLoginSuccess();
    }
    return res.status(200).json({
      success: true,
      token: 'admin-jwt-token-secure-123',
      role: 'super_admin'
    });
  } else {
    let failureInfo = null;
    if (typeof req.recordLoginFailure === 'function') {
      failureInfo = req.recordLoginFailure();
    }

    if (failureInfo && failureInfo.isLocked) {
      return res.status(429).json({
        success: false,
        error: `Security Lockout: Maximum login attempts exceeded. Account access locked for ${failureInfo.lockoutMinutes} minutes.`,
        locked: true,
        retryAfterSeconds: failureInfo.lockoutMinutes * 60
      });
    }

    const remainingMsg = failureInfo ? ` (${failureInfo.remaining} attempts remaining)` : '';
    return res.status(401).json({
      success: false,
      error: `Invalid credentials.${remainingMsg}`,
      remainingAttempts: failureInfo ? failureInfo.remaining : undefined
    });
  }
};

// Webhooks
const getWebhooks = (req, res) => {
  res.json({ success: true, webhook: getWebhookConfig() });
};

const updateWebhooks = (req, res) => {
  setWebhookUrl(req.body.url);
  res.json({ success: true, message: 'Webhook URL updated' });
};

// Partner Applications
const getApplications = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM partner_applications ORDER BY created_at DESC');
    res.json({ applications: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateApplication = async (req, res) => {
  const { status, notes } = req.body;
  try {
    await db.run('UPDATE partner_applications SET status = ?, notes = ? WHERE id = ?', [status, notes, req.params.id]);
    const row = await db.get('SELECT * FROM partner_applications WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    await db.run('DELETE FROM partner_applications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Contacts
const getContacts = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ contacts: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateContact = async (req, res) => {
  try {
    await db.run('UPDATE contacts SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Bookings
const getBookings = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ bookings: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    await db.run('UPDATE bookings SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Stats
const getStats = async (req, res) => {
  try {
    const [contacts, bookings, applications, blogs, products, team, caseStudies] = await Promise.all([
      db.get('SELECT COUNT(*) as count FROM contacts'),
      db.get('SELECT COUNT(*) as count FROM bookings'),
      db.get('SELECT COUNT(*) as count FROM partner_applications'),
      db.get('SELECT COUNT(*) as count FROM blogs'),
      db.get('SELECT COUNT(*) as count FROM products'),
      db.get('SELECT COUNT(*) as count FROM team_members'),
      db.get('SELECT COUNT(*) as count FROM case_studies').catch(() => ({ count: 0 }))
    ]);
    res.json({
      contacts: contacts?.count || 0,
      bookings: bookings?.count || 0,
      applications: applications?.count || 0,
      blogs: blogs?.count || 0,
      products: products?.count || 0,
      team: team?.count || 0,
      case_studies: caseStudies?.count || 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  login,
  getWebhooks,
  updateWebhooks,
  getApplications,
  updateApplication,
  deleteApplication,
  getContacts,
  updateContact,
  getBookings,
  updateBooking,
  getStats
};
