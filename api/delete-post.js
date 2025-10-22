const ALLOWED_ORIGIN = 'https://admin-dashboard-phi-green-90.vercel.app';

const API_URL = process.env.JSONBIN_URL || 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID';
const API_KEY = process.env.JSONBIN_KEY || '$2a$10$YOUR_API_KEY';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    
    try {
      const getResponse = await fetch(API_URL, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await getResponse.json();
      const posts = data.record?.posts || [];
      
      const filteredPosts = posts.filter(p => p.id != id);
      
      await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ posts: filteredPosts })
      });
      
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
