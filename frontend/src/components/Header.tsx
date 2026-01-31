import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Building, ChevronDown, LogOut } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!sessionStorage.getItem('adminUser'));

  const navigate = useNavigate();
  const location = useLocation();
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const studentDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
        setIsStudentDropdownOpen(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('studentUser');
    sessionStorage.removeItem('companyUser');
    sessionStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsAdminDropdownOpen(false);
    setIsStudentDropdownOpen(false);
    setIsCompanyDropdownOpen(false);
    navigate('/');
    window.location.reload();
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    try {
      const cleanUrl = url.trim().replace(/\s+/g, '%20');
      return cleanUrl;
    } catch {
      return null;
    }
  };

  // Menu déroulant admin
  const AdminDropdown = () => {
    if (!isAdmin) return null;

    const admin = JSON.parse(sessionStorage.getItem('adminUser') || '{}');
    const email = admin?.email || '';
    const name = admin?.first_name || 'Super Admin';

    return (
      <div className="relative" ref={adminDropdownRef}>
        <button
          onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
            A
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isAdminDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex flex-col text-sm">
                <span className="font-semibold text-gray-900">{name}</span>
                <span className="text-gray-500 text-xs">{email}</span>
                <span className="text-xs text-gray-700 font-medium mt-1">Administrateur</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    );
  };

  // Menu déroulant étudiant
  const StudentDropdown = () => {
    const student = sessionStorage.getItem('studentUser');
    if (!student || isAdmin) return null;

    const userData = JSON.parse(student);
    const email = userData?.email || '';
    const name = userData?.first_name || '';
    const logoUrl = userData?.profile_picture_url || '';
    const cleanLogoUrl = getImageUrl(logoUrl);

    return (
      <div className="relative" ref={studentDropdownRef}>
        <button
          onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {cleanLogoUrl ? (
            <img
              src={cleanLogoUrl}
              alt={`Photo de profil de ${name}`}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold ${cleanLogoUrl ? 'hidden' : ''}`}>
            {name ? name[0].toUpperCase() : (email[0]?.toUpperCase() || 'E')}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isStudentDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isStudentDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex flex-col text-sm overflow-hidden">
                <span className="font-semibold text-gray-900 truncate">{name || 'Étudiant'}</span>
                <span className="text-gray-500 text-xs truncate">{email}</span>
                <span className="text-xs text-gray-700 font-medium mt-1">Étudiant</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    );
  };

  // Menu déroulant entreprise
  const CompanyDropdown = () => {
    const company = sessionStorage.getItem('companyUser');
    if (!company || isAdmin) return null;

    const userData = JSON.parse(company);
    const email = userData?.email || '';
    const name = userData?.companyName || '';
    const logoUrl = userData?.logo_url || '';
    const cleanLogoUrl = getImageUrl(logoUrl);

    return (
      <div className="relative" ref={companyDropdownRef}>
        <button
          onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {cleanLogoUrl ? (
            <img
              src={cleanLogoUrl}
              alt={`Logo de ${name}`}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold ${cleanLogoUrl ? 'hidden' : ''}`}>
            {name ? name[0].toUpperCase() : (email[0]?.toUpperCase() || 'E')}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isCompanyDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex flex-col text-sm overflow-hidden">
                <span className="font-semibold text-gray-900 truncate">{name || 'Entreprise'}</span>
                <span className="text-gray-500 text-xs truncate">{email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50 shadow-lg bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobTogo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`transition-all duration-300 px-4 py-2 rounded-xl font-medium ${location.pathname === '/' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
              Accueil
            </Link>
            <Link to="/jobs" className={`transition-all duration-300 px-4 py-2 rounded-xl font-medium ${location.pathname === '/jobs' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
              Offres
            </Link>
            <Link to="/entreprises" className={`transition-all duration-300 px-4 py-2 rounded-xl font-medium ${location.pathname === '/entreprises' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
              Entreprises
            </Link>
            <Link to="/contact" className={`transition-all duration-300 px-4 py-2 rounded-xl font-medium ${location.pathname === '/contact' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin-dashboard" className={`transition-colors px-3 py-1 rounded-md ${location.pathname === '/admin-dashboard' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-semibold'}`}>
                Dashboard Admin
              </Link>
            )}
            {isAuthenticated && !isAdmin && sessionStorage.getItem('studentUser') && (
              <Link to="/student-dashboard" className={`transition-colors px-3 py-1 rounded-md ${location.pathname === '/student-dashboard' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-semibold'}`}>
                Mon Dashboard
              </Link>
            )}
            {isAuthenticated && !isAdmin && sessionStorage.getItem('companyUser') && (
              <Link to="/company-dashboard" className={`transition-colors px-3 py-1 rounded-md ${location.pathname === '/company-dashboard' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-semibold'}`}>
                Dashboard Entreprise
              </Link>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          {!isAuthenticated && !isAdmin && (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/student-auth"
                className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                <User className="h-4 w-4" />
                <span>Étudiant</span>
              </Link>
              <Link
                to="/company-auth"
                className="flex items-center space-x-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                <Building className="h-4 w-4" />
                <span>Entreprise</span>
              </Link>
            </div>
          )}

          {/* User Info - Desktop */}
          {isAdmin && (
            <div className="hidden md:flex items-center">
              <AdminDropdown />
            </div>
          )}

          {isAuthenticated && !isAdmin && sessionStorage.getItem('studentUser') && (
            <div className="hidden md:flex items-center">
              <StudentDropdown />
            </div>
          )}

          {isAuthenticated && !isAdmin && sessionStorage.getItem('companyUser') && (
            <div className="hidden md:flex items-center">
              <CompanyDropdown />
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
                className={`px-3 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/jobs"
                className={`px-3 py-2 rounded-md transition-colors ${location.pathname === '/jobs' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Offres d'emploi
              </Link>
              <Link
                to="/entreprises"
                className={`px-3 py-2 rounded-md transition-colors ${location.pathname === '/entreprises' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Entreprises
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md transition-colors ${location.pathname === '/contact' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  className={`px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin-dashboard' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900 font-semibold'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard Admin
                </Link>
              )}
              {isAuthenticated && !isAdmin && sessionStorage.getItem('studentUser') && (
                <Link
                  to="/student-dashboard"
                  className={`px-3 py-2 rounded-md transition-colors ${location.pathname === '/student-dashboard' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900 font-semibold'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon Dashboard
                </Link>
              )}
              {isAuthenticated && !isAdmin && sessionStorage.getItem('companyUser') && (
                <Link
                  to="/company-dashboard"
                  className={`px-3 py-2 rounded-md transition-colors ${location.pathname === '/company-dashboard' ? 'text-gray-900 font-semibold bg-gray-100' : 'text-gray-700 hover:text-gray-900 font-semibold'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard Entreprise
                </Link>
              )}

              {!isAuthenticated && !isAdmin && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/student-auth"
                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Connexion Étudiant</span>
                  </Link>
                  <Link
                    to="/company-auth"
                    className="flex items-center space-x-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="h-4 w-4" />
                    <span>Connexion Entreprise</span>
                  </Link>
                </div>
              )}

              {/* Mobile Admin Info */}
              {isAdmin && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold text-gray-900">
                        {JSON.parse(sessionStorage.getItem('adminUser') || '{}')?.first_name || 'Super Admin'}
                      </span>
                      <span className="text-xs text-gray-700 font-medium">Administrateur</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              )}

              {/* Mobile Non-Admin User */}
              {isAuthenticated && !isAdmin && sessionStorage.getItem('studentUser') && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    {(() => {
                      const student = JSON.parse(sessionStorage.getItem('studentUser') || '{}');
                      const name = student?.first_name || '';
                      const email = student?.email || '';
                      const logoUrl = student?.profile_picture_url || '';
                      const cleanLogoUrl = getImageUrl(logoUrl);

                      return (
                        <>
                          {cleanLogoUrl ? (
                            <img
                              src={cleanLogoUrl}
                              alt={`Photo de profil de ${name}`}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold ${cleanLogoUrl ? 'hidden' : ''}`}>
                            {name ? name[0].toUpperCase() : (email[0]?.toUpperCase() || 'E')}
                          </div>
                          <div className="flex flex-col text-sm overflow-hidden max-w-[150px]">
                            <span className="font-semibold text-gray-900 truncate">{name || 'Étudiant'}</span>
                            {name && <span className="text-gray-500 text-xs truncate">{email}</span>}
                            <span className="text-xs text-gray-700 font-medium">Étudiant</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              )}

              {isAuthenticated && !isAdmin && sessionStorage.getItem('companyUser') && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    {(() => {
                      const company = JSON.parse(sessionStorage.getItem('companyUser') || '{}');
                      const name = company?.companyName || '';
                      const email = company?.email || '';
                      const logoUrl = company?.logo_url || '';
                      const cleanLogoUrl = getImageUrl(logoUrl);

                      return (
                        <>
                          {cleanLogoUrl ? (
                            <img
                              src={cleanLogoUrl}
                              alt={`Logo de ${name}`}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold ${cleanLogoUrl ? 'hidden' : ''}`}>
                            {name ? name[0].toUpperCase() : (email[0]?.toUpperCase() || 'E')}
                          </div>
                          <div className="flex flex-col text-sm overflow-hidden max-w-[150px]">
                            <span className="font-semibold text-gray-900 truncate">{name || 'Entreprise'}</span>
                            {name && <span className="text-gray-500 text-xs truncate">{email}</span>}
                            <span className="text-xs text-gray-700 font-medium">Entreprise</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
