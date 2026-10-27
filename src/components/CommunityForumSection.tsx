import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  ShieldCheck, 
  Plus, 
  X, 
  Search, 
  User,
  Sparkles
} from 'lucide-react';

export const CommunityForumSection: React.FC = () => {
  const { t, showToast } = useApp();
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [showAskModal, setShowAskModal] = useState<boolean>(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    cropCategory: 'Wheat',
    tags: 'Wheat, Fertilizer, Advice',
  });

  const fetchPosts = async () => {
    try {
      const res = await api.getForumPosts({
        category: category !== 'all' ? category : undefined,
        search: search.trim() || undefined,
      });
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (e) {
      console.warn('Failed to load forum posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category, search]);

  const handleLike = async (postId: string) => {
    try {
      const res = await api.toggleLike(postId);
      if (res.data.success) {
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p));
      }
    } catch (e) {
      showToast('Error liking post', 'error');
    }
  };

  const handleAddReply = async (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.addComment(postId, { content: text.trim() });
      if (res.data.success) {
        showToast('Reply added to discussion', 'success');
        setReplyTextMap(prev => ({ ...prev, [postId]: '' }));
        fetchPosts();
      }
    } catch (e) {
      showToast('Error posting reply', 'error');
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.content) {
      showToast('Title and question details are required', 'error');
      return;
    }

    try {
      const tagsArray = newQuestion.tags.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.createForumPost({
        title: newQuestion.title,
        content: newQuestion.content,
        cropCategory: newQuestion.cropCategory,
        tags: tagsArray,
      });

      if (res.data.success) {
        showToast('Question posted to Kisan Chopal!', 'success');
        setShowAskModal(false);
        setNewQuestion({ title: '', content: '', cropCategory: 'Wheat', tags: '' });
        fetchPosts();
      }
    } catch (e) {
      showToast('Error posting question', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t.forum.title}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t.forum.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farm questions..."
              className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={() => setShowAskModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t.forum.askQuestion}</span>
          </button>
        </div>
      </div>

      {/* Posts Thread */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm"
          >
            {/* Author Lockup */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  {post.authorName?.[0] || 'K'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {post.authorName}
                    </span>
                    {post.authorRole === 'expert' || post.authorRole === 'admin' ? (
                      <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Agronomist</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-medium">
                        Farmer · {post.authorRegion || 'India'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-neutral-400 font-mono">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Post Title & Content */}
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
              {post.title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
              {post.content}
            </p>

            {/* Tags & Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-wrap gap-1">
                {post.tags?.map((tag: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono tabular-nums">{post.likes}</span>
                </button>
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-mono tabular-nums">{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Replies Thread */}
            {post.comments?.length > 0 && (
              <div className="mt-4 space-y-3 pt-2">
                {post.comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-xl text-xs ${
                      comment.isExpert
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50'
                        : 'bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        {comment.isExpert && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                            Verified Agronomist
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Write Reply Input */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Share your practical advice or experience..."
                value={replyTextMap[post._id] || ''}
                onChange={(e) => setReplyTextMap({ ...replyTextMap, [post._id]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post._id)}
                className="flex-1 text-xs py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleAddReply(post._id)}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                title="Send Reply"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {t.forum.askQuestion}
              </h3>
              <button onClick={() => setShowAskModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Question Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best method for preventing leaf curling in tomato?"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Crop Category
                </label>
                <select
                  value={newQuestion.cropCategory}
                  onChange={(e) => setNewQuestion({ ...newQuestion, cropCategory: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Paddy Rice">Paddy Rice (धान / వరి)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Cotton">Cotton (कपास / పత్తి)</option>
                  <option value="Chickpea">Chickpea / Chana (चना)</option>
                  <option value="Vegetables">Vegetables & Horticulture</option>
                  <option value="General">Soil, Water & Machinery</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Detailed Explanation / Observations *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your soil type, weather, fertilizer used, and what you noticed..."
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PestControl, Organic, Monsoon"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
