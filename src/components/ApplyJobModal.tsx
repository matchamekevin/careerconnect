import React, { useState } from 'react';

interface ApplyJobModalProps {
  jobId: number;
  onClose: () => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ jobId, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [message, setMessage] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!cv) {
      setMessage('Veuillez sélectionner un CV au format PDF.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('job_id', jobId.toString());
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('cv', cv);
    const res = await fetch('/api/apply', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setMessage('Candidature envoyée !');
      setTimeout(onClose, 1500);
    } else {
      setMessage(data.error || 'Erreur lors de la candidature');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Postuler à cette offre</h2>
        {message && <div className="mb-2 text-center text-green-600">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required placeholder="Votre email" className="w-full border px-3 py-2 rounded" value={email} onChange={e => setEmail(e.target.value)} pattern="^[\w-.]+@([\w-]+\.)+[\w-]{2,}$" />
          <input type="tel" required placeholder="Numéro de téléphone (+228 xx xx xx xx)" className="w-full border px-3 py-2 rounded" value={phone} onChange={e => setPhone(e.target.value)} pattern="^\+228\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$" />
          <input type="file" accept="application/pdf" required className="w-full" onChange={e => setCv(e.target.files?.[0] || null)} />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer la candidature'}</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
