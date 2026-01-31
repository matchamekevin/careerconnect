import { TrendingUp, Users, Building, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Stats = () => {
  const stats = [
    { icon: Users, number: '2,500+', label: 'Étudiants inscrits', growth: '+25%' },
    { icon: Building, number: '350+', label: 'Entreprises', growth: '+15%' },
    { icon: CheckCircle, number: '1,800+', label: 'Placements', growth: '+30%' },
    { icon: TrendingUp, number: '95%', label: 'Satisfaction', growth: 'Stable' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gray-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-white/20">
            <Star className="h-4 w-4 text-white" />
            Nos résultats
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Des résultats qui <span className="text-gray-300">parlent</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            JobTogo transforme l'avenir professionnel des jeunes togolais
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <stat.icon className="h-7 w-7 text-gray-900" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
              <div className="text-white/70 mb-2">{stat.label}</div>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
                <TrendingUp className="h-3 w-3" />
                {stat.growth}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Rejoignez la communauté JobTogo</h3>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Que vous soyez étudiant ou entreprise, JobTogo vous connecte avec les bonnes personnes au bon moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/student-auth"
              className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5 transition-transform" />
            </Link>
            <Link
              to="/en-savoir-plus"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
