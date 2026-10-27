import { Response } from 'express';
import { dataStore, StoreForumPost } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    let posts = [...dataStore.forumPosts];

    if (category && category !== 'all') {
      posts = posts.filter(p => p.cropCategory.toLowerCase() === String(category).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
    }

    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, cropCategory, tags } = req.body;
    const user = req.user;

    if (!title || !content || !cropCategory) {
      res.status(400).json({ success: false, message: 'Title, question content, and crop category are required.' });
      return;
    }

    const newPost: StoreForumPost = {
      _id: `frm-post-${Date.now()}`,
      author: user?.id || 'usr-farmer-01',
      authorName: user?.name || 'Ramesh Patel',
      authorRole: user?.role || 'farmer',
      authorRegion: 'Madhya Pradesh',
      title,
      content,
      cropCategory,
      tags: Array.isArray(tags) ? tags : [cropCategory, 'Farming'],
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    dataStore.forumPosts.unshift(newPost);
    dataStore.logActivity(newPost.authorName, 'FORUM_POST_CREATED', 'Community Forum', `Posted question: "${title}"`, newPost.author);

    res.status(201).json({ success: true, message: 'Question shared with the farming community.', data: newPost });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!content) {
      res.status(400).json({ success: false, message: 'Comment content cannot be empty.' });
      return;
    }

    const post = dataStore.forumPosts.find(p => p._id === id);
    if (!post) {
      res.status(404).json({ success: false, message: 'Forum post not found.' });
      return;
    }

    const isExpert = user?.role === 'admin' || user?.role === 'expert';
    const comment = {
      id: `c-${Date.now()}`,
      authorName: user?.name || 'Farmer Contributor',
      authorRole: user?.role || 'farmer',
      content,
      isExpert,
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    dataStore.logActivity(comment.authorName, 'FORUM_COMMENT', 'Community Forum', `Replied to "${post.title}"`, user?.id);

    res.status(201).json({ success: true, message: 'Reply posted successfully.', data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'usr-guest';

    const post = dataStore.forumPosts.find(p => p._id === id);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found.' });
      return;
    }

    const idx = post.likedBy.indexOf(userId);
    if (idx === -1) {
      post.likedBy.push(userId);
      post.likes += 1;
    } else {
      post.likedBy.splice(idx, 1);
      post.likes = Math.max(0, post.likes - 1);
    }

    res.json({ success: true, likes: post.likes, liked: idx === -1 });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
