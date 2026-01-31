import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Building, Award, Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
  const isAuthenticated = !!sessionStorage.getItem('studentUser') || !!sessionStorage.getItem('companyUser');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedLocation) params.append('location', selectedLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient - monochrome */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">+1000 opportunités disponibles</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
            Construis ta carrière
            <span className="block mt-2 text-gray-300">
              au Togo
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            La plateforme qui connecte les talents togolais avec les meilleures entreprises locales
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col md:flex-row gap-3 p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un poste, entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                />
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-4 bg-white rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all cursor-pointer"
              >
                <option value="">Toutes les villes</option>
                <option value="Lomé">Lomé</option>
                <option value="Sokodé">Sokodé</option>
                <option value="Kara">Kara</option>
                <option value="Atakpamé">Atakpamé</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link
                to="/student-auth"
                className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Je cherche un emploi
                <ArrowRight className="h-5 w-5 transition-transform" />
              </Link>
              <Link
                to="/company-auth"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Je recrute des talents
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {[
            { icon: Users, value: '500+', label: 'Étudiants connectés' },
            { icon: Building, value: '150+', label: 'Entreprises partenaires' },
            { icon: Award, value: '1000+', label: 'Opportunités créées' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <stat.icon className="h-7 w-7 text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
