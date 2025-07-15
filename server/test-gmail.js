const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmailConnection() {
    console.log('🧪 Test de connexion Gmail pour CareerConnect');
    console.log('==============================================');
    
    // Configuration actuelle
    const config = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    };
    
    // Vérifications préliminaires
    if (!config.auth.user) {
        console.log('❌ SMTP_USER non défini');
        return false;
    }
    
    if (!config.auth.pass) {
        console.log('❌ SMTP_PASS non défini');
        return false;
    }
    
    // Vérification spécifique Gmail
    if (config.host === 'smtp.gmail.com') {
        console.log('🎯 Configuration Gmail détectée');
        
        if (config.auth.pass.length !== 16) {
            console.log('⚠️  ATTENTION: Le mot de passe ne fait pas 16 caractères');
            console.log('💡 Un mot de passe d\'application Gmail fait exactement 16 caractères');
            console.log('📋 Pour générer un mot de passe d\'application:');
            console.log('1. https://myaccount.google.com/');
            console.log('2. Sécurité > Validation en 2 étapes');
            console.log('3. Mots de passe d\'application');
            console.log('');
        } else {
            console.log('✅ Mot de passe d\'application détecté (16 caractères)');
        }
    }
    
    // Créer le transporteur
    const transporter = nodemailer.createTransport(config);
    
    try {
        console.log('\n🔍 Test de vérification de la configuration...');
        await transporter.verify();
        console.log('✅ Configuration SMTP valide !');
        
        console.log('\n📧 Test d\'envoi d\'email...');
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'JobTogo Étudiant'}" <${process.env.SMTP_FROM || config.auth.user}>`,
            to: config.auth.user, // S'envoyer à soi-même
            subject: 'Test CareerConnect - ' + new Date().toISOString(),
            html: `
                <h2>🎉 Test réussi !</h2>
                <p>Si vous recevez cet email, la configuration Gmail fonctionne correctement.</p>
                <p><strong>Heure du test :</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Application :</strong> CareerConnect JobTogo Étudiant</p>
                <hr>
                <p><small>Cet email a été envoyé automatiquement lors du test de configuration.</small></p>
            `
        });
        
        console.log('✅ Email envoyé avec succès !');
        console.log('📨 Message ID:', info.messageId);
        console.log('📬 Vérifiez votre boîte email pour confirmer la réception.');
        
    } catch (error) {
        console.log('❌ Erreur de connexion Gmail :');
        console.log('Code d\'erreur:', error.code);
        console.log('Message:', error.message);
        
        // Diagnostic détaillé
        console.log('\n🔍 DIAGNOSTIC DÉTAILLÉ');
        console.log('===================');
        
        if (error.code === 'EAUTH') {
            console.log('❌ Erreur d\'authentification (535-5.7.8)');
            console.log('📝 Solutions possibles :');
            console.log('   1. Vérifier l\'authentification à 2 facteurs sur Gmail');
            console.log('   2. Générer un nouveau mot de passe d\'application');
            console.log('   3. Vérifier l\'adresse email dans SMTP_USER');
            console.log('   4. Supprimer les espaces dans SMTP_PASS');
        } else if (error.code === 'ECONNECTION') {
            console.log('❌ Erreur de connexion réseau');
            console.log('📝 Solutions possibles :');
            console.log('   1. Vérifier la connexion Internet');
            console.log('   2. Vérifier les paramètres de firewall');
            console.log('   3. Essayer un autre réseau');
        } else {
            console.log('❌ Erreur inconnue');
            console.log('📝 Vérifier tous les paramètres SMTP');
        }
        
        console.log('\n🔗 LIENS UTILES :');
        console.log('• Sécurité Google : https://myaccount.google.com/security');
        console.log('• Mots de passe d\'app : https://myaccount.google.com/apppasswords');
        console.log('• Support Gmail : https://support.google.com/mail/?p=BadCredentials');
    }
}

// Exécuter le test
testGmailConnection().catch(console.error);
