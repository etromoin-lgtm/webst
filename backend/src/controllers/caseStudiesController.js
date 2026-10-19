const { run, all, get } = require('../config/database');
const { resolveFavicon } = require('../services/faviconService');

// Helper to safely parse JSON or return default
function safeJsonParse(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// Helper to stringify JSON fields safely
function safeJsonStringify(val, fallback = '[]') {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch {
    return fallback;
  }
}

// Format database row to clean object
function formatCaseStudy(row) {
  if (!row) return null;
  return {
    ...row,
    is_client_confidential: Boolean(row.is_client_confidential),
    featured: Boolean(row.featured),
    featured_on_homepage: Boolean(row.featured_on_homepage),
    featured_in_trusted_by: Boolean(row.featured_in_trusted_by),
    embedded_link: row.embedded_link || '',
    custom_favicon_url: row.custom_favicon_url || '',
    services: safeJsonParse(row.services, []),
    technologies: safeJsonParse(row.technologies, []),
    challenge_points: safeJsonParse(row.challenge_points, []),
    goals_baseline: safeJsonParse(row.goals_baseline, []),
    approach_phases: safeJsonParse(row.approach_phases, []),
    solution_features: safeJsonParse(row.solution_features, []),
    before_after_metrics: safeJsonParse(row.before_after_metrics, []),
    key_results: safeJsonParse(row.key_results, []),
    lessons_learned: safeJsonParse(row.lessons_learned, []),
    external_links: safeJsonParse(row.external_links, []),
    custom_tables: safeJsonParse(row.custom_tables, []),
    testimonial: safeJsonParse(row.testimonial, null)
  };
}

// GET all case studies
async function getCaseStudies(req, res) {
  try {
    const isAll = req.query.all === 'true';
    let query = 'SELECT * FROM case_studies';
    const conditions = [];
    const params = [];

    if (!isAll) {
      conditions.push("status = 'published'");
    }

    if (req.query.featured_on_homepage === 'true') {
      conditions.push("featured_on_homepage = 1");
    }

    if (req.query.featured_in_trusted_by === 'true') {
      conditions.push("featured_in_trusted_by = 1");
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY sort_order ASC, featured DESC, created_at DESC';

    const rows = await all(query, params);
    const caseStudies = rows.map(formatCaseStudy);
    res.json({ success: true, case_studies: caseStudies });
  } catch (err) {
    console.error('Error fetching case studies:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}

// GET single case study by slug
async function getCaseStudyBySlug(req, res) {
  try {
    const { slug } = req.params;
    const isPreview = req.query.preview === 'true';

    let query = 'SELECT * FROM case_studies WHERE slug = ?';
    if (!isPreview) {
      query += " AND status = 'published'";
    }

    const row = await get(query, [slug]);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Case study not found' });
    }

    res.json({ success: true, case_study: formatCaseStudy(row) });
  } catch (err) {
    console.error('Error fetching case study by slug:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}

// POST create case study
async function createCaseStudy(req, res) {
  try {
    const {
      title,
      slug,
      subtitle,
      category,
      industry,
      client_name,
      is_client_confidential,
      cover_image,
      duration,
      services,
      technologies,
      business_type,
      challenge_overview,
      challenge_points,
      goals_baseline,
      approach_phases,
      solution_overview,
      solution_features,
      solution_architecture_image,
      before_after_metrics,
      key_results,
      methodology,
      lessons_learned,
      external_links,
      custom_tables,
      testimonial,
      status = 'published',
      featured = 0,
      featured_on_homepage = 0,
      featured_in_trusted_by = 0,
      embedded_link = '',
      custom_favicon_url = '',
      sort_order = 0,
      author = 'Engineering Team',
      seo_title,
      seo_description
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, error: 'Title and slug are required' });
    }

    // Generate unique slug if collision
    let finalSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await get('SELECT id FROM case_studies WHERE slug = ?', [finalSlug]);
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const result = await run(
      `INSERT INTO case_studies (
        slug, title, subtitle, category, industry, client_name, is_client_confidential,
        cover_image, duration, services, technologies, business_type,
        challenge_overview, challenge_points, goals_baseline, approach_phases,
        solution_overview, solution_features, solution_architecture_image,
        before_after_metrics, key_results, methodology, lessons_learned,
        external_links, custom_tables, testimonial, status, featured,
        featured_on_homepage, featured_in_trusted_by, embedded_link, custom_favicon_url,
        sort_order, author, seo_title, seo_description
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )`,
      [
        finalSlug,
        title,
        subtitle || '',
        category || 'General',
        industry || 'Technology',
        client_name || 'Client Partner',
        is_client_confidential ? 1 : 0,
        cover_image || '',
        duration || '',
        safeJsonStringify(services, '[]'),
        safeJsonStringify(technologies, '[]'),
        business_type || '',
        challenge_overview || '',
        safeJsonStringify(challenge_points, '[]'),
        safeJsonStringify(goals_baseline, '[]'),
        safeJsonStringify(approach_phases, '[]'),
        solution_overview || '',
        safeJsonStringify(solution_features, '[]'),
        solution_architecture_image || '',
        safeJsonStringify(before_after_metrics, '[]'),
        safeJsonStringify(key_results, '[]'),
        methodology || '',
        safeJsonStringify(lessons_learned, '[]'),
        safeJsonStringify(external_links, '[]'),
        safeJsonStringify(custom_tables, '[]'),
        safeJsonStringify(testimonial, 'null'),
        status || 'published',
        featured ? 1 : 0,
        featured_on_homepage ? 1 : 0,
        featured_in_trusted_by ? 1 : 0,
        embedded_link || '',
        custom_favicon_url || '',
        Number(sort_order) || 0,
        author || 'Engineering Team',
        seo_title || title,
        seo_description || subtitle || ''
      ]
    );

    const inserted = await get('SELECT * FROM case_studies WHERE id = ?', [result.lastID]);
    res.json({ success: true, case_study: formatCaseStudy(inserted) });
  } catch (err) {
    console.error('Error creating case study:', err);
    res.status(500).json({ success: false, error: err.message || 'Database error' });
  }
}

// PUT update case study
async function updateCaseStudy(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await get('SELECT * FROM case_studies WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Case study not found' });
    }

    const finalSlug = body.slug || existing.slug;

    await run(
      `UPDATE case_studies SET
        slug = ?, title = ?, subtitle = ?, category = ?, industry = ?, client_name = ?,
        is_client_confidential = ?, cover_image = ?, duration = ?, services = ?, technologies = ?,
        business_type = ?, challenge_overview = ?, challenge_points = ?, goals_baseline = ?,
        approach_phases = ?, solution_overview = ?, solution_features = ?,
        solution_architecture_image = ?, before_after_metrics = ?, key_results = ?,
        methodology = ?, lessons_learned = ?, external_links = ?, custom_tables = ?,
        testimonial = ?, status = ?, featured = ?, featured_on_homepage = ?,
        featured_in_trusted_by = ?, embedded_link = ?, custom_favicon_url = ?,
        sort_order = ?, author = ?, seo_title = ?, seo_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        finalSlug,
        body.title !== undefined ? body.title : existing.title,
        body.subtitle !== undefined ? body.subtitle : existing.subtitle,
        body.category !== undefined ? body.category : existing.category,
        body.industry !== undefined ? body.industry : existing.industry,
        body.client_name !== undefined ? body.client_name : existing.client_name,
        body.is_client_confidential !== undefined ? (body.is_client_confidential ? 1 : 0) : existing.is_client_confidential,
        body.cover_image !== undefined ? body.cover_image : existing.cover_image,
        body.duration !== undefined ? body.duration : existing.duration,
        body.services !== undefined ? safeJsonStringify(body.services) : existing.services,
        body.technologies !== undefined ? safeJsonStringify(body.technologies) : existing.technologies,
        body.business_type !== undefined ? body.business_type : existing.business_type,
        body.challenge_overview !== undefined ? body.challenge_overview : existing.challenge_overview,
        body.challenge_points !== undefined ? safeJsonStringify(body.challenge_points) : existing.challenge_points,
        body.goals_baseline !== undefined ? safeJsonStringify(body.goals_baseline) : existing.goals_baseline,
        body.approach_phases !== undefined ? safeJsonStringify(body.approach_phases) : existing.approach_phases,
        body.solution_overview !== undefined ? body.solution_overview : existing.solution_overview,
        body.solution_features !== undefined ? safeJsonStringify(body.solution_features) : existing.solution_features,
        body.solution_architecture_image !== undefined ? body.solution_architecture_image : existing.solution_architecture_image,
        body.before_after_metrics !== undefined ? safeJsonStringify(body.before_after_metrics) : existing.before_after_metrics,
        body.key_results !== undefined ? safeJsonStringify(body.key_results) : existing.key_results,
        body.methodology !== undefined ? body.methodology : existing.methodology,
        body.lessons_learned !== undefined ? safeJsonStringify(body.lessons_learned) : existing.lessons_learned,
        body.external_links !== undefined ? safeJsonStringify(body.external_links) : existing.external_links,
        body.custom_tables !== undefined ? safeJsonStringify(body.custom_tables) : existing.custom_tables,
        body.testimonial !== undefined ? safeJsonStringify(body.testimonial, 'null') : existing.testimonial,
        body.status !== undefined ? body.status : existing.status,
        body.featured !== undefined ? (body.featured ? 1 : 0) : existing.featured,
        body.featured_on_homepage !== undefined ? (body.featured_on_homepage ? 1 : 0) : (existing.featured_on_homepage || 0),
        body.featured_in_trusted_by !== undefined ? (body.featured_in_trusted_by ? 1 : 0) : (existing.featured_in_trusted_by || 0),
        body.embedded_link !== undefined ? body.embedded_link : (existing.embedded_link || ''),
        body.custom_favicon_url !== undefined ? body.custom_favicon_url : (existing.custom_favicon_url || ''),
        body.sort_order !== undefined ? Number(body.sort_order) : existing.sort_order,
        body.author !== undefined ? body.author : existing.author,
        body.seo_title !== undefined ? body.seo_title : existing.seo_title,
        body.seo_description !== undefined ? body.seo_description : existing.seo_description,
        id
      ]
    );

    const updated = await get('SELECT * FROM case_studies WHERE id = ?', [id]);
    res.json({ success: true, case_study: formatCaseStudy(updated) });
  } catch (err) {
    console.error('Error updating case study:', err);
    res.status(500).json({ success: false, error: err.message || 'Database error' });
  }
}

// DELETE case study
async function deleteCaseStudy(req, res) {
  try {
    const { id } = req.params;
    await run('DELETE FROM case_studies WHERE id = ?', [id]);
    res.json({ success: true, message: 'Case study deleted' });
  } catch (err) {
    console.error('Error deleting case study:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}

// POST duplicate case study
async function duplicateCaseStudy(req, res) {
  try {
    const { id } = req.params;
    const original = await get('SELECT * FROM case_studies WHERE id = ?', [id]);
    if (!original) {
      return res.status(404).json({ success: false, error: 'Original case study not found' });
    }

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newTitle = `${original.title} (Draft Copy)`;

    const result = await run(
      `INSERT INTO case_studies (
        slug, title, subtitle, category, industry, client_name, is_client_confidential,
        cover_image, duration, services, technologies, business_type,
        challenge_overview, challenge_points, goals_baseline, approach_phases,
        solution_overview, solution_features, solution_architecture_image,
        before_after_metrics, key_results, methodology, lessons_learned,
        external_links, custom_tables, testimonial, status, featured, sort_order,
        author, seo_title, seo_description
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )`,
      [
        newSlug,
        newTitle,
        original.subtitle,
        original.category,
        original.industry,
        original.client_name,
        original.is_client_confidential,
        original.cover_image,
        original.duration,
        original.services,
        original.technologies,
        original.business_type,
        original.challenge_overview,
        original.challenge_points,
        original.goals_baseline,
        original.approach_phases,
        original.solution_overview,
        original.solution_features,
        original.solution_architecture_image,
        original.before_after_metrics,
        original.key_results,
        original.methodology,
        original.lessons_learned,
        original.external_links,
        original.custom_tables,
        original.testimonial,
        'draft',
        0,
        (original.sort_order || 0) + 1,
        original.author,
        newTitle,
        original.seo_description
      ]
    );

    const cloned = await get('SELECT * FROM case_studies WHERE id = ?', [result.lastID]);
    res.json({ success: true, case_study: formatCaseStudy(cloned) });
  } catch (err) {
    console.error('Error duplicating case study:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}

// POST detect favicon from URL
async function detectFaviconEndpoint(req, res) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    const detection = await resolveFavicon(url);
    res.json(detection);
  } catch (err) {
    console.error('Error in detectFaviconEndpoint:', err);
    res.status(500).json({ success: false, error: 'Favicon detection failed' });
  }
}

module.exports = {
  getCaseStudies,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  duplicateCaseStudy,
  detectFaviconEndpoint
};
