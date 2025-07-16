import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Building, Award } from 'lucide-react';

const Hero = () => {
  // Vérifie la session pour masquer les boutons du Hero
  const isAuthenticated = !!sessionStorage.getItem('studentUser') || !!sessionStorage.getItem('companyUser');

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  // Fonction pour gérer la recherche
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedLocation) params.append('location', selectedLocation);

    navigate(`/jobs?${params.toString()}`);
  };

  // Fonction pour gérer l'appui sur Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section
      className="relative text-white"
      style={{ minHeight: '60vh' }}
    >
      {/* Image de fond floutée */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url('/Livreur.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px) brightness(0.3)', // brightness abaissé pour assombrir
        }}
        aria-hidden="true"
      />
      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Votre carrière commence
            <span className="block text-yellow-400">ici au Togo</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Connectez-vous avec les meilleures opportunités d'emploi et de stage adaptées aux étudiants togolais
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher un poste, entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les villes</option>
                  <option value="Lomé">Lomé</option>
                  <option value="Sokodé">Sokodé</option>
                  <option value="Kara">Kara</option>
                  <option value="Atakpamé">Atakpamé</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-white hover:text-gray-900 transition-colors border border-gray-300"
              >
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/student-auth"
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Je cherche un emploi
              </Link>
              <Link
                to="/company-auth"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-900 transition-colors font-semibold"
              >
                Je recrute des talents
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Étudiants connectés</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mx-auto mb-4">
              <Building className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold mb-2">150+</div>
            <div className="text-blue-200">Entreprises partenaires</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4">
              <Award className="h-8 w-8 text-gray-500" />
            </div>
            <div className="text-3xl font-bold mb-2">1000+</div>
            <div className="text-blue-200">Opportunités créées</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;