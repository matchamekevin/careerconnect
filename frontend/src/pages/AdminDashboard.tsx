import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Trash2, CheckCircle2, Clock, Mail, ChevronLeft, ChevronRight, Briefcase, MessageSquare, BarChart3, Settings, Plus, Home, Edit, Search, Building, GraduationCap, Sparkles, Users } from 'lucide-react';
import { useLocalStorage } from '../hooks/useStorage';
import { useToastContext } from '../contexts/ToastContext';
import { adminService, jobService, companyService, contactService, reviewService, userService } from '../services/api';
import { getImageUrl } from '../utils/api';
import type { Review, Job, Company, ContactMessage } from '../utils/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
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
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
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

  const { showSuccess, showError } = useToastContext();

  // Nouveaux états pour la gestion avancée des offres
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [jobsSearchTerm, setJobsSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  void setError; // Utilisé pour la gestion d'erreurs futures

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      console.log('companies:', data);
      setCompanies(data);
    } catch (e) {
      console.warn('Erreur chargement entreprises:', (e as Error).message);
      setCompanies([]);
    }
  };

  useEffect(() => {
    setLoadingStats(true);

    // Charger les statistiques
    adminService.getStats()
      .then(data => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(e => {
        console.warn('Erreur chargement stats:', e.message);
        setStats({ companies: 0, jobs: 0, students: 0, messages: 0, reviews: 0 });
        setLoadingStats(false);
      });
  }, []);

  useEffect(() => {
    loadCompanies();

    // Charger les offres avec statistiques
    loadJobs();

    // Charger les messages de contact
    loadContactMessages();

    // Charger les avis
    loadReviews();
  }, []);

  const loadContactMessages = async (page = 1) => {
    setLoadingMessages(true);
    try {
      const limit = showAllMessages ? 50 : 10;
      const allMessages = await contactService.getAll();
      const total = allMessages.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const safePage = Math.min(Math.max(page, 1), totalPages);
      const offset = (safePage - 1) * limit;
      setContactMessages(allMessages.slice(offset, offset + limit));
      setMessagesPagination({
        currentPage: safePage,
        totalPages,
        total,
        limit
      });
      setStats(prev => ({ ...prev, messages: total }));
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadReviews = async (page = 1) => {
    setLoadingReviews(true);
    try {
      const limit = 10;
      const allReviews = await reviewService.getAll();
      const total = allReviews.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const safePage = Math.min(Math.max(page, 1), totalPages);
      const offset = (safePage - 1) * limit;
      setReviews(allReviews.slice(offset, offset + limit));
      setReviewsPagination({
        currentPage: safePage,
        totalPages,
        total,
        limit
      });
      setStats(prev => ({ ...prev, reviews: total }));
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
      await contactService.delete(messageId);
      await loadContactMessages(messagesPagination.currentPage);
      console.log('Message supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Fonctions pour la gestion des offres d'emploi
  const loadJobs = async () => {
    try {
      const data = await jobService.getAll();
      setJobs(data);
    } catch (err) {
      console.warn('Erreur chargement offres:', err.message);
      setJobs([]);
    }
  };

  const deleteJob = async (jobId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      await jobService.delete(jobId);
      loadJobs();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const validateJob = async (jobId: number) => {
    try {
      await jobService.update(jobId, { status: 'validated' });
      loadJobs();
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
    }
  };

  // Fonction pour activer/désactiver un compte
  const toggleAccountStatus = async (type: 'company' | 'student', id: number | string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      if (type === 'company') {
        await companyService.update(Number(id), { account_status: newStatus });
        await loadCompanies();
      } else {
        await userService.update(String(id), { account_status: newStatus });
      }
      alert(`Compte ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès`);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  const getFilteredJobs = () => {
    let filtered = jobs;

    // Filtrer par statut
    if (jobsFilter !== 'all') {
      filtered = filtered.filter((job: Job) => {
        if (jobsFilter === 'pending') return job.status !== 'validated';
        if (jobsFilter === 'validated') return job.status === 'validated';
        return true;
      });
    }

    // Filtrer par terme de recherche
    if (jobsSearchTerm.trim()) {
      const searchLower = jobsSearchTerm.toLowerCase();
      filtered = filtered.filter((job: Job) =>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Building className="h-7 w-7 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Entreprises</p>
                    <p className="text-2xl font-bold text-white">{loadingStats ? '...' : stats.companies}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="h-7 w-7 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Offres</p>
                    <p className="text-2xl font-bold text-white">{loadingStats ? '...' : stats.jobs}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="h-7 w-7 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Étudiants</p>
                    <p className="text-2xl font-bold text-white">{loadingStats ? '...' : stats.students}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="h-7 w-7 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Messages</p>
                    <p className="text-2xl font-bold text-white">{loadingMessages ? '...' : stats.messages || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-7 w-7 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Avis</p>
                    <p className="text-2xl font-bold text-white">{loadingReviews ? '...' : stats.reviews || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'companies':
        return (
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-white/70" />
              Entreprises connectées
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="py-3 px-3 text-left text-white/70 font-medium">Logo</th>
                    <th className="py-3 text-left text-white/70 font-medium">Nom</th>
                    <th className="py-3 text-left text-white/70 font-medium">Secteur</th>
                    <th className="py-3 text-left text-white/70 font-medium">Offres</th>
                    <th className="py-3 text-left text-white/70 font-medium">Statut</th>
                    <th className="py-3 text-left text-white/70 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-white/50 py-8">Aucune entreprise trouvée.</td></tr>
                  )}
                  {companies.map((c: Company) => (
                    <tr key={c.id} className="transition hover:bg-white/5 border-b border-white/10">
                      <td className="py-3 px-3">
                        {c.logo_url ? (
                          <img
                            src={getImageUrl(c.logo_url) || undefined}
                            alt={`Logo ${c.name}`}
                            className="w-10 h-10 rounded-xl border border-white/20 object-cover"
                            onError={(e) => {
                              console.log(`Erreur de chargement d'image pour ${c.name}:`, c.logo_url);
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center ${c.logo_url ? 'hidden' : ''}`}>
                          <Building className="h-5 w-5 text-white" />
                        </div>
                      </td>
                      <td className="font-semibold text-white">{c.name || <span className="text-white/40">—</span>}</td>
                      <td className="text-white/70">{c.sector || <span className="text-white/40">—</span>}</td>
                      <td className="text-center text-white/70">{c.job_count ?? 0}</td>
                      <td>
                        <span className={c.status === 'validated' ? 'inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/20 text-white text-xs font-semibold' : 'inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-white/60 text-xs font-semibold'}>
                          {c.status === 'validated' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {c.status === 'validated' ? 'Validée' : 'En attente'}
                        </span>
                      </td>
                      <td className="flex gap-2 py-3">
                        <button
                          onClick={() => toggleAccountStatus('company', c.id, c.account_status || 'active')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition text-sm font-medium ${c.account_status === 'active' || !c.account_status
                            ? 'text-white/60 hover:bg-white/10'
                            : 'text-white hover:bg-white/20'
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
                        <button className="flex items-center gap-1 text-white/60 hover:bg-white/10 px-3 py-1.5 rounded-lg transition text-sm font-medium" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                        {c.status !== 'validated' && (
                          <button className="flex items-center gap-1 text-white hover:bg-white/20 px-2 py-1 rounded transition text-sm" title="Valider" onClick={async () => {
                            await companyService.update(c.id, { status: 'validated' });
                            await loadCompanies();
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
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-white/70" />
                Offres d'emploi
              </h2>
              <div className="flex gap-3">
                <select
                  value={jobsFilter}
                  onChange={e => setJobsFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-white/30"
                >
                  <option value="all" className="text-gray-900">Toutes les offres</option>
                  <option value="pending" className="text-gray-900">En attente</option>
                  <option value="validated" className="text-gray-900">Validées</option>
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={jobsSearchTerm}
                    onChange={e => setJobsSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pr-10 text-sm w-64 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30"
                  />
                  <span className="absolute right-3 top-2.5 text-white/50">
                    <Search className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="py-3 px-4 text-left text-white/70 font-medium">Titre</th>
                    <th className="py-3 px-4 text-left text-white/70 font-medium">Entreprise</th>
                    <th className="py-3 px-4 text-left text-white/70 font-medium">Lieu</th>
                    <th className="py-3 px-4 text-left text-white/70 font-medium">Date</th>
                    <th className="py-3 px-4 text-left text-white/70 font-medium">Statut</th>
                    <th className="py-3 px-4 text-left text-white/70 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-white/50 py-8">Aucune offre trouvée.</td></tr>
                  )}
                  {getFilteredJobs().map((j: Job) => (
                    <tr key={j.id} className="transition hover:bg-white/5 border-b border-white/10">
                      <td className="font-semibold text-white py-3 px-4">{j.title || <span className="text-white/40">—</span>}</td>
                      <td className="py-3 px-4 text-white/70">{j.company || <span className="text-white/40">—</span>}</td>
                      <td className="py-3 px-4 text-white/70">{j.location || <span className="text-white/40">—</span>}</td>
                      <td className="py-3 px-4 text-white/70">{j.posted_at ? j.posted_at.slice(0, 10) : <span className="text-white/40">—</span>}</td>
                      <td className="py-3 px-4">
                        <span className={j.status === 'validated' ? 'inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/20 text-white text-xs font-semibold' : 'inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 text-white/60 text-xs font-semibold'}>
                          {j.status === 'validated' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {j.status === 'validated' ? 'Validée' : 'En attente'}
                        </span>
                      </td>
                      <td className="flex gap-2 py-3 px-4">
                        <button className="flex items-center gap-1 text-white/60 hover:bg-white/10 px-3 py-1.5 rounded-lg transition font-medium" title="Supprimer" onClick={() => deleteJob(j.id)}><Trash2 className="w-4 h-4" />Supprimer</button>
                        {j.status !== 'validated' && (
                          <button className="flex items-center gap-1 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg transition font-medium" title="Valider" onClick={() => validateJob(j.id)}><CheckCircle2 className="w-4 h-4" />Valider</button>
                        )}
                        <button
                          onClick={() => {
                            setEditingJob(j);
                            setShowEditModal(true);
                          }}
                          className="flex items-center gap-1 text-white/80 hover:bg-white/10 px-3 py-1.5 rounded-lg transition font-medium"
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
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-white/70" />
                Messages de contact ({stats.messages || 0})
              </h2>
              <button
                onClick={() => {
                  setShowAllMessages(!showAllMessages);
                  loadContactMessages(1);
                }}
                className="text-sm px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors font-medium"
              >
                {showAllMessages ? 'Vue résumée' : 'Voir tous'}
              </button>
            </div>

            <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
              {loadingMessages ? (
                <div className="text-center text-white/50 py-8">
                  <div className="animate-pulse">Chargement des messages...</div>
                </div>
              ) : contactMessages.length === 0 ? (
                <div className="text-white/50 italic text-center py-8">Aucun message pour le moment.</div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {contactMessages.map((message: ContactMessage) => (
                      <div key={message.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white text-sm">{message.name}</h4>
                          <span className="text-xs text-white/50">
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
                          <p className="text-sm text-white/60">{message.email}</p>
                          <span className={`text-xs px-2 py-1 rounded-lg ${message.user_type === 'student' ? 'bg-white/20 text-white' :
                            message.user_type === 'company' ? 'bg-white/10 text-white/80' :
                              'bg-white/5 text-white/60'
                            }`}>
                            {message.user_type === 'student' ? 'Étudiant' :
                              message.user_type === 'company' ? 'Entreprise' : 'Autre'}
                          </span>
                        </div>
                        {message.subject && (
                          <p className="text-sm font-medium text-white/80 mb-2">Sujet: {message.subject}</p>
                        )}
                        <p className="text-sm text-white/70 line-clamp-3">{message.message}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject || 'Votre message'}&body=Bonjour ${message.name},%0D%0A%0D%0AEn réponse à votre message:%0D%0A"${message.message}"%0D%0A%0D%0A`}
                            className="text-xs px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                          >
                            Répondre
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="text-xs px-3 py-1.5 bg-white/10 text-white/60 rounded-lg hover:bg-white/20 transition-colors font-medium"
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
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                      <div className="text-xs text-white/50">
                        Page {messagesPagination.currentPage} de {messagesPagination.totalPages}
                        ({messagesPagination.total} messages)
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadContactMessages(messagesPagination.currentPage - 1)}
                          disabled={messagesPagination.currentPage <= 1}
                          className="p-2 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white/70 transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => loadContactMessages(messagesPagination.currentPage + 1)}
                          disabled={messagesPagination.currentPage >= messagesPagination.totalPages}
                          className="p-2 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white/70 transition"
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
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white/70" />
                Avis & Questions ({stats.reviews || 0})
              </h2>
              <button
                onClick={() => {
                  setEditingReview(null);
                  setNewReviewResponse('');
                  setShowReviewModal(true);
                }}
                className="text-sm px-4 py-2 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-medium"
              >
                Poser une question
              </button>
            </div>

            <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
              {loadingReviews ? (
                <div className="text-center text-white/50 py-8">
                  <div className="animate-pulse">Chargement des avis...</div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-white/50 italic text-center py-8">Aucun avis pour le moment.</div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {reviews.map((review: Review) => (
                      <div key={review.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-semibold text-white text-sm">
                              {review.display_name || 'Utilisateur anonyme'}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-lg ${review.type === 'student' ? 'bg-white/20 text-white' :
                              review.type === 'company' ? 'bg-white/10 text-white/80' :
                                'bg-white/5 text-white/60'
                              }`}>
                              {review.type === 'student' ? 'Étudiant' :
                                review.type === 'company' ? 'Entreprise' : 'Admin'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-lg ${review.status === 'approved' ? 'bg-white/20 text-white' :
                              review.status === 'rejected' ? 'bg-white/5 text-white/40' :
                                'bg-white/10 text-white/60'
                              }`}>
                              {review.status === 'approved' ? 'Approuvé' :
                                review.status === 'rejected' ? 'Rejeté' : 'En attente'}
                            </span>
                          </div>
                          <span className="text-xs text-white/50">
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
                          <p className="text-sm text-white/60 mb-1">
                            {review.display_email || 'Email non disponible'}
                          </p>
                          <p className="text-sm text-white/80">
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
                            className="text-xs px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                          >
                            Répondre
                          </button>

                          {review.status !== 'approved' && (
                            <button
                              onClick={async () => {
                                try {
                                  await reviewService.update(review.id, { status: 'approved' });
                                  loadReviews();
                                } catch (err) {
                                  console.error('Erreur lors de l\'approbation:', err);
                                }
                              }}
                              className="text-xs px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                            >
                              Approuver
                            </button>
                          )}

                          {review.status !== 'rejected' && (
                            <button
                              onClick={async () => {
                                try {
                                  await reviewService.update(review.id, { status: 'rejected' });
                                  loadReviews();
                                } catch (err) {
                                  console.error('Erreur lors du rejet:', err);
                                }
                              }}
                              className="text-xs px-3 py-1.5 bg-white/10 text-white/60 rounded-lg hover:bg-white/20 transition-colors font-medium"
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
                            className="text-xs px-3 py-1.5 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors font-medium"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={async () => {
                              if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
                                try {
                                  await reviewService.delete(review.id);
                                  loadReviews();
                                } catch (err) {
                                  console.error('Erreur lors de la suppression:', err);
                                }
                              }
                            }}
                            className="text-xs px-3 py-1.5 bg-white/5 text-white/50 rounded-lg hover:bg-white/10 transition-colors font-medium"
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
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                      <div className="text-xs text-white/50">
                        Page {reviewsPagination.currentPage} de {reviewsPagination.totalPages}
                        ({reviewsPagination.total} avis)
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadReviews(reviewsPagination.currentPage - 1)}
                          disabled={reviewsPagination.currentPage <= 1}
                          className="p-2 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white/70 transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => loadReviews(reviewsPagination.currentPage + 1)}
                          disabled={reviewsPagination.currentPage >= reviewsPagination.totalPages}
                          className="p-2 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white/70 transition"
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
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-white/70" />
              Paramètres
            </h2>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
                <h3 className="font-semibold text-white mb-2">Configuration générale</h3>
                <p className="text-sm text-white/60">Paramètres de l'application (à venir)</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
                <h3 className="font-semibold text-white mb-2">Notifications</h3>
                <p className="text-sm text-white/60">Gestion des notifications (à venir)</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-white/50 py-12">
            <p>Section non trouvée</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-white/50">JobTogo</p>
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeSection === item.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-white/70 hover:bg-white/10'
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
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2 px-4 py-3 text-white/60 hover:bg-white/10 rounded-xl transition-all"
            >
              <Home className="h-4 w-4" />
              Retour au site
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowJobModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold"
          >
            <Plus className="h-5 w-5" />
            Publier une offre
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header admin */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-white/80 text-sm font-medium">Super Admin</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard Admin</h1>
            <p className="text-white/60">Vue d'ensemble et gestion globale de la plateforme</p>
          </div>
        </div>

        {/* Dynamic content based on active section */}
        {renderContent()}
      </div>

      {/* Modal publication job */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl border border-white/20 p-8 w-full max-w-lg relative animate-fade-in bg-gray-900">
            <button onClick={() => setShowJobModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition">×</button>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-white" />
              Publier une nouvelle offre
            </h3>
            <form onSubmit={async e => {
              e.preventDefault();
              setJobLoading(true);
              if (!newJob.title || !newJob.company_id) {
                showError('Titre et entreprise obligatoires');
                setJobLoading(false);
                return;
              }
              try {
                const tags = newJob.tags
                  ? newJob.tags.split(',').map(t => t.trim()).filter(Boolean)
                  : undefined;
                await jobService.create({
                  ...newJob,
                  company_id: Number(newJob.company_id),
                  tags,
                  salary: newJob.salary || undefined
                });
                showSuccess('Offre publiée avec succès !');
                setShowJobModal(false);
                setNewJob({ title: '', description: '', location: '', type: '', salary: '', tags: '', company_id: '' });
                // Refresh jobs list
                loadJobs();
              } catch {
                showError('Erreur lors de la publication');
              }
              setJobLoading(false);
            }} className="flex flex-col gap-4">
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Titre" value={newJob.title} onChange={e => setNewJob(j => ({ ...j, title: e.target.value }))} required />
              <textarea className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[80px]" placeholder="Description" value={newJob.description} onChange={e => setNewJob(j => ({ ...j, description: e.target.value }))} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Lieu" value={newJob.location} onChange={e => setNewJob(j => ({ ...j, location: e.target.value }))} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Type (CDI, Stage...)" value={newJob.type} onChange={e => setNewJob(j => ({ ...j, type: e.target.value }))} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Salaire (FCFA)" value={newJob.salary} onChange={e => setNewJob(j => ({ ...j, salary: e.target.value }))} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Tags (séparés par virgule)" value={newJob.tags} onChange={e => setNewJob(j => ({ ...j, tags: e.target.value }))} />
              <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30" value={newJob.company_id} onChange={e => setNewJob(j => ({ ...j, company_id: e.target.value }))} required>
                <option value="" className="bg-gray-900">Sélectionner une entreprise</option>
                {companies.map((c: Company) => <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>)}
              </select>
              <button type="submit" className="mt-2 px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold disabled:opacity-60" disabled={jobLoading}>{jobLoading ? 'Publication...' : 'Publier'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal édition job */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/20 p-8 w-full max-w-lg relative animate-fade-in">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition">×</button>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-white/70" />
              Modifier l'offre
            </h3>
            <form onSubmit={async e => {
              e.preventDefault();
              setJobLoading(true);
              if (!editingJob.title || !editingJob.company_id) {
                showError('Titre et entreprise obligatoires');
                setJobLoading(false);
                return;
              }
              try {
                const tags = Array.isArray(editingJob.tags)
                  ? editingJob.tags
                  : editingJob.tags
                    ? editingJob.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                    : undefined;
                await jobService.update(editingJob.id, {
                  ...editingJob,
                  tags,
                  salary: editingJob.salary || undefined
                });
                showSuccess('Offre mise à jour !');
                setShowEditModal(false);
                setEditingJob(null);
                // Refresh jobs list
                loadJobs();
              } catch {
                showError('Erreur lors de la mise à jour');
              }
              setJobLoading(false);
            }} className="flex flex-col gap-4">
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Titre" value={editingJob.title} onChange={e => setEditingJob((j: Job | null) => j ? ({ ...j, title: e.target.value }) : null)} required />
              <textarea className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[80px]" placeholder="Description" value={editingJob.description} onChange={e => setEditingJob((j: Job | null) => j ? ({ ...j, description: e.target.value }) : null)} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Lieu" value={editingJob.location} onChange={e => setEditingJob((j: Job | null) => j ? ({ ...j, location: e.target.value }) : null)} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Type (CDI, Stage...)" value={editingJob.type} onChange={e => setEditingJob((j: Job | null) => j ? ({ ...j, type: e.target.value }) : null)} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Salaire (FCFA)" value={editingJob.salary} onChange={e => setEditingJob((j: Job | null) => j ? ({ ...j, salary: e.target.value }) : null)} />
              <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="Tags (séparés par virgule)" value={Array.isArray(editingJob.tags) ? editingJob.tags.join(', ') : (editingJob.tags || '')} onChange={e => setEditingJob((j: Job | null) => j ? ({ ...j, tags: e.target.value }) : null)} />
              <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30" value={editingJob.company_id} onChange={e => setEditingJob((j: Job | null) => j ? ({ ...j, company_id: Number(e.target.value) }) : null)} required>
                <option value="" className="bg-gray-900">Sélectionner une entreprise</option>
                {companies.map((c: Company) => <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>)}
              </select>
              <button type="submit" className="mt-2 px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold disabled:opacity-60" disabled={jobLoading}>{jobLoading ? 'Mise à jour...' : 'Mettre à jour'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour gérer les avis */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/20 p-8 w-full max-w-lg relative animate-fade-in">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-white/70" />
              {editingReview ?
                (editingReview.content === newReviewResponse ? 'Répondre à l\'avis' : 'Modifier l\'avis')
                : 'Poser une question'}
            </h3>

            {editingReview && editingReview.content !== newReviewResponse && (
              <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-sm text-white/60 mb-1">Avis original:</p>
                <p className="text-sm text-white/80">{editingReview.content}</p>
              </div>
            )}

            <form onSubmit={async e => {
              e.preventDefault();
              if (!newReviewResponse.trim()) return;

              try {
                if (editingReview) {
                  if (editingReview.content === newReviewResponse) {
                    // Répondre à l'avis
                    await reviewService.create({
                      user_id: null,
                      type: 'admin',
                      content: newReviewResponse,
                      parent_id: editingReview.id,
                      user_name: 'Admin',
                      user_email: 'admin@jobtogo.com'
                    });
                  } else {
                    // Modifier l'avis
                    await reviewService.update(editingReview.id, {
                      content: newReviewResponse,
                      status: 'approved'
                    });
                  }
                } else {
                  // Poser une nouvelle question
                  await reviewService.create({
                    user_id: null,
                    type: 'admin',
                    content: newReviewResponse,
                    parent_id: null,
                    user_name: 'Admin',
                    user_email: 'admin@jobtogo.com'
                  });
                }

                setShowReviewModal(false);
                setEditingReview(null);
                setNewReviewResponse('');
                loadReviews();
              } catch (err) {
                console.error('Erreur:', err);
              }
            }} className="flex flex-col gap-4">
              <textarea
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[120px]"
                placeholder={editingReview ?
                  (editingReview.content === newReviewResponse ? "Votre réponse..." : "Modifier le contenu...")
                  : "Poser votre question..."}
                value={newReviewResponse}
                onChange={e => setNewReviewResponse(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-2 px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold"
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
