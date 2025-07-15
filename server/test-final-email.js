require('dotenv').config();
const { sendJobApplicationEmail } = require('./mailer');

// Test de la configuration email
async function testEmailDelivery() {
  console.log('🧪 Test de l\'envoi d\'email...\n');
  
  // Vérifier la configuration
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:', missingVars);
    console.log('\n💡 Assurez-vous que votre fichier .env contient :');
    console.log('   - SMTP_HOST=smtp.gmail.com');
    console.log('   - SMTP_PORT=587');
    console.log('   - SMTP_USER=votre-email@gmail.com');
    console.log('   - SMTP_PASS=votre-mot-de-passe-app');
    console.log('   - SMTP_FROM=votre-email@gmail.com');
    process.exit(1);
  }
  
  console.log('✅ Configuration trouvée');
  console.log('📧 Serveur SMTP:', process.env.SMTP_HOST);
  console.log('👤 Utilisateur:', process.env.SMTP_USER);
  console.log('📮 Expéditeur:', process.env.SMTP_FROM);
  
  // Données de test
  const testData = {
    companyEmail: 'matchamegnatikevin894@gmail.com', // Email de destination pour le test
    jobTitle: 'Développeur Frontend React',
    candidateInfo: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+33 6 12 34 56 78',
      coverLetter: 'Madame, Monsieur,\n\nJe vous adresse ma candidature pour le poste de Développeur Frontend React.\n\nCordialement,\nJean Dupont'
    },
    cvPath: null // Pas de CV pour le test
  };
  
  try {
    console.log('\n📤 Envoi de l\'email de test...');
    const result = await sendJobApplicationEmail(
      testData.companyEmail,
      testData.jobTitle,
      testData.candidateInfo,
      testData.cvPath
    );
    
    console.log('\n🎉 Test réussi !');
    console.log('✅ Email envoyé avec succès');
    console.log('📧 ID du message:', result.messageId);
    console.log('📝 Réponse du serveur:', result.response);
    
    console.log('\n💌 Vérifiez maintenant votre boîte de réception Gmail :');
    console.log(`   → ${testData.companyEmail}`);
    console.log('   → Vérifiez aussi le dossier spam/courrier indésirable');
    
  } catch (error) {
    console.error('\n❌ Échec du test !');
    console.error('📛 Erreur:', error.message);
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.log('\n💡 Erreur d\'authentification Gmail détectée :');
      console.log('1. Vérifiez que l\'authentification à 2 facteurs est activée');
      console.log('2. Générez un mot de passe d\'application :');
      console.log('   → https://myaccount.google.com/apppasswords');
      console.log('3. Utilisez ce mot de passe dans SMTP_PASS (pas votre mot de passe normal)');
    }
    
    process.exit(1);
  }
}

// Exécuter le test
testEmailDelivery();
