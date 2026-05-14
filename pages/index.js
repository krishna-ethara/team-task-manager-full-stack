import Link from 'next/link';

export default function Home() {
  return (
    <section className="page home-page">
      <div className="hero-card">
        <h1>Team Task Manager</h1>
        <p>Manage projects, assign tasks, and track progress with Admin and Member roles.</p>
        <div className="hero-actions">
          <Link href="/signup" className="button">Create account</Link>
          <Link href="/login" className="button button-secondary">Login</Link>
        </div>
      </div>
      <div className="info-panel">
        <div>
          <h2>Features</h2>
          <ul>
            <li>Authentication</li>
            <li>Role-based access</li>
            <li>Project team assignment</li>
            <li>Task status and overdue tracking</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
