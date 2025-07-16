// Configuration de base du serveur Express
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { sendJobApplicationEmail } = require('./mailer');
const whatsappService = require('./whatsapp');
const fs = require('fs');
const reviewsRouter = require('./reviews');
const savedJobsRouter = require('./savedJobs');
const autoResponseRouter = require('./autoResponse');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test de connexion à la base
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base :', err);
  } else {
    console.log('Connexion à la base OK, date/heure :', res.rows[0]);
  }
});

// Route test pour vérifier le backend
app.get('/api/test', (req, res) => {
  res.json({ message: 'ok' });
});

// Exemple de route pour récupérer des données
app.get('/api/jobs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM jobs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inscription étudiant
app.post('/api/register-student', async (req, res) => {
  const { firstName, lastName, email, password, university, level, field } = req.body;
  try {
    // Vérifier si l'email existe déjà
    const exist = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }
    // Insérer le nouvel étudiant (sans hash pour test)
    await pool.query(
      'INSERT INTO users (id, first_name, last_name, email, password_hash, university, level, field) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [uuidv4(), firstName, lastName, email, password, university, level, field]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion étudiant
app.post('/api/login-student', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Chercher par email ou par prénom (first_name)
    const user = await pool.query(
      'SELECT * FROM users WHERE (email = $1 OR first_name = $1) AND password_hash = $2', 
      [email, password]
    );
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Email/prénom ou mot de passe incorrect.' });
    }
    // Ne pas renvoyer le hash du mot de passe
    const { password_hash, ...userWithoutPassword } = user.rows[0];
    res.json({ success: true, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inscription entreprise
app.post('/api/register-company', async (req, res) => {
  const { companyName, contactName, email, password, phone, address, sector, size, logo_url, website_url } = req.body;
  try {
    const exist = await pool.query('SELECT id FROM companies WHERE email = $1', [email]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }
    await pool.query(
      'INSERT INTO companies (name, contact_name, email, password_hash, phone, address, sector, size, logo_url, website_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [companyName, contactName, email, password, phone, address, sector, size, logo_url || null, website_url || null]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion entreprise
app.post('/api/login-company', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Chercher par email ou par nom de contact (contact_name)
    const company = await pool.query(
      'SELECT * FROM companies WHERE (email = $1 OR contact_name = $1) AND password_hash = $2', 
      [email, password]
    );
    if (company.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    // Ne pas renvoyer le hash du mot de passe
    const { password_hash, ...companyWithoutPassword } = company.rows[0];
    res.json({ success: true, company: companyWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion admin (vérifie l'email admin@careerconnect.fr)
app.post('/api/login-admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Vérifie uniquement l'email admin connu
    if (email !== 'admin@careerconnect.fr') {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    const admin = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password_hash = $2",
      [email, password]
    );
    if (admin.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    res.json({ success: true, admin: admin.rows[0] });
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
    await pool.query('UPDATE companies SET logo_url = $1, updated_at = NOW() WHERE id = $2', [logo_url, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publier une offre d'emploi
app.post('/api/jobs', async (req, res) => {
  const { title, description, location, type, salary, tags, company_id } = req.body;
  try {
    // Récupérer le nom et le logo de l'entreprise
    const companyRes = await pool.query('SELECT name, logo_url FROM companies WHERE id = $1', [company_id]);
    if (companyRes.rows.length === 0) {
      return res.status(400).json({ error: "Entreprise introuvable" });
    }
    const company = companyRes.rows[0];
    const result = await pool.query(
      'INSERT INTO jobs (title, description, location, type, salary, tags, company, company_id, logo_url, posted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
      [title, description, location, type, salary, tags, company.name, company_id, company.logo_url]
    );
    res.json({ success: true, job: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les offres d'une entreprise
app.get('/api/company/:id/jobs', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE company_id = $1 ORDER BY posted_at DESC', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une offre d'emploi
app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
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
    // Récupérer le logo et le nom de l'entreprise
    const companyRes = await pool.query('SELECT name, logo_url FROM companies WHERE id = $1', [company_id]);
    if (companyRes.rows.length === 0) {
      return res.status(400).json({ error: "Entreprise introuvable" });
    }
    const company = companyRes.rows[0];
    await pool.query(
      'UPDATE jobs SET title=$1, description=$2, location=$3, type=$4, salary=$5, tags=$6, company=$7, logo_url=$8 WHERE id=$9',
      [title, description, location, type, salary, tags, company.name, company.logo_url, id]
    );
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
    await pool.query(
      'UPDATE companies SET name=$1, contact_name=$2, email=$3, phone=$4, address=$5, sector=$6, size=$7, website_url=$8, updated_at=NOW() WHERE id=$9',
      [name, contact_name, email, phone, address, sector, size, website_url, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les candidatures pour une entreprise
app.get('/api/company/:id/applications', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM applications WHERE company_id = $1 ORDER BY applied_at DESC', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les stats pour le dashboard entreprise
app.get('/api/company/:id/stats', async (req, res) => {
  const { id } = req.params;
  try {
    const jobs = await pool.query('SELECT COUNT(*) FROM jobs WHERE company_id = $1', [id]);
    const applications = await pool.query('SELECT COUNT(*) FROM applications WHERE company_id = $1', [id]);
    // Pour les vues, il faudrait une colonne dédiée dans jobs (ex: views INT)
    res.json({
      jobs: parseInt(jobs.rows[0].count, 10),
      applications: parseInt(applications.rows[0].count, 10),
      views: 0 // à remplacer si la colonne existe
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
    await pool.query('UPDATE applications SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statistiques mensuelles pour la performance
app.get('/api/company/:id/performance', async (req, res) => {
  const { id } = req.params;
  try {
    // Candidatures reçues ce mois
    const applications = await pool.query(
      `SELECT COUNT(*) FROM applications WHERE company_id = $1 AND date_trunc('month', applied_at) = date_trunc('month', CURRENT_DATE)`,
      [id]
    );
    // Pour les vues, il faudrait une colonne 'views' dans jobs, ici on retourne 0 par défaut
    // Taux de réponse : % de candidatures dont le statut est différent de 'Nouveau'
    const total = await pool.query(
      `SELECT COUNT(*) FROM applications WHERE company_id = $1 AND date_trunc('month', applied_at) = date_trunc('month', CURRENT_DATE)`,
      [id]
    );
    const repondu = await pool.query(
      `SELECT COUNT(*) FROM applications WHERE company_id = $1 AND status != 'Nouveau' AND date_trunc('month', applied_at) = date_trunc('month', CURRENT_DATE)`,
      [id]
    );
    const taux = total.rows[0].count > 0 ? Math.round((repondu.rows[0].count / total.rows[0].count) * 100) : 0;
    res.json({
      vues: 0 // à remplacer si la colonne existe
      ,
      candidatures: parseInt(applications.rows[0].count, 10),
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
    const { rows } = await pool.query('SELECT * FROM applications WHERE student_id = $1 ORDER BY applied_at DESC', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les offres sauvegardées d'un étudiant (exemple, à adapter selon la structure de la table)
app.get('/api/student/:id/saved-jobs', async (req, res) => {
  const { id } = req.params;
  try {
    // Si tu as une table saved_jobs, adapte la requête ci-dessous
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id IN (SELECT job_id FROM saved_jobs WHERE student_id = $1)', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier le profil étudiant
app.put('/api/student/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, university, level, field } = req.body;
  try {
    await pool.query(
      'UPDATE users SET first_name=$1, last_name=$2, email=$3, university=$4, level=$5, field=$6 WHERE id=$7',
      [first_name, last_name, email, university, level, field, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recommandations d'offres pour un étudiant
app.get('/api/student/:id/recommendations', async (req, res) => {
  const { id } = req.params;
  try {
    // On récupère le domaine et le niveau de l'étudiant
    const userRes = await pool.query('SELECT field, level FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) return res.json([]);
    const { field, level } = userRes.rows[0];
    // On recommande les jobs qui matchent le domaine ou le niveau
    const jobsRes = await pool.query(
      `SELECT * FROM jobs WHERE ($1 = '' OR $1 IS NULL OR $1 = ANY(tags)) OR ($2 = '' OR $2 IS NULL OR type ILIKE '%' || $2 || '%') ORDER BY posted_at DESC LIMIT 5`,
      [field, level]
    );
    res.json(jobsRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les détails d'une offre d'emploi
app.get('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Offre non trouvée" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour stats globales admin
app.get('/api/admin/stats', async (req, res) => {
  try {
    const companies = await pool.query('SELECT COUNT(*) FROM companies');
    const jobs = await pool.query('SELECT COUNT(*) FROM jobs');
    const students = await pool.query('SELECT COUNT(*) FROM users');
    res.json({
      companies: parseInt(companies.rows[0].count, 10),
      jobs: parseInt(jobs.rows[0].count, 10),
      students: parseInt(students.rows[0].count, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour la liste des entreprises avec logo persistant et nombre d'offres
app.get('/api/companies', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM jobs j WHERE j.company_id = c.id) AS job_count
      FROM companies c
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer le profil d'une entreprise par ID
app.get('/api/companies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT *, (SELECT COUNT(*) FROM jobs WHERE company_id = $1) AS job_count FROM companies WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Entreprise non trouvée" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour la liste des offres (admin)
app.get('/api/jobs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM jobs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une entreprise (admin)
app.delete('/api/companies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM companies WHERE id = $1', [id]);
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
    const result = await pool.query(
      'UPDATE companies SET account_status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    
    res.json({ success: true, company: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activer/désactiver un compte étudiant (admin)
app.patch('/api/students/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE students SET account_status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    
    res.json({ success: true, student: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Supprimer une offre (admin)
app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Supprimer un étudiant (admin)
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Supprimer une candidature (admin)
app.delete('/api/applications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Récupérer tous les étudiants (admin)
app.get('/api/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Récupérer toutes les candidatures (admin)
app.get('/api/applications', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM applications ORDER BY applied_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour postuler à une offre avec CV PDF
// (Réutilise l'instance upload déjà déclarée plus haut)
app.post('/api/apply', upload.single('cv'), async (req, res) => {
  const { job_id, email, phone, country } = req.body;
  const cv_url = req.file ? `/uploads/${req.file.filename}` : null;
  
  console.log('🔍 Debug - Données reçues:', {
    job_id,
    email,
    phone,
    country,
    cv_file: req.file?.filename
  });
  
  // Configuration des pays supportés
  const COUNTRIES = {
    'TG': { name: 'Togo', prefix: '+228', pattern: /^\+228\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
    'BF': { name: 'Burkina Faso', prefix: '+226', pattern: /^\+226\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
    'GH': { name: 'Ghana', prefix: '+233', pattern: /^\+233\s?\d{2}\s?\d{3}\s?\d{4}$/ },
    'BJ': { name: 'Bénin', prefix: '+229', pattern: /^\+229\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
    'CI': { name: 'Côte d\'Ivoire', prefix: '+225', pattern: /^\+225\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ }
  };
  
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
    // Récupérer les informations de l'offre et de l'entreprise
    const jobRes = await pool.query('SELECT company_id, title FROM jobs WHERE id = $1', [job_id]);
    if (jobRes.rows.length === 0) return res.status(400).json({ error: "Offre non trouvée" });
    
    const companyId = jobRes.rows[0].company_id;
    const jobTitle = jobRes.rows[0].title;
    
    const companyRes = await pool.query('SELECT email, name, phone FROM companies WHERE id = $1', [companyId]);
    if (companyRes.rows.length === 0) return res.status(400).json({ error: "Entreprise non trouvée" });
    
    const companyEmail = companyRes.rows[0].email;
    const companyName = companyRes.rows[0].name;
    const companyPhone = companyRes.rows[0].phone;
    
    // Vérifier que l'email de l'entreprise est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
      return res.status(400).json({ error: "Email de l'entreprise invalide. L'entreprise doit configurer un email valide." });
    }
    
    console.log(`📧 Préparation email pour: ${companyName} (${companyEmail})`);

    // Générer le contenu de l'email automatiquement
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const candidateName = email.split('@')[0]; // Nom temporaire basé sur l'email
    
    // Préparer les informations du candidat
    const candidateInfo = {
      firstName: candidateName,
      lastName: '',
      email: email,
      phone: phone,
      coverLetter: `Bonjour ${companyName},

J'ai l'honneur de vous soumettre ma candidature pour le poste de ${jobTitle} publié sur votre plateforme CareerConnect.

Étant très intéressé(e) par cette opportunité, je serais ravi(e) de pouvoir contribuer au développement de votre entreprise grâce à mes compétences et ma motivation.

Informations du candidat :
- Email : ${email}
- Téléphone : ${phone}
- Pays : ${selectedCountry.name}
- Date de candidature : ${currentDate}

Je reste à votre disposition pour tout complément d'information et serais honoré(e) de pouvoir vous rencontrer pour un entretien.

Cordialement,
${candidateName}

---
Cette candidature a été envoyée automatiquement via CareerConnect.`
    };

    // Envoi du mail à l'entreprise avec le nouveau mailer
    await sendJobApplicationEmail(
      companyEmail,
      jobTitle,
      candidateInfo,
      req.file ? req.file.path : null,
      companyPhone // Ajout du numéro de téléphone de l'entreprise
    );

    // Créer une discussion WhatsApp directe entre entreprise et étudiant
    let whatsappResult = null;
    if (companyPhone && phone) {
      try {
        console.log('📱 Création d\'une discussion WhatsApp directe...');
        whatsappResult = await whatsappService.createDirectConversation(
          companyPhone,
          phone,
          jobTitle,
          companyName,
          candidateInfo
        );
        
        if (whatsappResult.success) {
          console.log('✅ Discussion WhatsApp créée avec succès !');
          console.log('🔗 Lien entreprise → étudiant:', whatsappResult.companyLink);
          console.log('🔗 Lien étudiant → entreprise:', whatsappResult.studentLink);
        } else {
          console.log('⚠️ Erreur lors de la création de la discussion WhatsApp');
        }
      } catch (error) {
        console.error('❌ Erreur WhatsApp:', error);
      }
    }

    await pool.query(
      'INSERT INTO applications (job_id, email, phone, cv_url, status, applied_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [job_id, email, phone, cv_url, 'Nouveau']
    );
    
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
    const { rows } = await pool.query('SELECT * FROM companies WHERE is_connected = true');
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    res.json([]); // Toujours retourner un tableau même en cas d'erreur
  }
});

// Déconnexion entreprise (à appeler lors du logout)
app.post('/api/logout-company', async (req, res) => {
  const { companyId } = req.body;
  try {
    await pool.query('UPDATE companies SET is_connected = false WHERE id = $1', [companyId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/reviews', reviewsRouter);
app.use('/api/student', savedJobsRouter);
app.use('/api/response', autoResponseRouter);

// Nouvelle route : upload logo BLOB (stockage direct en base)
app.post('/api/company/:id/logo-blob', upload.single('logo'), async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier envoyé.' });
  }
  try {
    await pool.query(
      'UPDATE companies SET logo_url = $1, logo_mime = $2, updated_at = NOW() WHERE id = $3',
      [req.file.buffer, req.file.mimetype, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nouvelle route : GET logo binaire (BLOB)
app.get('/api/company/:id/logo-blob', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT logo_url, logo_mime FROM companies WHERE id = $1', [id]);
    if (!rows[0] || !rows[0].logo_url) {
      return res.status(404).send('Logo non trouvé');
    }
    res.set('Content-Type', rows[0].logo_mime || 'image/jpeg');
    res.send(rows[0].logo_url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// ENDPOINTS POUR LA PAGE CONTACT
// ============================================

// Créer la table contact_messages si elle n'existe pas
const createContactTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL,
          subject VARCHAR(200) NOT NULL,
          user_type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'nouveau',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          admin_response TEXT,
          responded_at TIMESTAMP,
          responded_by INTEGER
      );

      CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_user_type ON contact_messages(user_type);
    `;
    
    await pool.query(query);
    console.log('✅ Table contact_messages initialisée');
  } catch (error) {
    console.log('ℹ️ Table contact_messages déjà présente');
  }
};

// Initialiser la table au démarrage
createContactTable();

// Route pour envoyer un message de contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, userType, message } = req.body;
  
  console.log('📩 Nouveau message de contact reçu:', {
    name,
    email,
    subject,
    userType,
    messageLength: message?.length
  });

  // Validation des champs obligatoires
  if (!name || !email || !subject || !userType || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Tous les champs sont obligatoires' 
    });
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Adresse email invalide' 
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, user_type, message) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
      [name, email, subject, userType, message]
    );

    console.log('✅ Message de contact enregistré avec l\'ID:', result.rows[0].id);

    res.json({ 
      success: true, 
      message: 'Message envoyé avec succès',
      id: result.rows[0].id 
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'enregistrement du message' 
    });
  }
});

// Route pour récupérer tous les messages de contact (pour l'admin)
app.get('/api/contact/messages', async (req, res) => {
  try {
    const { status, userType, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM contact_messages';
    let params = [];
    let conditions = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (userType) {
      conditions.push(`user_type = $${params.length + 1}`);
      params.push(userType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    // Compter le total pour la pagination
    const countQuery = 'SELECT COUNT(*) as total FROM contact_messages' + 
      (conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '');
    const countResult = await pool.query(countQuery, params.slice(0, -2));

    res.json({
      success: true,
      messages: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des messages:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des messages' 
    });
  }
});

// Route pour supprimer un message de contact (pour l'admin)
app.delete('/api/contact/messages/:id', async (req, res) => {
  const { id } = req.params;
  
  console.log('🗑️ Demande de suppression du message ID:', id);

  // Validation de l'ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ 
      success: false, 
      error: 'ID de message invalide' 
    });
  }

  try {
    // Vérifier que le message existe
    const checkResult = await pool.query(
      'SELECT id FROM contact_messages WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message non trouvé' 
      });
    }

    // Supprimer le message
    await pool.query(
      'DELETE FROM contact_messages WHERE id = $1',
      [id]
    );

    console.log('✅ Message supprimé avec succès, ID:', id);

    res.json({ 
      success: true, 
      message: 'Message supprimé avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la suppression du message' 
    });
  }
});

// Route pour marquer un message comme lu/traité (optionnel)
app.patch('/api/contact/messages/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log('📝 Mise à jour du statut du message ID:', id, 'nouveau statut:', status);

  // Validation
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ 
      success: false, 
      error: 'ID de message invalide' 
    });
  }

  if (!status || !['unread', 'read', 'processed'].includes(status)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Statut invalide. Valeurs acceptées: unread, read, processed' 
    });
  }

  try {
    // Vérifier que le message existe
    const checkResult = await pool.query(
      'SELECT id FROM contact_messages WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message non trouvé' 
      });
    }

    // Mettre à jour le statut
    await pool.query(
      'UPDATE contact_messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );

    console.log('✅ Statut du message mis à jour, ID:', id);

    res.json({ 
      success: true, 
      message: 'Statut mis à jour avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la mise à jour du statut' 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur CareerConnect démarré sur le port ${PORT}`);
});