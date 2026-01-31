import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircle, ThumbsUp, Reply, Star, User, Clock, Send, Filter, Sparkles, Heart, HelpCircle } from 'lucide-react';
import { useToastContext } from '../contexts/ToastContext';

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
  const [submitLoading, setSubmitLoading] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reviews');
      const list = res.data?.reviews;
      if (Array.isArray(list)) {
        setReviews(list);
        const likesData: { [key: number]: number } = {};
        list.forEach((review: Review, index: number) => {
          likesData[review.id] = Math.floor(Math.random() * 10) + index;
        });
        setLikes(likesData);
      } else {
        console.error('Format de données incorrect:', res.data);
        showError('Erreur lors du chargement des avis');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      showError('Impossible de charger les avis');
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
        showSuccess('Message publié avec succès !');
        await fetchReviews();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      showError('Impossible d\'envoyer votre message');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 py-16 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Votre avis compte</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              Avis & Questions
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Partagez votre expérience avec la communauté JobTogo
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => !r.parent_id).length}</p>
                  <p className="text-xs text-gray-500">Messages</p>
                </div>
              </div>
              <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.type === 'avis' && !r.parent_id).length}</p>
                  <p className="text-xs text-gray-500">Avis</p>
                </div>
              </div>
              <div className="glass rounded-xl px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.type === 'question' && !r.parent_id).length}</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4 -mt-8 relative z-10">
        {/* Filter buttons */}
        <div className="glass rounded-2xl p-4 mb-6 border border-white/50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Filtrer :</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                Tout
              </button>
              <button
                onClick={() => setFilter('avis')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${filter === 'avis'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                <Heart className="h-4 w-4" /> Avis
              </button>
              <button
                onClick={() => setFilter('questions')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${filter === 'questions'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                <HelpCircle className="h-4 w-4" /> Questions
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 mb-8 border border-white/50">
          {replyingTo && (
            <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-indigo-700 text-sm font-medium flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  Réponse à un message
                </span>
                <button
                  onClick={cancelReply}
                  className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full border-0 bg-white/80 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 resize-none text-sm shadow-sm"
                  placeholder={replyingTo ? "Écrivez votre réponse..." : "Partagez votre avis ou posez une question..."}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pl-16">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="border-0 bg-white/80 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
                disabled={replyingTo !== null}
              >
                <option value="avis">💚 Avis</option>
                <option value="question">🧡 Question</option>
              </select>

              <button
                type="submit"
                disabled={!content.trim() || submitLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/50 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border border-white/50">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucun {filter === 'avis' ? 'avis' : filter === 'questions' ? 'question' : 'contenu'} pour le moment
                </h3>
                <p className="text-gray-500 text-sm">
                  Soyez le premier à partager votre expérience !
                </p>
              </div>
            ) : (
              filteredReviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className="glass rounded-2xl border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Review Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          review.type === 'avis' 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30' 
                            : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30'
                        }`}>
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {getUserName(review.user_id)}
                            </span>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${review.type === 'avis'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                              }`}>
                              {review.type === 'avis' ? '💚 Avis' : '🧡 Question'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4" />
                            {getTimeAgo(review.created_at)}
                          </div>
                        </div>
                      </div>

                      {review.type === 'avis' && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= (Math.floor(Math.random() * 5) + 1)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="px-5 pb-5">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {review.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleLike(review.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors text-sm group"
                      >
                        <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span>{likes[review.id] || 0}</span>
                      </button>

                      <button
                        onClick={() => handleReply(review.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors text-sm group"
                      >
                        <Reply className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span>Répondre</span>
                      </button>
                    </div>
                  </div>

                  {/* Replies */}
                  {reviews.filter(rep => rep.parent_id === review.id).length > 0 && (
                    <div className="bg-gray-50/80 border-t border-gray-100 px-5 py-4">
                      <h4 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2">
                        <Reply className="h-3 w-3" />
                        {reviews.filter(rep => rep.parent_id === review.id).length} réponse(s)
                      </h4>
                      <div className="space-y-3">
                        {reviews.filter(rep => rep.parent_id === review.id).map(reply => (
                          <div key={reply.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900 text-sm">
                                    {getUserName(reply.user_id)}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {getTimeAgo(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
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