import React, { useEffect, useState } from 'react';

interface CompanyProfileModalProps {
  companyId: number | null;
  onClose: () => void;
}

interface Company {
  id: number;
  name: string;
  sector: string;
  address: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  job_count?: number;
  email?: string;
 phone?: string;
}

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ companyId, onClose }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) {
      setLoading(true);
      fetch(`/api/companies/${companyId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Erreur lors du chargement du profil entreprise');
          return res.json();
        })
        .then((data) => {
          setCompany(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [companyId]);

  if (!companyId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose}>&times;</button>
        {loading && <div>Chargement...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {company && (
          <>
            <div className="flex items-center gap-4 mb-4">
              {company.logo_url && <img src={company.logo_url} alt="Logo" className="w-16 h-16 rounded-full object-cover" />}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
                <p className="text-blue-600 font-medium">{company.sector}</p>
                <p className="text-gray-500 text-sm">{company.address}</p>
              </div>
            </div>
            {company.description && <p className="mb-2 text-gray-700">{company.description}</p>}
            {company.website_url && <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm">Site web</a>}
            {company.email && <p className="text-sm text-gray-500 mt-2">Email : {company.email}</p>}
            {company.phone && <p className="text-sm text-gray-500">Téléphone : {company.phone}</p>}
            {company.job_count !== undefined && <p className="text-blue-600 font-medium mt-2">{company.job_count} offre{company.job_count > 1 ? 's' : ''} publiée{company.job_count > 1 ? 's' : ''}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyProfileModal;
