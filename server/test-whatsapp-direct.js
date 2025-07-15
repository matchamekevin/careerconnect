#!/usr/bin/env node

// Test de la fonctionnalité WhatsApp directe
console.log('🧪 Test de la discussion WhatsApp directe...');

const whatsappService = require('./whatsapp');

// Données de test
const testData = {
  companyPhone: '+228 90 12 34 56',
  studentPhone: '+228 91 23 45 67',
  jobTitle: 'Développeur Full Stack',
  companyName: 'Tech Solutions',
  candidateInfo: {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+228 91 23 45 67'
  }
};

async function testWhatsAppDirectConversation() {
  console.log('📱 Test de création de discussion directe...');
  
  try {
    // Test de la création de conversation directe
    const result = await whatsappService.createDirectConversation(
      testData.companyPhone,
      testData.studentPhone,
      testData.jobTitle,
      testData.companyName,
      testData.candidateInfo
    );
    
    console.log('✅ Résultat du test:', result);
    console.log('🔗 Lien entreprise → étudiant:', result.companyLink);
    console.log('🔗 Lien étudiant → entreprise:', result.studentLink);
    
    // Test de génération de liens automatiques
    console.log('\n📱 Test de génération de liens automatiques...');
    const autoLinks = whatsappService.generateAutoOpenLinks(
      testData.companyPhone,
      testData.studentPhone,
      testData.jobTitle,
      testData.companyName,
      testData.candidateInfo
    );
    
    console.log('✅ Liens automatiques générés:');
    console.log('   Entreprise → Étudiant:', autoLinks.companyToStudent);
    console.log('   Étudiant → Entreprise:', autoLinks.studentToCompany);
    console.log('   Métadonnées:', autoLinks.metadata);
    
    console.log('\n🎉 Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testWhatsAppDirectConversation();
