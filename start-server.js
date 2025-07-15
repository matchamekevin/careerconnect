const { exec } = require('child_process');
const path = require('path');

// Démarrer le serveur
console.log('🚀 Démarrage du serveur backend...');
const serverProcess = exec('cd server && node index.js', {
  cwd: path.join(__dirname)
}, (error, stdout, stderr) => {
  if (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    return;
  }
  if (stderr) {
    console.error('Erreur stderr:', stderr);
  }
  console.log('Serveur output:', stdout);
});

// Attendre que le serveur soit prêt
setTimeout(() => {
  console.log('✅ Serveur supposé prêt, test des routes...');
  
  // Test des routes API
  const testRoutes = async () => {
    try {
      const fetch = require('node-fetch');
      
      // Test route jobs
      console.log('🔍 Test route /api/jobs...');
      const jobsResponse = await fetch('http://localhost:3000/api/jobs');
      const jobs = await jobsResponse.json();
      console.log(`📊 Nombre d'offres dans la base : ${jobs.length}`);
      if (jobs.length > 0) {
        console.log('📝 Première offre:', jobs[0].title);
      }
      
      // Test route reviews
      console.log('🔍 Test route /api/reviews...');
      const reviewsResponse = await fetch('http://localhost:3000/api/reviews');
      const reviews = await reviewsResponse.json();
      console.log(`💬 Nombre d'avis dans la base : ${reviews.length}`);
      if (reviews.length > 0) {
        console.log('📝 Premier avis:', reviews[0].comment);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error.message);
    }
  };
  
  testRoutes();
}, 3000);

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});
