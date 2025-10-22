const ALLOWED_ORIGIN = 'https://admin-dashboard-phi-green-90.vercel.app';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const posts = JSON.parse(process.env.FORUM_POSTS || '[]');
    return res.status(200).json({ posts });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
