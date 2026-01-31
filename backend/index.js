// Configuration de base du serveur Express avec Supabase
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const supabase = require('./src/supabase');
// const { sendJobApplicationEmail } = require('./src/mailer');
// const whatsappService = require('./src/whatsapp');
// const fs = require('fs');
// const reviewsRouter = require('./src/reviews');
// const savedJobsRouter = require('./src/savedJobs');
// const autoResponseRouter = require('./src/autoResponse');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test de connexion à Supabase
// const testConnection = async () => {
//   try {
//     const { data, error } = await supabase.from('users').select('*', { count: 'exact', head: true }).limit(1);
//     if (error) {
//       console.error('❌ Erreur de connexion à Supabase:', error.message);
//     } else {
//       console.log('✅ Connexion à Supabase OK !');
//     }
//   } catch (err) {
//     console.error('❌ Erreur de connexion à Supabase:', err.message);
//   }
// };
// testConnection();

// Route test pour vérifier le backend
app.get('/api/test', (req, res) => {
  res.json({ message: 'ok', database: 'supabase' });
});

// Récupérer toutes les offres d'emploi
app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// Avis (Supabase)
// =============================
app.get('/api/reviews', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ reviews: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { user_id, type = 'review', content, parent_id = null, user_name, user_email } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Contenu requis' });
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user_id || null,
        type,
        content: content.trim(),
        parent_id,
        user_name: user_name || null,
        user_email: user_email || null
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ review: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Inscription étudiant
app.post('/api/register-student', async (req, res) => {
  const { firstName, lastName, email, password, university, level, field } = req.body;
  try {
    // Vérifier si l'email existe déjà
    const { data: exist } = await supabase.from('users').select('id').eq('email', email);
    if (exist && exist.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }
    // Insérer le nouvel étudiant
    const { error } = await supabase.from('users').insert({
      id: uuidv4(),
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash: password,
      university,
      level,
      field
    });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion étudiant
app.post('/api/login-student', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},first_name.eq.${email}`)
      .eq('password_hash', password);
    
    if (error) throw error;
    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'Email/prénom ou mot de passe incorrect.' });
    }
    const { password_hash, ...userWithoutPassword } = user[0];
    res.json({ success: true, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inscription entreprise
app.post('/api/register-company', async (req, res) => {
  const { companyName, contactName, email, password, phone, address, sector, size, logo_url, website_url } = req.body;
  try {
    const { data: exist } = await supabase.from('companies').select('id').eq('email', email);
    if (exist && exist.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }
    const { error } = await supabase.from('companies').insert({
      name: companyName,
      contact_name: contactName,
      email,
      password_hash: password,
      phone,
      address,
      sector,
      size,
      logo_url: logo_url || null,
      website_url: website_url || null
    });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion entreprise
app.post('/api/login-company', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .or(`email.eq.${email},contact_name.eq.${email}`)
      .eq('password_hash', password);
    
    if (error) throw error;
    if (!company || company.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    const { password_hash, ...companyWithoutPassword } = company[0];
    res.json({ success: true, company: companyWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion admin
app.post('/api/login-admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== 'admin@careerconnect.fr') {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    const { data: admin, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password);
    
    if (error) throw error;
    if (!admin || admin.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    res.json({ success: true, admin: admin[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configuration de multer pour l'upload local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route d'upload de logo entreprise
app.post('/api/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier envoyé.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Route pour mettre à jour le logo d'une entreprise
app.put('/api/company/:id/logo', async (req, res) => {
  const { id } = req.params;
  const { logo_url } = req.body;
  try {
    const { error } = await supabase
      .from('companies')
      .update({ logo_url, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publier une offre d'emploi
app.post('/api/jobs', async (req, res) => {
  const { title, description, location, type, salary, tags, company_id } = req.body;
  try {
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('name, logo_url')
      .eq('id', company_id)
      .single();
    
    if (companyError || !companyData) {
      return res.status(400).json({ error: "Entreprise introuvable" });
    }
    
    const { data, error } = await supabase.from('jobs').insert({
      title,
      description,
      location,
      type,
      salary,
      tags,
      company: companyData.name,
      company_id,
      logo_url: companyData.logo_url,
      posted_at: new Date().toISOString()
    }).select().single();
    
    if (error) throw error;
    res.json({ success: true, job: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les offres d'une entreprise
app.get('/api/company/:id/jobs', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', id)
      .order('posted_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une offre d'emploi
app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier une offre d'emploi
app.put('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, location, type, salary, tags, company_id } = req.body;
  try {
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('name, logo_url')
      .eq('id', company_id)
      .single();
    
    if (companyError || !companyData) {
      return res.status(400).json({ error: "Entreprise introuvable" });
    }
    
    const { error } = await supabase
      .from('jobs')
      .update({
        title,
        description,
        location,
        type,
        salary,
        tags,
        company: companyData.name,
        logo_url: companyData.logo_url
      })
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier le profil d'une entreprise
app.put('/api/company/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact_name, email, phone, address, sector, size, website_url } = req.body;
  try {
    const { error } = await supabase
      .from('companies')
      .update({
        name,
        contact_name,
        email,
        phone,
        address,
        sector,
        size,
        website_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les candidatures pour une entreprise
app.get('/api/company/:id/applications', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('company_id', id)
      .order('applied_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les stats pour le dashboard entreprise
app.get('/api/company/:id/stats', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id', { count: 'exact' })
      .eq('company_id', id);
    
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('id', { count: 'exact' })
      .eq('company_id', id);
    
    res.json({
      jobs: jobs?.length || 0,
      applications: applications?.length || 0,
      views: 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour le statut d'une candidature
app.put('/api/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statistiques mensuelles pour la performance
app.get('/api/company/:id/performance', async (req, res) => {
  const { id } = req.params;
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { data: applications, error } = await supabase
      .from('applications')
      .select('status')
      .eq('company_id', id)
      .gte('applied_at', startOfMonth.toISOString());
    
    if (error) throw error;
    
    const total = applications?.length || 0;
    const repondu = applications?.filter(a => a.status !== 'Nouveau').length || 0;
    const taux = total > 0 ? Math.round((repondu / total) * 100) : 0;
    
    res.json({
      vues: 0,
      candidatures: total,
      taux_reponse: taux
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les candidatures d'un étudiant
app.get('/api/student/:id/applications', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('student_id', id)
      .order('applied_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les offres sauvegardées d'un étudiant
app.get('/api/student/:id/saved-jobs', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: savedJobs, error: savedError } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('student_id', id);
    
    if (savedError) throw savedError;
    
    if (!savedJobs || savedJobs.length === 0) {
      return res.json([]);
    }
    
    const jobIds = savedJobs.map(s => s.job_id);
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .in('id', jobIds);
    
    if (error) throw error;
    res.json(jobs || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier le profil étudiant
app.put('/api/student/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, university, level, field } = req.body;
  try {
    const { error } = await supabase
      .from('users')
      .update({ first_name, last_name, email, university, level, field })
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recommandations d'offres pour un étudiant
app.get('/api/student/:id/recommendations', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('field, level')
      .eq('id', id)
      .single();
    
    if (userError || !user) return res.json([]);
    
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    res.json(jobs || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer le nombre de notifications non lues d'un étudiant
app.get('/api/student/:id/notifications/count', async (req, res) => {
  const { id } = req.params;
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id)
      .eq('is_read', false);

    if (error) throw error;
    res.json({ count: count || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer le nombre de notifications non lues d'un étudiant
// app.get('/api/student/:id/notifications/count', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const { count, error } = await supabase
//       .from('notifications')
//       .select('*', { count: 'exact', head: true })
//       .eq('user_id', id)
//       .eq('is_read', false);

// Récupérer les détails d'une offre d'emploi
app.get('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: "Offre non trouvée" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour stats globales admin
app.get('/api/admin/stats', async (req, res) => {
  try {
    const { data: companies } = await supabase.from('companies').select('id', { count: 'exact' });
    const { data: jobs } = await supabase.from('jobs').select('id', { count: 'exact' });
    const { data: students } = await supabase.from('users').select('id', { count: 'exact' });
    
    res.json({
      companies: companies?.length || 0,
      jobs: jobs?.length || 0,
      students: students?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour la liste des entreprises avec logo persistant et nombre d'offres
app.get('/api/companies', async (req, res) => {
  try {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) throw error;
    
    // Ajouter le comptage des jobs pour chaque entreprise
    const companiesWithJobCount = await Promise.all(
      (data || []).map(async (company) => {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('id', { count: 'exact' })
          .eq('company_id', company.id);
        return { ...company, job_count: jobs?.length || 0 };
      })
    );
    
    res.json(companiesWithJobCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer le profil d'une entreprise par ID
app.get('/api/companies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !company) {
      return res.status(404).json({ error: "Entreprise non trouvée" });
    }
    
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id', { count: 'exact' })
      .eq('company_id', id);
    
    res.json({ ...company, job_count: jobs?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une entreprise (admin)
app.delete('/api/companies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('companies').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activer/désactiver un compte entreprise (admin)
app.patch('/api/companies/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .update({ account_status: status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    
    res.json({ success: true, company: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activer/désactiver un compte étudiant (admin)
app.patch('/api/students/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('students')
      .update({ account_status: status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    
    res.json({ success: true, student: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un étudiant (admin)
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une candidature (admin)
app.delete('/api/applications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les étudiants (admin)
app.get('/api/students', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer toutes les candidatures (admin)
app.get('/api/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('applied_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configuration des pays supportés
const COUNTRIES = {
  'TG': { name: 'Togo', prefix: '+228', pattern: /^\+228\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  'BF': { name: 'Burkina Faso', prefix: '+226', pattern: /^\+226\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  'GH': { name: 'Ghana', prefix: '+233', pattern: /^\+233\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  'BJ': { name: 'Bénin', prefix: '+229', pattern: /^\+229\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  'CI': { name: 'Côte d\'Ivoire', prefix: '+225', pattern: /^\+225\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ }
};

// Route pour postuler à une offre avec CV PDF
app.post('/api/apply', upload.single('cv'), async (req, res) => {
  const { job_id, email, phone, country } = req.body;
  const cv_url = req.file ? `/uploads/${req.file.filename}` : null;
  
  console.log('🔍 Debug - Données reçues:', { job_id, email, phone, country, cv_file: req.file?.filename });
  
  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }
  
  // Validation numéro de téléphone selon le pays
  const selectedCountry = COUNTRIES[country] || COUNTRIES['TG'];
  if (!selectedCountry.pattern.test(phone)) {
    return res.status(400).json({ 
      error: `Numéro de téléphone invalide pour ${selectedCountry.name}. Format attendu : ${selectedCountry.prefix} XX XX XX XX` 
    });
  }
  
  if (!job_id || !email || !phone || !cv_url) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }
  
  try {
    // Récupérer les informations de l'offre
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('company_id, title')
      .eq('id', job_id)
      .single();
    
    if (jobError || !job) {
      return res.status(400).json({ error: "Offre non trouvée" });
    }
    
    // Récupérer les informations de l'entreprise
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('email, name, phone')
      .eq('id', job.company_id)
      .single();
    
    if (companyError || !company) {
      return res.status(400).json({ error: "Entreprise non trouvée" });
    }
    
    // Vérifier que l'email de l'entreprise est valide
    if (!emailRegex.test(company.email)) {
      return res.status(400).json({ error: "Email de l'entreprise invalide." });
    }
    
    console.log(`📧 Préparation email pour: ${company.name} (${company.email})`);

    // Générer le contenu de l'email
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const candidateName = email.split('@')[0];
    
    const candidateInfo = {
      firstName: candidateName,
      lastName: '',
      email: email,
      phone: phone,
      coverLetter: `Bonjour ${company.name},

J'ai l'honneur de vous soumettre ma candidature pour le poste de ${job.title} publié sur votre plateforme CareerConnect.

Étant très intéressé(e) par cette opportunité, je serais ravi(e) de pouvoir contribuer au développement de votre entreprise.

Informations du candidat :
- Email : ${email}
- Téléphone : ${phone}
- Pays : ${selectedCountry.name}
- Date de candidature : ${currentDate}

Cordialement,
${candidateName}

---
Cette candidature a été envoyée automatiquement via CareerConnect.`
    };

    // Envoi email/WhatsApp désactivé (legacy). À réimplémenter côté Supabase si besoin.
    // await sendJobApplicationEmail(...)
    // const whatsappResult = await whatsappService.createDirectConversation(...)
    let whatsappResult = null;

    // Insérer la candidature
    const { error: insertError } = await supabase.from('applications').insert({
      job_id,
      email,
      phone,
      cv_url,
      status: 'Nouveau',
      applied_at: new Date().toISOString()
    });
    
    if (insertError) throw insertError;
    
    res.json({ 
      success: true,
      whatsappLinks: whatsappResult ? {
        companyToStudent: whatsappResult.companyLink,
        studentToCompany: whatsappResult.studentLink
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour entreprises connectées
app.get('/api/companies/connected', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_connected', true);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.json([]);
  }
});

// Déconnexion entreprise
app.post('/api/logout-company', async (req, res) => {
  const { companyId } = req.body;
  try {
    const { error } = await supabase
      .from('companies')
      .update({ is_connected: false })
      .eq('id', companyId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routers legacy désactivés (Mongo/Local). À réactiver seulement si recréés pour Supabase.
// app.use('/api/reviews', reviewsRouter);
// app.use('/api/student', savedJobsRouter);
// app.use('/api/response', autoResponseRouter);

// ============================================
// ENDPOINTS POUR LA PAGE CONTACT
// ============================================

// Créer la table contact_messages si elle n'existe pas
const createContactTable = async () => {
  try {
    // Avec Supabase, la table doit être créée via le dashboard ou les migrations
    console.log('ℹ️ Table contact_messages déjà présente');
  } catch (error) {
    console.log('ℹ️ Table contact_messages déjà présente');
  }
};
// createContactTable();

// Route pour envoyer un message de contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, userType, message } = req.body;
  
  console.log('📩 Nouveau message de contact reçu:', { name, email, subject, userType });

  if (!name || !email || !subject || !userType || !message) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Adresse email invalide' });
  }

  try {
    const { data, error } = await supabase.from('contact_messages').insert({
      name,
      email,
      subject,
      user_type: userType,
      message
    }).select().single();

    if (error) throw error;

    console.log('✅ Message de contact enregistré avec l\'ID:', data.id);
    res.json({ success: true, message: 'Message envoyé avec succès', id: data.id });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement du message' });
  }
});

// Route pour récupérer tous les messages de contact (admin)
app.get('/api/contact/messages', async (req, res) => {
  try {
    const { status, userType, limit = 50, offset = 0 } = req.query;
    
    let query = supabase.from('contact_messages').select('*', { count: 'exact' });
    
    if (status) query = query.eq('status', status);
    if (userType) query = query.eq('user_type', userType);
    
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      messages: data || [],
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des messages' });
  }
});

// Route pour supprimer un message de contact (admin)
app.delete('/api/contact/messages/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, error: 'ID de message invalide' });
  }

  try {
    const { data: existing } = await supabase
      .from('contact_messages')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Message non trouvé' });
    }

    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;

    console.log('✅ Message supprimé avec succès, ID:', id);
    res.json({ success: true, message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du message' });
  }
});

// Route pour marquer un message comme lu/traité
app.patch('/api/contact/messages/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, error: 'ID de message invalide' });
  }

  if (!status || !['unread', 'read', 'processed'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Statut invalide' });
  }

  try {
    const { data: existing } = await supabase
      .from('contact_messages')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Message non trouvé' });
    }

    const { error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;

    console.log('✅ Statut du message mis à jour, ID:', id);
    res.json({ success: true, message: 'Statut mis à jour avec succès' });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du statut' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur CareerConnect démarré sur le port ${PORT}`);
  console.log(`📦 Base de données: Supabase`);
});
