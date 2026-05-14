import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/login');
          return;
        }
        setUser(data.user);
      })
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]));
  }, [user]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, memberEmails: memberEmails.split(',').map((email) => email.trim()).filter(Boolean) }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Unable to create project');
      return;
    }

    setProjects((prev) => [result.project, ...prev]);
    setName('');
    setDescription('');
    setMemberEmails('');
  };

  return (
    <section className="page projects-page">
      <div className="panel">
        <h1>Projects</h1>
        {user?.role === 'admin' ? (
          <form className="card form-card" onSubmit={handleCreate}>
            <h2>Create a project</h2>
            <label>Project name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <label>Team member emails</label>
            <input value={memberEmails} onChange={(e) => setMemberEmails(e.target.value)} placeholder="member1@example.com, member2@example.com" />
            {error && <p className="error">{error}</p>}
            <button type="submit">Create project</button>
          </form>
        ) : (
          <div className="card form-card">
            <h2>Project access</h2>
            <p>Only admins can create new projects. Ask your admin to add the team or assign you to a project.</p>
          </div>
        )}
      </div>
      <div className="panel">
        <h2>My projects</h2>
        <div className="grid-list">
          {projects.length === 0 && <p>No projects yet. Start by creating one.</p>}
          {projects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`} className="card project-card">
              <h3>{project.name}</h3>
              <p>{project.description || 'No description yet.'}</p>
              <small>{project.members?.length || 0} members</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
