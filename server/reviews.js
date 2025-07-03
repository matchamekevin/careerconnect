// Routes Express pour avis/questions/réponses
const express = require('express');
const router = express.Router();
const pool = require('./db'); // Assure-toi que ce fichier exporte le pool pg

// Créer un avis/question
router.post('/', async (req, res) => {
  const { user_id, type, content, parent_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, type, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, type, content, parent_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les avis/questions/réponses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Répondre à un avis/question (parent_id)
// (utilise la même route POST avec parent_id)

// Supprimer un avis/question/réponse
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
