import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      window.location.href = '/admin-dashboard'; // force reload pour header
    } else {
      setError(data.error || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <UserCircle className="h-16 w-16 text-blue-700 mb-2" />
          <h2 className="text-2xl font-bold text-blue-800 mb-1">Connexion Super Admin</h2>
          <p className="text-gray-500 text-sm">Accès réservé à l’administrateur</p>
        </div>
        {error && <div className="mb-4 text-red-600 text-center font-semibold bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <input
          type="email"
          placeholder="Adresse email admin"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Mot de passe admin"
          className="w-full mb-6 px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold text-lg shadow"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default AdminAuth;
