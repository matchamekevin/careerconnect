import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplyJobModal from './ApplyJobModal';

interface JobDetailsModalProps {
  jobId: number | null;
  onClose: () => void;
}

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

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ jobId, onClose }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApply, setShowApply] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      fetch(`/api/jobs/${jobId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Erreur lors du chargement des détails');
          return res.json();
        })
        .then((data) => {
          setJob(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [jobId]);

  const handleApplyClick = () => {
    // Vérifier si l'étudiant est connecté
    const studentUser = sessionStorage.getItem('studentUser');

    if (!studentUser) {
      // Sauvegarder l'ID du job pour après la connexion
      sessionStorage.setItem('pendingJobApplication', jobId?.toString() || '');

      // Afficher un message et rediriger vers la page de connexion
      setShowLoginMessage(true);

      // Rediriger après 2 secondes
      setTimeout(() => {
        onClose();
        navigate('/student-auth?redirect=apply');
      }, 2000);
    } else {
      // L'utilisateur est connecté, procéder à la candidature normale
      setShowApply(true);
    }
  };

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose}>&times;</button>
        {loading && <div>Chargement...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {job && (
          <>
            <div className="flex items-center gap-4 mb-4">
              {job.logo_url && <img src={job.logo_url} alt="Logo" className="w-12 h-12 rounded-full object-cover" />}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                <p className="text-blue-600 font-medium">{job.company}</p>
                <p className="text-gray-500 text-sm">{job.location}</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">{job.type}</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mr-2">{job.salary}</span>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Publié le {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : ''}</span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags && job.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">{tag}</span>
                ))}
              </div>
            </div>

            {/* Message de connexion */}
            {showLoginMessage && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-center">
                  🔐 Vous devez être connecté pour postuler. Redirection vers la page de connexion...
                </p>
              </div>
            )}

            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4" onClick={handleApplyClick}>
              Postuler
            </button>
            {showApply && <ApplyJobModal jobId={job.id} onClose={() => setShowApply(false)} />}
          </>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
