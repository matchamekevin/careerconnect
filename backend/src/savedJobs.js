// Route pour sauvegarder une offre d'emploi pour un étudiant
const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

// Ajouter une offre sauvegardée
router.post('/:studentId/save-job', async (req, res) => {
  const { studentId } = req.params;
  const { jobId } = req.body;
  try {
    const { error } = await supabase
      .from('saved_jobs')
      .upsert({ student_id: studentId, job_id: jobId }, { onConflict: 'student_id,job_id' });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une offre sauvegardée
router.delete('/:studentId/saved-job/:jobId', async (req, res) => {
  const { studentId, jobId } = req.params;
  try {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('student_id', studentId)
      .eq('job_id', jobId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
