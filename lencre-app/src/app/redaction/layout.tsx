'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isRedactionAuthenticated, getRedactionUser, logoutRedaction } from '@/lib/redactionAuth';
import './redaction.css';

interface User {
  name: string;
  role: string;
}

export default function RedactionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isLoginPage = pathname === '/redaction/login';

  useEffect(() => {
    if (isLoginPage) return;

    if (!isRedactionAuthenticated()) {
      router.push('/redaction/login');
      return;
    }

    getRedactionUser()
      .then(setUser)
      .catch(() => {
        router.push('/redaction/login');
      });
  }, [router, isLoginPage]);

  // Don't apply layout to login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutRedaction();
    router.push('/redaction/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/redaction', icon: '📊' },
    { label: 'Mes Articles', href: '/redaction/articles', icon: '📝' },
    { label: 'Mes Médias', href: '/redaction/multimedia', icon: '🎬' },
    { label: 'Ma Médiathèque', href: '/redaction/media', icon: '🖼️' },
    { label: 'Mon Profil', href: '/redaction/profile', icon: '👤' },
  ];

  if (!user) {
    return (
      <div className="redaction-loading">
        <div className="redaction-loading__spinner" />
        <p>Chargement du Newsroom...</p>
      </div>
    );
  }

  return (
    <div className="redaction">
      {/* Sidebar */}
      <aside className={`redaction__sidebar ${sidebarOpen ? '' : 'redaction__sidebar--collapsed'}`}>
        <div className="redaction__sidebar-header">
          <Link href="/redaction" className="redaction__sidebar-logo">
            <Image src="/images/logo-encre.png" alt="L'Encre Newsroom" width={140} height={42} className="redaction__sidebar-logo-img" />
          </Link>
          <span className="redaction__sidebar-badge">Newsroom</span>
        </div>

        <nav className="redaction__sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`redaction__sidebar-link ${pathname === item.href ? 'redaction__sidebar-link--active' : ''}`}
            >
              <span className="redaction__sidebar-link-icon">{item.icon}</span>
              <span className="redaction__sidebar-link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="redaction__sidebar-footer">
          <Link href="/" className="redaction__sidebar-link redaction__sidebar-link--external" target="_blank">
            <span className="redaction__sidebar-link-icon">🌐</span>
            <span className="redaction__sidebar-link-label">Voir le site public</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="redaction__main">
        {/* Top bar */}
        <header className="redaction__topbar">
          <button
            className="redaction__topbar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu"
          >
            ☰
          </button>

          <div className="redaction__topbar-user">
            <div className="redaction__topbar-avatar" style={{ background: '#3b82f6' }}>
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="redaction__topbar-info">
              <span className="redaction__topbar-name">{user.name}</span>
              <span className="redaction__topbar-role">{user.role.replace('_', ' ')}</span>
            </div>
            <button onClick={handleLogout} className="redaction__topbar-logout" title="Déconnexion">
              ⏻
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="redaction__content">
          {children}
        </main>
      </div>
    </div>
  );
}
