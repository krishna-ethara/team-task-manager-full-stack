const connectDb = require('../../../lib/db');
const { verifyToken } = require('../../../lib/auth');
const Task = require('../../../models/Task');
const Project = require('../../../models/Project');

export default async function handler(req, res) {
  await connectDb();
  const auth = await verifyToken(req);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  const task = await Task.findById(id).populate('project', 'name').populate('assignedTo', 'name email');
  if (!task) return res.status(404).json({ error: 'Task not found.' });

  const project = await Project.findById(task.project._id);
  const isMember = auth.role === 'admin' || project.members.some((memberId) => memberId.toString() === auth.id.toString());
  if (!isMember) return res.status(403).json({ error: 'Access denied.' });

  if (req.method === 'PUT') {
    const canEdit = auth.role === 'admin' || task.createdBy.toString() === auth.id.toString() || task.assignedTo?.toString() === auth.id.toString();
    if (!canEdit) {
      return res.status(403).json({ error: 'Only admins, task creator, or assigned user can update this task.' });
    }

    const updates = req.body;
    if (updates.status) {
      task.status = updates.status;
    }
    if (updates.dueDate) {
      task.dueDate = new Date(updates.dueDate);
    }
    if (updates.description) {
      task.description = updates.description;
    }
    await task.save();
    return res.status(200).json({ task });
  }

  if (req.method === 'DELETE') {
    if (auth.role !== 'admin' && task.createdBy.toString() !== auth.id.toString()) {
      return res.status(403).json({ error: 'Only the creator or admin can delete this task.' });
    }
    await task.deleteOne();
    return res.status(200).json({ message: 'Task removed.' });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
