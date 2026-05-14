const connectDb = require('../../../lib/db');
const { verifyToken } = require('../../../lib/auth');
const Project = require('../../../models/Project');
const Task = require('../../../models/Task');

export default async function handler(req, res) {
  await connectDb();
  const auth = await verifyToken(req);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  const project = await Project.findById(id).populate('members', 'name email role').populate('createdBy', 'name email');
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  const isMember = auth.role === 'admin' || project.members.some((member) => member._id.toString() === auth.id.toString());
  if (!isMember) return res.status(403).json({ error: 'Access denied.' });

  if (req.method === 'GET') {
    const tasks = await Task.find({ project: id }).populate('assignedTo', 'name email');
    return res.status(200).json({ project, tasks });
  }

  if (req.method === 'DELETE') {
    if (auth.role !== 'admin') return res.status(403).json({ error: 'Only admins can delete projects.' });
    await Task.deleteMany({ project: id });
    await project.deleteOne();
    return res.status(200).json({ message: 'Project removed.' });
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
