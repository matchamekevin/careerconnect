// Routes Express pour avis/questions/réponses avec Supabase
const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

// Créer un avis/question
router.post('/', async (req, res) => {
  const { user_id, type, content, parent_id, user_name, user_email } = req.body;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id,
        type,
        content,
        parent_id: parent_id || null,
        user_name,
        user_email
      })
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les avis/questions/réponses avec pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, type = 'all' } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = supabase.from('reviews').select('*', { count: 'exact' });
    
    if (type !== 'all') {
      query = query.eq('type', type);
    }
    
    query = query.order('created_at', { ascending: false }).range(offset, offset + parseInt(limit) - 1);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Ajouter display_name et display_email
    const reviews = (data || []).map(r => ({
      ...r,
      display_name: r.user_name || 'Utilisateur anonyme',
      display_email: r.user_email || 'Email non disponible'
    }));
    
    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
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
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .or(`id.eq.${req.params.id},parent_id.eq.${req.params.id}`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Ajouter display_name et display_email
    const reviews = (data || []).map(r => ({
      ...r,
      display_name: r.user_name || 'Utilisateur anonyme',
      display_email: r.user_email || 'Email non disponible'
    }));
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier un avis/question/réponse
router.put('/:id', async (req, res) => {
  const { content, status } = req.body;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        content,
        status: status || 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un avis/question/réponse
router.delete('/:id', async (req, res) => {
  try {
    // Supprimer aussi les réponses associées
    await supabase.from('reviews').delete().eq('parent_id', req.params.id);
    const { error } = await supabase.from('reviews').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modérer un avis (approuver/rejeter)
router.patch('/:id/moderate', async (req, res) => {
  const { status } = req.body;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
