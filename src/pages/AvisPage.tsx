import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircle, ThumbsUp, Reply, Star, User, Clock, Send, Filter } from 'lucide-react';

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
  const [filter, setFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/reviews');
      if (res.data && res.data.reviews && Array.isArray(res.data.reviews)) {
        setReviews(res.data.reviews);
        // Simuler des likes aléatoirement
        const likesData: { [key: number]: number } = {};
        res.data.reviews.forEach((review: Review) => {
          likesData[review.id] = Math.floor(Math.random() * 10);
        });
        setLikes(likesData);
      } else {
        console.error('Format de données incorrect:', res.data);
        setError('Erreur lors du chargement des avis');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      setError('Impossible de charger les avis. Veuillez réessayer.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitLoading(true);
    setError(null);

    try {
      const payload = {
        user_id: '00000000-0000-0000-0000-000000000000',
        type,
        content: content.trim(),
        parent_id: parentId,
        user_name: 'Utilisateur anonyme',
        user_email: 'anonymous@example.com'
      };

      const response = await axios.post('/api/reviews', payload);

      if (response.data) {
        setContent('');
        setType('avis');
        setParentId(null);
        setReplyingTo(null);
        await fetchReviews();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setError('Impossible d\'envoyer votre message. Veuillez réessayer.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReply = (reviewId: number) => {
    setReplyingTo(reviewId);
    setParentId(reviewId);
    setType('question');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setParentId(null);
    setType('avis');
  };

  const handleLike = (reviewId: number) => {
    setLikes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  const filteredReviews = reviews.filter(review => {
    if (!review.parent_id) {
      if (filter === 'avis') return review.type === 'avis';
      if (filter === 'questions') return review.type === 'question';
      return true;
    }
    return false;
  });

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString();
  };

  const getUserName = (userId: string) => {
    if (userId === '00000000-0000-0000-0000-000000000000') return 'Utilisateur anonyme';
    return `Utilisateur ${userId.slice(0, 8)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <MessageCircle className="h-10 w-10" />
            Avis & Questions
          </h1>
          <p className="text-blue-100 text-lg">
            Partagez votre expérience et posez vos questions à la communauté JobTogo
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 text-red-600">⚠️</div>
              <div className="text-red-800 font-medium">{error}</div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Filter buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filtrer par :</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Tout
            </button>
            <button
              onClick={() => setFilter('avis')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'avis'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Avis
            </button>
            <button
              onClick={() => setFilter('questions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'questions'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Questions
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {replyingTo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">
                  Réponse à un message
                </span>
                <button
                  onClick={cancelReply}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={replyingTo ? "Écrivez votre réponse..." : "Partagez votre avis ou posez une question..."}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={replyingTo !== null}
                >
                  <option value="avis">📝 Avis</option>
                  <option value="question">❓ Question</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!content.trim() || submitLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {replyingTo ? 'Répondre' : 'Publier'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        {/* Reviews List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Aucun {filter === 'avis' ? 'avis' : filter === 'questions' ? 'question' : 'contenu'} pour le moment
                </h3>
                <p className="text-gray-500">
                  Soyez le premier à partager votre expérience !
                </p>
              </div>
            ) : (
              filteredReviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Review Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {getUserName(review.user_id)}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${review.type === 'avis'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700'
                              }`}>
                              {review.type === 'avis' ? '📝 Avis' : '❓ Question'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4" />
                            {getTimeAgo(review.created_at)}
                          </div>
                        </div>
                      </div>

                      {review.type === 'avis' && (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= (Math.floor(Math.random() * 5) + 1)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-6">
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {review.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(review.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">{likes[review.id] || 0}</span>
                      </button>

                      <button
                        onClick={() => handleReply(review.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors"
                      >
                        <Reply className="h-4 w-4" />
                        <span className="text-sm">Répondre</span>
                      </button>
                    </div>
                  </div>

                  {/* Replies */}
                  {reviews.filter(rep => rep.parent_id === review.id).length > 0 && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      <div className="p-6">
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <Reply className="h-4 w-4" />
                          Réponses ({reviews.filter(rep => rep.parent_id === review.id).length})
                        </h4>
                        <div className="space-y-4">
                          {reviews.filter(rep => rep.parent_id === review.id).map(reply => (
                            <div key={reply.id} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-gray-900 text-sm">
                                      {getUserName(reply.user_id)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {getTimeAgo(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvisPage;
