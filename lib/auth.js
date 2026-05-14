const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const User = require('../models/User');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}
const SECRET = process.env.JWT_SECRET || 'default_secret';

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, SECRET, {
    expiresIn: '7d',
  });
};

const parseCookies = (req) => {
  if (!req.headers.cookie) return {};
  return cookie.parse(req.headers.cookie);
};

const verifyToken = async (req) => {
  const cookies = parseCookies(req);
  const token = cookies.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id).lean();
    return user ? { ...decoded, role: user.role } : null;
  } catch (err) {
    return null;
  }
};

module.exports = { signToken, verifyToken, parseCookies };
