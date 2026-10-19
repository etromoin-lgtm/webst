const db = require('../config/database');

const generateCode = (type) => {
  const prefix = type === 'tech' ? 'TECH' : 'SALE';
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomStr}`;
};

const applyPartner = async (req, res) => {
  const { type, name, email, company, product_name, website, agency_name, experience, linkedin } = req.body;
  const code = generateCode(type);
  try {
    const result = await db.run(
      `INSERT INTO partner_applications (type, name, email, company, product_name, website, agency_name, experience, linkedin, code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, name, email, company || null, product_name || null, website || null, agency_name || null, experience || null, linkedin || null, code]
    );
    const row = await db.get('SELECT * FROM partner_applications WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, code, data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPartnerStatus = async (req, res) => {
  try {
    const row = await db.get('SELECT status, name, type FROM partner_applications WHERE code = ?', [req.params.code]);
    if (row) {
      res.status(200).json({ success: true, data: row });
    } else {
      res.status(404).json({ success: false, error: 'Application code not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  applyPartner,
  getPartnerStatus
};
