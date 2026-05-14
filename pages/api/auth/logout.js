export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', `token=deleted; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`);
  return res.status(200).json({ message: 'Logged out' });
}
