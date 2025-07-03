import React, { useEffect, useState } from 'react';
import { Search, MapPin, Filter, Clock, DollarSign, ArrowRight } from 'lucide-react';
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
}

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des offres');
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesType = !selectedType || job.type === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  if (loading) return <div className="text-center py-10">Chargement...</div>;
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
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {visibleJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {job.logo_url && (
                        <img src={job.logo_url} alt="Logo entreprise" className="w-16 h-16 rounded-full object-cover mb-2" />
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium text-lg">
                        {job.company}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.type === 'Stage' ? 'bg-green-100 text-green-800' :
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
                      <DollarSign className="h-4 w-4 mr-2" />
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

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune offre ne correspond à vos critères de recherche.
            </p>
            <p className="text-gray-400 mt-2">
              Essayez de modifier vos filtres ou votre terme de recherche.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredJobs.length && (
          <div className="text-center mt-12">
            <button
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              onClick={() => setVisibleCount((prev) => prev + 6)}
            >
              Charger plus d'offres
            </button>
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