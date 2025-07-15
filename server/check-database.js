const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const checkDatabase = async () => {
  console.log('🔍 Vérification de la base de données CareerConnect');
  console.log('==================================================');

  try {
    // Test de connexion
    await pool.query('SELECT NOW()');
    console.log('✅ Connexion à la base de données réussie');

    // Vérifier les tables
    const { rows: tables } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tables disponibles :');
    tables.forEach(table => console.log(`  - ${table.table_name}`));

    // Vérifier les offres
    const { rows: jobs } = await pool.query('SELECT COUNT(*) as count FROM jobs');
    const jobCount = parseInt(jobs[0].count);
    console.log(`📊 Nombre d'offres : ${jobCount}`);

    if (jobCount > 0) {
      const { rows: recentJobs } = await pool.query(`
        SELECT id, title, company, location, salary, status, posted_at
        FROM jobs 
        ORDER BY posted_at DESC 
        LIMIT 5
      `);
      console.log('📝 Offres récentes :');
      recentJobs.forEach(job => {
        const date = new Date(job.posted_at).toLocaleDateString();
        console.log(`  - ${job.title} chez ${job.company} (${job.location}) - ${job.salary} - ${job.status} (${date})`);
      });
    }

    // Vérifier les avis
    const { rows: reviews } = await pool.query('SELECT COUNT(*) as count FROM reviews');
    const reviewCount = parseInt(reviews[0].count);
    console.log(`💬 Nombre d'avis : ${reviewCount}`);

    // Vérifier les utilisateurs
    const { rows: students } = await pool.query('SELECT COUNT(*) as count FROM students');
    const studentCount = parseInt(students[0].count);
    console.log(`🎓 Nombre d'étudiants : ${studentCount}`);

    const { rows: companies } = await pool.query('SELECT COUNT(*) as count FROM companies');
    const companyCount = parseInt(companies[0].count);
    console.log(`🏢 Nombre d'entreprises : ${companyCount}`);

    console.log('==================================================');
    console.log('✅ Vérification terminée');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await pool.end();
  }
};

checkDatabase();
