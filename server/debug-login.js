require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function testLogin() {
  console.log('🔍 Test de Connexion Étudiant');
  console.log('============================');
  
  // Test avec les données d'un utilisateur existant
  const testEmail = 'matchamegnatikevin894@gmail.com';
  const testPassword = 'motdep@sse2003';
  
  console.log('Email de test:', testEmail);
  console.log('Mot de passe de test:', testPassword);
  
  try {
    // Vérifier l'utilisateur dans la base
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [testEmail]);
    console.log('\n📋 Vérification utilisateur:');
    if (userCheck.rows.length === 0) {
      console.log('❌ Utilisateur non trouvé dans la base');
      return;
    }
    
    const user = userCheck.rows[0];
    console.log('✅ Utilisateur trouvé:');
    console.log('  ID:', user.id);
    console.log('  Nom:', user.first_name, user.last_name);
    console.log('  Email:', user.email);
    console.log('  Password Hash:', user.password_hash);
    console.log('  Actif:', user.is_active);
    console.log('  Vérifié:', user.is_verified);
    
    // Test de la requête de connexion
    console.log('\n🔓 Test de la requête de connexion:');
    const loginQuery = 'SELECT * FROM users WHERE email = $1 AND password_hash = $2';
    const loginResult = await pool.query(loginQuery, [testEmail, testPassword]);
    
    if (loginResult.rows.length === 0) {
      console.log('❌ Connexion échouée');
      console.log('   Requête:', loginQuery);
      console.log('   Paramètres:', [testEmail, testPassword]);
      
      // Vérifier si le problème est l'email ou le mot de passe
      const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [testEmail]);
      if (emailCheck.rows.length === 0) {
        console.log('   ❌ Email non trouvé');
      } else {
        console.log('   ✅ Email trouvé');
        console.log('   ❌ Mot de passe incorrect');
        console.log('   Mot de passe stocké:', emailCheck.rows[0].password_hash);
        console.log('   Mot de passe fourni:', testPassword);
        console.log('   Égalité:', emailCheck.rows[0].password_hash === testPassword);
      }
    } else {
      console.log('✅ Connexion réussie');
      console.log('   Utilisateur connecté:', loginResult.rows[0].first_name, loginResult.rows[0].last_name);
    }
    
    // Test de l'endpoint API
    console.log('\n🌐 Test de l\'endpoint API:');
    const http = require('http');
    const postData = JSON.stringify({ email: testEmail, password: testPassword });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/login-student',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('  Status:', res.statusCode);
        console.log('  Réponse:', data);
        process.exit(0);
      });
    });
    
    req.on('error', (e) => {
      console.log('❌ Erreur API:', e.message);
      process.exit(1);
    });
    
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

testLogin();
