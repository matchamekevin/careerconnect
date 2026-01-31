import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, FileText, Heart, Bell, Briefcase, MapPin, Clock, Trash2, ArrowRight, Sparkles, GraduationCap, Building } from 'lucide-react';
import ApplyJobModal from '../components/ApplyJobModal';
import { useLocalStorage } from '../hooks/useStorage';
import SelectWithOther from '../components/SelectWithOther';
import { STUDY_LEVELS, STUDY_FIELDS_TOGO, UNIVERSITIES_TOGO } from '../constants/formOptions';
import { useToastContext } from '../contexts/ToastContext';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useLocalStorage('studentDashboardActiveTab', 'overview');
  const [showProfileEdit, setShowProfileEdit] = useLocalStorage('studentDashboardShowProfileEdit', false);
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('studentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const urlParams = new URLSearchParams(location.search);
    const applyToJobParam = urlParams.get('applyToJob');
    if (applyToJobParam) {
      const pendingJobId = sessionStorage.getItem('pendingJobApplication');
      if (pendingJobId && pendingJobId === applyToJobParam) {
        setApplyJobId(parseInt(applyToJobParam));
        sessionStorage.removeItem('pendingJobApplication');
        navigate('/student-dashboard', { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/student/${user.id}/applications`).then(res => res.json()).then(data => setApplications(Array.isArray(data) ? data : []));
      fetch(`/api/student/${user.id}/saved-jobs`).then(res => res.json()).then(data => setSavedJobs(Array.isArray(data) ? data : []));
      let filled = 0;
      if (user.first_name) filled++;
      if (user.last_name) filled++;
      if (user.email) filled++;
      if (user.university) filled++;
      if (user.level) filled++;
      if (user.field) filled++;
      setProfileCompletion(Math.round((filled / 6) * 100));
      fetch(`/api/student/${user.id}/recommendations`).then(res => res.json()).then(data => setRecommendations(Array.isArray(data) ? data : []));
      fetch(`/api/student/${user.id}/notifications/count`).then(res => res.json()).then(data => setNotificationsCount(data.count || 0));
    }
  }, [user]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-gray-300 text-gray-800';
      case 'Accepté': return 'bg-gray-900 text-white';
      case 'Refusé': return 'bg-gray-600 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch(type) {
      case 'Stage': return 'bg-gray-200 text-gray-800';
      case 'Temps partiel': return 'bg-gray-300 text-gray-800';
      default: return 'bg-gray-900 text-white';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Sparkles },
    { id: 'applications', label: 'Candidatures', icon: FileText },
    { id: 'saved', label: 'Sauvegardées', icon: Heart },
    { id: 'profile', label: 'Mon profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user && user.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt="Profil" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-200" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {user ? user.first_name?.[0] : <User className="h-8 w-8" />}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-700 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user ? `${user.first_name} ${user.last_name}` : 'Étudiant'}
                </h2>
                <p className="text-gray-500">{user?.email}</p>
                {user?.university && (
                  <p className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                    <GraduationCap className="h-4 w-4" />
                    {user.university}
                  </p>
                )}
              </div>
            </div>
            
            {/* Profile Completion */}
            <div className="flex items-center gap-4 bg-white/80 rounded-xl p-4 border border-gray-100">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                  <circle 
                    cx="32" cy="32" r="28" 
                    stroke="url(#gradient)" 
                    strokeWidth="4" 
                    fill="none"
                    strokeDasharray={`${profileCompletion * 1.76} 176`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1f2937" />
                      <stop offset="100%" stopColor="#374151" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700">
                  {profileCompletion}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Profil complété</p>
                <p className="text-xs text-gray-500">Complétez votre profil pour plus de visibilité</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-gray-200 shadow-sm">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Candidatures</p>
                      <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sauvegardées</p>
                      <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notifications</p>
                      <p className="text-2xl font-bold text-gray-900">{notificationsCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-700" />
                  Candidatures récentes
                </h3>
                <div className="space-y-3">
                  {applications.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Aucune candidature pour le moment</p>
                  )}
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-white/80 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{app.job_title || app.title}</h4>
                          <p className="text-sm text-gray-700">{app.company_name || app.company}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Tips */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Complétez votre profil</h3>
                <div className="space-y-2">
                  {!user?.first_name && <p className="text-sm text-gray-500 flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span>Ajouter votre prénom</p>}
                  {!user?.university && <p className="text-sm text-gray-500 flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span>Ajouter votre université</p>}
                  {!user?.level && <p className="text-sm text-gray-500 flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span>Ajouter votre niveau</p>}
                  {!user?.field && <p className="text-sm text-gray-500 flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span>Ajouter votre domaine</p>}
                  {profileCompletion === 100 && <p className="text-sm text-gray-700 font-medium">✓ Profil complet !</p>}
                </div>
              </div>

              {/* Recommended Jobs */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gray-600" />
                  Recommandé pour vous
                </h3>
                <div className="space-y-3">
                  {recommendations.length === 0 && <p className="text-gray-500 text-sm">Aucune recommandation pour l'instant.</p>}
                  {recommendations.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-3 bg-white/80 border border-gray-100 rounded-xl cursor-pointer" onClick={() => setApplyJobId(job.id)}>
                      <div className="flex items-center gap-3">
                        {job.logo_url ? (
                          <img src={job.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-gray-700" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                          <p className="text-xs text-gray-700">{job.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet candidatures dynamiques */}
        {activeTab === 'applications' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-700" />
              Mes candidatures
            </h3>
            <div className="space-y-4">
              {applications.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-700" />
                  </div>
                  <p className="text-gray-500">Aucune candidature envoyée</p>
                  <button onClick={() => navigate('/jobs')} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
                    Voir les offres
                  </button>
                </div>
              )}
              {applications.map((app, index) => (
                <div 
                  key={app.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/80 border border-gray-100 rounded-xl animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                      <Building className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{app.job_title || app.title}</h4>
                      <p className="text-gray-700 font-medium">{app.company_name || app.company}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{app.applied_at?.slice(0, 10)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(app.status)}`}>{app.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet offres sauvegardées dynamiques */}
        {activeTab === 'saved' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="h-5 w-5 text-gray-700" />
              Offres sauvegardées
            </h3>
            <div className="space-y-4">
              {savedJobs.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-gray-700" />
                  </div>
                  <p className="text-gray-500">Aucune offre sauvegardée</p>
                  <button onClick={() => navigate('/jobs')} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
                    Parcourir les offres
                  </button>
                </div>
              )}
              {savedJobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/80 border border-gray-100 rounded-xl animate-fade-in group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0 cursor-pointer" onClick={() => setApplyJobId(job.id)}>
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                      <Building className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{job.title}</h4>
                      <p className="text-gray-700 font-medium">{job.company}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        <span className="font-medium text-gray-700">{job.salary} FCFA</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTypeBadgeStyle(job.type)}`}>{job.type}</span>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm font-medium"
                      onClick={async () => {
                        if (!user) return;
                        const res = await fetch(`/api/student/${user.id}/saved-job/${job.id}`, {
                          method: 'DELETE',
                        });
                        const data = await res.json();
                        if (data.success) {
                          setSavedJobs((prev) => prev.filter((j) => j.id !== job.id));
                        } else {
                          alert(data.error || 'Erreur lors de la suppression');
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Retirer
                    </button>
                    <button
                      className="flex items-center gap-1 px-4 py-1.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-medium"
                      onClick={() => setApplyJobId(job.id)}
                    >
                      Postuler
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && user && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-700" />
              Mon profil
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Prénom</p>
                  <p className="font-semibold text-gray-900">{user.first_name || '-'}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Nom</p>
                  <p className="font-semibold text-gray-900">{user.last_name || '-'}</p>
                </div>
              </div>
              <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{user.email || '-'}</p>
              </div>
              <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Université/École</p>
                <p className="font-semibold text-gray-900">{user.university || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Niveau</p>
                  <p className="font-semibold text-gray-900">{user.level || '-'}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Domaine</p>
                  <p className="font-semibold text-gray-900">{user.field || '-'}</p>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
              onClick={() => setShowProfileEdit(true)}
            >
              Modifier mon profil
            </button>
            
            {showProfileEdit && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
                  <button 
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                    onClick={() => setShowProfileEdit(false)}
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-700" />
                    Modifier mon profil
                  </h3>
                  <StudentProfileForm user={user} setUser={setUser} onClose={() => setShowProfileEdit(false)} />
                </div>
              </div>
            )}
          </div>
        )}

        {applyJobId && (
          <ApplyJobModal jobId={applyJobId} onClose={() => setApplyJobId(null)} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

// Composant formulaire édition profil étudiant
const StudentProfileForm = ({ user, setUser, onClose }: { user: any, setUser: any, onClose?: () => void }) => {
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    university: user.university || '',
    level: user.level || '',
    field: user.field || ''
  });
  const { showSuccess, showError } = useToastContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/student/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      showSuccess('Profil mis à jour !');
      setUser({ ...user, ...form });
      localStorage.setItem('studentUser', JSON.stringify({ ...user, ...form }));
      if (onClose) onClose();
    } else {
      showError(data.error || 'Erreur lors de la mise à jour');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            placeholder="Prénom"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            placeholder="Nom"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Université</label>
        <SelectWithOther
          value={form.university}
          onChange={(value) => handleSelectChange('university', value)}
          options={UNIVERSITIES_TOGO}
          placeholder="Sélectionnez votre université"
          name="university"
          allowOther={true}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
          <SelectWithOther
            value={form.level}
            onChange={(value) => handleSelectChange('level', value)}
            options={STUDY_LEVELS}
            placeholder="Niveau"
            name="level"
            allowOther={true}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domaine</label>
          <SelectWithOther
            value={form.field}
            onChange={(value) => handleSelectChange('field', value)}
            options={STUDY_FIELDS_TOGO}
            placeholder="Domaine"
            name="field"
            allowOther={true}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
      >
        Enregistrer les modifications
      </button>
    </form>
  );
};
