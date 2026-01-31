import React, { useState, useEffect } from 'react';
import { Mail, Phone, FileText, MapPin } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsappUtils';
import { useToastContext } from '../contexts/ToastContext';

interface ApplyJobModalProps {
  jobId: number;
  onClose: () => void;
}

// Configuration des pays et leurs préfixes
const COUNTRIES = {
  'TG': { name: 'Togo', prefix: '+228', flag: '🇹🇬', pattern: /^\+228\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  'BF': { name: 'Burkina Faso', prefix: '+226', flag: '🇧🇫', pattern: /^\+226\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  'GH': { name: 'Ghana', prefix: '+233', flag: '🇬🇭', pattern: /^\+233\s?\d{2}\s?\d{3}\s?\d{4}$/ },
  'BJ': { name: 'Bénin', prefix: '+229', flag: '🇧🇯', pattern: /^\+229\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ },
  'CI': { name: 'Côte d\'Ivoire', prefix: '+225', flag: '🇨🇮', pattern: /^\+225\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/ }
};

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ jobId, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('TG');
  const [detectedCountry, setDetectedCountry] = useState<string>('TG');
  const { showSuccess, showError, showInfo } = useToastContext();

  // Détecter automatiquement le pays en fonction de l'IP ou de la localisation
  useEffect(() => {
    // Tentative de détection automatique du pays
    // En production, on pourrait utiliser une API de géolocalisation
    // Pour l'instant, on utilise Togo par défaut
    const detectCountry = async () => {
      try {
        // Simulation de détection - en production, utiliser une API comme ipapi.co
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code && COUNTRIES[data.country_code as keyof typeof COUNTRIES]) {
          setDetectedCountry(data.country_code);
          setSelectedCountry(data.country_code);
        }
      } catch (error) {
        // Fallback vers Togo si la détection échoue
        setDetectedCountry('TG');
        setSelectedCountry('TG');
      }
    };

    detectCountry();
  }, []);

  // Formater automatiquement le numéro de téléphone
  const formatPhoneNumber = (value: string, countryCode: string) => {
    const country = COUNTRIES[countryCode as keyof typeof COUNTRIES];
    if (!country) return value;

    // Supprimer tout sauf les chiffres et le +
    const cleaned = value.replace(/[^\d+]/g, '');

    // Si on commence par taper des chiffres, ajouter le préfixe
    if (cleaned.length > 0 && !cleaned.startsWith('+')) {
      return formatPhoneNumber(country.prefix + cleaned, countryCode);
    }

    // Formater selon le pays
    if (countryCode === 'TG' || countryCode === 'BF' || countryCode === 'BJ' || countryCode === 'CI') {
      // Format: +228 XX XX XX XX
      if (cleaned.length > 4) {
        const prefix = cleaned.substring(0, 4); // +228
        const rest = cleaned.substring(4);
        const formatted = rest.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        return prefix + ' ' + formatted;
      }
    } else if (countryCode === 'GH') {
      // Format: +233 XX XXX XXXX
      if (cleaned.length > 4) {
        const prefix = cleaned.substring(0, 4); // +233
        const rest = cleaned.substring(4);
        const formatted = rest.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
        return prefix + ' ' + formatted;
      }
    }

    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry);
    setPhone(formatted);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const country = COUNTRIES[selectedCountry as keyof typeof COUNTRIES];
    return country ? country.pattern.test(phone) : false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔍 Debug - Données du formulaire:', {
      jobId,
      email,
      phone,
      selectedCountry,
      cv: cv?.name
    });

    // Validation des champs
    if (!validateEmail(email)) {
      showError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!validatePhone(phone)) {
      showError('Veuillez entrer un numéro de téléphone valide.');
      return;
    }

    if (!cv) {
      showError('Veuillez sélectionner un CV au format PDF.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('job_id', jobId.toString());
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('country', selectedCountry);
    formData.append('cv', cv);

    console.log('📤 Envoi des données vers /api/apply');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      console.log('📥 Réponse du serveur:', data);

      if (data.success) {
        showSuccess('Candidature envoyée avec succès !');

        // Ouvrir automatiquement WhatsApp si les liens sont disponibles
        if (data.whatsappLinks && data.whatsappLinks.studentToCompany) {
          console.log('📱 Ouverture automatique de WhatsApp...');

          // Afficher un message d'information avant l'ouverture
          showInfo('Ouverture de WhatsApp...');

          // Ouvrir WhatsApp avec la nouvelle logique
          setTimeout(async () => {
            try {
              // Essayer d'extraire le numéro et le message du lien
              const whatsappUrl = new URL(data.whatsappLinks.studentToCompany);
              const phoneNumber = whatsappUrl.searchParams.get('phone');
              const message = whatsappUrl.searchParams.get('text');

              if (phoneNumber && message) {
                await openWhatsApp(phoneNumber, decodeURIComponent(message));
              } else {
                // Fallback vers l'ancienne méthode
                window.open(data.whatsappLinks.studentToCompany, '_blank');
              }
            } catch (error) {
              console.error('Erreur lors de l\'ouverture de WhatsApp:', error);
              // Fallback vers l'ancienne méthode
              window.open(data.whatsappLinks.studentToCompany, '_blank');
            }
          }, 1500);
        }

        setTimeout(onClose, 2000);
      } else {
        showError(data.error || 'Erreur lors de l\'envoi de la candidature');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      showError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Postuler à cette offre</h2>
          <p className="text-gray-600">Remplissez vos informations pour postuler</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Adresse Email
            </label>
            <input
              type="email"
              required
              placeholder="votre.email@exemple.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Pays {detectedCountry === selectedCountry && '(Détecté automatiquement)'}
            </label>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              {Object.entries(COUNTRIES).map(([code, country]) => (
                <option key={code} value={code}>
                  {country.flag} {country.name} ({country.prefix})
                </option>
              ))}
            </select>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Numéro de téléphone
            </label>
            <input
              type="tel"
              required
              placeholder={`${COUNTRIES[selectedCountry as keyof typeof COUNTRIES].prefix} XX XX XX XX`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              value={phone}
              onChange={handlePhoneChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format : {COUNTRIES[selectedCountry as keyof typeof COUNTRIES].prefix} XX XX XX XX
            </p>
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              CV (format PDF uniquement)
            </label>
            <input
              type="file"
              accept="application/pdf"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              onChange={e => setCv(e.target.files?.[0] || null)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Envoi en cours...
              </>
            ) : (
              'Envoyer la candidature'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
