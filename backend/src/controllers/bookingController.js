const db = require('../config/database');
const { fireWebhook } = require('../services/webhookService');

const createBooking = async (req, res) => {
  const { name, email, phone, company, country, topics, message, date, time } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO bookings (name, email, phone, company, country, topics, message, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, company, country, JSON.stringify(topics || []), message, date, time]
    );
    const row = await db.get('SELECT * FROM bookings WHERE id = ?', [result.lastID]);
    fireWebhook('new_booking', row);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createBooking
};
