import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      if (!authData.user) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unable to load tasks');
        setLoading(false);
        return;
      }
      setTasks(data.tasks || []);
      setLoading(false);
    };
    load();
  }, [router]);

  if (loading) return <section className="page"><p>Loading tasks...</p></section>;

  return (
    <section className="page tasks-page">
      <div className="panel">
        <h1>Tasks</h1>
        {error && <p className="error">{error}</p>}
        {tasks.length === 0 && <p>No assigned or project tasks found yet.</p>}
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
                  <span>Project: {task.project?.name || 'Unknown'}</span>
                  <span>Assigned: {task.assignedTo?.name || 'Unassigned'}</span>
                  <span>Priority: {task.priority || 'medium'}</span>
                  <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
