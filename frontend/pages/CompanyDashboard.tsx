import React, { useState, useEffect, useRef } from 'react';
import { Building, Plus, Users, Eye, Edit, Trash2 } from 'lucide-react';
import FCFAInput from '../components/FCFAInput';
import SelectWithOther from '../components/SelectWithOther';
import { CONTRACT_TYPES, LOCATIONS_TOGO } from '../constants/formOptions';
import { useLocalStorage } from '../hooks/useStorage';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useLocalStorage('companyDashboardActiveTab', 'overview');
  const [showJobForm, setShowJobForm] = useLocalStorage('companyDashboardShowJobForm', false);
  const [showProfileEdit, setShowProfileEdit] = useLocalStorage('companyDashboardShowProfileEdit', false);
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    salary: '',
    tags: ''
  });
  const [jobMessage, setJobMessage] = useState<string | null>(null);
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [editJobForm, setEditJobForm] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    salary: '',
    tags: ''
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({ jobs: 0, applications: 0, views: 0 });
  const [performance, setPerformance] = useState({ vues: 0, candidatures: 0, taux_reponse: 0 });
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Récupérer l'entreprise connectée depuis le sessionStorage
    const companyData = sessionStorage.getItem('companyUser');
    if (companyData) {
      const parsedCompany = JSON.parse(companyData);
      setCompany(parsedCompany);

      // Recharger les données depuis le serveur pour s'assurer d'avoir les infos les plus récentes
      fetch(`/api/companies/${parsedCompany.id}`)
        .then(res => res.json())
        .then(updatedCompany => {
          setCompany(updatedCompany);
          sessionStorage.setItem('companyUser', JSON.stringify(updatedCompany));

          // Initialiser le logo si disponible
          if (updatedCompany.logo_url) {
            setLogoSrc(`http://localhost:5000${updatedCompany.logo_url}`);
          }
        })
        .catch(error => {
          console.error('Error fetching company data:', error);
          // Fallback: utiliser les données du sessionStorage
          if (parsedCompany.logo_url) {
            setLogoSrc(`http://localhost:5000${parsedCompany.logo_url}`);
          }
        });
    }
  }, []);

  // Charger le logo à chaque changement de company
  useEffect(() => {
    if (company && company.id) {
      // Essayer d'abord l'approche BLOB
      fetch(`/api/company/${company.id}/logo-blob`)
        .then(async res => {
          if (!res.ok) {
            // Si l'approche BLOB échoue, utiliser l'URL directe
            if (company.logo_url) {
              setLogoSrc(`http://localhost:5000${company.logo_url}`);
            } else {
              setLogoSrc(null);
            }
            return;
          }
          const blob = await res.blob();
          setLogoSrc(URL.createObjectURL(blob));
        })
        .catch(() => {
          // En cas d'erreur, utiliser l'URL directe si disponible
          if (company.logo_url) {
            setLogoSrc(`http://localhost:5000${company.logo_url}`);
          } else {
            setLogoSrc(null);
          }
        });
    }
  }, [company]);

  // Charger les offres de l'entreprise
  useEffect(() => {
    if (company && company.id) {
      fetch(`/api/company/${company.id}/jobs`)
        .then(res => res.json())
        .then(data => setJobs(data));
    }
  }, [company]);

  // Charger candidatures et stats dynamiques
  useEffect(() => {
    if (company && company.id) {
      fetch(`/api/company/${company.id}/applications`).then(res => res.json()).then(data => setApplications(data));
      fetch(`/api/company/${company.id}/stats`).then(res => res.json()).then(data => setStats(data));
    }
  }, [company, jobs]);

  // Charger performance du mois
  useEffect(() => {
    if (company && company.id) {
      fetch(`/api/company/${company.id}/performance`).then(res => res.json()).then(data => setPerformance(data));
    }
  }, [company, jobs, applications]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && company) {
      const formDataFile = new FormData();
      formDataFile.append('logo', e.target.files[0]);

      // Essayer d'abord l'upload BLOB
      try {
        const blobResponse = await fetch(`/api/company/${company.id}/logo-blob`, {
          method: 'POST',
          body: formDataFile
        });

        if (blobResponse.ok) {
          // Recharger le logo via BLOB
          const logoResponse = await fetch(`/api/company/${company.id}/logo-blob`);
          if (logoResponse.ok) {
            const blob = await logoResponse.blob();
            setLogoSrc(URL.createObjectURL(blob));

            // Mettre à jour les données de l'entreprise dans sessionStorage
            await updateCompanyData();
            return;
          }
        }
      } catch (error) {
        console.log('BLOB upload failed, trying traditional upload...');
      }

      // Si l'approche BLOB échoue, utiliser l'upload traditionnel
      try {
        const uploadResponse = await fetch('/api/upload-logo', {
          method: 'POST',
          body: formDataFile
        });

        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          // Mettre à jour le logo_url de l'entreprise
          await fetch(`/api/company/${company.id}/logo`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logo_url: data.url })
          });

          // Mettre à jour l'affichage
          setLogoSrc(`http://localhost:5000${data.url}`);

          // Mettre à jour les données de l'entreprise dans sessionStorage
          await updateCompanyData();
        }
      } catch (error) {
        console.error('Logo upload failed:', error);
      }
    }
  };

  // Fonction pour mettre à jour les données de l'entreprise
  const updateCompanyData = async () => {
    if (!company) return;

    try {
      const response = await fetch(`/api/companies/${company.id}`);
      if (response.ok) {
        const updatedCompany = await response.json();
        setCompany(updatedCompany);

        // Mettre à jour le sessionStorage avec les nouvelles données
        sessionStorage.setItem('companyUser', JSON.stringify(updatedCompany));

        // Mettre à jour le logo si disponible
        if (updatedCompany.logo_url) {
          setLogoSrc(`http://localhost:5000${updatedCompany.logo_url}`);
        }
      }
    } catch (error) {
      console.error('Error updating company data:', error);
    }
  };

  const handleJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobMessage(null);
    if (!company) return;
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...jobForm, tags: jobForm.tags.split(','), company_id: company.id })
    });
    const data = await res.json();
    if (data.success) {
      setJobMessage('Offre publiée !');
      setShowJobForm(false);
      setJobForm({ title: '', description: '', location: '', type: '', salary: '', tags: '' });
      // Recharge les offres
      fetch(`/api/company/${company.id}/jobs`).then(res => res.json()).then(data => setJobs(data));
    } else {
      setJobMessage(data.error || 'Erreur lors de la publication');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j.id !== id));
  };

  const openEditJob = (job: any) => {
    setEditJobId(job.id);
    setEditJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
      salary: job.salary,
      tags: job.tags ? job.tags.join ? job.tags.join(',') : job.tags : ''
    });
    setShowJobForm(false);
  };

  const handleEditJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditJobForm({ ...editJobForm, [e.target.name]: e.target.value });
  };

  const handleEditJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !editJobId) return;
    const res = await fetch(`/api/jobs/${editJobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editJobForm, tags: editJobForm.tags.split(','), company_id: company.id })
    });
    const data = await res.json();
    if (data.success) {
      setEditJobId(null);
      fetch(`/api/company/${company.id}/jobs`).then(res => res.json()).then(data => setJobs(data));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Fermée': return 'bg-gray-100 text-gray-800';
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Accepté': return 'bg-green-100 text-green-800';
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
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 relative">
                {company ? (
                  logoSrc ? (
                    <img src={logoSrc} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    company.name[0]
                  )
                ) : (
                  <Building className="h-8 w-8" />
                )}
                <button
                  className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                  title="Changer le logo"
                >
                  <Plus className="h-4 w-4 text-blue-600" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {company ? company.name : 'Entreprise'}
                </h2>
                <p className="text-gray-600">{company ? company.email : ''}</p>
                {company && company.location && (
                  <p className="text-gray-500 text-sm">Localisation : {company.location}</p>
                )}
                {company && company.website_url && (
                  <p className="text-gray-500 text-sm">Site web : {company.website_url}</p>
                )}
              </div>
            </div>
            {/* Remplacer le bouton "Publier une offre" dans le header */}
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowJobForm(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Publier une offre
            </button>
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
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-4 font-medium ${activeTab === 'jobs'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Mes offres
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-4 font-medium ${activeTab === 'applications'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Candidatures
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium ${activeTab === 'profile'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Profil entreprise
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards dynamiques */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Offres actives</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.jobs}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Candidatures</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.applications}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Vues totales</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications dynamiques */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Candidatures récentes</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {applications.length} au total
                    </span>
                    {applications.filter(app => app.status === 'Nouveau' || app.status === 'En cours').length > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {applications.filter(app => app.status === 'Nouveau' || app.status === 'En cours').length} en attente
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{app.candidate_name}</h4>
                        <p className="text-sm text-gray-600">{app.job_title || ''}</p>
                        <p className="text-xs text-gray-500">{app.university} • {app.field}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{app.applied_at?.slice(0, 10)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowJobForm(true)}>
                    Publier une nouvelle offre
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setActiveTab('applications')}>
                    Voir toutes les candidatures
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setActiveTab('profile')}>
                    Modifier le profil
                  </button>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance ce mois</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nouvelles vues</span>
                    <span className="text-sm font-medium text-gray-900">{performance.vues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Candidatures reçues</span>
                    <span className="text-sm font-medium text-gray-900">{performance.candidatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taux de réponse</span>
                    <span className="text-sm font-medium text-green-600">{performance.taux_reponse}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de création d'offre (modale simple) */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowJobForm(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-4">Publier une offre</h3>
              {jobMessage && <div className="mb-2 text-center text-green-600">{jobMessage}</div>}
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <input name="title" value={jobForm.title} onChange={handleJobFormChange} required placeholder="Titre du poste" className="w-full border px-3 py-2 rounded" />
                <input name="company" value={company?.name || ''} disabled className="w-full border px-3 py-2 rounded bg-gray-100" placeholder="Nom de l'entreprise" />
                <SelectWithOther
                  value={jobForm.type}
                  onChange={(value) => setJobForm({ ...jobForm, type: value })}
                  options={CONTRACT_TYPES}
                  placeholder="Type de contrat"
                  name="type"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <textarea name="description" value={jobForm.description} onChange={handleJobFormChange} required placeholder="Description du poste" className="w-full border px-3 py-2 rounded" />
                <input name="tags" value={jobForm.tags} onChange={handleJobFormChange} placeholder="Tags (ex: Marketing, Digital, Réseaux sociaux)" className="w-full border px-3 py-2 rounded" />
                <SelectWithOther
                  value={jobForm.location}
                  onChange={(value) => setJobForm({ ...jobForm, location: value })}
                  options={LOCATIONS_TOGO}
                  placeholder="Lieu (ex: Lomé)"
                  name="location"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <FCFAInput
                  value={jobForm.salary}
                  onChange={(value) => setJobForm({ ...jobForm, salary: value })}
                  placeholder="Salaire (ex: 50,000 - 75,000 FCFA)"
                  name="salary"
                  className="w-full border px-3 py-2 rounded"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Publier</button>
              </form>
            </div>
          </div>
        )}

        {/* Onglet Mes offres : affichage dynamique */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Mes offres d'emploi</h3>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowJobForm(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle offre
              </button>
            </div>
            <div className="space-y-4">
              {jobs.length === 0 && <div className="text-gray-500">Aucune offre publiée.</div>}
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 flex items-center space-x-4">
                    {job.logo_url && <img src={job.logo_url} alt="Logo" className="w-12 h-12 rounded-full object-cover" />}
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                      <p className="text-xs text-gray-500">Publié le {job.posted_at?.slice(0, 10)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('Active')}`}>Active</span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded" onClick={() => openEditJob(job)}>
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidatures reçues</h3>            <div className="space-y-4">
              {applications.length === 0 && (
                <div className="text-center py-8 text-gray-500">Aucune candidature reçue.</div>
              )}
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{app.candidate_name}</h4>
                        <p className="text-sm text-gray-600">{app.job_title || ''}</p>
                        <p className="text-xs text-gray-500">{app.university} • {app.field}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Candidature du {app.applied_at?.slice(0, 10)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-3">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm" onClick={async () => {
                        await fetch(`/api/applications/${app.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Accepté' }) });
                        setApplications(applications.map(a => a.id === app.id ? { ...a, status: 'Accepté' } : a));
                      }}>
                        Accepter
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm" onClick={async () => {
                        await fetch(`/api/applications/${app.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Refusé' }) });
                        setApplications(applications.map(a => a.id === app.id ? { ...a, status: 'Refusé' } : a));
                      }}>
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && company && (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profil de l'entreprise</h3>
            <div className="space-y-2 mb-6">
              <div><span className="font-medium">Nom :</span> {company.name}</div>
              <div><span className="font-medium">Contact :</span> {company.contact_name}</div>
              <div><span className="font-medium">Email :</span> {company.email}</div>
              <div><span className="font-medium">Téléphone :</span> {company.phone}</div>
              <div><span className="font-medium">Adresse :</span> {company.address}</div>
              <div><span className="font-medium">Secteur :</span> {company.sector}</div>
              <div><span className="font-medium">Taille :</span> {company.size}</div>
              <div><span className="font-medium">Site web :</span> {company.website_url}</div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowProfileEdit(true)}>Modifier</button>
            {showProfileEdit && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowProfileEdit(false)}>&times;</button>
                  <h3 className="text-xl font-bold mb-4">Modifier le profil</h3>
                  <ProfileForm company={company} setCompany={setCompany} onClose={() => setShowProfileEdit(false)} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulaire d'édition d'offre (modale) */}
        {editJobId && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setEditJobId(null)}>&times;</button>
              <h3 className="text-xl font-bold mb-4">Modifier l'offre</h3>
              <form onSubmit={handleEditJobSubmit} className="space-y-4">
                <input name="title" value={editJobForm.title} onChange={handleEditJobFormChange} required placeholder="Titre du poste" className="w-full border px-3 py-2 rounded" />
                <textarea name="description" value={editJobForm.description} onChange={handleEditJobFormChange} required placeholder="Description" className="w-full border px-3 py-2 rounded" />
                <SelectWithOther
                  value={editJobForm.location}
                  onChange={(value) => setEditJobForm({ ...editJobForm, location: value })}
                  options={LOCATIONS_TOGO}
                  placeholder="Lieu"
                  name="location"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <SelectWithOther
                  value={editJobForm.type}
                  onChange={(value) => setEditJobForm({ ...editJobForm, type: value })}
                  options={CONTRACT_TYPES}
                  placeholder="Type de contrat"
                  name="type"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                <FCFAInput
                  value={editJobForm.salary}
                  onChange={(value) => setEditJobForm({ ...editJobForm, salary: value })}
                  placeholder="Salaire (ex: 50,000 - 75,000 FCFA)"
                  name="salary"
                  className="w-full border px-3 py-2 rounded"
                />
                <input name="tags" value={editJobForm.tags} onChange={handleEditJobFormChange} placeholder="Tags (séparés par des virgules)" className="w-full border px-3 py-2 rounded" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Enregistrer</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileForm = ({ company, setCompany, onClose }: { company: any, setCompany: any, onClose?: () => void }) => {
  const [form, setForm] = useState({
    name: company.name || '',
    contact_name: company.contact_name || '',
    email: company.email || '',
    phone: company.phone || '',
    address: company.address || '',
    sector: company.sector || '',
    size: company.size || '',
    website_url: company.website_url || ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/company/${company.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Profil mis à jour !');
      setCompany({ ...company, ...form });
      localStorage.setItem('companyUser', JSON.stringify({ ...company, ...form }));
      if (onClose) onClose();
    } else {
      setMessage(data.error || 'Erreur lors de la mise à jour');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <div className="text-center text-green-600">{message}</div>}
      <input name="name" value={form.name} onChange={handleChange} required placeholder="Nom de l'entreprise" className="w-full border px-3 py-2 rounded" />
      <input name="contact_name" value={form.contact_name} onChange={handleChange} required placeholder="Nom du contact" className="w-full border px-3 py-2 rounded" />
      <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full border px-3 py-2 rounded" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone" className="w-full border px-3 py-2 rounded" />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Adresse" className="w-full border px-3 py-2 rounded" />
      <input name="sector" value={form.sector} onChange={handleChange} placeholder="Secteur d'activité" className="w-full border px-3 py-2 rounded" />
      <input name="size" value={form.size} onChange={handleChange} placeholder="Taille de l'entreprise" className="w-full border px-3 py-2 rounded" />
      <input name="website_url" value={form.website_url} onChange={handleChange} placeholder="Site web" className="w-full border px-3 py-2 rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Enregistrer</button>
    </form>
  );
};

export default CompanyDashboard;