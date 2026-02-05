import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, ArrowLeft, Sparkles } from 'lucide-react';
import SelectWithOther from '../components/SelectWithOther';
import { UNIVERSITIES_TOGO, STUDY_FIELDS_TOGO, STUDY_LEVELS } from '../constants/formOptions';
import { useToastContext } from '../contexts/ToastContext';
import { userService } from '../services/api';

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
  const location = useLocation();
  const [isFromJobApplication, setIsFromJobApplication] = useState(false);
  const { showSuccess, showError, showInfo } = useToastContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const redirect = urlParams.get('redirect');
    const pendingJobId = sessionStorage.getItem('pendingJobApplication');

    if (redirect === 'apply' && pendingJobId) {
      setIsFromJobApplication(true);
      showInfo('Connectez-vous pour postuler à cette offre');
    }
  }, [location, showInfo]);

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
        const user = await userService.login(formData.email, formData.password);
        sessionStorage.setItem('studentUser', JSON.stringify(user));
        showSuccess('Connexion réussie !');
        const pendingJobId = sessionStorage.getItem('pendingJobApplication');
        if (pendingJobId && isFromJobApplication) {
          navigate(`/student-dashboard?applyToJob=${pendingJobId}`);
        } else {
          navigate('/student-dashboard');
        }
      } else {
        // Inscription
        if (formData.password !== formData.confirmPassword) {
          showError('Les mots de passe ne correspondent pas');
          return;
        }
        await userService.register({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          university: formData.university,
          level: formData.level,
          field: formData.field
        });
        showSuccess('Compte créé avec succès !');
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
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Connexion Étudiant' : 'Inscription Étudiant'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isFromJobApplication
                ? 'Connectez-vous pour continuer votre candidature'
                : (isLogin ? 'Accédez à votre espace personnel' : 'Créez votre compte étudiant')
              }
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-gray-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                        placeholder="Prénom"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-gray-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                      placeholder="Nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Université/École <span className="text-gray-500">*</span>
                  </label>
                  <SelectWithOther
                    value={formData.university}
                    onChange={(value) => setFormData({ ...formData, university: value })}
                    options={UNIVERSITIES_TOGO}
                    placeholder="Sélectionnez votre établissement"
                    name="university"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau d'études <span className="text-gray-500">*</span>
                    </label>
                    <SelectWithOther
                      value={formData.level}
                      onChange={(value) => setFormData({ ...formData, level: value })}
                      options={STUDY_LEVELS}
                      placeholder="Niveau"
                      name="level"
                      required
                      allowOther={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domaine <span className="text-gray-500">*</span>
                    </label>
                    <SelectWithOther
                      value={formData.field}
                      onChange={(value) => setFormData({ ...formData, field: value })}
                      options={STUDY_FIELDS_TOGO}
                      placeholder="Domaine"
                      name="field"
                      required
                      allowOther={true}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isLogin ? 'Email ou Prénom' : 'Email'} <span className="text-gray-500">*</span>
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                  placeholder={isLogin ? "Email ou prénom" : "votre.email@exemple.com"}
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
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
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

        {/* Company Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Vous êtes une entreprise ?{' '}
            <Link to="/company-auth" className="text-gray-900 hover:text-gray-700 font-medium">
              Espace entreprise →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;
