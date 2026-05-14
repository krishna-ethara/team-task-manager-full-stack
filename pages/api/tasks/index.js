const connectDb = require('../../../lib/db');
const { verifyToken } = require('../../../lib/auth');
const Task = require('../../../models/Task');
const Project = require('../../../models/Project');
const User = require('../../../models/User');

export default async function handler(req, res) {
  await connectDb();
  const auth = await verifyToken(req);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    let query = {};
    if (auth.role !== 'admin') {
      const memberProjects = await Project.find({ members: auth.id }).select('_id');
      const projectIds = memberProjects.map((item) => item._id);
      query = {
        $or: [{ assignedTo: auth.id }, { project: { $in: projectIds } }],
      };
    }

    const tasks = await Task.find(query).populate('project', 'name').populate('assignedTo', 'name email');
    return res.status(200).json({ tasks });
  }

  if (req.method === 'POST') {
    const { title, description, status, dueDate, projectId, assignedEmail, priority } = req.body;
    if (!title || !projectId) return res.status(400).json({ error: 'Title and project are required.' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const isMember = auth.role === 'admin' || project.members.some((memberId) => memberId.toString() === auth.id.toString());
    if (!isMember) return res.status(403).json({ error: 'Access denied.' });

    let assignedTo = null;
    if (assignedEmail) {
      const user = await User.findOne({ email: assignedEmail.toLowerCase().trim() });
      if (!user) {
        return res.status(400).json({ error: 'Assigned email must belong to a registered project member.' });
      }
      const isProjectMember = project.members.some((memberId) => memberId.toString() === user._id.toString());
      if (!isProjectMember) {
        return res.status(400).json({ error: 'Assigned user must be a member of this project.' });
      }
      assignedTo = user._id;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      status: status || 'todo',
      dueDate: dueDate ? new Date(dueDate) : null,
      project: projectId,
      assignedTo,
      createdBy: auth.id,
      priority: priority || 'medium',
    });

    return res.status(201).json({ task });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
