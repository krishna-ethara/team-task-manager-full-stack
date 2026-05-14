import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [router.pathname]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="logo">
          <Link href="/">Team Task Manager</Link>
        </div>
        <nav>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/tasks">Tasks</Link>
          {!user && <Link href="/login">Login</Link>}
          {!user && <Link href="/signup">Signup</Link>}
          {user && <span className="user-badge">{user.role}</span>}
          {user && <button className="link-button" onClick={logout}>Logout</button>}
        </nav>
      </header>

      <main>{children}</main>
      <footer>Built with Next.js · Role-based team progress tracking</footer>
    </div>
  );
}
