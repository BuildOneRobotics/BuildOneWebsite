export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  const ADMIN_CREDS = {
    bensteels: { pass: process.env.BEN_PASSWORD || '24122012', role: 'super' },
    ethanpatmore: { pass: process.env.ETHAN_PASSWORD || '1012', role: 'mod' }
  };

  if (ADMIN_CREDS[username] && ADMIN_CREDS[username].pass === password) {
    return res.status(200).json({ 
      valid: true, 
      role: ADMIN_CREDS[username].role,
      username 
    });
  }

  return res.status(401).json({ valid: false });
}
