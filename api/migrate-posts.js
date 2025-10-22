import { saveToGist } from './gist-storage';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { posts } = req.body;
    
    try {
      await saveToGist({ posts });
      return res.status(200).json({ success: true, count: posts.length });
    } catch (error) {
      return res.status(500).json({ error: 'Migration failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
