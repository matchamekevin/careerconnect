const emailWrapper = require('./mailer');
require('dotenv').config();

async function testEmail() {
  console.log('🧪 TEST D\'ENVOI D\'EMAIL...');
  console.log('Configuration SMTP:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM
  });
  
  try {
    const result = await emailWrapper.sendMail({
      to: 'matchamegnatikevin894@gmail.com',
      subject: '🧪 Test CareerConnect - Email System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🧪 Test d'Email CareerConnect</h2>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ Configuration Email Fonctionnelle</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Serveur SMTP:</strong> ${process.env.SMTP_HOST}</p>
            <p><strong>Port:</strong> ${process.env.SMTP_PORT}</p>
          </div>
          <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
            <p>Si vous recevez cet email, la configuration SMTP de CareerConnect fonctionne correctement.</p>
            <p>Le système peut maintenant envoyer des emails aux entreprises lorsqu'un candidat postule.</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ TEST RÉUSSI!');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ TEST ÉCHOUÉ:', error.message);
    console.error('Détails:', error);
  }
}

testEmail();
