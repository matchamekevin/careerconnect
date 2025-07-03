import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Review {
  id: number;
  user_id: string;
  type: string;
  content: string;
  parent_id: number | null;
  created_at: string;
}

const AvisPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [content, setContent] = useState('');
  const [type, setType] = useState('avis');
  const [parentId, setParentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await axios.get('/api/reviews');
    setReviews(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/reviews', {
      user_id: '00000000-0000-0000-0000-000000000000', // à remplacer par l'ID utilisateur réel
      type,
      content,
      parent_id: parentId,
    });
    setContent('');
    setType('avis');
    setParentId(null);
    await fetchReviews(); // Rafraîchir la liste juste après l'envoi
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Avis, questions & réponses</h1>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
        <textarea
          className="border rounded-lg p-3"
          placeholder="Laissez un avis, une question..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <select value={type} onChange={e => setType(e.target.value)} className="border rounded-lg p-2 w-48">
          <option value="avis">Avis</option>
          <option value="question">Question</option>
        </select>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">Envoyer</button>
      </form>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <ul className="space-y-4">
          {reviews.filter(r => !r.parent_id).map(r => (
            <li key={r.id} className="bg-white rounded-lg shadow p-4">
              <div className="font-semibold mb-2">
                {r.type === 'avis' ? 'Avis' : 'Question'}
                {r.user_id && (
                  <span className="ml-2 text-xs text-gray-500">par {r.user_id === '00000000-0000-0000-0000-000000000000' ? 'Test User' : r.user_id}</span>
                )}
              </div>
              <div className="mb-2">{r.content}</div>
              <div className="text-xs text-gray-500 mb-2">Posté le {new Date(r.created_at).toLocaleString()}</div>
              <button onClick={() => setParentId(r.id)} className="text-blue-700 underline text-sm">Répondre</button>
              {/* Afficher les réponses */}
              <ul className="ml-6 mt-2 space-y-2">
                {reviews.filter(rep => rep.parent_id === r.id).map(rep => (
                  <li key={rep.id} className="bg-blue-50 rounded p-2">
                    <div className="text-sm">{rep.content}</div>
                    <div className="text-xs text-gray-400">Réponse le {new Date(rep.created_at).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvisPage;
