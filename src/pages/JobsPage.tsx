import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, ArrowRight } from 'lucide-react';
import ApplyJobModal from '../components/ApplyJobModal';

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
  const [error, setError] = useState<string | null>(null);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des offres');
        return res.json();
      })
      .then((data) => {
        // Afficher toutes les offres pour tous les utilisateurs
        setJobs(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    const student = sessionStorage.getItem('studentUser');
    if (student) {
      const studentId = JSON.parse(student).id;
      fetch(`/api/student/${studentId}/saved-jobs`)
        .then(res => res.json())
        .then(data => setSavedJobIds(Array.isArray(data) ? data.map((job: any) => job.id) : []));
    }
  }, []);

  // Afficher toutes les offres disponibles
  let displayJobs = jobs;
  const filteredJobs = displayJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesType = !selectedType || job.type === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  // Calculs pour la pagination
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand les filtres changent
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...', totalPages);
      }
    }

    return pages;
  };


  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Offres d'emploi pour étudiants
          </h1>
          <p className="text-xl text-gray-600">
            Trouvez l'opportunité parfaite pour lancer votre carrière
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un poste, entreprise, compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les villes</option>
                <option value="Lomé">Lomé</option>
                <option value="Sokodé">Sokodé</option>
                <option value="Kara">Kara</option>
                <option value="Atakpamé">Atakpamé</option>
              </select>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="Stage">Stage</option>
                <option value="Temps partiel">Temps partiel</option>
                <option value="Contrat">Contrat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {totalJobs} offre{totalJobs > 1 ? 's' : ''} trouvée{totalJobs > 1 ? 's' : ''}
            {totalJobs > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                (Page {currentPage} sur {totalPages} - Affichage de {startIndex + 1} à {Math.min(endIndex, totalJobs)})
              </span>
            )}
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {job.logo_url ? (
                        <img
                          src={job.logo_url.startsWith('/') ? job.logo_url : `/uploads/${job.logo_url}`}
                          alt="Logo entreprise"
                          className="w-16 h-16 rounded-full object-cover mb-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                          <span className="text-gray-400">🏢</span>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium text-lg">
                        {job.company}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.type === 'Stage' ? 'bg-green-100 text-green-800' :
                      job.type === 'Temps partiel' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                      {job.type}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags && job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium mr-2">FCFA</span>
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Publié le {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : ''}
                    </div>
                  </div>

                  {/* Profil recherché : non disponible dans la base, donc ignoré */}
                </div>

                <div className="lg:w-48 flex flex-col gap-3">
                  <button
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={() => setApplyJobId(job.id)}
                  >
                    Postuler maintenant
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                  <button
                    className={`flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg transition-colors font-medium ${savedJobIds.includes(job.id) ? 'bg-green-100 text-green-700 border-green-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={async () => {
                      if (savedJobIds.includes(job.id)) return;
                      const student = sessionStorage.getItem('studentUser');
                      if (!student) {
                        setSaveMessage('Veuillez vous connecter comme étudiant pour sauvegarder.');
                        return;
                      }
                      const studentId = JSON.parse(student).id;
                      const res = await fetch(`/api/student/${studentId}/save-job`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ jobId: job.id })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setSavedJobIds(prev => [...prev, job.id]);
                        setSaveMessage('Offre sauvegardée !');
                        setTimeout(() => setSaveMessage(null), 2000);
                      } else {
                        setSaveMessage(data.error || 'Erreur lors de la sauvegarde');
                      }
                    }}
                    disabled={savedJobIds.includes(job.id)}
                  >
                    {savedJobIds.includes(job.id) ? 'Déjà sauvegardée' : 'Sauvegarder'}
                  </button>
                  {saveMessage && <div className="text-green-600 text-xs mt-1">{saveMessage}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalJobs === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune offre ne correspond à vos critères de recherche.
            </p>
            <p className="text-gray-400 mt-2">
              Essayez de modifier vos filtres ou votre terme de recherche.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            {/* Bouton Précédent */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            {/* Numéros de page */}
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">...</span>
                ) : (
                  <button
                    onClick={() => goToPage(page as number)}
                    className={`px-4 py-2 text-sm font-medium border ${currentPage === page
                      ? 'text-blue-600 bg-blue-50 border-blue-500'
                      : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Bouton Suivant */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}

        {/* Info pagination mobile */}
        {totalPages > 1 && (
          <div className="text-center mt-4 text-sm text-gray-500">
            Page {currentPage} sur {totalPages} ({totalJobs} offres au total)
          </div>
        )}

        {applyJobId && (
          <ApplyJobModal jobId={applyJobId} onClose={() => setApplyJobId(null)} />
        )}
      </div>
    </div>
  );
};

export default JobsPage;