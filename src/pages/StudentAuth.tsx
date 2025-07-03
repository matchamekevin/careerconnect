import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';

const StudentAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    level: '',
    field: ''
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
      const res = await fetch('/api/login-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('studentUser', JSON.stringify(data.user));
        navigate('/student-dashboard');
      } else {
        setMessage(data.error || 'Erreur de connexion');
      }
    } else {
      // Inscription
      if (formData.password !== formData.confirmPassword) {
        setMessage('Les mots de passe ne correspondent pas');
        return;
      }
      const res = await fetch('/api/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Compte créé avec succès, vous pouvez vous connecter.');
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
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Connexion Étudiant' : 'Inscription Étudiant'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Accédez à votre espace personnel' : 'Créez votre compte étudiant'}
            </p>
          </div>

          {/* Form */}
          {message && <div className="text-center text-red-500 mb-2">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Université/École
                  </label>
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez votre établissement</option>
                    <option value="ul">Université de Lomé</option>
                    <option value="uk">Université de Kara</option>
                    <option value="ucao">UCAO</option>
                    <option value="isk">ISK</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau d'études
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Niveau</option>
                      <option value="l1">Licence 1</option>
                      <option value="l2">Licence 2</option>
                      <option value="l3">Licence 3</option>
                      <option value="m1">Master 1</option>
                      <option value="m2">Master 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domaine d'études
                    </label>
                    <select
                      name="field"
                      value={formData.field}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Domaine</option>
                      <option value="informatique">Informatique</option>
                      <option value="commerce">Commerce</option>
                      <option value="comptabilite">Comptabilité</option>
                      <option value="communication">Communication</option>
                      <option value="droit">Droit</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
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
                  Confirmer le mot de passe
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

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
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

export default StudentAuth;