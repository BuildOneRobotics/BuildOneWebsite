const ALLOWED_ORIGIN = 'https://admin-dashboard-phi-green-90.vercel.app';

const API_URL = process.env.JSONBIN_URL || 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID';
const API_KEY = process.env.JSONBIN_KEY || '$2a$10$YOUR_API_KEY';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(API_URL, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await response.json();
      const posts = data.record?.posts || [];
      
      const announcements = posts.filter(p => p.isAnnouncement).length;
      const regularPosts = posts.filter(p => !p.isAnnouncement).length;
      
      return res.status(200).json({
        totalUsers: '-',
        activePosts: posts.length,
        forumTopics: regularPosts,
        announcements: announcements
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load stats' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
