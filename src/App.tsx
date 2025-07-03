import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
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
      </div>
    </Router>
  );
}

export default App;