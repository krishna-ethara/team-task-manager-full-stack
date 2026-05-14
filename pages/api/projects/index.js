const connectDb = require('../../../lib/db');
const { verifyToken } = require('../../../lib/auth');
const Project = require('../../../models/Project');
const User = require('../../../models/User');

export default async function handler(req, res) {
  await connectDb();
  const auth = await verifyToken(req);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const query = auth.role === 'admin' ? {} : { members: auth.id };
    const projects = await Project.find(query).populate('members', 'name email role').populate('createdBy', 'name email');
    return res.status(200).json({ projects });
  }

  if (req.method === 'POST') {
    if (auth.role !== 'admin') return res.status(403).json({ error: 'Only admins can create projects.' });

    const { name, description, memberEmails = [] } = req.body;
    if (!name) return res.status(400).json({ error: 'Project name is required.' });

    const normalizedEmails = memberEmails
      .filter(Boolean)
      .map((email) => email.toLowerCase().trim());

    const members = await User.find({ email: { $in: normalizedEmails } }).select('_id email');
    const memberIds = members.map((user) => user._id);
    if (!memberIds.some((id) => id.toString() === auth.id.toString())) {
      memberIds.push(auth.id);
    }

    const project = await Project.create({
      name: name.trim(),
      description: description || '',
      members: memberIds,
      createdBy: auth.id,
    });

    return res.status(201).json({ project });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
