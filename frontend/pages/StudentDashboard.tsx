import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, FileText, Heart, Bell } from 'lucide-react';
import ApplyJobModal from '../components/ApplyJobModal';
import { useLocalStorage } from '../hooks/useStorage';
import SelectWithOther from '../components/SelectWithOther';
import { STUDY_LEVELS, STUDY_FIELDS_TOGO, UNIVERSITIES_TOGO } from '../constants/formOptions';

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
    // Récupérer l'utilisateur connecté depuis le sessionStorage
    const userData = sessionStorage.getItem('studentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Vérifier s'il y a une candidature à continuer
    const urlParams = new URLSearchParams(location.search);
    const applyToJobParam = urlParams.get('applyToJob');
    if (applyToJobParam) {
      const pendingJobId = sessionStorage.getItem('pendingJobApplication');
      if (pendingJobId && pendingJobId === applyToJobParam) {
        setApplyJobId(parseInt(applyToJobParam));
        // Nettoyer l'URL et le sessionStorage
        sessionStorage.removeItem('pendingJobApplication');
        navigate('/student-dashboard', { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/student/${user.id}/applications`).then(res => res.json()).then(data => setApplications(Array.isArray(data) ? data : []));
      fetch(`/api/student/${user.id}/saved-jobs`).then(res => res.json()).then(data => setSavedJobs(Array.isArray(data) ? data : []));
      // Calcul de la complétion du profil côté frontend (simple)
      let filled = 0;
      if (user.first_name) filled++;
      if (user.last_name) filled++;
      if (user.email) filled++;
      if (user.university) filled++;
      if (user.level) filled++;
      if (user.field) filled++;
      setProfileCompletion(Math.round((filled / 6) * 100));
      // Récupérer les recommandations
      fetch(`/api/student/${user.id}/recommendations`).then(res => res.json()).then(data => setRecommendations(Array.isArray(data) ? data : []));
      // Récupérer le nombre de notifications
      fetch(`/api/student/${user.id}/notifications/count`).then(res => res.json()).then(data => setNotificationsCount(data.count || 0));
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Accepté': return 'bg-green-100 text-green-800';
      case 'Refusé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                {user && user.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt="Profil" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  user ? user.first_name[0] : <User className="h-8 w-8" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user ? `${user.first_name} ${user.last_name}` : 'Étudiant'}
                </h2>
                <p className="text-gray-600">{user ? user.email : ''}</p>
                {user && user.university && (
                  <p className="text-gray-500 text-sm">Université : {user.university}</p>
                )}
                {user && user.level && (
                  <p className="text-gray-500 text-sm">Niveau : {user.level}</p>
                )}
                {user && user.field && (
                  <p className="text-gray-500 text-sm">Domaine : {user.field}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Profil complété à</p>
              <p className="text-2xl font-bold text-green-600">{profileCompletion}%</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium ${activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-4 font-medium ${activeTab === 'applications'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Mes candidatures
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-4 font-medium ${activeTab === 'saved'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Offres sauvegardées
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium ${activeTab === 'profile'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Mon profil
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Candidatures</p>
                      <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <Heart className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Sauvegardées</p>
                      <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <Bell className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Notifications</p>
                      <p className="text-2xl font-bold text-gray-900">{notificationsCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidatures récentes</h3>
                <div className="space-y-4">
                  {applications.slice(0, 2).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{app.title}</h4>
                        <p className="text-sm text-gray-600">{app.company} • {app.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complétez votre profil</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Complétion</span>
                  <span className="text-sm font-medium text-green-600">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                </div>
                <ul className="text-xs text-gray-500 space-y-1">
                  {!user?.first_name && <li>Ajouter votre prénom</li>}
                  {!user?.last_name && <li>Ajouter votre nom</li>}
                  {!user?.email && <li>Ajouter votre email</li>}
                  {!user?.university && <li>Ajouter votre université</li>}
                  {!user?.level && <li>Ajouter votre niveau</li>}
                  {!user?.field && <li>Ajouter votre domaine</li>}
                </ul>
              </div>

              {/* Recommended Jobs */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommandé pour vous</h3>
                <div className="space-y-3">
                  {recommendations.length === 0 && <div className="text-gray-500">Aucune recommandation pour l'instant.</div>}
                  {recommendations.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        {job.logo_url && <img src={job.logo_url} alt="Logo" className="w-8 h-8 rounded-full object-cover" />}
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-xs text-blue-600">{job.company}</div>
                          <div className="text-xs text-gray-500">{job.location}</div>
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Mes candidatures</h3>
            <div className="space-y-4">
              {applications.length === 0 && <div className="text-gray-500">Aucune candidature envoyée.</div>}
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{app.job_title || app.title}</h4>
                    <p className="text-blue-600 font-medium">{app.company_name || app.company}</p>
                    <p className="text-xs text-gray-500">{app.location} • {app.applied_at?.slice(0, 10)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>{app.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet offres sauvegardées dynamiques */}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Offres sauvegardées</h3>
            <div className="space-y-4">
              {savedJobs.length === 0 && <div className="text-gray-500">Aucune offre sauvegardée.</div>}
              {savedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="cursor-pointer" onClick={() => setApplyJobId(job.id)}>
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                    <p className="text-xs text-gray-500">{job.location} • {job.salary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.type === 'Stage' ? 'bg-green-100 text-green-800' : job.type === 'Temps partiel' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{job.type}</span>
                    <button
                      className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
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
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && user && (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Mon profil</h3>
            <div className="space-y-2 mb-6">
              <div><span className="font-medium">Nom :</span> {user.first_name} {user.last_name}</div>
              <div><span className="font-medium">Email :</span> {user.email}</div>
              <div><span className="font-medium">Université :</span> {user.university}</div>
              <div><span className="font-medium">Niveau :</span> {user.level}</div>
              <div><span className="font-medium">Domaine :</span> {user.field}</div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowProfileEdit(true)}>Modifier</button>
            {showProfileEdit && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowProfileEdit(false)}>&times;</button>
                  <h3 className="text-xl font-bold mb-4">Modifier mon profil</h3>
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
  const [message, setMessage] = useState<string | null>(null);

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
      setMessage('Profil mis à jour !');
      setUser({ ...user, ...form });
      localStorage.setItem('studentUser', JSON.stringify({ ...user, ...form }));
      if (onClose) onClose();
    } else {
      setMessage(data.error || 'Erreur lors de la mise à jour');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <div className="text-center text-green-600">{message}</div>}

      <div className="grid grid-cols-2 gap-4">
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          required
          placeholder="Prénom"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
          placeholder="Nom"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Université
        </label>
        <SelectWithOther
          value={form.university}
          onChange={(value) => handleSelectChange('university', value)}
          options={UNIVERSITIES_TOGO}
          placeholder="Sélectionnez votre université"
          name="university"
          allowOther={true}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niveau d'études
        </label>
        <SelectWithOther
          value={form.level}
          onChange={(value) => handleSelectChange('level', value)}
          options={STUDY_LEVELS}
          placeholder="Sélectionnez votre niveau"
          name="level"
          allowOther={true}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Domaine d'études
        </label>
        <SelectWithOther
          value={form.field}
          onChange={(value) => handleSelectChange('field', value)}
          options={STUDY_FIELDS_TOGO}
          placeholder="Sélectionnez votre domaine"
          name="field"
          allowOther={true}
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Enregistrer
      </button>
    </form>
  );
};