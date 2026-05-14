import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ projects: 0, tasks: 0, overdue: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profileRes = await fetch('/api/auth/me', { credentials: 'same-origin' });
        const profile = await profileRes.json();
        if (!profile.user) {
          window.location.href = '/login';
          return;
        }
        setUser(profile.user);

        const [projectsRes, tasksRes] = await Promise.all([
          fetch('/api/projects', { credentials: 'same-origin' }),
          fetch('/api/tasks', { credentials: 'same-origin' }),
        ]);

        const [projectsData, tasksData] = await Promise.all([projectsRes.json(), tasksRes.json()]);

      const tasks = tasksData.tasks || [];
      const overdue = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done').length;
      const counts = tasks.reduce(
        (acc, task) => {
          if (task.status === 'todo') acc.todo += 1;
          if (task.status === 'in-progress') acc.inProgress += 1;
          if (task.status === 'done') acc.done += 1;
          return acc;
        },
        { todo: 0, inProgress: 0, done: 0 }
      );

      setStats({
        projects: (projectsData.projects || []).length,
        tasks: tasks.length,
        overdue,
        todo: counts.todo,
        inProgress: counts.inProgress,
        done: counts.done,
      });
      setLoading(false);
    } catch (err) {
      console.error('Dashboard load error:', err);
      window.location.href = '/login';
    }
    };
    loadUserData();
  }, []);

  if (loading) return <div className="page"><p>Loading dashboard...</p></div>;

  return (
    <section className="page dashboard-page">
      <div className="panel welcome-panel">
        <h1>Welcome, {user?.name}</h1>
        <p>Your role: {user?.role}</p>
        <div className="stats-row">
          <div className="stat-card">
            <strong>{stats.projects}</strong>
            <span>Projects</span>
          </div>
          <div className="stat-card">
            <strong>{stats.tasks}</strong>
            <span>Tasks</span>
          </div>
          <div className="stat-card overdue">
            <strong>{stats.overdue}</strong>
            <span>Overdue</span>
          </div>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <strong>{stats.todo}</strong>
            <span>Todo</span>
          </div>
          <div className="stat-card">
            <strong>{stats.inProgress}</strong>
            <span>In progress</span>
          </div>
          <div className="stat-card">
            <strong>{stats.done}</strong>
            <span>Done</span>
          </div>
        </div>
      </div>
      <div className="panel quick-links">
        <h2>Quick actions</h2>
        <Link href="/projects" className="button">View projects</Link>
        <Link href="/projects" className="button button-secondary">Manage tasks</Link>
      </div>
    </section>
  );
}
