import { Sparkles, Users, Shield, Zap, Heart, Mail, Phone, Target, Briefcase, GraduationCap, Building } from 'lucide-react';

const EnSavoirPlusPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    {/* Hero Section */}
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-black">
      <div className="max-w-5xl mx-auto px-4 py-20 relative">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Votre avenir commence ici</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            En savoir plus sur <span className="text-white/80">JobTogo</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            La plateforme de référence pour connecter les étudiants et jeunes diplômés togolais 
            avec les meilleures opportunités d'emploi, de stage et d'alternance.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 -mt-8 relative z-10">
      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Offres Vérifiées</h3>
          <p className="text-gray-600">
            Accédez à des offres d'emploi et de stage vérifiées, publiées par des entreprises locales et internationales.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Target className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Accompagnement Personnalisé</h3>
          <p className="text-gray-600">
            Bénéficiez de recommandations et de conseils pour booster votre carrière et atteindre vos objectifs.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Espace Sécurisé</h3>
          <p className="text-gray-600">
            Profitez d'un espace sécurisé pour gérer vos candidatures, votre CV et suivre vos opportunités.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Building className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Pour les Entreprises</h3>
          <p className="text-gray-600">
            Les entreprises peuvent publier des offres, gérer leurs recrutements et découvrir les meilleurs talents togolais.
          </p>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-sm mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Pourquoi choisir <span className="text-gray-700">JobTogo</span> ?
          </h2>
          <p className="text-gray-600">Les avantages qui font la différence</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: 'Interface Moderne', desc: 'Simple, rapide et intuitive' },
            { icon: GraduationCap, title: 'Gestion Dynamique', desc: 'Candidatures et profils' },
            { icon: Target, title: 'Statistiques', desc: 'Recommandations intelligentes' },
            { icon: Heart, title: 'Support Réactif', desc: 'Communauté engagée' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Une question ?</h2>
        <p className="text-gray-600 mb-6">Notre équipe est là pour vous accompagner</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="mailto:matchamegnatikevin894@gmail.com" 
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
          >
            <Mail className="h-5 w-5" />
            Nous contacter
          </a>
          <a 
            href="tel:+22870472436" 
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            <Phone className="h-5 w-5" />
            +228 70 47 24 36
          </a>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Ou appelez-nous au <span className="font-medium">+228 96 73 22 47</span>
        </p>
      </div>
    </div>
  </div>
);

export default EnSavoirPlusPage;
