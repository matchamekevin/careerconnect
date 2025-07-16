import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingPage from './components/LoadingPage';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import StudentAuth from './pages/StudentAuth';
import CompanyAuth from './pages/CompanyAuth';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import ContactPage from './pages/ContactPage';
import EntreprisesPage from './pages/EntreprisesPage';
import AdminDashboard from './pages/AdminDashboard';
import EnSavoirPlusPage from './pages/EnSavoirPlusPage';
import AvisPage from './pages/AvisPage';
import PrivateRoute from './components/PrivateRoute';
import AdminAuth from './pages/AdminAuth';
import AdminPrivateRoute from './components/AdminPrivateRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, hideToast } = useToast();

  useEffect(() => {
    // Simuler le chargement initial de l'application
    const initializeApp = async () => {
      try {
        // Vérifier les sessions existantes
        // Vérification de sessionStorage pour étudiants, entreprises ou admin (non utilisé directement ici)

        // Simuler un délai de chargement (minimum 2.5s pour voir l'animation plus longtemps)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Initialisation terminée

        // Petit délai pour la transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        // Même en cas d'erreur, on cache le loading
        setTimeout(() => {
          setIsLoading(false);
        }, 2500);
      }
    };

    initializeApp();
  }, []);

  // Afficher la page de loading pendant l'initialisation
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1 bg-white">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/student-auth" element={<StudentAuth />} />
              <Route path="/company-auth" element={<CompanyAuth />} />
              <Route path="/student-dashboard" element={
                <PrivateRoute allowedFor="student">
                  <StudentDashboard />
                </PrivateRoute>
              } />
              <Route path="/company-dashboard" element={
                <PrivateRoute allowedFor="company">
                  <CompanyDashboard />
                </PrivateRoute>
              } />
              <Route path="/entreprises" element={<EntreprisesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin-dashboard" element={
                <AdminPrivateRoute>
                  <AdminDashboard />
                </AdminPrivateRoute>
              } />
              <Route path="/en-savoir-plus" element={<EnSavoirPlusPage />} />
              <Route path="/avis" element={<AvisPage />} />
              <Route path="/admin-auth" element={<AdminAuth />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />

          {/* Toast notifications */}
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              isVisible={toast.isVisible}
              onClose={() => hideToast(toast.id)}
            />
          ))}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;