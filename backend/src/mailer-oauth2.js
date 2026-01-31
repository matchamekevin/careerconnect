const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const whatsappService = require('./whatsapp');

// Configuration OAuth2 pour Gmail
const createOAuth2Transporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  try {
    const accessToken = await oauth2Client.getAccessToken();
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    return transporter;
  } catch (error) {
    console.error('❌ Erreur OAuth2:', error);
    throw error;
  }
};

// Configuration SMTP classique (fallback)
const createSMTPTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT, 10);
  const config = {
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  console.log('📧 Configuration SMTP:', {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    from: process.env.SMTP_FROM
  });

  return nodemailer.createTransporter(config);
};

// Fonction principale pour créer le transporteur
const createTransporter = async () => {
  // Essayer OAuth2 d'abord si configuré
  if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET && process.env.OAUTH_REFRESH_TOKEN) {
    try {
      console.log('🔐 Tentative d\'authentification OAuth2...');
      return await createOAuth2Transporter();
    } catch (error) {
      console.log('⚠️  OAuth2 échoué, basculement vers SMTP classique');
    }
  }

  // Fallback vers SMTP classique
  console.log('📧 Utilisation de l\'authentification SMTP classique');
  return createSMTPTransporter();
};

// Solution alternative : utiliser un service tiers
const createEtherealTransporter = async () => {
  console.log('🧪 Création d\'un compte de test Ethereal...');
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Fonction pour envoyer un email avec gestion d'erreurs améliorée
const sendJobApplicationEmail = async (companyEmail, jobTitle, candidateInfo, cvPath, companyPhone = null) => {
  try {
    let transporter;
    
    try {
      transporter = await createTransporter();
    } catch (error) {
      console.log('⚠️  Impossible de créer le transporteur principal, utilisation d\'Ethereal pour test');
      transporter = await createEtherealTransporter();
    }

    // Vérifier la configuration
    try {
      await transporter.verify();
      console.log('✅ Serveur SMTP prêt pour l\'envoi d\'emails');
    } catch (err) {
      console.error('❌ Erreur de vérification SMTP:', err.message);
      
      // Messages d'erreur spécifiques
      if (err.message.includes('535-5.7.8') || err.message.includes('BadCredentials')) {
        console.error('🔐 ERREUR D\'AUTHENTIFICATION GMAIL:');
        console.error('1. Vérifiez que l\'authentification à 2 facteurs est activée');
        console.error('2. Générez un mot de passe d\'application: https://myaccount.google.com/apppasswords');
        console.error('3. Ou configurez OAuth2 avec les paramètres suivants dans .env:');
        console.error('   OAUTH_CLIENT_ID=xxx.apps.googleusercontent.com');
        console.error('   OAUTH_CLIENT_SECRET=xxx');
        console.error('   OAUTH_REFRESH_TOKEN=1//xxx');
        console.error('4. Guide OAuth2: https://developers.google.com/oauthplayground');
      }
      
      throw err;
    }

    // Préparer les pièces jointes
    const attachments = [];
    if (cvPath) {
      attachments.push({
        filename: `CV_${candidateInfo.firstName}_${candidateInfo.lastName}.pdf`,
        path: cvPath,
        contentType: 'application/pdf'
      });
    }

    // Contenu de l'email (gardé identique)
    const mailOptions = {
      from: `"CareerConnect" <${process.env.SMTP_FROM}>`,
      to: companyEmail,
      subject: `Nouvelle candidature pour le poste : ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Email content reste identique -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📋 CareerConnect</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Plateforme de recrutement professionnel</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; margin-top: 0;">
              🎯 Nouvelle candidature reçue
            </h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="color: #374151; margin-top: 0; font-size: 18px;">
                📄 Poste : <span style="color: #2563eb;">${jobTitle}</span>
              </h3>
              
              <div style="margin: 20px 0;">
                <strong style="color: #374151; font-size: 16px;">👤 Informations du candidat :</strong>
                <div style="background-color: white; padding: 15px; border-radius: 6px; margin-top: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <p style="margin: 8px 0; color: #374151;"><strong>📝 Nom :</strong> ${candidateInfo.firstName} ${candidateInfo.lastName}</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>📧 Email :</strong> <a href="mailto:${candidateInfo.email}" style="color: #2563eb; text-decoration: none;">${candidateInfo.email}</a></p>
                  <p style="margin: 8px 0; color: #374151;"><strong>📱 Téléphone :</strong> <a href="tel:${candidateInfo.phone}" style="color: #2563eb; text-decoration: none;">${candidateInfo.phone}</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      attachments
    };

    console.log('📤 Envoi de l\'email à:', companyEmail);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé avec succès !');
    console.log('📧 Message ID:', info.messageId);
    
    // Si utilisation d'Ethereal, afficher le lien de prévisualisation
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log('🔗 Prévisualisation Ethereal:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

module.exports = {
  sendJobApplicationEmail,
  createTransporter,
  createEtherealTransporter
};
