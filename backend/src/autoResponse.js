const express = require('express');
const router = express.Router();
const supabase = require('./supabase');
const whatsappService = require('./whatsapp');
const nodemailer = require('nodemailer');

// Endpoint pour gérer les réponses automatiques
router.post('/auto-response', async (req, res) => {
  const { 
    candidateEmail, 
    candidatePhone, 
    jobTitle, 
    companyName, 
    responseMessage, 
    sendEmail = true, 
    sendWhatsApp = true,
    modifiedEmailMessage = null,
    modifiedWhatsAppMessage = null
  } = req.body;

  try {
    const results = {
      email: null,
      whatsapp: null
    };

    // Envoyer l'email de réponse
    if (sendEmail) {
      const emailMessage = modifiedEmailMessage || `Bonjour,

Nous avons bien reçu votre candidature pour le poste de ${jobTitle}.

${responseMessage}

Cordialement,
L'équipe ${companyName}`;

      // Configuration du transporteur (réutiliser la config du mailer principal)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${companyName}" <${process.env.SMTP_FROM}>`,
        to: candidateEmail,
        subject: `Re: Candidature pour ${jobTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h2 style="color: white; margin: 0;">${companyName}</h2>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">Réponse à votre candidature</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
              <h3 style="color: #2563eb; margin-top: 0;">Re: ${jobTitle}</h3>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-line;">${emailMessage}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                <p style="margin: 0;">Message envoyé via CareerConnect</p>
              </div>
            </div>
          </div>
        `
      };

      const emailResult = await transporter.sendMail(mailOptions);
      results.email = { success: true, messageId: emailResult.messageId };
    }

    // Envoyer le WhatsApp de réponse
    if (sendWhatsApp && candidatePhone) {
      const whatsappMessage = modifiedWhatsAppMessage || `📬 *Réponse de ${companyName}*

📄 *Poste:* ${jobTitle}

💬 *Message:*
${responseMessage}

_Message automatique de CareerConnect_`;

      const whatsappResult = await whatsappService.sendMessage(candidatePhone, whatsappMessage);
      results.whatsapp = whatsappResult;
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse automatique:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
