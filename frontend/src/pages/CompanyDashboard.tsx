import React, { useState, useEffect, useRef } from 'react';
import { Building, Plus, Users, Edit, Trash2, Briefcase, MapPin, Clock, Eye, CheckCircle, XCircle, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import FCFAInput from '../components/FCFAInput';
import SelectWithOther from '../components/SelectWithOther';
import { CONTRACT_TYPES, LOCATIONS_TOGO } from '../constants/formOptions';
import { useToastContext } from '../contexts/ToastContext';

const CompanyDashboard = () => {
  const { showSuccess, showError } = useToastContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({ jobs: 0, applications: 0, views: 0 });
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobForm, setJobForm] = useState({
    title: '', description: '', location: '', type: '', salary: '', tags: '', company: ''
  });
  const [editingJobId, setEditingJobId] = useState<number | null>(null);

  useEffect(() => {
    const companyData = sessionStorage.getItem('companyUser');
    if (companyData) {
      const parsedCompany = JSON.parse(companyData);
      setCompany(parsedCompany);
      if (parsedCompany.logo_url) {
        setLogoSrc(`http://localhost:5000${parsedCompany.logo_url}`);
      }

      // Charger les données
      fetch(`/api/companies/${parsedCompany.id}`)
        .then(res => res.json())
        .then(data => {
          setCompany(data);
          fetch(`/api/company/${data.id}/jobs`).then(res => res.json()).then(setJobs);
          fetch(`/api/company/${data.id}/applications`).then(res => res.json()).then(setApplications);
          fetch(`/api/company/${data.id}/stats`).then(res => res.json()).then(setStats);
        });
    }
  }, []);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const uploadResponse = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        await fetch(`/api/company/${company.id}/logo`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logo_url: data.url })
        });
        setLogoSrc(`http://localhost:5000${data.url}`);
        const updatedCompany = { ...company, logo_url: data.url };
        setCompany(updatedCompany);
        sessionStorage.setItem('companyUser', JSON.stringify(updatedCompany));
      }
    } catch (error) {
      console.error('Logo upload failed:', error);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    const method = editingJobId ? 'PUT' : 'POST';
    const url = editingJobId ? `/api/jobs/${editingJobId}` : '/api/jobs';
    const normalizedTags = Array.isArray(jobForm.tags)
      ? jobForm.tags
      : jobForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    const payload = {
      ...jobForm,
      tags: normalizedTags,
      company_id: company.id
    };

    const body = JSON.stringify(payload);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const data = await res.json();
    if (data.success) {
      showSuccess(editingJobId ? 'Offre modifiée !' : 'Offre publiée !');
      setShowJobForm(false);
      setJobForm({ title: '', description: '', location: '', type: '', salary: '', tags: '', company: '' });
      setEditingJobId(null);
      fetch(`/api/company/${company.id}/jobs`).then(res => res.json()).then(setJobs);
      fetch(`/api/company/${company.id}/stats`).then(res => res.json()).then(setStats);
    } else {
      showError(data.error || 'Erreur lors de la publication');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j.id !== id));
    // Actualiser les statistiques
    fetch(`/api/company/${company.id}/stats`).then(res => res.json()).then(setStats);
  };

  const handleEditJob = (job: any) => {
    setJobForm({
      title: job.title,
      company: company?.name || '',
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      tags: Array.isArray(job.tags) ? job.tags.join(', ') : (job.tags || '')
    });
    setEditingJobId(job.id);
    setShowJobForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Fermée': return 'bg-gray-100 text-gray-700';
      case 'Nouveau': return 'bg-blue-100 text-blue-700';
      case 'En cours': return 'bg-amber-100 text-amber-700';
      case 'Accepté': return 'bg-emerald-100 text-emerald-700';
      case 'Refusé': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="glass rounded-3xl p-8 mb-8 border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Logo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-5xl font-extrabold text-white shadow-xl shadow-emerald-500/30 overflow-hidden">
                {logoSrc ? (
                  <img src={logoSrc} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  company?.name?.[0] || <Building className="h-16 w-16" />
                )}
              </div>
              <button
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors border border-emerald-100"
                onClick={() => fileInputRef.current?.click()}
                title="Changer le logo"
              >
                <Plus className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
            
            {/* Company Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Entreprise</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{company?.name || 'Entreprise'}</h1>
              <p className="text-gray-500">{company?.sector || 'Secteur non défini'}</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center px-6 py-4 bg-white/80 rounded-2xl border border-emerald-100">
                <p className="text-3xl font-bold text-emerald-600">{stats.jobs}</p>
                <p className="text-xs text-gray-500">Offres</p>
              </div>
              <div className="text-center px-6 py-4 bg-white/80 rounded-2xl border border-emerald-100">
                <p className="text-3xl font-bold text-emerald-600">{stats.applications}</p>
                <p className="text-xs text-gray-500">Candidatures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass rounded-2xl p-2 mb-8 border border-white/50 inline-flex w-full justify-center">
          <div className="flex gap-2 flex-wrap justify-center">
            {[
              { key: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
              { key: 'jobs', label: 'Mes offres', icon: Briefcase },
              { key: 'applications', label: 'Candidatures', icon: Users },
              { key: 'profile', label: 'Profil', icon: Building }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 hover:bg-white/80'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Offres actives</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.jobs}</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Candidatures</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.applications}</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vues totales</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.views || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Applications */}
            <div className="glass rounded-2xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Candidatures récentes
                </h3>
                <button 
                  onClick={() => setActiveTab('applications')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  Voir tout <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Aucune candidature reçue pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app: any, index: number) => (
                    <div 
                      key={app.id} 
                      className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-100 hover:shadow-md transition-all animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {app.candidate_name?.[0] || '?'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{app.candidate_name}</h4>
                          <p className="text-sm text-gray-500">{app.job_title || ''} • {app.university}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-400">{app.applied_at?.slice(0, 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Mes offres d'emploi
                </h3>
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold" 
                  onClick={() => setShowJobForm(true)}
                >
                  <Plus className="h-5 w-5" />
                  Nouvelle offre
                </button>
              </div>
              
              {jobs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune offre publiée</h3>
                  <p className="text-gray-500 mb-6">Commencez par publier votre première offre d'emploi</p>
                  <button 
                    onClick={() => setShowJobForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold"
                  >
                    Publier une offre
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job: any, index: number) => (
                    <div 
                      key={job.id} 
                      className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all animate-fade-in group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {job.logo_url ? (
                            <img 
                              src={job.logo_url.startsWith('http') ? job.logo_url : `http://localhost:5000${job.logo_url}`} 
                              alt="Logo" 
                              className="w-12 h-12 rounded-xl object-cover" 
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900 line-clamp-1">{job.title}</h4>
                            <p className="text-sm text-emerald-600 font-medium">{job.company}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          job.type === 'CDI' ? 'bg-purple-100 text-purple-700' : 
                          job.type === 'Stage' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>
                      
                      {job.tags && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(Array.isArray(job.tags) ? job.tags : String(job.tags).split(',')).slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs">{String(tag).trim()}</span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{job.posted_at?.slice(0, 10)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-semibold text-emerald-600">{job.salary} FCFA</span>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                            onClick={() => handleEditJob(job)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="glass rounded-2xl p-6 border border-white/50">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Candidatures reçues
            </h3>
            
            {applications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune candidature reçue</h3>
                <p className="text-gray-500">Les candidatures apparaîtront ici une fois que des étudiants postuleront à vos offres</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any, index: number) => (
                  <div 
                    key={app.id} 
                    className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                          {app.candidate_name?.[0] || '?'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{app.candidate_name}</h4>
                          <p className="text-emerald-600 font-medium">{app.job_title || ''}</p>
                          <p className="text-sm text-gray-500">{app.university} • {app.field}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-xl text-sm font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <span className="text-sm text-gray-400">{app.applied_at?.slice(0, 10)}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all text-sm font-medium"
                            onClick={async () => {
                              await fetch(`/api/applications/${app.id}/status`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'Accepté' })
                              });
                              setApplications(applications.map(a => a.id === app.id ? { ...a, status: 'Accepté' } : a));
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accepter
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-medium"
                            onClick={async () => {
                              await fetch(`/api/applications/${app.id}/status`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'Refusé' })
                              });
                              setApplications(applications.map(a => a.id === app.id ? { ...a, status: 'Refusé' } : a));
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                            Refuser
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && company && (
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-8 border border-white/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="h-5 w-5 text-emerald-600" />
                Profil entreprise
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="font-semibold text-gray-900">{company.contact_name || '-'}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900 truncate">{company.email}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                  <p className="font-semibold text-gray-900">{company.phone || '-'}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Adresse</p>
                  <p className="font-semibold text-gray-900">{company.address || '-'}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Secteur d'activité</p>
                  <p className="font-semibold text-gray-900">{company.sector || '-'}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Taille</p>
                  <p className="font-semibold text-gray-900">{company.size || '-'}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl border border-gray-100 md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Site web</p>
                  {company.website_url ? (
                    <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-600 hover:underline">{company.website_url}</a>
                  ) : (
                    <p className="font-semibold text-gray-900">-</p>
                  )}
                </div>
              </div>

              <button
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold flex items-center justify-center gap-2"
                onClick={() => setShowProfileEdit(true)}
              >
                <Edit className="h-4 w-4" />
                Modifier le profil
              </button>
            </div>
          </div>
        )}

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowJobForm(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
              <button 
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors" 
                onClick={() => setShowJobForm(false)}
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                {editingJobId ? 'Modifier l\'offre' : 'Publier une offre'}
              </h3>
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre du poste</label>
                  <input
                    name="title"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    required
                    placeholder="ex: Développeur Web Junior"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                  <input
                    name="company"
                    value={company?.name || ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat</label>
                  <SelectWithOther
                    value={jobForm.type}
                    onChange={(value) => setJobForm({ ...jobForm, type: value })}
                    options={CONTRACT_TYPES}
                    placeholder="Sélectionnez le type"
                    name="type"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Décrivez le poste et les responsabilités..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (séparés par des virgules)</label>
                  <input
                    name="tags"
                    value={jobForm.tags}
                    onChange={(e) => setJobForm({ ...jobForm, tags: e.target.value })}
                    placeholder="ex: Marketing, Digital, Réseaux sociaux"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
                  <SelectWithOther
                    value={jobForm.location}
                    onChange={(value) => setJobForm({ ...jobForm, location: value })}
                    options={LOCATIONS_TOGO}
                    placeholder="Sélectionnez le lieu"
                    name="location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salaire</label>
                  <FCFAInput
                    value={jobForm.salary}
                    onChange={(value) => setJobForm({ ...jobForm, salary: value })}
                    placeholder="ex: 50,000 - 75,000"
                    name="salary"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold"
                >
                  {editingJobId ? 'Modifier' : 'Publier l\'offre'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Profile Edit Modal */}
        {showProfileEdit && company && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowProfileEdit(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in max-h-[90vh] overflow-y-auto">
              <button 
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors" 
                onClick={() => setShowProfileEdit(false)}
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Building className="h-5 w-5 text-emerald-600" />
                Modifier le profil
              </h3>
              <ProfileForm
                company={company}
                setCompany={setCompany}
                onClose={() => setShowProfileEdit(false)}
              />
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
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/company/${company.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      showSuccess('Profil mis à jour !');
      setCompany({ ...company, ...form });
      sessionStorage.setItem('companyUser', JSON.stringify({ ...company, ...form }));
      if (onClose) onClose();
    } else {
      showError(data.error || 'Erreur lors de la mise à jour');
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
        <input name="name" value={form.name} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} required placeholder="Nom de l'entreprise" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contact</label>
        <input name="contact_name" value={form.contact_name} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} required placeholder="Nom du contact" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input name="email" value={form.email} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} required placeholder="Email" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
        <input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder="Téléphone" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
        <input name="address" value={form.address} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder="Adresse" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
        <input name="sector" value={form.sector} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder="Secteur d'activité" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Taille de l'entreprise</label>
        <input name="size" value={form.size} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder="Taille de l'entreprise" className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
        <input name="website_url" value={form.website_url} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} placeholder="https://..." className={inputClass} />
      </div>
      <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold">
        Enregistrer
      </button>
    </form>
  );
};

export default CompanyDashboard;
