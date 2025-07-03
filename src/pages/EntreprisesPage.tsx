import React, { useEffect, useState } from 'react';
import CompanyProfileModal from '../components/CompanyProfileModal';

const EntreprisesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number|null>(null);

  useEffect(() => {
    fetch('/api/companies')
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des entreprises');
        return res.json();
      })
      .then(data => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Entreprises qui publient sur la plateforme</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map((c: any) => (
          <div
            key={c.id}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setSelectedCompanyId(c.id)}
          >
            {c.logo_url && <img src={c.logo_url} alt="Logo" className="w-16 h-16 rounded-full object-cover mb-3" />}
            <h2 className="text-xl font-semibold mb-1">{c.name}</h2>
            <p className="text-gray-500 mb-1">{c.sector}</p>
            <p className="text-gray-500 mb-1">{c.address}</p>
            <p className="text-blue-600 font-medium mb-2">{c.job_count} offre{c.job_count > 1 ? 's' : ''} publiée{c.job_count > 1 ? 's' : ''}</p>
            {c.website_url && <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm" onClick={e => e.stopPropagation()}>Site web</a>}
          </div>
        ))}
      </div>
      {selectedCompanyId && (
        <CompanyProfileModal companyId={selectedCompanyId} onClose={() => setSelectedCompanyId(null)} />
      )}
    </div>
  );
};

export default EntreprisesPage;
