import { useState } from 'react';
import { Shield, Lock, Mail, Sparkles } from 'lucide-react';
import { useToastContext } from '../contexts/ToastContext';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/login-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success && data.admin) {
      sessionStorage.setItem('adminUser', JSON.stringify(data.admin));
      showSuccess('Connexion admin réussie !');
      window.location.href = '/admin-dashboard';
    } else {
      showError(data.error || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white/80 text-sm font-medium">Accès restreint</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="rounded-3xl p-8 border border-white/20 shadow-2xl backdrop-blur-xl bg-white/10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="h-10 w-10 text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Super Admin</h2>
            <p className="text-white/60 text-sm">Accès réservé à l'administrateur</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="email"
                placeholder="Adresse email admin"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="password"
                placeholder="Mot de passe admin"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full mt-6 bg-white text-gray-900 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                Connexion...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Se connecter
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-white/40 text-sm mt-6">
          Espace sécurisé • JobTogo Admin
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
