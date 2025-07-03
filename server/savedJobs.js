// Route pour sauvegarder une offre d'emploi pour un étudiant
const express = require('express');
const router = express.Router();
const pool = require('./db');

// Ajouter une offre sauvegardée
router.post('/:studentId/save-job', async (req, res) => {
  const { studentId } = req.params;
  const { jobId } = req.body;
  try {
    await pool.query('INSERT INTO saved_jobs (student_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [studentId, jobId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une offre sauvegardée
router.delete('/:studentId/saved-job/:jobId', async (req, res) => {
  const { studentId, jobId } = req.params;
  try {
    await pool.query('DELETE FROM saved_jobs WHERE student_id = $1 AND job_id = $2', [studentId, jobId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
