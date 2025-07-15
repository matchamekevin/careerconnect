require('dotenv').config();

console.log('🔍 Diagnostic de la Configuration Email');
console.log('=====================================');

// Vérifier les variables d'environnement
console.log('\n📋 Variables d\'environnement actuelles:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? process.env.SMTP_PASS.substring(0, 4) + '****' : 'NON CONFIGURÉ');
console.log('SMTP_FROM:', process.env.SMTP_FROM);

// Diagnostic du problème
console.log('\n🔧 Diagnostic du problème:');
if (process.env.SMTP_PASS === 'YOUR_GMAIL_APP_PASSWORD') {
    console.log('❌ PROBLÈME DÉTECTÉ: Mot de passe Gmail non configuré');
    console.log('\n💡 Solutions:');
    console.log('');
    console.log('OPTION 1 - Configuration Gmail:');
    console.log('1. Activez l\'authentification à 2 facteurs sur Gmail');
    console.log('2. Générez un mot de passe d\'application:');
    console.log('   → https://myaccount.google.com/apppasswords');
    console.log('3. Remplacez YOUR_GMAIL_APP_PASSWORD dans .env');
    console.log('');
    console.log('OPTION 2 - Configuration Brevo (Plus Simple):');
    console.log('1. Inscrivez-vous sur https://app.brevo.com/account/register');
    console.log('2. Allez dans "SMTP & API" → "SMTP"');
    console.log('3. Remplacez BREVO_SMTP_KEY dans .env');
    console.log('');
} else if (process.env.SMTP_PASS === 'BREVO_SMTP_KEY') {
    console.log('❌ PROBLÈME DÉTECTÉ: Clé SMTP Brevo non configurée');
    console.log('\n💡 Solution:');
    console.log('1. Inscrivez-vous sur https://app.brevo.com/account/register');
    console.log('2. Allez dans "SMTP & API" → "SMTP"');
    console.log('3. Copiez votre clé SMTP');
    console.log('4. Remplacez BREVO_SMTP_KEY dans .env');
    console.log('');
} else {
    console.log('✅ Configuration détectée, test en cours...');
    
    // Test de la configuration
    const { sendJobApplicationEmail } = require('./mailer');
    
    const testData = {
        companyEmail: 'matchamegnatikevin894@gmail.com',
        jobTitle: 'Test de Configuration Email',
        candidateInfo: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+228 12 34 56 78',
            coverLetter: 'Ceci est un test de configuration email.'
        },
        cvPath: null
    };
    
    sendJobApplicationEmail(
        testData.companyEmail,
        testData.jobTitle,
        testData.candidateInfo,
        testData.cvPath
    ).then(() => {
        console.log('🎉 Test réussi ! Email envoyé avec succès.');
    }).catch(error => {
        console.error('❌ Erreur lors du test:', error.message);
        if (error.code === 'EAUTH') {
            console.log('\n💡 Erreur d\'authentification détectée.');
            console.log('Vérifiez vos identifiants SMTP dans .env');
        }
    });
}

console.log('\n📝 Fichier de configuration: server/.env');
console.log('📝 Après modification, relancez: npm start');
