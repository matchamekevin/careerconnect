import React, { useEffect, useState } from 'react';
import { Building, MapPin, Globe, Briefcase, Sparkles, Search } from 'lucide-react';
import CompanyProfileModal from '../components/CompanyProfileModal';
import { useToastContext } from '../contexts/ToastContext';

const EntreprisesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showError } = useToastContext();

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
        showError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCompanies = companies.filter((c: any) => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-400 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-4 border border-white/20">
            <Building className="h-4 w-4" />
            {companies.length} entreprises partenaires
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Nos <span className="text-white/80">entreprises partenaires</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Découvrez les entreprises qui recrutent des talents au Togo
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une entreprise ou un secteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-0 rounded-2xl focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-28"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Companies Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((c: any, index: number) => (
              <div
                key={c.id}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedCompanyId(c.id)}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Logo */}
                  <div className="relative mb-4">
                    {c.logo_url ? (
                      <img
                        src={`http://localhost:5000${c.logo_url}`}
                        alt="Logo"
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-gray-200 transition-all"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center';
                            fallback.innerHTML = `<span class="text-2xl font-bold text-white">${c.name ? c.name[0].toUpperCase() : '?'}</span>`;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {c.name ? c.name[0].toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">{c.name}</h2>
                  
                  {c.sector && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-2">
                      <Sparkles className="h-3 w-3" />
                      {c.sector}
                    </span>
                  )}
                  
                  {c.address && (
                    <p className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin className="h-4 w-4" />
                      {c.address}
                    </p>
                  )}

                  {/* Job Count Badge */}
                  <div className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold shadow-lg">
                    <Briefcase className="h-4 w-4" />
                    {c.job_count} offre{c.job_count > 1 ? 's' : ''}
                  </div>

                  {/* Website */}
                  {c.website_url && (
                    <a
                      href={c.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
                      onClick={e => e.stopPropagation()}
                    >
                      <Globe className="h-4 w-4" />
                      Visiter le site
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCompanies.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune entreprise trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier votre recherche
            </p>
          </div>
        )}
      </div>

      {selectedCompanyId && (
        <CompanyProfileModal companyId={selectedCompanyId} onClose={() => setSelectedCompanyId(null)} />
      )}
    </div>
  );
};

export default EntreprisesPage;
