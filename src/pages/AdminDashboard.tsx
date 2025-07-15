import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Trash2, CheckCircle2, Clock, Mail, ChevronLeft, ChevronRight, Users, Briefcase, MessageSquare, BarChart3, Settings, Plus, Home, Edit, Eye, Search, Filter } from 'lucide-react';
import { useLocalStorage } from '../hooks/useStorage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  // Fonction utilitaire pour construire les URLs d'images
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Encoder les caractères spéciaux dans l'URL
    const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
    return `http://localhost:5000${encodedPath}`;
  };
  const [jobs, setJobs] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messagesPagination, setMessagesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [stats, setStats] = useState<{ companies?: number; jobs?: number; students?: number; messages?: number; reviews?: number }>({});
  const [connectedCompanies, setConnectedCompanies] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [newReviewResponse, setNewReviewResponse] = useState('');
  const [activeSection, setActiveSection] = useLocalStorage('adminDashboardActiveSection', 'dashboard');
  const [jobsFilter, setJobsFilter] = useLocalStorage('adminDashboardJobsFilter', 'all');
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    salary: '',
    tags: '',
    company_id: ''
  });
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState('');

  // Nouveaux états pour la gestion avancée des offres
  const [editingJob, setEditingJob] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [jobsSearchTerm, setJobsSearchTerm] = useState('');
  const [jobsStats, setJobsStats] = useState({ total: 0, pending: 0, validated: 0 });

  useEffect(() => {
    setLoadingStats(true);

    // Charger les statistiques
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(e => {
        setError(e.message);
        setLoadingStats(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        console.log('companies:', data);
        setCompanies(data);
      })
      .catch(e => setError(e.message));

    // Charger les offres avec statistiques
    loadJobs();

    fetch('/api/companies/connected')
      .then(res => res.json())
      .then(setConnectedCompanies)
      .catch(e => setError(e.message));

    // Charger les messages de contact
    loadContactMessages();

    // Charger les avis
    loadReviews();
  }, []);

  const loadContactMessages = async (page = 1) => {
    setLoadingMessages(true);
    try {
      const limit = showAllMessages ? 50 : 10;
      const offset = (page - 1) * limit;
      const response = await fetch(`/api/contact/messages?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      if (data.success) {
        setContactMessages(data.messages);
        setMessagesPagination({
          currentPage: data.page || page,
          totalPages: data.totalPages || 1,
          total: data.total || 0,
          limit: limit
        });
        // Mettre à jour les stats avec le nombre total de messages
        setStats(prev => ({ ...prev, messages: data.total }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadReviews = async (page = 1) => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews?page=${page}&limit=10`);
      const data = await response.json();

      if (data.reviews) {
        setReviews(data.reviews);
        setReviewsPagination(data.pagination);
        setStats(prev => ({ ...prev, reviews: data.pagination.total }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const deleteMessage = async (messageId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact/messages/${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Recharger les messages
        await loadContactMessages(messagesPagination.currentPage);
        console.log('Message supprimé avec succès');
      } else {
        console.error('Erreur lors de la suppression du message');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Fonctions pour la gestion des offres d'emploi
  const loadJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);

      // Calculer les statistiques
      const stats = {
        total: data.length,
        pending: data.filter((job: any) => job.status !== 'validated').length,
        validated: data.filter((job: any) => job.status === 'validated').length
      };
      setJobsStats(stats);
    } catch (err) {
      console.error('Erreur lors du chargement des offres:', err);
    }
  };

  const deleteJob = async (jobId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (response.ok) {
        loadJobs(); // Recharger la liste
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const validateJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'validated' })
      });
      if (response.ok) {
        loadJobs(); // Recharger la liste
      }
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
    }
  };

  const updateJob = async (jobData: any) => {
    try {
      const response = await fetch(`/api/jobs/${jobData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'offre');
      }

      const result = await response.json();
      if (result.success) {
        setShowEditModal(false);
        setEditingJob(null);
        loadJobs(); // Recharger la liste
        alert('Offre mise à jour avec succès');
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour: ' + err.message);
    }
  };

  // Fonction pour activer/désactiver un compte
  const toggleAccountStatus = async (type: 'company' | 'student', id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`/api/${type === 'company' ? 'companies' : 'students'}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du changement de statut');
      }

      const result = await response.json();
      if (result.success) {
        // Recharger les données
        if (type === 'company') {
          fetch('/api/companies').then(res => res.json()).then(setCompanies);
        }
        alert(`Compte ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès`);
      } else {
        throw new Error(result.error || 'Erreur lors du changement de statut');
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur: ' + err.message);
    }
  };

  const getFilteredJobs = () => {
    let filtered = jobs;

    // Filtrer par statut
    if (jobsFilter !== 'all') {
      filtered = filtered.filter((job: any) => {
        if (jobsFilter === 'pending') return job.status !== 'validated';
        if (jobsFilter === 'validated') return job.status === 'validated';
        return true;
      });
    }

    // Filtrer par terme de recherche
    if (jobsSearchTerm.trim()) {
      const searchLower = jobsSearchTerm.toLowerCase();
      filtered = filtered.filter((job: any) =>
        job.title?.toLowerCase().includes(searchLower) ||
        job.company?.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower) ||
        job.type?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  if (error) {
    return <div className="p-8 text-red-600">Erreur : {error}</div>;
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'companies', label: 'Entreprises', icon: Users },
    { id: 'jobs', label: 'Offres d\'emploi', icon: Briefcase },
    { id: 'reviews', label: 'Avis & Questions', icon: MessageSquare },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            {/* Stats cards reliées à la base */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-blue-600">
                <span className="text-xl font-bold text-blue-700 mb-1">
                  Entreprises : {loadingStats ? <span className="animate-pulse text-gray-400">...</span> : stats.companies}
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-blue-600">
                <span className="text-xl font-bold text-blue-700 mb-1">
                  Offres : {loadingStats ? <span className="animate-pulse text-gray-400">...</span> : stats.jobs}
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-blue-600">
                <span className="text-xl font-bold text-blue-700 mb-1">
                  Étudiants : {loadingStats ? <span className="animate-pulse text-gray-400">...</span> : stats.students}
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-green-600">
                <Mail className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-xl font-bold text-green-700 mb-1">
                  Messages : {loadingMessages ? <span className="animate-pulse text-gray-400">...</span> : stats.messages || 0}
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-purple-600">
                <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-xl font-bold text-purple-700 mb-1">
                  Avis : {loadingReviews ? <span className="animate-pulse text-gray-400">...</span> : stats.reviews || 0}
                </span>
              </div>
            </div>
          </>
        );

      case 'companies':
        return (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Entreprises connectées</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-3 text-left">Logo</th>
                    <th className="py-3 text-left">Nom</th>
                    <th className="py-3 text-left">Secteur</th>
                    <th className="py-3 text-left">Offres</th>
                    <th className="py-3 text-left">Statut</th>
                    <th className="py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-gray-500 py-4">Aucune entreprise trouvée.</td></tr>
                  )}
                  {companies.map((c: any, idx: number) => (
                    <tr key={c.id} className="transition hover:bg-blue-50 border-b border-gray-100">
                      <td className="py-2 px-3">
                        {c.logo_url ? (
                          <img
                            src={getImageUrl(c.logo_url)}
                            alt={`Logo ${c.name}`}
                            className="w-10 h-10 rounded-full border object-cover"
                            onError={(e) => {
                              console.log(`Erreur de chargement d'image pour ${c.name}:`, c.logo_url);
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <UserCircle className={`h-8 w-8 text-gray-300 ${c.logo_url ? 'hidden' : ''}`} />
                      </td>
                      <td className="font-semibold text-blue-900">{c.name || <span className="text-gray-400">—</span>}</td>
                      <td>{c.sector || <span className="text-gray-400">—</span>}</td>
                      <td className="text-center">{c.job_count ?? 0}</td>
                      <td>
                        <span className={c.status === 'validated' ? 'inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold' : 'inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold'}>
                          {c.status === 'validated' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {c.status === 'validated' ? 'Validée' : 'En attente'}
                        </span>
                      </td>
                      <td className="flex gap-2 py-2">
                        <button
                          onClick={() => toggleAccountStatus('company', c.id, c.account_status || 'active')}
                          className={`flex items-center gap-1 px-2 py-1 rounded transition text-sm ${c.account_status === 'active' || !c.account_status
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                            }`}
                          title={c.account_status === 'active' || !c.account_status ? 'Désactiver' : 'Activer'}
                        >
                          {c.account_status === 'active' || !c.account_status ? (
                            <>
                              <Clock className="w-4 h-4" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Activer
                            </>
                          )}
                        </button>
                        <button className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded transition text-sm" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                        {c.status !== 'validated' && (
                          <button className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded transition text-sm" title="Valider" onClick={async () => {
                            await fetch(`/api/companies/${c.id}/status`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'validated' })
                            });
                            fetch('/api/companies').then(res => res.json()).then(setCompanies);
                          }}>
                            <CheckCircle2 className="w-4 h-4" />
                            Valider
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Offres d'emploi
              </h2>
              <div className="flex gap-2">
                <select
                  value={jobsFilter}
                  onChange={e => setJobsFilter(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option value="all">Toutes les offres</option>
                  <option value="pending">En attente</option>
                  <option value="validated">Validées</option>
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={jobsSearchTerm}
                    onChange={e => setJobsSearchTerm(e.target.value)}
                    className="border rounded px-3 py-2 pr-10 text-sm w-64"
                  />
                  <span className="absolute right-3 top-2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Titre</th>
                    <th className="py-3 px-4 text-left">Entreprise</th>
                    <th className="py-3 px-4 text-left">Lieu</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Statut</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-gray-500 py-4">Aucune offre trouvée.</td></tr>
                  )}
                  {getFilteredJobs().map((j: any) => (
                    <tr key={j.id} className="transition hover:bg-blue-50 border-b border-gray-100">
                      <td className="font-semibold text-blue-900 py-2 px-4">{j.title || <span className="text-gray-400">—</span>}</td>
                      <td className="py-2 px-4">{j.company || <span className="text-gray-400">—</span>}</td>
                      <td className="py-2 px-4">{j.location || <span className="text-gray-400">—</span>}</td>
                      <td className="py-2 px-4">{j.posted_at ? j.posted_at.slice(0, 10) : <span className="text-gray-400">—</span>}</td>
                      <td className="py-2 px-4">
                        <span className={j.status === 'validated' ? 'inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold' : 'inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold'}>
                          {j.status === 'validated' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {j.status === 'validated' ? 'Validée' : 'En attente'}
                        </span>
                      </td>
                      <td className="flex gap-2 py-2 px-4">
                        <button className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded transition" title="Supprimer" onClick={() => deleteJob(j.id)}><Trash2 className="w-4 h-4" />Supprimer</button>
                        {j.status !== 'validated' && (
                          <button className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded transition" title="Valider" onClick={() => validateJob(j.id)}><CheckCircle2 className="w-4 h-4" />Valider</button>
                        )}
                        <button
                          onClick={() => {
                            setEditingJob(j);
                            setShowEditModal(true);
                          }}
                          className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                Messages de contact ({stats.messages || 0})
              </h2>
              <button
                onClick={() => {
                  setShowAllMessages(!showAllMessages);
                  loadContactMessages(1);
                }}
                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                {showAllMessages ? 'Vue résumée' : 'Voir tous'}
              </button>
            </div>

            <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
              {loadingMessages ? (
                <div className="text-center text-gray-500">
                  <div className="animate-pulse">Chargement des messages...</div>
                </div>
              ) : contactMessages.length === 0 ? (
                <div className="text-gray-500 italic text-center">Aucun message pour le moment.</div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {contactMessages.map((message: any) => (
                      <div key={message.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-blue-900 text-sm">{message.name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-gray-600">{message.email}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${message.user_type === 'student' ? 'bg-blue-100 text-blue-700' :
                            message.user_type === 'company' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                            {message.user_type === 'student' ? 'Étudiant' :
                              message.user_type === 'company' ? 'Entreprise' : 'Autre'}
                          </span>
                        </div>
                        {message.subject && (
                          <p className="text-sm font-medium text-gray-800 mb-2">Sujet: {message.subject}</p>
                        )}
                        <p className="text-sm text-gray-800 line-clamp-3">{message.message}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject || 'Votre message'}&body=Bonjour ${message.name},%0D%0A%0D%0AEn réponse à votre message:%0D%0A"${message.message}"%0D%0A%0D%0A`}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Répondre
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination pour les messages */}
                  {messagesPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-xs text-gray-500">
                        Page {messagesPagination.currentPage} de {messagesPagination.totalPages}
                        ({messagesPagination.total} messages)
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadContactMessages(messagesPagination.currentPage - 1)}
                          disabled={messagesPagination.currentPage <= 1}
                          className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => loadContactMessages(messagesPagination.currentPage + 1)}
                          disabled={messagesPagination.currentPage >= messagesPagination.totalPages}
                          className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Avis & Questions ({stats.reviews || 0})
              </h2>
              <button
                onClick={() => {
                  setEditingReview(null);
                  setNewReviewResponse('');
                  setShowReviewModal(true);
                }}
                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Poser une question
              </button>
            </div>

            <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
              {loadingReviews ? (
                <div className="text-center text-gray-500">
                  <div className="animate-pulse">Chargement des avis...</div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-500 italic text-center">Aucun avis pour le moment.</div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-blue-900 text-sm">
                              {review.display_name || 'Utilisateur anonyme'}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${review.type === 'student' ? 'bg-blue-100 text-blue-700' :
                              review.type === 'company' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                              {review.type === 'student' ? 'Étudiant' :
                                review.type === 'company' ? 'Entreprise' : 'Admin'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                              review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                              {review.status === 'approved' ? 'Approuvé' :
                                review.status === 'rejected' ? 'Rejeté' : 'En attente'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            {review.display_email || 'Email non disponible'}
                          </p>
                          <p className="text-sm text-gray-800">
                            {review.content}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setEditingReview(review);
                              setNewReviewResponse('');
                              setShowReviewModal(true);
                            }}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Répondre
                          </button>

                          {review.status !== 'approved' && (
                            <button
                              onClick={async () => {
                                try {
                                  await fetch(`/api/reviews/${review.id}/moderate`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'approved' })
                                  });
                                  loadReviews();
                                } catch (err) {
                                  console.error('Erreur lors de l\'approbation:', err);
                                }
                              }}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              Approuver
                            </button>
                          )}

                          {review.status !== 'rejected' && (
                            <button
                              onClick={async () => {
                                try {
                                  await fetch(`/api/reviews/${review.id}/moderate`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'rejected' })
                                  });
                                  loadReviews();
                                } catch (err) {
                                  console.error('Erreur lors du rejet:', err);
                                }
                              }}
                              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              Rejeter
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingReview(review);
                              setNewReviewResponse(review.content);
                              setShowReviewModal(true);
                            }}
                            className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={async () => {
                              if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
                                try {
                                  await fetch(`/api/reviews/${review.id}`, {
                                    method: 'DELETE'
                                  });
                                  loadReviews();
                                } catch (err) {
                                  console.error('Erreur lors de la suppression:', err);
                                }
                              }
                            }}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination pour les avis */}
                  {reviewsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-xs text-gray-500">
                        Page {reviewsPagination.currentPage} de {reviewsPagination.totalPages}
                        ({reviewsPagination.total} avis)
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadReviews(reviewsPagination.currentPage - 1)}
                          disabled={reviewsPagination.currentPage <= 1}
                          className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => loadReviews(reviewsPagination.currentPage + 1)}
                          disabled={reviewsPagination.currentPage >= reviewsPagination.totalPages}
                          className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Paramètres</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Configuration générale</h3>
                <p className="text-sm text-gray-600">Paramètres de l'application (à venir)</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Gestion des notifications (à venir)</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            <p>Section non trouvée</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 text-white rounded-full p-2">
              <UserCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-800">Admin Panel</h2>
              <p className="text-xs text-gray-500">CareerConnect</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === item.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Bouton retour au dashboard principal */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="h-4 w-4" />
              Retour au site
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowJobModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Publier une offre
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header admin */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-1">Dashboard Super Admin</h1>
            <p className="text-gray-600">Vue d'ensemble et gestion globale de la plateforme</p>
          </div>
        </div>

        {/* Dynamic content based on active section */}
        {renderContent()}
      </div>

      {/* Modal publication job */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={() => setShowJobModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl">×</button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Publier une nouvelle offre</h3>
            {jobError && <div className="text-red-600 mb-2 text-sm">{jobError}</div>}
            <form onSubmit={async e => {
              e.preventDefault();
              setJobLoading(true);
              setJobError('');
              if (!newJob.title || !newJob.company_id) {
                setJobError('Titre et entreprise obligatoires');
                setJobLoading(false);
                return;
              }
              try {
                const res = await fetch('/api/jobs', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...newJob,
                    tags: newJob.tags.split(',').map(t => t.trim()),
                    salary: newJob.salary || null
                  })
                });
                if (!res.ok) throw new Error('Erreur lors de la publication');
                setShowJobModal(false);
                setNewJob({ title: '', description: '', location: '', type: '', salary: '', tags: '', company_id: '' });
                fetch('/api/jobs').then(res => res.json()).then(setJobs);
              } catch (err) {
                setJobError('Erreur lors de la publication');
              }
              setJobLoading(false);
            }} className="flex flex-col gap-3">
              <input className="border rounded px-3 py-2" placeholder="Titre" value={newJob.title} onChange={e => setNewJob(j => ({ ...j, title: e.target.value }))} required />
              <textarea className="border rounded px-3 py-2" placeholder="Description" value={newJob.description} onChange={e => setNewJob(j => ({ ...j, description: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Lieu" value={newJob.location} onChange={e => setNewJob(j => ({ ...j, location: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Type (CDI, Stage...)" value={newJob.type} onChange={e => setNewJob(j => ({ ...j, type: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Salaire (FCFA)" value={newJob.salary} onChange={e => setNewJob(j => ({ ...j, salary: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Tags (séparés par virgule)" value={newJob.tags} onChange={e => setNewJob(j => ({ ...j, tags: e.target.value }))} />
              <select className="border rounded px-3 py-2" value={newJob.company_id} onChange={e => setNewJob(j => ({ ...j, company_id: e.target.value }))} required>
                <option value="">Sélectionner une entreprise</option>
                {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={jobLoading}>{jobLoading ? 'Publication...' : 'Publier'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal édition job */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl">×</button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Modifier l'offre</h3>
            {jobError && <div className="text-red-600 mb-2 text-sm">{jobError}</div>}
            <form onSubmit={async e => {
              e.preventDefault();
              setJobLoading(true);
              setJobError('');
              if (!editingJob.title || !editingJob.company_id) {
                setJobError('Titre et entreprise obligatoires');
                setJobLoading(false);
                return;
              }
              try {
                const res = await fetch(`/api/jobs/${editingJob.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...editingJob,
                    tags: editingJob.tags.split(',').map(t => t.trim()),
                    salary: editingJob.salary || null
                  })
                });
                if (!res.ok) throw new Error('Erreur lors de la mise à jour');
                setShowEditModal(false);
                setEditingJob(null);
                fetch('/api/jobs').then(res => res.json()).then(setJobs);
              } catch (err) {
                setJobError('Erreur lors de la mise à jour');
              }
              setJobLoading(false);
            }} className="flex flex-col gap-3">
              <input className="border rounded px-3 py-2" placeholder="Titre" value={editingJob.title} onChange={e => setEditingJob(j => ({ ...j, title: e.target.value }))} required />
              <textarea className="border rounded px-3 py-2" placeholder="Description" value={editingJob.description} onChange={e => setEditingJob(j => ({ ...j, description: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Lieu" value={editingJob.location} onChange={e => setEditingJob(j => ({ ...j, location: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Type (CDI, Stage...)" value={editingJob.type} onChange={e => setEditingJob(j => ({ ...j, type: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Salaire (FCFA)" value={editingJob.salary} onChange={e => setEditingJob(j => ({ ...j, salary: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Tags (séparés par virgule)" value={editingJob.tags} onChange={e => setEditingJob(j => ({ ...j, tags: e.target.value }))} />
              <select className="border rounded px-3 py-2" value={editingJob.company_id} onChange={e => setEditingJob(j => ({ ...j, company_id: e.target.value }))} required>
                <option value="">Sélectionner une entreprise</option>
                {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={jobLoading}>{jobLoading ? 'Mise à jour...' : 'Mettre à jour'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour gérer les avis */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              {editingReview ?
                (editingReview.content === newReviewResponse ? 'Répondre à l\'avis' : 'Modifier l\'avis')
                : 'Poser une question'}
            </h3>

            {editingReview && editingReview.content !== newReviewResponse && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-1">Avis original:</p>
                <p className="text-sm">{editingReview.content}</p>
              </div>
            )}

            <form onSubmit={async e => {
              e.preventDefault();
              if (!newReviewResponse.trim()) return;

              try {
                if (editingReview) {
                  if (editingReview.content === newReviewResponse) {
                    // Répondre à l'avis
                    await fetch('/api/reviews', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        user_id: null,
                        type: 'admin',
                        content: newReviewResponse,
                        parent_id: editingReview.id,
                        user_name: 'Admin',
                        user_email: 'admin@jobtogo.com'
                      })
                    });
                  } else {
                    // Modifier l'avis
                    await fetch(`/api/reviews/${editingReview.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        content: newReviewResponse,
                        status: 'approved'
                      })
                    });
                  }
                } else {
                  // Poser une nouvelle question
                  await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      user_id: null,
                      type: 'admin',
                      content: newReviewResponse,
                      parent_id: null,
                      user_name: 'Admin',
                      user_email: 'admin@jobtogo.com'
                    })
                  });
                }

                setShowReviewModal(false);
                setEditingReview(null);
                setNewReviewResponse('');
                loadReviews();
              } catch (err) {
                console.error('Erreur:', err);
              }
            }} className="flex flex-col gap-3">
              <textarea
                className="border rounded px-3 py-2 min-h-[100px]"
                placeholder={editingReview ?
                  (editingReview.content === newReviewResponse ? "Votre réponse..." : "Modifier le contenu...")
                  : "Poser votre question..."}
                value={newReviewResponse}
                onChange={e => setNewReviewResponse(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {editingReview ?
                  (editingReview.content === newReviewResponse ? 'Répondre' : 'Modifier')
                  : 'Publier'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
