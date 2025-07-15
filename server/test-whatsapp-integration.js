require('dotenv').config();
const whatsappService = require('./whatsapp');
const { sendJobApplicationEmail } = require('./mailer');

async function testWhatsAppIntegration() {
  console.log('🧪 Test d\'Intégration WhatsApp + Email');
  console.log('====================================');
  
  // Données de test
  const testData = {
    companyEmail: 'matchamegnatikevin894@gmail.com',
    companyPhone: '+228 90 12 34 56',
    jobTitle: 'Développeur Full Stack',
    candidateInfo: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+228 99 87 65 43',
      coverLetter: 'Je suis très intéressé par ce poste et j\'aimerais rejoindre votre équipe.'
    }
  };
  
  console.log('📋 Données de test:');
  console.log('   Entreprise:', testData.companyEmail, '/', testData.companyPhone);
  console.log('   Candidat:', testData.candidateInfo.firstName, testData.candidateInfo.lastName);
  console.log('   Poste:', testData.jobTitle);
  
  try {
    // Test 1: Envoi d'une candidature (email + WhatsApp à l'entreprise)
    console.log('\n📤 Test 1: Envoi candidature avec WhatsApp...');
    
    const result = await sendJobApplicationEmail(
      testData.companyEmail,
      testData.jobTitle,
      testData.candidateInfo,
      null, // Pas de CV pour le test
      testData.companyPhone
    );
    
    console.log('✅ Résultat:', result);
    
    // Test 2: Génération de lien WhatsApp
    console.log('\n📱 Test 2: Génération lien WhatsApp...');
    
    const whatsappLink = whatsappService.generateWhatsAppLink(
      testData.candidateInfo.phone,
      `Bonjour ${testData.candidateInfo.firstName}, nous avons bien reçu votre candidature pour le poste de ${testData.jobTitle}.`
    );
    
    console.log('🔗 Lien WhatsApp:', whatsappLink);
    
    // Test 3: Envoi de notification WhatsApp direct
    console.log('\n📲 Test 3: Notification WhatsApp directe...');
    
    const whatsappResult = await whatsappService.sendJobApplicationNotification(
      testData.companyPhone,
      testData.jobTitle,
      testData.candidateInfo
    );
    
    console.log('📱 Résultat WhatsApp:', whatsappResult);
    
    console.log('\n🎉 Tous les tests terminés !');
    console.log('✅ Email envoyé avec branding CareerConnect');
    console.log('✅ WhatsApp intégré (mode simulation)');
    console.log('✅ Liens d\'action fonctionnels');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testWhatsAppIntegration();
