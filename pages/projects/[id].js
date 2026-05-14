import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [values, setValues] = useState({ title: '', description: '', dueDate: '', assignedEmail: '', priority: 'medium' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      setProject(data.project || null);
      setTasks(data.tasks || []);
    };
    load();
  }, [id]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        projectId: id,
        assignedEmail: values.assignedEmail,
        priority: values.priority,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Unable to create task');
      return;
    }

    setTasks((prev) => [result.task, ...prev]);
    setValues({ title: '', description: '', dueDate: '', assignedEmail: '', priority: 'medium' });
  };

  const updateStatus = async (taskId, status) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setTasks((prev) => prev.map((task) => (task._id === taskId ? { ...task, status } : task)));
  };

  if (!project) return <section className="page"><p>Loading project...</p></section>;

  return (
    <section className="page project-detail-page">
      <div className="panel">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <div className="meta-row">
          <span>Created by: {project.createdBy?.name}</span>
          <span>{project.members?.length || 0} members</span>
        </div>
      </div>

      <div className="panel card form-card">
        <h2>Create task</h2>
        <form onSubmit={handleCreateTask}>
          <label>Title</label>
          <input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} required />
          <label>Description</label>
          <textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} />
          <label>Due date</label>
          <input type="date" value={values.dueDate} onChange={(e) => setValues({ ...values, dueDate: e.target.value })} />
          <label>Assign to email</label>
          <input value={values.assignedEmail} onChange={(e) => setValues({ ...values, assignedEmail: e.target.value })} placeholder="member@example.com" />
          <label>Priority</label>
          <select value={values.priority} onChange={(e) => setValues({ ...values, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {error && <p className="error">{error}</p>}
          <button type="submit">Add task</button>
        </form>
      </div>

      <div className="panel">
        <h2>Task board</h2>
        {tasks.length === 0 && <p>No tasks yet. Add one above.</p>}
        <div className="task-list">
          {tasks.map((task) => {
            const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
            return (
              <div key={task._id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={overdue ? 'tag overdue' : 'tag'}>{task.status}</span>
                </div>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span>Assigned to: {task.assignedTo?.name || 'Unassigned'}</span>
                  <span>Priority: {task.priority || 'medium'}</span>
                  <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                </div>
                <div className="task-actions">
                  <button onClick={() => updateStatus(task._id, 'todo')}>Todo</button>
                  <button onClick={() => updateStatus(task._id, 'in-progress')}>In progress</button>
                  <button onClick={() => updateStatus(task._id, 'done')}>Done</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
