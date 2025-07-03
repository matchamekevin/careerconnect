import React from 'react';
import { TrendingUp, Users, Building, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Stats = () => {
  const stats = [
    {
      icon: Users,
      number: '2,500+',
      label: 'Étudiants inscrits',
      growth: '+25% ce mois'
    },
    {
      icon: Building,
      number: '350+',
      label: 'Entreprises partenaires',
      growth: '+15% ce mois'
    },
    {
      icon: CheckCircle,
      number: '1,800+',
      label: 'Placements réussis',
      growth: '+30% ce mois'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Taux de satisfaction',
      growth: 'Stable'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Des résultats qui parlent
          </h2>
          <p className="text-xl text-blue-100">
            JobTogo Étudiant transforme l'avenir professionnel des jeunes togolais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg mb-2">{stat.label}</div>
              <div className="text-sm text-blue-200">{stat.growth}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white bg-opacity-10 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Rejoignez la communauté JobTogo</h3>
            <p className="text-lg text-blue-100 mb-6">
              Que vous soyez étudiant à la recherche d'opportunités ou entreprise cherchant des talents, 
              JobTogo Étudiant vous connecte avec les bonnes personnes au bon moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/avis"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Commencer maintenant
              </Link>
              <Link
                to="/en-savoir-plus"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-900 transition-colors font-semibold"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;