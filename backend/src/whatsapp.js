const axios = require('axios');

// Configuration WhatsApp Business API
// Pour la production, utilisez l'API WhatsApp Business officielle
// Pour les tests, nous utiliserons une approche simulée

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  // Formater le numéro de téléphone pour WhatsApp
  formatPhoneNumber(phone) {
    // Supprimer tous les espaces, tirets et autres caractères
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // S'assurer que le numéro commence par +
    if (!cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    
    return cleaned;
  }

  // Envoyer un message WhatsApp (version simulée pour le développement)
  async sendMessage(to, message, options = {}) {
    const formattedNumber = this.formatPhoneNumber(to);
    
    console.log('📱 Envoi WhatsApp simulé:');
    console.log('   Destinataire:', formattedNumber);
    console.log('   Message:', message);
    
    // En production, utilisez l'API WhatsApp Business
    if (process.env.NODE_ENV === 'production' && this.accessToken) {
      try {
        const response = await axios.post(
          `${this.apiUrl}/v17.0/${this.phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            to: formattedNumber,
            type: 'text',
            text: { body: message }
          },
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        return { success: true, messageId: response.data.messages[0].id };
      } catch (error) {
        console.error('❌ Erreur WhatsApp:', error.response?.data || error.message);
        return { success: false, error: error.message };
      }
    }
    
    // Mode développement : simulation
    return { 
      success: true, 
      messageId: 'sim_' + Date.now(),
      simulated: true 
    };
  }

  // Message de candidature pour l'entreprise
  async sendJobApplicationNotification(companyPhone, jobTitle, candidateInfo) {
    const message = `🎯 *Nouvelle candidature reçue*

📄 *Poste:* ${jobTitle}

👤 *Candidat:*
• Nom: ${candidateInfo.firstName} ${candidateInfo.lastName}
• Email: ${candidateInfo.email}
• Téléphone: ${candidateInfo.phone}

📧 Consultez votre email pour plus de détails et le CV.

_Message automatique de CareerConnect_`;

    return await this.sendMessage(companyPhone, message);
  }

  // Message de réponse pour le candidat
  async sendJobResponseNotification(candidatePhone, jobTitle, companyName, responseMessage) {
    const message = `📬 *Réponse de ${companyName}*

📄 *Poste:* ${jobTitle}

💬 *Message:*
${responseMessage}

_Message automatique de CareerConnect_`;

    return await this.sendMessage(candidatePhone, message);
  }

  // Générer un lien WhatsApp pour réponse manuelle
  generateWhatsAppLink(phoneNumber, prefilledMessage = '') {
    const formatted = this.formatPhoneNumber(phoneNumber);
    const encoded = encodeURIComponent(prefilledMessage);
    return `https://wa.me/${formatted.replace('+', '')}?text=${encoded}`;
  }

  // Créer une discussion directe entre entreprise et étudiant
  async createDirectConversation(companyPhone, studentPhone, jobTitle, companyName, candidateInfo) {
    console.log('🚀 Création d\'une discussion WhatsApp directe...');
    
    // Message pour l'entreprise avec lien direct vers l'étudiant
    const messageForCompany = `🎯 *Nouvelle candidature reçue*

📄 *Poste:* ${jobTitle}

👤 *Candidat:*
• Nom: ${candidateInfo.firstName} ${candidateInfo.lastName}
• Email: ${candidateInfo.email}
• Téléphone: ${candidateInfo.phone}

📧 Consultez votre email pour plus de détails et le CV.

💬 *Cliquez ici pour discuter directement avec le candidat:*
${this.generateWhatsAppLink(candidateInfo.phone, `Bonjour ${candidateInfo.firstName}, nous avons reçu votre candidature pour le poste de ${jobTitle}. Pouvons-nous discuter ?`)}

_Message automatique de CareerConnect_`;

    // Message pour l'étudiant avec lien direct vers l'entreprise
    const messageForStudent = `✅ *Candidature envoyée avec succès*

📄 *Poste:* ${jobTitle}
🏢 *Entreprise:* ${companyName}

Votre candidature a été transmise à l'entreprise. Vous pouvez maintenant discuter directement avec eux.

💬 *Cliquez ici pour contacter l'entreprise:*
${this.generateWhatsAppLink(companyPhone, `Bonjour, je suis ${candidateInfo.firstName}, j'ai postulé pour le poste de ${jobTitle}. Je suis disponible pour discuter.`)}

_Message automatique de CareerConnect_`;

    // Envoyer les messages aux deux parties
    const results = await Promise.allSettled([
      this.sendMessage(companyPhone, messageForCompany),
      this.sendMessage(studentPhone, messageForStudent)
    ]);

    const companyResult = results[0];
    const studentResult = results[1];

    console.log('📱 Résultats envoi WhatsApp:');
    console.log('   Entreprise:', companyResult.status === 'fulfilled' ? '✅' : '❌');
    console.log('   Étudiant:', studentResult.status === 'fulfilled' ? '✅' : '❌');

    return {
      success: companyResult.status === 'fulfilled' && studentResult.status === 'fulfilled',
      companyMessage: companyResult.status === 'fulfilled' ? companyResult.value : null,
      studentMessage: studentResult.status === 'fulfilled' ? studentResult.value : null,
      companyLink: this.generateWhatsAppLink(candidateInfo.phone, `Bonjour ${candidateInfo.firstName}, nous avons reçu votre candidature pour le poste de ${jobTitle}. Pouvons-nous discuter ?`),
      studentLink: this.generateWhatsAppLink(companyPhone, `Bonjour, je suis ${candidateInfo.firstName}, j'ai postulé pour le poste de ${jobTitle}. Je suis disponible pour discuter.`)
    };
  }

  // Ouvrir automatiquement WhatsApp Web/Desktop avec la conversation
  generateAutoOpenLinks(companyPhone, studentPhone, jobTitle, companyName, candidateInfo) {
    const companyMessage = `Bonjour ${candidateInfo.firstName}, nous avons reçu votre candidature pour le poste de ${jobTitle}. Pouvons-nous discuter ?`;
    const studentMessage = `Bonjour, je suis ${candidateInfo.firstName}, j'ai postulé pour le poste de ${jobTitle}. Je suis disponible pour discuter.`;

    return {
      // Lien pour que l'entreprise contacte l'étudiant
      companyToStudent: this.generateWhatsAppLink(candidateInfo.phone, companyMessage),
      // Lien pour que l'étudiant contacte l'entreprise
      studentToCompany: this.generateWhatsAppLink(companyPhone, studentMessage),
      // Métadonnées
      metadata: {
        jobTitle,
        companyName,
        candidateName: `${candidateInfo.firstName} ${candidateInfo.lastName}`,
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = new WhatsAppService();
