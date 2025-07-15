#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testContactDeletion() {
  console.log('🧪 Test de suppression des messages de contact\n');

  try {
    // 1. Créer un message de test
    console.log('1. Création d\'un message de test...');
    const createResponse = await axios.post(`${BASE_URL}/contact`, {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Message de test',
      userType: 'student',
      message: 'Ceci est un message de test qui sera supprimé'
    });

    if (!createResponse.data.success) {
      throw new Error('Échec de la création du message de test');
    }

    const messageId = createResponse.data.id;
    console.log(`✅ Message créé avec l'ID: ${messageId}`);

    // 2. Vérifier que le message existe
    console.log('\n2. Vérification de l\'existence du message...');
    const listResponse = await axios.get(`${BASE_URL}/contact/messages`);
    const messageExists = listResponse.data.messages.some(msg => msg.id === messageId);
    
    if (!messageExists) {
      throw new Error('Le message créé n\'apparaît pas dans la liste');
    }
    console.log('✅ Message trouvé dans la liste');

    // 3. Supprimer le message
    console.log('\n3. Suppression du message...');
    const deleteResponse = await axios.delete(`${BASE_URL}/contact/messages/${messageId}`);
    
    if (!deleteResponse.data.success) {
      throw new Error('Échec de la suppression du message');
    }
    console.log('✅ Message supprimé avec succès');

    // 4. Vérifier que le message n'existe plus
    console.log('\n4. Vérification de la suppression...');
    const listAfterDeleteResponse = await axios.get(`${BASE_URL}/contact/messages`);
    const messageStillExists = listAfterDeleteResponse.data.messages.some(msg => msg.id === messageId);
    
    if (messageStillExists) {
      throw new Error('Le message existe toujours après suppression');
    }
    console.log('✅ Message bien supprimé de la base de données');

    // 5. Test de suppression d'un message inexistant
    console.log('\n5. Test de suppression d\'un message inexistant...');
    try {
      const deleteNonExistentResponse = await axios.delete(`${BASE_URL}/contact/messages/99999`);
      console.log('❌ La suppression d\'un message inexistant devrait retourner une erreur');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Erreur 404 correctement retournée pour un message inexistant');
      } else {
        throw error;
      }
    }

    // 6. Test avec ID invalide
    console.log('\n6. Test avec ID invalide...');
    try {
      await axios.delete(`${BASE_URL}/contact/messages/invalid-id`);
      console.log('❌ La suppression avec un ID invalide devrait retourner une erreur');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Erreur 400 correctement retournée pour un ID invalide');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Tous les tests de suppression ont réussi !');

  } catch (error) {
    console.error('\n❌ Erreur pendant les tests:', error.message);
    if (error.response) {
      console.error('Réponse du serveur:', error.response.data);
    }
    process.exit(1);
  }
}

async function testContactPagination() {
  console.log('\n🧪 Test de la pagination des messages\n');

  try {
    // 1. Créer plusieurs messages de test
    console.log('1. Création de plusieurs messages de test...');
    const testMessages = [];
    
    for (let i = 1; i <= 15; i++) {
      const response = await axios.post(`${BASE_URL}/contact`, {
        name: `Test User ${i}`,
        email: `test${i}@example.com`,
        subject: `Message de test ${i}`,
        userType: i % 2 === 0 ? 'company' : 'student',
        message: `Ceci est le message de test numéro ${i}`
      });
      
      if (response.data.success) {
        testMessages.push(response.data.id);
      }
    }
    
    console.log(`✅ ${testMessages.length} messages créés`);

    // 2. Test de la pagination
    console.log('\n2. Test de la pagination...');
    
    // Première page (10 éléments par défaut)
    const page1Response = await axios.get(`${BASE_URL}/contact/messages?limit=5&offset=0`);
    if (page1Response.data.messages.length !== 5) {
      throw new Error(`Attendu 5 messages sur la page 1, reçu ${page1Response.data.messages.length}`);
    }
    console.log('✅ Page 1 : 5 messages récupérés');
    
    // Deuxième page
    const page2Response = await axios.get(`${BASE_URL}/contact/messages?limit=5&offset=5`);
    if (page2Response.data.messages.length !== 5) {
      throw new Error(`Attendu 5 messages sur la page 2, reçu ${page2Response.data.messages.length}`);
    }
    console.log('✅ Page 2 : 5 messages récupérés');

    // Vérifier les informations de pagination
    if (page1Response.data.totalPages < 3) {
      throw new Error(`Attendu au moins 3 pages, reçu ${page1Response.data.totalPages}`);
    }
    console.log(`✅ Pagination correcte : ${page1Response.data.totalPages} pages, ${page1Response.data.total} messages total`);

    // 3. Nettoyage : supprimer les messages de test
    console.log('\n3. Nettoyage des messages de test...');
    for (const messageId of testMessages) {
      try {
        await axios.delete(`${BASE_URL}/contact/messages/${messageId}`);
      } catch (error) {
        console.warn(`Attention: impossible de supprimer le message ${messageId}`);
      }
    }
    console.log('✅ Messages de test nettoyés');

    console.log('\n🎉 Tous les tests de pagination ont réussi !');

  } catch (error) {
    console.error('\n❌ Erreur pendant les tests de pagination:', error.message);
    if (error.response) {
      console.error('Réponse du serveur:', error.response.data);
    }
    process.exit(1);
  }
}

// Fonction principale
async function runTests() {
  console.log('🚀 Démarrage des tests d\'administration des messages de contact\n');
  
  // Vérifier que le serveur est accessible
  try {
    await axios.get(`${BASE_URL}/test`);
    console.log('✅ Serveur accessible\n');
  } catch (error) {
    console.error('❌ Serveur non accessible. Assurez-vous qu\'il est démarré sur le port 5000');
    process.exit(1);
  }

  await testContactDeletion();
  await testContactPagination();
  
  console.log('\n🎉 Tous les tests sont terminés avec succès !');
}

if (require.main === module) {
  runTests();
}

module.exports = { testContactDeletion, testContactPagination };
