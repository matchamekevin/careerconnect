import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, ArrowRight, Building, Briefcase, Filter, Heart, CheckCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ApplyJobModal from '../components/ApplyJobModal';
import { useToastContext } from '../contexts/ToastContext';
import { jobService, savedJobsService } from '../services/api';
import { getImageUrl } from '../utils/api';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted_at: string;
  description: string;
  tags: string[];
  logo_url?: string;
  company_id?: number;
}

const JobsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedType, setSelectedType] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const { showSuccess, showError, showInfo } = useToastContext();

  const companyUser = sessionStorage.getItem('companyUser');
  const currentCompanyId = companyUser ? JSON.parse(companyUser).id : null;

  useEffect(() => {
    setLoading(true);
    jobService.getAll()
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        showError(err.message || 'Erreur lors du chargement des offres');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const student = sessionStorage.getItem('studentUser');
    if (student) {
      const studentId = JSON.parse(student).id;
      savedJobsService.getByStudentId(studentId)
        .then(data => setSavedJobIds(data.map(job => job.id)))
        .catch(err => console.warn('Erreur chargement emplois sauvegardés:', err.message));
    }
  }, []);

  const displayJobs = jobs;
  const filteredJobs = displayJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesType = !selectedType || job.type === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedType]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...', totalPages);
      }
    }
    return pages;
  };

  const getTypeBadgeStyle = (type: string) => {
    switch(type) {
      case 'Stage': return 'bg-gray-200 text-gray-800';
      case 'Temps partiel': return 'bg-gray-300 text-gray-900';
      default: return 'bg-gray-900 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-4 border border-white/20">
              <Sparkles className="h-4 w-4 text-white" />
              +{jobs.length} opportunités disponibles
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Trouvez votre <span className="text-gray-300">opportunité idéale</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Stages, emplois à temps partiel et contrats pour lancer votre carrière au Togo
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 max-w-4xl mx-auto border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Poste, entreprise, compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                />
              </div>
              <div className="md:col-span-3 relative">
                <MapPin className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent appearance-none transition-all"
                >
                  <option value="">Toutes les villes</option>
                  <option value="Lomé">Lomé</option>
                  <option value="Sokodé">Sokodé</option>
                  <option value="Kara">Kara</option>
                  <option value="Atakpamé">Atakpamé</option>
                </select>
              </div>
              <div className="md:col-span-3 relative">
                <Filter className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent appearance-none transition-all"
                >
                  <option value="">Tous les types</option>
                  <option value="Stage">Stage</option>
                  <option value="Temps partiel">Temps partiel</option>
                  <option value="Contrat">Contrat</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <button className="w-full h-full min-h-[48px] bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {totalJobs} offre{totalJobs > 1 ? 's' : ''} trouvée{totalJobs > 1 ? 's' : ''}
            </h2>
            {totalJobs > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Affichage {startIndex + 1} - {Math.min(endIndex, totalJobs)} sur {totalJobs}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">Mise à jour en temps réel</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Listings */}
        {!loading && (
          <div className="grid gap-6">
            {currentJobs.map((job, index) => (
              <div
                key={job.id}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {getImageUrl(job.logo_url) ? (
                      <img
                        src={getImageUrl(job.logo_url) || undefined}
                        alt="Logo entreprise"
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeStyle(job.type)} shadow-sm`}>
                        {job.type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 4 && (
                          <span className="px-3 py-1 text-gray-500 text-xs">+{job.tags.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-gray-900">
                        {job.salary} FCFA
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {job.posted_at ? new Date(job.posted_at).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-3 md:ml-4">
                    {currentCompanyId && job.company_id === currentCompanyId ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Votre offre
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => setApplyJobId(job.id)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-semibold"
                        >
                          Postuler
                          <ArrowRight className="h-4 w-4 transition-transform" />
                        </button>
                        <button
                          onClick={async () => {
                            if (savedJobIds.includes(job.id)) return;
                            const student = sessionStorage.getItem('studentUser');
                            if (!student) {
                              showInfo('Connectez-vous pour sauvegarder cette offre.');
                              return;
                            }
                            const studentId = JSON.parse(student).id;
                            try {
                              await savedJobsService.saveJob(studentId, job.id);
                              setSavedJobIds(prev => [...prev, job.id]);
                              showSuccess('Offre sauvegardée !');
                            } catch (error) {
                              showError('Erreur lors de la sauvegarde');
                            }
                          }}
                          disabled={savedJobIds.includes(job.id)}
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            savedJobIds.includes(job.id)
                              ? 'bg-gray-200 text-gray-700 border border-gray-300'
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${savedJobIds.includes(job.id) ? 'fill-gray-600' : ''}`} />
                          {savedJobIds.includes(job.id) ? 'Sauvé' : 'Sauver'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && totalJobs === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune offre trouvée
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Essayez de modifier vos filtres ou votre terme de recherche pour trouver plus d'opportunités.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(page as number)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </p>
          </div>
        )}

        {applyJobId && (
          <ApplyJobModal
            jobId={applyJobId}
            onClose={() => setApplyJobId(null)}
            studentId={(() => {
              const studentUser = sessionStorage.getItem('studentUser');
              return studentUser ? JSON.parse(studentUser).id : undefined;
            })()}
          />
        )}
      </div>
    </div>
  );
};

export default JobsPage;
