const db = require('../config/database');

const getActiveTeam = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM team_members WHERE is_active = 1 OR is_active IS NULL ORDER BY sort_order ASC, created_at ASC');
    res.json({ team: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getAllTeam = async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM team_members ORDER BY sort_order ASC, created_at ASC');
    res.json({ team: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createTeamMember = async (req, res) => {
  const {
    name, role, department, short_desc, bio, email,
    linkedin_url, github_url, x_url, instagram_url, facebook_url, youtube_url, website_url,
    image_url, skills, sort_order, is_active
  } = req.body;
  try {
    const result = await db.run(
      `INSERT INTO team_members (
        name, role, department, short_desc, bio, email,
        linkedin_url, github_url, x_url, instagram_url, facebook_url, youtube_url, website_url,
        image_url, skills, sort_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, role || null, department || null, short_desc || null, bio || null, email || null,
        linkedin_url || null, github_url || null, x_url || null, instagram_url || null, facebook_url || null, youtube_url || null, website_url || null,
        image_url || null, skills || null, sort_order || 0, is_active !== undefined ? is_active : 1
      ]
    );
    const row = await db.get('SELECT * FROM team_members WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, team_member: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateTeamMember = async (req, res) => {
  const {
    name, role, department, short_desc, bio, email,
    linkedin_url, github_url, x_url, instagram_url, facebook_url, youtube_url, website_url,
    image_url, skills, sort_order, is_active
  } = req.body;
  try {
    await db.run(
      `UPDATE team_members SET
        name = ?, role = ?, department = ?, short_desc = ?, bio = ?, email = ?,
        linkedin_url = ?, github_url = ?, x_url = ?, instagram_url = ?, facebook_url = ?, youtube_url = ?, website_url = ?,
        image_url = ?, skills = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [
        name, role || null, department || null, short_desc || null, bio || null, email || null,
        linkedin_url || null, github_url || null, x_url || null, instagram_url || null, facebook_url || null, youtube_url || null, website_url || null,
        image_url || null, skills || null, sort_order || 0, is_active !== undefined ? is_active : 1,
        req.params.id
      ]
    );
    const row = await db.get('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
    res.json({ success: true, team_member: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    await db.run('DELETE FROM team_members WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getActiveTeam,
  getAllTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
