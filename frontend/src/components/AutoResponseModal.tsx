import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Edit3 } from 'lucide-react';

interface AutoResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateInfo: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
    };
    jobTitle: string;
    companyName: string;
    onSend: (data: any) => void;
}

const AutoResponseModal: React.FC<AutoResponseModalProps> = ({
    isOpen,
    onClose,
    candidateInfo,
    jobTitle,
    companyName,
    onSend
}) => {
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [showEmailEditor, setShowEmailEditor] = useState(false);
    const [showWhatsAppEditor, setShowWhatsAppEditor] = useState(false);
    const [customEmailMessage, setCustomEmailMessage] = useState('');
    const [customWhatsAppMessage, setCustomWhatsAppMessage] = useState('');

    const defaultEmailMessage = `Bonjour ${candidateInfo.firstName},

Nous avons bien reçu votre candidature pour le poste de ${jobTitle}.

${responseMessage}

Cordialement,
L'équipe ${companyName}`;

    const defaultWhatsAppMessage = `📬 *Réponse de ${companyName}*

📄 *Poste:* ${jobTitle}

💬 *Message:*
${responseMessage}

_Message automatique de CareerConnect_`;

    const handleSend = () => {
        onSend({
            candidateEmail: candidateInfo.email,
            candidatePhone: candidateInfo.phone,
            jobTitle,
            companyName,
            responseMessage,
            sendEmail,
            sendWhatsApp,
            modifiedEmailMessage: showEmailEditor ? customEmailMessage : null,
            modifiedWhatsAppMessage: showWhatsAppEditor ? customWhatsAppMessage : null
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Répondre automatiquement au candidat
                    </h2>

                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-gray-900">Candidat :</h3>
                        <p className="text-gray-800">{candidateInfo.firstName} {candidateInfo.lastName}</p>
                        <p className="text-gray-700 text-sm">{candidateInfo.email} • {candidateInfo.phone}</p>
                        <p className="text-gray-700 text-sm">Poste : {jobTitle}</p>
                    </div>

                    {/* Message principal */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message de réponse principal
                        </label>
                        <textarea
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Tapez votre message de réponse ici..."
                        />
                    </div>

                    {/* Options d'envoi */}
                    <div className="space-y-4 mb-6">
                        {/* Email */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={sendEmail}
                                        onChange={(e) => setSendEmail(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <Mail className="h-5 w-5 text-gray-600 mr-2" />
                                    <span className="font-medium">Envoyer par email</span>
                                </label>
                                <button
                                    onClick={() => setShowEmailEditor(!showEmailEditor)}
                                    className="text-gray-600 hover:text-gray-800 flex items-center"
                                >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Modifier
                                </button>
                            </div>

                            {showEmailEditor && (
                                <div>
                                    <textarea
                                        value={customEmailMessage || defaultEmailMessage}
                                        onChange={(e) => setCustomEmailMessage(e.target.value)}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                </div>
                            )}

                            {!showEmailEditor && (
                                <div className="bg-gray-50 p-3 rounded border text-sm">
                                    <pre className="whitespace-pre-wrap">{defaultEmailMessage}</pre>
                                </div>
                            )}
                        </div>

                        {/* WhatsApp */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={sendWhatsApp}
                                        onChange={(e) => setSendWhatsApp(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <MessageCircle className="h-5 w-5 text-gray-600 mr-2" />
                                    <span className="font-medium">Envoyer par WhatsApp</span>
                                </label>
                                <button
                                    onClick={() => setShowWhatsAppEditor(!showWhatsAppEditor)}
                                    className="text-gray-600 hover:text-gray-800 flex items-center"
                                >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Modifier
                                </button>
                            </div>

                            {showWhatsAppEditor && (
                                <div>
                                    <textarea
                                        value={customWhatsAppMessage || defaultWhatsAppMessage}
                                        onChange={(e) => setCustomWhatsAppMessage(e.target.value)}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                </div>
                            )}

                            {!showWhatsAppEditor && (
                                <div className="bg-gray-50 p-3 rounded border text-sm">
                                    <pre className="whitespace-pre-wrap">{defaultWhatsAppMessage}</pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!responseMessage || (!sendEmail && !sendWhatsApp)}
                            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoResponseModal;
