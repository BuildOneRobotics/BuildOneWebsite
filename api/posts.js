import { loadFromGist } from './gist-storage';

const ALLOWED_ORIGIN = 'https://admin-dashboard-phi-green-90.vercel.app';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const data = await loadFromGist();
      const posts = data.posts || [];
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load posts' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
