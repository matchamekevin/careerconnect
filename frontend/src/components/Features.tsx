import { User, Building, Shield, Smartphone, Clock, Star, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: User,
      title: 'Profil Complet',
      description: 'Créez un profil détaillé avec vos compétences et expériences.',
    },
    {
      icon: Building,
      title: 'Entreprises Vérifiées',
      description: 'Toutes nos entreprises sont vérifiées pour votre sécurité.',
    },
    {
      icon: Shield,
      title: 'Données Sécurisées',
      description: 'Protection de vos informations avec les meilleurs standards.',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Accédez à toutes les fonctionnalités depuis votre mobile.',
    },
    {
      icon: Clock,
      title: 'Temps Réel',
      description: 'Notifications instantanées pour les nouvelles offres.',
    },
    {
      icon: Star,
      title: 'Matching Intelligent',
      description: 'Algorithme qui vous propose les offres pertinentes.',
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Pourquoi choisir <span className="text-gray-600">JobTogo</span> ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une plateforme moderne conçue pour les talents togolais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
