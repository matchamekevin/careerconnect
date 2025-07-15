// Configuration Gmail simple pour tests
const nodemailer = require('nodemailer');

// Configuration temporaire pour tests Gmail
const gmailConfig = {
  user: 'matchamegnatikevin894@gmail.com',
  // Vous devez générer un "mot de passe d'application" sur Gmail
  pass: 'votre_mot_de_passe_app_16_caracteres'
};

const createGmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: gmailConfig.user,
      pass: gmailConfig.pass
    }
  });
};

// Test de configuration Gmail
const testGmailConfig = async () => {
  console.log('🧪 TEST DE CONFIGURATION GMAIL...');
  
  const transporter = createGmailTransporter();
  
  try {
    await transporter.verify();
    console.log('✅ Configuration Gmail validée!');
    
    // Envoyer un email de test
    const info = await transporter.sendMail({
      from: `"CareerConnect Test" <${gmailConfig.user}>`,
      to: 'matchamegnatikevin894@gmail.com',
      subject: '🧪 Test CareerConnect Gmail',
      html: `
        <h2>✅ Configuration Gmail Fonctionnelle</h2>
        <p>Cet email confirme que la configuration Gmail fonctionne correctement.</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Serveur:</strong> Gmail SMTP</p>
      `
    });
    
    console.log('✅ Email de test envoyé!');
    console.log('Message ID:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('❌ Configuration Gmail échouée:', error.message);
    console.log('📝 Instructions pour configurer Gmail:');
    console.log('1. Allez sur https://myaccount.google.com/security');
    console.log('2. Activez l\'authentification à 2 facteurs');
    console.log('3. Allez dans "Mots de passe d\'application"');
    console.log('4. Créez un mot de passe pour "Mail"');
    console.log('5. Remplacez "votre_mot_de_passe_app_16_caracteres" par ce mot de passe');
    return false;
  }
};

module.exports = { createGmailTransporter, testGmailConfig };
