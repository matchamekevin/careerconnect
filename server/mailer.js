const nodemailer = require('nodemailer');
const path = require('path');
const whatsappService = require('./whatsapp');

// Configuration du transporteur SMTP
const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT, 10);
  const config = {
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465, // Utiliser SSL/TLS si port 465
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

  return nodemailer.createTransport(config);
};

// Fonction pour envoyer un email de candidature avec WhatsApp
const sendJobApplicationEmail = async (companyEmail, jobTitle, candidateInfo, cvPath, companyPhone = null) => {
  try {
    const transporter = createTransporter();

    // Vérifier la configuration SMTP
    try {
      await transporter.verify();
      console.log('✅ Serveur SMTP prêt pour l\'envoi d\'emails');
    } catch (err) {
      console.error('❌ Erreur SMTP:', err.message);
      console.error('Vérifiez vos identifiants SMTP. Pour Gmail, autorisez les mots de passe d\'application ou utilisez OAuth2.');
      console.error('Plus d\'infos: https://support.google.com/mail/?p=BadCredentials');
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

    // Contenu de l'email
    const mailOptions = {
      from: `"CareerConnect" <${process.env.SMTP_FROM}>`,
      to: companyEmail,
      subject: `Nouvelle candidature pour le poste : ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header avec logo CareerConnect -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📋 CareerConnect</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Plateforme de recrutement professionnel</p>
          </div>
          
          <!-- Contenu principal -->
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
              
              ${candidateInfo.coverLetter ? `
                <div style="margin: 20px 0;">
                  <strong style="color: #374151; font-size: 16px;">💌 Lettre de motivation :</strong>
                  <div style="background-color: white; padding: 20px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <p style="margin: 0; color: #374151; line-height: 1.6; font-style: italic;">
                      ${candidateInfo.coverLetter.replace(/\n/g, '<br>')}
                    </p>
                  </div>
                </div>
              ` : ''}
            </div>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #bfdbfe;">
              <p style="margin: 0; color: #1e40af; font-size: 16px; text-align: center;">
                ${cvPath ? '📎 <strong>CV joint à cet email</strong> - Cliquez sur la pièce jointe pour l\'ouvrir' : '⚠️ Aucun CV n\'a été joint à cette candidature'}
              </p>
            </div>
            
            <!-- Boutons d'action avec disposition responsive optimisée -->
            <div style="text-align: center; margin: 40px 0; padding: 20px;">
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
                <h3 style="color: #2563eb; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                  🚀 Actions rapides
                </h3>
                
                <!-- Boutons version desktop -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; width: 100%; max-width: 600px;">
                  <tr>
                    <td style="padding: 12px; text-align: center;">
                      <a href="mailto:${candidateInfo.email}?subject=Re: Candidature pour ${jobTitle}&body=Bonjour ${candidateInfo.firstName},

Nous avons bien reçu votre candidature pour le poste de ${jobTitle}.

[Veuillez modifier ce message selon votre réponse]

Cordialement,
L'équipe recrutement" 
                         style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); border: none; min-width: 180px; text-align: center; transition: all 0.3s ease; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        ✉️ Répondre par email
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; text-align: center;">
                      <a href="${whatsappService.generateWhatsAppLink(candidateInfo.phone, `Bonjour ${candidateInfo.firstName}, nous avons bien reçu votre candidature pour le poste de ${jobTitle}.`)}" 
                         style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); border: none; min-width: 180px; text-align: center; transition: all 0.3s ease; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        📱 Répondre par WhatsApp
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; text-align: center;">
                      <a href="tel:${candidateInfo.phone}" 
                         style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); border: none; min-width: 180px; text-align: center; transition: all 0.3s ease; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        📞 Appeler directement
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Version desktop large écran (3 boutons côte à côte) -->
                <!--[if !mso]><!-->
                <div style="display: none;">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; width: 100%; max-width: 600px;">
                    <tr>
                      <td style="padding: 8px; text-align: center; width: 33.33%;">
                        <a href="mailto:${candidateInfo.email}?subject=Re: Candidature pour ${jobTitle}&body=Bonjour ${candidateInfo.firstName},%0D%0A%0D%0ANous avons bien reçu votre candidature pour le poste de ${jobTitle}.%0D%0A%0D%0A[Veuillez modifier ce message selon votre réponse]%0D%0A%0D%0ACordialement,%0D%0AL'équipe recrutement" 
                           style="display: block; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 14px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                          ✉️ Email
                        </a>
                      </td>
                      <td style="padding: 8px; text-align: center; width: 33.33%;">
                        <a href="${whatsappService.generateWhatsAppLink(candidateInfo.phone, `Bonjour ${candidateInfo.firstName}, nous avons bien reçu votre candidature pour le poste de ${jobTitle}.`)}" 
                           style="display: block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 14px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                          📱 WhatsApp
                        </a>
                      </td>
                      <td style="padding: 8px; text-align: center; width: 33.33%;">
                        <a href="tel:${candidateInfo.phone}" 
                           style="display: block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                          📞 Appeler
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>
                <!--<![endif]-->
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #d1d5db;">
                  <p style="margin: 0; color: #6b7280; font-size: 13px; font-style: italic;">
                    💡 Cliquez sur le bouton de votre choix pour contacter rapidement le candidat
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #2563eb;">CareerConnect</strong> - Votre partenaire recrutement
              </p>
              <p style="margin: 0 0 10px 0;">
                Cet email a été envoyé automatiquement par notre plateforme de recrutement.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Vous pouvez répondre directement à ce message pour contacter le candidat.
              </p>
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
    console.log('📝 Réponse:', info.response);

    // Envoyer aussi une notification WhatsApp si le numéro de l'entreprise est fourni
    if (companyPhone) {
      try {
        console.log('📱 Envoi de la notification WhatsApp à l\'entreprise...');
        const whatsappResult = await whatsappService.sendJobApplicationNotification(
          companyPhone,
          jobTitle,
          candidateInfo
        );
        
        if (whatsappResult.success) {
          console.log('✅ Notification WhatsApp envoyée !');
          console.log('📱 Message ID:', whatsappResult.messageId);
        } else {
          console.log('⚠️ Erreur WhatsApp:', whatsappResult.error);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi WhatsApp:', error);
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      whatsappSent: companyPhone ? true : false
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    // Informations détaillées sur l'erreur
    if (error.code) {
      console.error('🔍 Code d\'erreur:', error.code);
    }
    if (error.response) {
      console.error('🔍 Réponse du serveur:', error.response);
    }
    
    throw error;
  }
};

module.exports = {
  sendJobApplicationEmail
};
