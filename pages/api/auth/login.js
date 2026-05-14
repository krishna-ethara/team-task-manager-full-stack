const bcrypt = require('bcryptjs');
const connectDb = require('../../../lib/db');
const User = require('../../../models/User');
const { signToken } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken(user);
    const cookieOptions = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict` + (process.env.NODE_ENV === 'production' ? '; Secure' : '');
    res.setHeader('Set-Cookie', cookieOptions);

    return res.status(200).json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login API error:', err);
    return res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
}
