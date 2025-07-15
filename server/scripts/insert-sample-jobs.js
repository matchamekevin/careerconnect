const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const insertSampleJobs = async () => {
  console.log('🔍 Vérification des offres existantes...');
  
  try {
    // Vérifier le nombre d'offres existantes
    const { rows: existingJobs } = await pool.query('SELECT COUNT(*) as count FROM jobs');
    const jobCount = parseInt(existingJobs[0].count);
    
    console.log(`📊 Nombre d'offres existantes : ${jobCount}`);
    
    if (jobCount === 0) {
      console.log('📝 Insertion d\'offres d\'exemple...');
      
      const sampleJobs = [
        {
          title: 'Développeur Full Stack',
          company: 'Tech Solutions Togo',
          location: 'Lomé, Togo',
          type: 'temps-plein',
          salary: '800,000 - 1,200,000 FCFA',
          description: 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies.',
          requirements: 'Maîtrise de React, Node.js, PostgreSQL. Expérience en développement web. Autonomie et esprit d\'équipe.',
          benefits: 'Salaire compétitif, assurance santé, formation continue, environnement de travail moderne.',
          status: 'active',
          company_id: 1,
          posted_at: new Date().toISOString()
        },
        {
          title: 'Ingénieur DevOps',
          company: 'Digital West Africa',
          location: 'Kara, Togo',
          type: 'temps-plein',
          salary: '1,000,000 - 1,500,000 FCFA',
          description: 'Rejoignez notre équipe DevOps pour optimiser notre infrastructure cloud et automatiser nos processus de déploiement.',
          requirements: 'Expérience avec Docker, Kubernetes, AWS/Azure. Maîtrise des outils CI/CD. Connaissance en scripting.',
          benefits: 'Télétravail possible, formations certifiantes, primes de performance.',
          status: 'active',
          company_id: 2,
          posted_at: new Date().toISOString()
        },
        {
          title: 'Analyste de Données',
          company: 'Data Analytics Togo',
          location: 'Lomé, Togo',
          type: 'temps-plein',
          salary: '700,000 - 1,000,000 FCFA',
          description: 'Analysez et interprétez des données complexes pour aider nos clients à prendre des décisions éclairées.',
          requirements: 'Maîtrise de Python, SQL, Power BI. Expérience en analyse statistique. Sens de l\'analyse.',
          benefits: 'Formation continue, équipement moderne, équipe internationale.',
          status: 'active',
          company_id: 3,
          posted_at: new Date().toISOString()
        },
        {
          title: 'Designer UI/UX',
          company: 'Creative Agency Togo',
          location: 'Lomé, Togo',
          type: 'temps-plein',
          salary: '600,000 - 900,000 FCFA',
          description: 'Créez des interfaces utilisateur intuitives et esthétiques pour nos applications web et mobiles.',
          requirements: 'Maîtrise de Figma, Adobe Creative Suite. Portfolio démontrant vos compétences. Créativité et attention aux détails.',
          benefits: 'Environnement créatif, projets variés, horaires flexibles.',
          status: 'active',
          company_id: 4,
          posted_at: new Date().toISOString()
        },
        {
          title: 'Consultant en Cybersécurité',
          company: 'SecureNet Togo',
          location: 'Lomé, Togo',
          type: 'contrat',
          salary: '1,200,000 - 1,800,000 FCFA',
          description: 'Protégez les systèmes informatiques de nos clients contre les menaces cybernétiques.',
          requirements: 'Certifications en sécurité (CISSP, CEH). Expérience en audit sécurite. Connaissance des réglementations.',
          benefits: 'Missions variées, formation continue, rémunération attractive.',
          status: 'active',
          company_id: 5,
          posted_at: new Date().toISOString()
        }
      ];
      
      for (const job of sampleJobs) {
        await pool.query(`
          INSERT INTO jobs (title, company, location, type, salary, description, requirements, benefits, status, company_id, posted_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          job.title, job.company, job.location, job.type, job.salary,
          job.description, job.requirements, job.benefits, job.status,
          job.company_id, job.posted_at
        ]);
      }
      
      console.log('✅ Offres d\'exemple insérées avec succès !');
    } else {
      console.log('✅ La base contient déjà des offres.');
    }
    
    // Afficher toutes les offres
    const { rows: allJobs } = await pool.query('SELECT id, title, company, location, salary, status FROM jobs ORDER BY posted_at DESC');
    console.log('📋 Offres dans la base :');
    allJobs.forEach(job => {
      console.log(`  - ${job.title} chez ${job.company} (${job.location}) - ${job.salary} - Status: ${job.status}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
};

insertSampleJobs();
