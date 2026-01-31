import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Briefcase, Building } from 'lucide-react';
import JobDetailsModal from './JobDetailsModal';
import { useToastContext } from '../contexts/ToastContext';

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

const RecentJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const { showError } = useToastContext();

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des offres');
        return res.json();
      })
      .then((data) => {
        const sortedJobs = data.sort((a: Job, b: Job) => {
          return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
        });
        setJobs(sortedJobs.slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        showError(err.message);
        setLoading(false);
      });
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Stage': return 'bg-gray-200 text-gray-800';
      case 'Temps partiel': return 'bg-gray-300 text-gray-900';
      case 'CDI': return 'bg-gray-900 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="skeleton h-12 w-12 rounded-xl mb-4"></div>
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-1/2 mb-4"></div>
                <div className="skeleton h-20 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
            <Briefcase className="h-4 w-4" />
            Opportunités récentes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Les dernières <span className="text-gray-600">offres</span>
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les opportunités qui correspondent à votre profil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedJobId(job.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                {job.logo_url ? (
                  <img
                    src={job.logo_url.startsWith('/') ? job.logo_url : `/uploads/${job.logo_url}`}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <span className={`px-3 py-1 ${getTypeBadge(job.type)} text-xs font-medium rounded-full`}>
                  {job.type}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 font-medium text-sm mb-3">{job.company}</p>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {job.description}
              </p>

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {job.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{job.salary}</span>
                  <span className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all duration-300 group"
          >
            Voir toutes les offres
            <ArrowRight className="h-5 w-5 transition-transform" />
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
