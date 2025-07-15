const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function configureEthereal() {
    console.log('🚀 Configuration d\'Ethereal Email...');
    
    try {
        // Créer un compte de test Ethereal
        const testAccount = await nodemailer.createTestAccount();
        
        console.log('✅ Compte Ethereal créé avec succès !');
        console.log('📧 Email:', testAccount.user);
        console.log('🔑 Mot de passe:', testAccount.pass);
        
        // Mettre à jour le fichier .env
        const envPath = path.join(__dirname, 'server', '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Remplacer les valeurs SMTP
        envContent = envContent.replace(/SMTP_HOST=.*/, `SMTP_HOST=smtp.ethereal.email`);
        envContent = envContent.replace(/SMTP_PORT=.*/, `SMTP_PORT=587`);
        envContent = envContent.replace(/SMTP_USER=.*/, `SMTP_USER=${testAccount.user}`);
        envContent = envContent.replace(/SMTP_PASS=.*/, `SMTP_PASS=${testAccount.pass}`);
        envContent = envContent.replace(/SMTP_FROM=.*/, `SMTP_FROM=${testAccount.user}`);
        
        fs.writeFileSync(envPath, envContent);
        
        console.log('✅ Fichier .env mis à jour !');
        console.log('🌐 Aperçu des emails : https://ethereal.email/');
        console.log('📝 Connectez-vous avec les identifiants ci-dessus pour voir les emails envoyés');
        
        // Test d'envoi
        console.log('\n🧪 Test d\'envoi d\'email...');
        
        const transporter = nodemailer.createTransporter({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        
        const info = await transporter.sendMail({
            from: testAccount.user,
            to: 'test@example.com',
            subject: 'Test CareerConnect - Configuration Ethereal',
            text: 'Ceci est un test de configuration email pour CareerConnect.',
            html: `
                <h2>✅ Test de configuration réussi !</h2>
                <p>CareerConnect est maintenant configuré avec Ethereal Email.</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Statut:</strong> Configuration terminée</p>
            `
        });
        
        console.log('✅ Email de test envoyé !');
        console.log('📬 ID du message:', info.messageId);
        console.log('🔗 Aperçu:', nodemailer.getTestMessageUrl(info));
        
    } catch (error) {
        console.error('❌ Erreur lors de la configuration:', error);
        process.exit(1);
    }
}

configureEthereal();
