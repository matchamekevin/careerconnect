import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Lock, Eye, EyeOff, Phone, MapPin } from 'lucide-react';

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
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (isLogin) {
      // Connexion
      const res = await fetch('/api/login-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('companyUser', JSON.stringify(data.company));
        navigate('/company-dashboard');
      } else {
        setMessage(data.error || 'Erreur de connexion');
      }
    } else {
      // Inscription
      if (formData.password !== formData.confirmPassword) {
        setMessage('Les mots de passe ne correspondent pas');
        return;
      }
      const res = await fetch('/api/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Compte entreprise créé avec succès, vous pouvez vous connecter.');
        setIsLogin(true);
      } else {
        setMessage(data.error || 'Erreur lors de la création du compte');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Connexion Entreprise' : 'Inscription Entreprise'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Accédez à votre espace recruteur' : 'Rejoignez nos entreprises partenaires'}
            </p>
          </div>

          {/* Form */}
          {message && <div className="text-center text-red-500 mb-2">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du contact *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de la personne responsable"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+228 XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <div className="relative">
                    <MapPin className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Adresse de l'entreprise"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur d'activité *
                    </label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Secteur</option>
                      <option value="technologie">Technologie</option>
                      <option value="finance">Finance</option>
                      <option value="sante">Santé</option>
                      <option value="education">Éducation</option>
                      <option value="commerce">Commerce</option>
                      <option value="industrie">Industrie</option>
                      <option value="ong">ONG</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille de l'entreprise
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Taille</option>
                      <option value="1-10">1-10 employés</option>
                      <option value="11-50">11-50 employés</option>
                      <option value="51-200">51-200 employés</option>
                      <option value="200+">200+ employés</option>
                    </select>
                  </div>
                </div>

                {/* Ajout logo (upload local) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de l'entreprise (fichier)
                  </label>
                  <input
                    type="file"
                    name="logoFile"
                    accept="image/*"
                    onChange={async (e) => {
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
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.logo_url && (
                    <div className="mt-2">
                      <img src={formData.logo_url} alt="Logo" className="w-20 h-20 object-contain rounded" />
                      <button
                        type="button"
                        className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        onClick={() => setFormData({ ...formData, logo_url: undefined })}
                      >
                        Supprimer le logo
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="text"
                    name="website_url"
                    value={formData.website_url || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email professionnel *
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@entreprise.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-2">📋 Validation du compte :</p>
                <p>
                  Votre compte sera vérifié par notre équipe avant activation. 
                  Vous recevrez un email de confirmation sous 24-48h.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {isLogin ? 'Se connecter' : 'Créer mon compte entreprise'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Première fois sur la plateforme ?" : "Vous avez déjà un compte ?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuth;