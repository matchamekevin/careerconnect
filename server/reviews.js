// Routes Express pour avis/questions/réponses
const express = require('express');
const router = express.Router();
const pool = require('./db'); // Assure-toi que ce fichier exporte le pool pg

// Créer un avis/question
router.post('/', async (req, res) => {
  const { user_id, type, content, parent_id, user_name, user_email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, type, content, parent_id, user_name, user_email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, type, content, parent_id || null, user_name, user_email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les avis/questions/réponses avec pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, type = 'all' } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = `
      SELECT r.*, 
             COALESCE(r.user_name, 'Utilisateur anonyme') as display_name,
             COALESCE(r.user_email, 'Email non disponible') as display_email
      FROM reviews r
    `;
    
    const params = [];
    
    if (type !== 'all') {
      query += ` WHERE r.type = $1`;
      params.push(type);
    }
    
    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Compter le total
    let countQuery = 'SELECT COUNT(*) FROM reviews';
    let countParams = [];
    
    if (type !== 'all') {
      countQuery += ' WHERE type = $1';
      countParams.push(type);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      reviews: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des avis:', err);
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un avis spécifique avec ses réponses
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, 
             CASE 
               WHEN r.user_id IS NOT NULL THEN 
                 COALESCE(s.name, c.name, r.user_name) 
               ELSE r.user_name 
             END as display_name,
             CASE 
               WHEN r.user_id IS NOT NULL THEN 
                 COALESCE(s.email, c.email, r.user_email) 
               ELSE r.user_email 
             END as display_email
      FROM reviews r
      LEFT JOIN students s ON r.user_id = s.id AND r.type = 'student'
      LEFT JOIN companies c ON r.user_id = c.id AND r.type = 'company'
      WHERE r.id = $1 OR r.parent_id = $1
      ORDER BY r.created_at ASC
    `, [req.params.id]);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier un avis/question/réponse
router.put('/:id', async (req, res) => {
  const { content, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE reviews SET content = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [content, status || 'active', req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un avis/question/réponse
router.delete('/:id', async (req, res) => {
  try {
    // Supprimer aussi les réponses associées
    await pool.query('DELETE FROM reviews WHERE parent_id = $1', [req.params.id]);
    await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modérer un avis (approuver/rejeter)
router.patch('/:id/moderate', async (req, res) => {
  const { status } = req.body; // 'approved', 'rejected', 'pending'
  try {
    const result = await pool.query(
      'UPDATE reviews SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
