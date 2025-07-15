import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
              <span className="text-xl font-bold">JobTogo Étudiant</span>
            </div>
            <p className="text-gray-300 mb-4">
              La plateforme de référence pour connecter les étudiants togolais avec les meilleures opportunités d'emploi et de stage.
            </p>
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="h-4 w-4" />
              <span>Lomé, Togo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">
                  Offres d'emploi
                </Link>
              </li>
              <li>
                <Link to="/student-auth" className="text-gray-300 hover:text-white transition-colors">
                  Espace Étudiant
                </Link>
              </li>
              <li>
                <Link to="/company-auth" className="text-gray-300 hover:text-white transition-colors">
                  Espace Entreprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-gray-300">matchamegnatikevin894@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-gray-300">+228 70 47 24 36</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-gray-300">+228 96 73 22 47</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 JobTogo Étudiant. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;