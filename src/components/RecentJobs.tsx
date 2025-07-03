import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import JobDetailsModal from './JobDetailsModal';

// Définition du type Job pour TypeScript
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
  logo_url?: string; // Ajout de logo_url en tant que champ optionnel
}

const RecentJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

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

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Offres d'emploi récentes
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les dernières opportunités pour les étudiants togolais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
              onClick={() => setSelectedJobId(job.id)}
            >
              <div className="flex flex-col items-center mb-4">
                {job.logo_url && (
                  <img src={job.logo_url} alt="Logo entreprise" className="w-12 h-12 rounded-full object-cover mb-2" />
                )}
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.type === 'Stage' ? 'bg-green-100 text-green-800' :
                    job.type === 'Temps partiel' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {job.type}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags && job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
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

              <button
                className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={e => { e.stopPropagation(); setSelectedJobId(job.id); }}
              >
                Voir les détails
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Voir toutes les offres
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        {selectedJobId && (
          <JobDetailsModal jobId={selectedJobId} onClose={() => setSelectedJobId(null)} />
        )}
      </div>
    </section>
  );
};

export default RecentJobs;