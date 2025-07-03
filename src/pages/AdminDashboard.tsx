import React, { useEffect, useState } from 'react';
import { UserCircle, Trash2, CheckCircle2, Clock, Mail } from 'lucide-react';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState<{ companies?: number; jobs?: number; students?: number }>({});
  const [connectedCompanies, setConnectedCompanies] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    salary: '',
    tags: '',
    company_id: ''
  });
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState('');

  useEffect(() => {
    setLoadingStats(true);
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(e => {
        setError(e.message);
        setLoadingStats(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        console.log('companies:', data);
        setCompanies(data);
      })
      .catch(e => setError(e.message));
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        console.log('jobs:', data);
        setJobs(data);
      })
      .catch(e => setError(e.message));
    fetch('/api/companies/connected')
      .then(res => res.json())
      .then(setConnectedCompanies)
      .catch(e => setError(e.message));
  }, []);

  if (error) {
    return <div className="p-8 text-red-600">Erreur : {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-0">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header admin */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-700 text-white rounded-full p-3 shadow-lg">
            <UserCircle className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-1">Dashboard Super Admin</h1>
            <p className="text-gray-600">Vue d’ensemble et gestion globale de la plateforme</p>
          </div>
        </div>
        {/* Stats cards reliées à la base */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-blue-600">
            <span className="text-xl font-bold text-blue-700 mb-1">
              Entreprises : {loadingStats ? <span className="animate-pulse text-gray-400">...</span> : stats.companies}
            </span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-blue-600">
            <span className="text-xl font-bold text-blue-700 mb-1">
              Offres : {loadingStats ? <span className="animate-pulse text-gray-400">...</span> : stats.jobs}
            </span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center border-t-4 border-blue-600">
            <span className="text-xl font-bold text-blue-700 mb-1">
              Étudiants : {loadingStats ? <span className="animate-pulse text-gray-400">...</span> : stats.students}
            </span>
          </div>
        </div>
        {/* Cadre actions admin */}
        <div className="bg-white rounded-xl shadow border border-blue-100 p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-wrap gap-4 w-full justify-start">
            <button onClick={() => setShowJobModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Publier une offre</button>
            {/* D'autres boutons d'action admin peuvent être ajoutés ici */}
          </div>
        </div>
        {/* Bloc principal : tableau entreprises à gauche, suggestions à droite */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Table entreprises */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Entreprises connectées</h2>
            <div className="overflow-x-auto mb-6 md:mb-0">
              <table className="w-full bg-white rounded-xl shadow border border-gray-200 text-sm">
                <thead className="bg-blue-50 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3 rounded-tl-xl">Logo</th>
                    <th className="py-3">Nom</th>
                    <th className="py-3">Secteur</th>
                    <th className="py-3">Offres</th>
                    <th className="py-3">Statut</th>
                    <th className="py-3 rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-gray-500 py-4">Aucune entreprise trouvée.</td></tr>
                  )}
                  {companies.map((c: any, idx: number) => (
                    <tr key={c.id} className={"transition hover:bg-blue-50 border-b border-gray-100 " + (idx === companies.length-1 ? "last:rounded-b-xl" : "")}> 
                      <td className="py-2 px-3">{c.logo_url ? <img src={c.logo_url} alt="Logo" className="w-10 h-10 rounded-full border" /> : <UserCircle className="h-8 w-8 text-gray-300" />}</td>
                      <td className="font-semibold text-blue-900">{c.name || <span className="text-gray-400">—</span>}</td>
                      <td>{c.sector || <span className="text-gray-400">—</span>}</td>
                      <td className="text-center">{c.job_count ?? 0}</td>
                      <td>
                        <span className={c.status === 'validated' ? 'inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold' : 'inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold'}>
                          {c.status === 'validated' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {c.status === 'validated' ? 'Validée' : 'En attente'}
                        </span>
                      </td>
                      <td className="flex gap-2 py-2">
                        <button className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded transition" title="Supprimer"><Trash2 className="w-4 h-4" />Supprimer</button>
                        {c.status !== 'validated' && (
                          <button className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded transition" title="Valider" onClick={async () => {
                            await fetch(`/api/companies/${c.id}/status`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'validated' })
                            });
                            fetch('/api/companies').then(res => res.json()).then(setCompanies);
                          }}><CheckCircle2 className="w-4 h-4" />Valider</button>
                        )}
                        {c.status === 'validated' && (
                          <button className="flex items-center gap-1 text-yellow-600 hover:bg-yellow-50 px-2 py-1 rounded transition" title="Mettre en attente" onClick={async () => {
                            await fetch(`/api/companies/${c.id}/status`, {
                              method: 'PATCH',
                              body: JSON.stringify({ status: 'pending' })
                            });
                            fetch('/api/companies').then(res => res.json()).then(setCompanies);
                          }}><Clock className="w-4 h-4" />Mettre en attente</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Section messages de suggestion */}
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2"><Mail className="w-6 h-6 text-blue-600" /> Suggestions reçues</h2>
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 min-h-[120px]">
              <div className="text-gray-500 italic">Aucun message pour le moment.</div>
              {/* Pour afficher les messages, remplacer ci-dessus par un .map sur un tableau de messages */}
            </div>
          </div>
        </div>
        {/* Tableau des offres en dessous sur toute la largeur */}
        <div className="overflow-x-auto mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-800">Offres d'emploi</h2>
          </div>
          <table className="w-full bg-white rounded-xl shadow border border-gray-200 text-sm">
            <thead className="bg-blue-50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 min-w-[140px] rounded-tl-xl text-left">Titre</th>
                <th className="py-3 px-4 min-w-[120px] text-left">Entreprise</th>
                <th className="py-3 px-4 min-w-[100px] text-left">Lieu</th>
                <th className="py-3 px-4 min-w-[110px] text-left">Date</th>
                <th className="py-3 px-4 min-w-[110px] text-left">Statut</th>
                <th className="py-3 px-4 min-w-[160px] rounded-tr-xl text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-500 py-4">Aucune offre trouvée.</td></tr>
              )}
              {jobs.map((j: any, idx: number) => (
                <tr key={j.id} className={"transition hover:bg-blue-50 border-b border-gray-100 " + (idx === jobs.length-1 ? "last:rounded-b-xl" : "")}> 
                  <td className="font-semibold text-blue-900 py-2 px-4 align-middle">{j.title || <span className="text-gray-400">—</span>}</td>
                  <td className="py-2 px-4 align-middle">{j.company || <span className="text-gray-400">—</span>}</td>
                  <td className="py-2 px-4 align-middle">{j.location || <span className="text-gray-400">—</span>}</td>
                  <td className="py-2 px-4 align-middle">{j.posted_at ? j.posted_at.slice(0,10) : <span className="text-gray-400">—</span>}</td>
                  <td className="py-2 px-4 align-middle">
                    <span className={j.status === 'validated' ? 'inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold' : 'inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold'}>
                      {j.status === 'validated' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {j.status === 'validated' ? 'Validée' : 'En attente'}
                    </span>
                  </td>
                  <td className="flex gap-2 py-2 px-4 align-middle">
                    <button className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded transition" title="Supprimer"><Trash2 className="w-4 h-4" />Supprimer</button>
                    {j.status !== 'validated' && (
                      <button className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded transition" title="Valider" onClick={async () => {
                        await fetch(`/api/jobs/${j.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'validated' })
                        });
                        fetch('/api/jobs').then(res => res.json()).then(setJobs);
                      }}><CheckCircle2 className="w-4 h-4" />Valider</button>
                    )}
                    {j.status === 'validated' && (
                      <button className="flex items-center gap-1 text-yellow-600 hover:bg-yellow-50 px-2 py-1 rounded transition" title="Mettre en attente" onClick={async () => {
                        await fetch(`/api/jobs/${j.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'pending' })
                        });
                        fetch('/api/jobs').then(res => res.json()).then(setJobs);
                      }}><Clock className="w-4 h-4" />Mettre en attente</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal publication job */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={() => setShowJobModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl">×</button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Publier une nouvelle offre</h3>
            {jobError && <div className="text-red-600 mb-2 text-sm">{jobError}</div>}
            <form onSubmit={async e => {
              e.preventDefault();
              setJobLoading(true);
              setJobError('');
              if (!newJob.title || !newJob.company_id) {
                setJobError('Titre et entreprise obligatoires');
                setJobLoading(false);
                return;
              }
              try {
                const res = await fetch('/api/jobs', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...newJob,
                    tags: newJob.tags.split(',').map(t => t.trim()),
                    salary: newJob.salary || null
                  })
                });
                if (!res.ok) throw new Error('Erreur lors de la publication');
                setShowJobModal(false);
                setNewJob({ title: '', description: '', location: '', type: '', salary: '', tags: '', company_id: '' });
                fetch('/api/jobs').then(res => res.json()).then(setJobs);
              } catch (err) {
                setJobError('Erreur lors de la publication');
              }
              setJobLoading(false);
            }} className="flex flex-col gap-3">
              <input className="border rounded px-3 py-2" placeholder="Titre" value={newJob.title} onChange={e => setNewJob(j => ({ ...j, title: e.target.value }))} required />
              <textarea className="border rounded px-3 py-2" placeholder="Description" value={newJob.description} onChange={e => setNewJob(j => ({ ...j, description: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Lieu" value={newJob.location} onChange={e => setNewJob(j => ({ ...j, location: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Type (CDI, Stage...)" value={newJob.type} onChange={e => setNewJob(j => ({ ...j, type: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Salaire (€)" value={newJob.salary} onChange={e => setNewJob(j => ({ ...j, salary: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Tags (séparés par virgule)" value={newJob.tags} onChange={e => setNewJob(j => ({ ...j, tags: e.target.value }))} />
              <select className="border rounded px-3 py-2" value={newJob.company_id} onChange={e => setNewJob(j => ({ ...j, company_id: e.target.value }))} required>
                <option value="">Sélectionner une entreprise</option>
                {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={jobLoading}>{jobLoading ? 'Publication...' : 'Publier'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
