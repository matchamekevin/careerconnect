import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, User, Building, UserCircle } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!sessionStorage.getItem('adminUser'));
  const [stats, setStats] = useState<{ companies: number; jobs: number; students: number }>({ companies: 0, jobs: 0, students: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  // Met à jour l'état à chaque navigation ou changement de session
  useEffect(() => {
    const checkAuth = () => {
      const student = sessionStorage.getItem('studentUser');
      const company = sessionStorage.getItem('companyUser');
      setIsAuthenticated(!!student || !!company);
      setIsAdmin(!!sessionStorage.getItem('adminUser'));
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  // Récupère les statistiques depuis l'API
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats({ companies: data.companies, jobs: data.jobs, students: data.students });
        console.log('Stats header:', data);
      })
      .catch(() => setStats({ companies: 0, jobs: 0, students: 0 }));
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem('studentUser');
    sessionStorage.removeItem('companyUser');
    setIsAuthenticated(false);
    navigate('/');
    window.location.reload();
  };

  // Ajout d'un bouton dashboard selon le type de session
  let dashboardLink = null;
  // On ne montre PAS le bouton admin sur la page d'accueil
  if (isAdmin && location.pathname !== "/") {
    dashboardLink = (
      <Link to="/admin-dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-2">
        Dashboard Admin
      </Link>
    );
  } else if (isAuthenticated) {
    const student = sessionStorage.getItem('studentUser');
    const company = sessionStorage.getItem('companyUser');
    if (student) {
      dashboardLink = (
        <Link to="/student-dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-2">
          Mon Dashboard
        </Link>
      );
    } else if (company) {
      dashboardLink = (
        <Link to="/company-dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-2">
          Mon Dashboard
        </Link>
      );
    }
  }

  // Affichage infos utilisateur connecté (admin prioritaire)
  let userInfo = null;
  let userLogo = null;
  // On ne montre PAS le logo admin sur la page d'accueil
  if (isAdmin && location.pathname !== "/") {
    const admin = JSON.parse(sessionStorage.getItem('adminUser') || '{}');
    const email = admin?.email || '';
    const name = admin?.first_name || 'Super Admin';
    userLogo = <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-blue-700 font-bold">A</div>;
    userInfo = (
      <div className="flex items-center gap-2 ml-4">
        {userLogo}
        <div className="flex flex-col text-xs text-gray-700">
          <span className="font-semibold">{name}</span>
          <span className="text-gray-500">{email}</span>
        </div>
      </div>
    );
  } else if (isAuthenticated) {
    const student = sessionStorage.getItem('studentUser');
    const company = sessionStorage.getItem('companyUser');
    let user = null;
    if (student) user = JSON.parse(student);
    if (company) user = JSON.parse(company);
    const email = user?.email || '';
    const name = user?.first_name || user?.companyName || '';
    const logoUrl = user?.profile_picture_url || user?.logo_url || '';
    // Logo : image si dispo, sinon initiale
    if (logoUrl) {
      userLogo = <img src={logoUrl} alt="logo" className="w-8 h-8 rounded-full object-cover" />;
    } else {
      const initial = name ? name[0].toUpperCase() : (email[0]?.toUpperCase() || '?');
      userLogo = <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">{initial}</div>;
    }
    userInfo = (
      <div className="flex items-center gap-2 ml-4">
        {userLogo}
        <div className="flex flex-col text-xs text-gray-700">
          <span className="font-semibold">{name || email}</span>
          <span className="text-gray-500">{email}</span>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Anciennement: <Briefcase className="h-8 w-8 text-blue-700" /> */}
            <Building className="h-8 w-8 text-blue-700" /> {/* Changement ici */}
            <span className="text-xl font-bold text-gray-900">JobTogo Étudiant</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-700 transition-colors">
              Accueil
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-700 transition-colors">
              Offres d'emploi
            </Link>
            <Link to="/entreprises" className="text-gray-700 hover:text-blue-700 transition-colors">
              Entreprises
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-700 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          {!isAuthenticated && !isAdmin && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/student-auth"
                className="flex items-center space-x-1 px-4 py-2 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Étudiant</span>
              </Link>
              <Link
                to="/company-auth"
                className="flex items-center space-x-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Building className="h-4 w-4" />
                <span>Entreprise</span>
              </Link>
            </div>
          )}
          {(isAuthenticated || isAdmin) && (
            <div className="flex items-center gap-2">
              {isAdmin && dashboardLink}
              {!isAdmin && dashboardLink}
              {userInfo}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  sessionStorage.removeItem('adminUser');
                  sessionStorage.removeItem('studentUser');
                  sessionStorage.removeItem('companyUser');
                  setIsAuthenticated(false);
                  setIsAdmin(false);
                  navigate('/');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-4"
              >
                Déconnexion
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Offres d'emploi
              </Link>
              <Link
                to="/entreprises"
                className="text-gray-700 hover:text-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Entreprises
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {!isAuthenticated && !isAdmin && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/student-auth"
                    className="flex items-center space-x-1 px-4 py-2 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Connexion Étudiant</span>
                  </Link>
                  <Link
                    to="/company-auth"
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="h-4 w-4" />
                    <span>Connexion Entreprise</span>
                  </Link>
                </div>
              )}
              {(isAuthenticated || isAdmin) && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    sessionStorage.removeItem('adminUser');
                    sessionStorage.removeItem('studentUser');
                    sessionStorage.removeItem('companyUser');
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    navigate('/');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-4"
                >
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;