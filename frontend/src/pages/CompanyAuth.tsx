import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Lock, Eye, EyeOff, Phone, MapPin, ArrowLeft, Sparkles, Upload, Globe, X } from 'lucide-react';
import SelectWithOther from '../components/SelectWithOther';
import { COMPANY_SECTORS, COMPANY_SIZES } from '../constants/formOptions';
import { useToastContext } from '../contexts/ToastContext';
import { companyService } from '../services/api';

const CompanyAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    sector: '',
    size: '',
    password: '',
    confirmPassword: '',
    logo_url: '',
    website_url: ''
  });
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Connexion
        const company = await companyService.login(formData.email, formData.password);
        sessionStorage.setItem('companyUser', JSON.stringify(company));
        showSuccess('Connexion réussie !');
        navigate('/company-dashboard');
      } else {
        // Inscription
        if (formData.password !== formData.confirmPassword) {
          showError('Les mots de passe ne correspondent pas');
          return;
        }
        await companyService.register({
          name: formData.name,
          contact_name: formData.contactName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          sector: formData.sector,
          size: formData.size
        });
        showSuccess('Compte entreprise créé avec succès !');
        setIsLogin(true);
      }
    } catch (error: unknown) {
      console.error('Erreur:', error);
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      showError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-200/50 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gray-300/50 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 shadow-lg">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Connexion Entreprise' : 'Inscription Entreprise'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Accédez à votre espace recruteur' : 'Rejoignez nos entreprises partenaires'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                !isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise <span className="text-gray-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="Nom de votre entreprise"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du contact <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    placeholder="Nom de la personne responsable"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                        placeholder="+228 XX XX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                        placeholder="Ville"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur *
                    </label>
                    <SelectWithOther
                      value={formData.sector}
                      onChange={(value) => setFormData({ ...formData, sector: value })}
                      options={COMPANY_SECTORS}
                      placeholder="Secteur"
                      name="sector"
                      required
                      allowOther={false}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille
                    </label>
                    <SelectWithOther
                      value={formData.size}
                      onChange={(value) => setFormData({ ...formData, size: value })}
                      options={COMPANY_SIZES}
                      placeholder="Taille"
                      name="size"
                      required={false}
                    />
                  </div>
                </div>

                {/* Logo upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de l'entreprise
                  </label>
                  {formData.logo_url ? (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <img src={formData.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-lg" />
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                        onClick={() => setFormData({ ...formData, logo_url: '' })}
                      >
                        <X className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Cliquez pour uploader</span>
                      <input
                        type="file"
                        name="logoFile"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          // TODO: Implémenter l'upload de logo vers Supabase Storage
                          /*
                          if (e.target.files && e.target.files[0]) {
                            const formDataFile = new FormData();
                            formDataFile.append('logo', e.target.files[0]);
                            const res = await fetch('/api/upload-logo', {
                              method: 'POST',
                              body: formDataFile
                            });
                            const data = await res.json();
                            if (data.url) {
                              setFormData({ ...formData, logo_url: data.url });
                            }
                          }
                          */
                          showError('Upload de logo non implémenté pour le moment');
                        }}
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <div className="relative">
                    <Globe className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="website_url"
                      value={formData.website_url || ''}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isLogin ? 'Email ou Nom de contact' : 'Email'} <span className="text-gray-500">*</span>
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  placeholder={isLogin ? "Email ou nom du contact" : "contact@entreprise.com"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span className="text-gray-500">*</span>
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe <span className="text-gray-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>📋 Validation du compte :</strong> Votre compte sera vérifié par notre équipe avant activation.
                    Vous recevrez un email de confirmation sous 24-48h.
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              {isLogin ? 'Se connecter' : 'Créer mon compte entreprise'}
            </button>
          </form>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Student Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Vous êtes un étudiant ?{' '}
            <Link to="/student-auth" className="text-gray-900 hover:text-gray-700 font-medium">
              Espace étudiant →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuth;
