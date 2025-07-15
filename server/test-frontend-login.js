// Test de connexion frontend
async function testFrontendLogin() {
  console.log('🔍 Test de Connexion Frontend');
  console.log('============================');
  
  const testData = {
    email: 'matchamegnatikevin894@gmail.com',
    password: 'motdep@sse2003'
  };
  
  console.log('Données de test:', testData);
  
  try {
    // Simuler la requête frontend
    const response = await fetch('http://localhost:5000/api/login-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Réponse:', data);
    
    if (data.success) {
      console.log('✅ Connexion réussie');
      console.log('Utilisateur:', data.user.first_name, data.user.last_name);
    } else {
      console.log('❌ Connexion échouée:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Test avec des données incorrectes
async function testWrongCredentials() {
  console.log('\\n🔍 Test avec Mauvaises Données');
  console.log('================================');
  
  const testData = {
    email: 'matchamegnatikevin894@gmail.com',
    password: 'mauvais_mot_de_passe'
  };
  
  console.log('Données de test:', testData);
  
  try {
    const response = await fetch('http://localhost:5000/api/login-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Réponse:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter les tests
testFrontendLogin().then(() => {
  testWrongCredentials().then(() => {
    console.log('\\n✅ Tests terminés');
    process.exit(0);
  });
});
