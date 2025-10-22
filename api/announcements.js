const ALLOWED_ORIGIN = 'https://admin-dashboard-phi-green-90.vercel.app';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { title, description, imageUrl, author } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newPost = {
      id: Date.now(),
      title,
      description,
      imageUrl,
      author,
      date: new Date().toLocaleDateString(),
      pinned: false,
      isAnnouncement: true
    };

    return res.status(201).json({ success: true, post: newPost });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
