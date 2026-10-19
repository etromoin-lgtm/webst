const db = require('../config/database');
const { fireWebhook } = require('../services/webhookService');

const submitContact = async (req, res) => {
  const { name, email, company, message } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO contacts (name, email, company, message) VALUES (?, ?, ?, ?)',
      [name, email, company, message]
    );
    const row = await db.get('SELECT * FROM contacts WHERE id = ?', [result.lastID]);
    fireWebhook('new_contact', row);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  submitContact
};
