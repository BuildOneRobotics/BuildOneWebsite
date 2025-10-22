const ALLOWED_ORIGIN = 'https://admin-dashboard-phi-green-90.vercel.app';

const API_URL = process.env.JSONBIN_URL || 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID';
const API_KEY = process.env.JSONBIN_KEY || '$2a$10$YOUR_API_KEY';

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
      const getResponse = await fetch(API_URL, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await getResponse.json();
      const posts = data.record?.posts || [];

      const newPost = {
        id: Date.now(),
        title,
        description: content,
        author,
        date: new Date().toLocaleDateString(),
        pinned: true,
        isAnnouncement: true,
        comments: []
      };

      posts.unshift(newPost);

      await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ posts })
      });

      return res.status(201).json({ success: true, post: newPost });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create announcement' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
