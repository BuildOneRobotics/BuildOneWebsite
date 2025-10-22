import { loadFromGist, saveToGist } from './gist-storage';

const ALLOWED_ORIGIN = 'https://admin-dashboard-phi-green-90.vercel.app';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { title, content, author } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      const data = await loadFromGist();
      const posts = data.posts || [];

      const newPost = {
        id: Date.now(),
        title,
        description: content,
        author: author || 'Admin',
        date: new Date().toLocaleDateString(),
        pinned: true,
        isAnnouncement: true,
        comments: []
      };

      posts.unshift(newPost);
      await saveToGist({ posts });

      return res.status(201).json({ success: true, post: newPost });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create announcement', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
