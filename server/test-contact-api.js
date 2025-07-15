#!/usr/bin/env node

// Test des endpoints de contact
console.log('🧪 Test des endpoints de contact...');

async function testContactEndpoints() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    // Test 1: Envoyer un message de contact
    console.log('\n📤 Test 1: Envoi d\'un message de contact...');
    
    const testMessage = {
      name: 'Jean Dupont',
      email: 'jean.dupont@test.com',
      subject: 'Test d\'intégration',
      userType: 'etudiant',
      message: 'Ceci est un message de test pour vérifier l\'intégration de la page de contact avec la base de données.'
    };
    
    const response1 = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage),
    });
    
    const data1 = await response1.json();
    console.log('📥 Réponse:', data1);
    
    if (data1.success) {
      console.log('✅ Message envoyé avec succès !', 'ID:', data1.id);
      
      // Test 2: Récupérer les messages
      console.log('\n📋 Test 2: Récupération des messages...');
      
      const response2 = await fetch(`${baseUrl}/api/contact/messages`);
      const data2 = await response2.json();
      
      console.log('📥 Messages récupérés:', data2.messages?.length || 0);
      if (data2.success && data2.messages?.length > 0) {
        console.log('✅ Récupération réussie !');
        console.log('📊 Statistiques:');
        console.log('   - Total messages:', data2.total);
        console.log('   - Page actuelle:', data2.page);
        console.log('   - Dernier message:', {
          nom: data2.messages[0].name,
          email: data2.messages[0].email,
          sujet: data2.messages[0].subject,
          type: data2.messages[0].user_type,
          statut: data2.messages[0].status,
          date: data2.messages[0].created_at
        });
      } else {
        console.log('❌ Erreur lors de la récupération des messages');
      }
    } else {
      console.log('❌ Erreur lors de l\'envoi du message:', data1.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Test de validation
async function testValidation() {
  console.log('\n🔍 Test 3: Validation des champs...');
  
  const invalidMessage = {
    name: '',
    email: 'email-invalide',
    subject: '',
    userType: '',
    message: ''
  };
  
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidMessage),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ Validation fonctionnelle:', data.error);
    } else {
      console.log('❌ La validation devrait échouer');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de validation:', error.message);
  }
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests des endpoints de contact');
  console.log('===============================================');
  
  await testContactEndpoints();
  await testValidation();
  
  console.log('\n🎉 Tests terminés !');
  console.log('===============================================');
  console.log('✅ Fonctionnalités testées:');
  console.log('   - Envoi de messages de contact');
  console.log('   - Stockage en base de données');
  console.log('   - Récupération des messages');
  console.log('   - Validation des champs');
  console.log('   - Gestion des erreurs');
  
  console.log('\n🔗 Pour tester l\'interface:');
  console.log('   - Frontend: http://localhost:5176/contact');
  console.log('   - API: http://localhost:5000/api/contact');
}

runAllTests();
