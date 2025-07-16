import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, User } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    userType: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage(null);

    // Validation côté client
    if (!formData.name || !formData.email || !formData.subject || !formData.userType || !formData.message) {
      setResponseMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs obligatoires.'
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('📤 Envoi du formulaire de contact:', formData);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('📥 Réponse du serveur:', data);

      if (data.success) {
        setResponseMessage({
          type: 'success',
          text: '✅ Votre message a été envoyé avec succès ! Notre équipe vous répondra dans les plus brefs délais.'
        });

        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          subject: '',
          userType: '',
          message: ''
        });
      } else {
        setResponseMessage({
          type: 'error',
          text: data.error || 'Une erreur est survenue lors de l\'envoi du message.'
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
      setResponseMessage({
        type: 'error',
        text: 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">matchamegnatikevin894@gmail.com</p>
                    <p className="text-sm text-gray-500">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Téléphone</h3>
                    <p className="text-gray-600">+228 70 47 24 36</p>
                    <p className="text-gray-600">+228 96 73 22 47</p>
                    <p className="text-sm text-gray-500">Lun-Ven: 8h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adresse</h3>
                    <p className="text-gray-600">Lomé, Togo</p>
                    <p className="text-sm text-gray-500">Quartier des Affaires</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Heures d'ouverture</h3>
                    <p className="text-gray-600">Lundi - Vendredi</p>
                    <p className="text-sm text-gray-500">8h00 - 18h00 GMT</p>
                  </div>
                </div>
              </div>

              {/* FAQ Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                    Comment créer un compte étudiant ?
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                    Comment publier une offre d'emploi ?
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                    Comment modifier mon profil ?
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                    Problème de connexion
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

              {/* Message de réponse */}
              {responseMessage && (
                <div className={`mb-6 p-4 rounded-lg ${responseMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                  <p className="text-sm font-medium">{responseMessage.text}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <User className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="votre.email@exemple.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'utilisateur
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="student">Étudiant</option>
                      <option value="company">Entreprise</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choisissez un sujet</option>
                      <option value="account">Problème de compte</option>
                      <option value="technical">Support technique</option>
                      <option value="partnership">Partenariat</option>
                      <option value="feedback">Suggestion/Commentaire</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Décrivez votre demande en détail..."
                    required
                  ></textarea>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Conseil :</strong> Pour un support plus rapide, n'hésitez pas à inclure des captures d'écran
                    ou des détails spécifiques sur votre problème.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Support Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Besoin d'une assistance immédiate ?
              </h2>
              <p className="text-blue-100 mb-6">
                Notre équipe support est disponible pour vous aider avec vos questions urgentes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@jobtogo.tg"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Envoyer un email
                </a>
                <a
                  href="tel:+228XXXXXXXX"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
                >
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;