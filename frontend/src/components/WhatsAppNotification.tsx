import React, { useState, useEffect } from 'react';
import { MessageCircle, ExternalLink, Check, X } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsappUtils';

interface WhatsAppNotificationProps {
    isOpen: boolean;
    onClose: () => void;
    whatsappLink: string;
    recipientType: 'company' | 'student';
    jobTitle: string;
    recipientName: string;
    phoneNumber?: string;
    message?: string;
}

const WhatsAppNotification: React.FC<WhatsAppNotificationProps> = ({
    isOpen,
    onClose,
    whatsappLink,
    recipientType,
    jobTitle,
    recipientName,
    phoneNumber,
    message
}) => {
    const [countdown, setCountdown] = useState(5);
    const [autoOpened, setAutoOpened] = useState(false);
    const [openMethod, setOpenMethod] = useState<'app' | 'web' | 'api' | null>(null);
    const [isMobile] = useState(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    useEffect(() => {
        if (isOpen && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isOpen && countdown === 0 && !autoOpened) {
            // Ouvrir automatiquement WhatsApp avec la nouvelle logique
            handleOpenWhatsApp();
        }
    }, [isOpen, countdown, autoOpened]);

    const handleOpenWhatsApp = async () => {
        try {
            if (phoneNumber && message) {
                // Utiliser la nouvelle fonction utilitaire
                const result = await openWhatsApp(phoneNumber, message);
                setOpenMethod(result.method as 'app' | 'web' | 'api');
                setAutoOpened(true);
            } else {
                // Fallback vers le lien existant
                window.open(whatsappLink, '_blank');
                setAutoOpened(true);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture de WhatsApp:', error);
            // Fallback ultime
            window.open(whatsappLink, '_blank');
            setAutoOpened(true);
        }
    };

    const handleManualOpen = () => {
        handleOpenWhatsApp();
    };

    const handleSkip = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center">
                    {/* Icône WhatsApp */}
                    <div className="mx-auto mb-4 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-gray-700" />
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {autoOpened ? 'WhatsApp Ouvert !' : 'Ouverture de WhatsApp...'}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                        {autoOpened ? (
                            <>
                                <Check className="inline h-4 w-4 text-gray-700 mr-1" />
                                WhatsApp a été ouvert {openMethod === 'app' ? 'via l\'application' : 'via le navigateur'} pour commencer la conversation
                            </>
                        ) : (
                            <>
                                Une conversation WhatsApp va s'ouvrir automatiquement pour le poste{' '}
                                <strong>"{jobTitle}"</strong> avec {recipientName}.
                            </>
                        )}
                    </p>

                    {/* Countdown ou actions */}
                    {!autoOpened ? (
                        <div className="mb-6">
                            <div className="text-2xl font-bold text-gray-700 mb-2">
                                {countdown}
                            </div>
                            <div className="text-sm text-gray-500">
                                Ouverture automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}
                                <br />
                                {isMobile ? 'Tentative d\'ouverture de l\'app puis WhatsApp Web' : 'Ouverture de WhatsApp Web'}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <div className="text-sm text-gray-500">
                                {openMethod === 'app' ? (
                                    'L\'application WhatsApp a été ouverte'
                                ) : (
                                    'WhatsApp Web a été ouvert dans votre navigateur'
                                )}
                                {!autoOpened && '. Si WhatsApp ne s\'est pas ouvert automatiquement, cliquez sur "Ouvrir maintenant"'}
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleManualOpen}
                            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Continuer vers la discussion
                        </button>
                        <button
                            onClick={handleSkip}
                            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Passer
                        </button>
                    </div>

                    {/* Note */}
                    <p className="text-xs text-gray-500 mt-4">
                        Cette fonctionnalité vous permet de communiquer directement avec{' '}
                        {recipientType === 'company' ? 'l\'entreprise' : 'le candidat'} via WhatsApp
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppNotification;
