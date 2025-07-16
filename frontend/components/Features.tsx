import React from 'react';
import { User, Building, Shield, Smartphone, Clock, Star } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: User,
      title: 'Profil Étudiant Complet',
      description: 'Créez un profil détaillé avec vos compétences, formations et expériences pour attirer les recruteurs.'
    },
    {
      icon: Building,
      title: 'Entreprises Vérifiées',
      description: 'Toutes nos entreprises partenaires sont vérifiées pour garantir des opportunités légitimes.'
    },
    {
      icon: Shield,
      title: 'Données Sécurisées',
      description: 'Vos informations personnelles sont protégées avec les plus hauts standards de sécurité.'
    },
    {
      icon: Smartphone,
      title: 'Optimisé Mobile',
      description: 'Accédez à toutes les fonctionnalités depuis votre smartphone, même avec une connexion lente.'
    },
    {
      icon: Clock,
      title: 'Notifications Temps Réel',
      description: 'Recevez des alertes instantanées pour les nouvelles offres correspondant à votre profil.'
    },
    {
      icon: Star,
      title: 'Correspondance Intelligente',
      description: 'Notre algorithme vous propose automatiquement les offres les plus pertinentes.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir JobTogo Étudiant ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une plateforme conçue spécifiquement pour répondre aux besoins des étudiants et des entreprises togolaises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Fin de la section communauté supprimée */}
    </section>
  );
};

export default Features;