import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Building className="h-6 w-6 text-gray-900" />
              </div>
              <span className="text-2xl font-bold">JobTogo</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              La plateforme de référence pour connecter les étudiants togolais avec les meilleures opportunités d'emploi et de stage.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>Lomé, Togo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-white rounded"></span>
              Liens rapides
            </h3>
            <ul className="space-y-4">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/jobs', label: 'Offres d\'emploi' },
                { to: '/student-auth', label: 'Espace Étudiant' },
                { to: '/company-auth', label: 'Espace Entreprise' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-white rounded"></span>
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <span className="text-gray-400 text-sm">matchamegnatikevin894@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-col text-gray-400 text-sm">
                  <span>+228 70 47 24 36</span>
                  <span>+228 96 73 22 47</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1">
              © 2025 JobTogo. Fait avec <Heart className="h-4 w-4 text-gray-400 fill-gray-400" /> au Togo
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link to="/en-savoir-plus" className="hover:text-white transition-colors">À propos</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/avis" className="hover:text-white transition-colors">Avis</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
