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
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: role === 'admin' ? 'admin' : 'member',
    });

    const token = signToken(user);
    const cookieOptions = `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict` + (process.env.NODE_ENV === 'production' ? '; Secure' : '');
    res.setHeader('Set-Cookie', cookieOptions);
    return res.status(201).json({ message: 'Account created', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Signup API error:', err);
    return res.status(500).json({ error: 'Server error during signup. Please try again.' });
  }
}
