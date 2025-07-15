require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🌟 Configuration Email Automatique avec Ethereal');
console.log('===============================================');

// Créer un compte Ethereal automatiquement
async function createEtherealAccount() {
    try {
        console.log('🔄 Création d\'un compte Ethereal automatique...');
        
        // Créer un compte test Ethereal
        const testAccount = await nodemailer.createTestAccount();
        console.log('✅ Compte Ethereal créé avec succès !');
        console.log('📧 Email:', testAccount.user);
        console.log('🔑 Mot de passe:', testAccount.pass);
        console.log('🌐 Interface web:', 'https://ethereal.email');
        
        // Configuration du transporteur
        const transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        
        // Test d'envoi
        console.log('\n📤 Test d\'envoi d\'email...');
        const info = await transporter.sendMail({
            from: testAccount.user,
            to: 'matchamegnatikevin894@gmail.com',
            subject: 'Test CareerConnect - Candidature',
            html: `
                <h2>🎉 Configuration Email Réussie !</h2>
                <p>Félicitations ! Votre système d'email CareerConnect fonctionne parfaitement.</p>
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
                    <h3>📋 Détails de la candidature test</h3>
                    <ul>
                        <li><strong>Poste :</strong> Développeur Frontend React</li>
                        <li><strong>Candidat :</strong> Jean Dupont</li>
                        <li><strong>Email :</strong> jean.dupont@example.com</li>
                        <li><strong>Téléphone :</strong> +33 6 12 34 56 78</li>
                    </ul>
                </div>
                <p><strong>Prochaines étapes :</strong></p>
                <ol>
                    <li>Configurez Gmail ou Brevo pour les emails réels</li>
                    <li>Testez avec de vraies candidatures</li>
                    <li>Déployez en production</li>
                </ol>
            `
        });
        
        console.log('✅ Email envoyé avec succès !');
        console.log('📧 Message ID:', info.messageId);
        console.log('🌐 Prévisualisation:', nodemailer.getTestMessageUrl(info));
        
        // Mettre à jour le fichier .env avec la configuration Ethereal
        const fs = require('fs');
        const envPath = '.env';
        const envContent = `DATABASE_URL=postgres://postgres:postgres@localhost:5432/careerconnect
PORT=5000
NODE_ENV=production

# Configuration SMTP Ethereal (Test - Fonctionne immédiatement)
SMTP_HOST=${testAccount.smtp.host}
SMTP_PORT=${testAccount.smtp.port}
SMTP_USER=${testAccount.user}
SMTP_PASS=${testAccount.pass}
SMTP_FROM=${testAccount.user}

# Configuration SMTP Gmail (production)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=matchamegnatikevin894@gmail.com
# SMTP_PASS=votre-mot-de-passe-app-gmail
# SMTP_FROM=matchamegnatikevin894@gmail.com

# Configuration SMTP Brevo (alternative)
# SMTP_HOST=smtp-relay.sendinblue.com
# SMTP_PORT=587
# SMTP_USER=matchamegnatikevin894@gmail.com
# SMTP_PASS=votre-cle-smtp-brevo
# SMTP_FROM=matchamegnatikevin894@gmail.com

# Instructions pour Brevo :
# 1. Inscrivez-vous sur https://www.brevo.com (gratuit)
# 2. Allez dans "SMTP & API" → "SMTP"
# 3. Copiez vos identifiants SMTP
# 4. Remplacez les valeurs ci-dessus
`;
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Fichier .env mis à jour avec la configuration Ethereal');
        
        console.log('\n🎯 Prochaines étapes :');
        console.log('1. Redémarrez le serveur : npm start');
        console.log('2. Testez une candidature sur http://localhost:5174');
        console.log('3. Vérifiez les emails sur https://ethereal.email');
        console.log('4. Pour la production, configurez Gmail ou Brevo');
        
    } catch (error) {
        console.error('❌ Erreur lors de la configuration:', error);
    }
}

createEtherealAccount();
