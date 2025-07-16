// Utilitaire pour ouvrir WhatsApp avec fallback vers WhatsApp Web
export const openWhatsApp = (phoneNumber: string, message: string) => {
    // Nettoyer le numéro de téléphone
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Liens WhatsApp
    const whatsappAppLink = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    const whatsappWebLink = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    const whatsappApiLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    // Fonction pour détecter si l'application WhatsApp est installée
    const tryOpenApp = () => {
        return new Promise<boolean>((resolve) => {
            let hasApp = false;
            
            // Créer un iframe invisible pour tester l'ouverture de l'app
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = whatsappAppLink;
            document.body.appendChild(iframe);
            
            // Timer pour détecter si l'app s'ouvre
            const timer = setTimeout(() => {
                if (!hasApp) {
                    document.body.removeChild(iframe);
                    resolve(false);
                }
            }, 2000);
            
            // Écouter les événements de changement de focus
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    hasApp = true;
                    clearTimeout(timer);
                    document.body.removeChild(iframe);
                    resolve(true);
                }
            };
            
            const handleBlur = () => {
                hasApp = true;
                clearTimeout(timer);
                document.body.removeChild(iframe);
                resolve(true);
            };
            
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('blur', handleBlur);
            
            // Nettoyage
            setTimeout(() => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('blur', handleBlur);
            }, 3000);
        });
    };
    
    // Fonction pour ouvrir WhatsApp avec fallback
    const openWithFallback = async () => {
        try {
            // Pour les appareils mobiles, essayer d'abord l'app
            if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                console.log('📱 Appareil mobile détecté - Tentative d\'ouverture de l\'app WhatsApp...');
                
                // Essayer d'ouvrir l'app
                const appOpened = await tryOpenApp();
                
                if (!appOpened) {
                    console.log('📱 App WhatsApp non détectée - Ouverture de WhatsApp Web...');
                    window.open(whatsappWebLink, '_blank');
                    return { success: true, method: 'web', url: whatsappWebLink };
                } else {
                    console.log('📱 App WhatsApp ouverte avec succès');
                    return { success: true, method: 'app', url: whatsappAppLink };
                }
            } else {
                // Pour les ordinateurs de bureau, ouvrir WhatsApp Web directement
                console.log('💻 Ordinateur de bureau détecté - Ouverture de WhatsApp Web...');
                window.open(whatsappWebLink, '_blank');
                return { success: true, method: 'web', url: whatsappWebLink };
            }
        } catch (error) {
            console.error('❌ Erreur lors de l\'ouverture de WhatsApp:', error);
            // Fallback ultime vers l'API WhatsApp
            window.open(whatsappApiLink, '_blank');
            return { success: true, method: 'api', url: whatsappApiLink };
        }
    };
    
    return openWithFallback();
};

// Fonction pour créer un lien WhatsApp
export const createWhatsAppLink = (phoneNumber: string, message: string) => {
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    // Détecter le type d'appareil
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    } else {
        return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    }
};

// Fonction pour valider un numéro de téléphone WhatsApp
export const validateWhatsAppPhone = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Vérifier que le numéro commence par + et contient au moins 10 chiffres
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(cleanPhone);
};

// Fonction pour formater un numéro de téléphone pour WhatsApp
export const formatWhatsAppPhone = (phoneNumber: string) => {
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Ajouter le + si absent
    if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+' + cleanPhone;
    }
    
    return cleanPhone;
};
