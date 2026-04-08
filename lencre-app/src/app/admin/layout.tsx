'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isAuthenticated, getUser, logout } from '@/lib/auth';
import './admin.css';

interface User {
  name: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    getUser()
      .then(setUser)
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router, isLoginPage]);

  // Don't apply admin layout to login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Articles', href: '/admin/articles', icon: '📝' },
    { label: 'Validation', href: '/admin/validation', icon: '⚖️' },
    { label: 'Rédacteurs', href: '/admin/users', icon: '👥' },
    { label: 'Catégories', href: '/admin/categories', icon: '📂' },
    { label: 'Médias', href: '/admin/media', icon: '🖼️' },
  ];

  if (!user) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className={`admin__sidebar ${sidebarOpen ? '' : 'admin__sidebar--collapsed'}`}>
        <div className="admin__sidebar-header">
          <Link href="/admin" className="admin__sidebar-logo">
            <Image src="/images/logo-encre.png" alt="L'Encre CMS" width={140} height={42} className="admin__sidebar-logo-img" />
          </Link>
          <span className="admin__sidebar-badge">CMS</span>
        </div>

        <nav className="admin__sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin__sidebar-link ${pathname === item.href ? 'admin__sidebar-link--active' : ''}`}
            >
              <span className="admin__sidebar-link-icon">{item.icon}</span>
              <span className="admin__sidebar-link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin__sidebar-footer">
          <Link href="/" className="admin__sidebar-link admin__sidebar-link--external" target="_blank">
            <span className="admin__sidebar-link-icon">🌐</span>
            <span className="admin__sidebar-link-label">Voir le site</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin__main">
        {/* Top bar */}
        <header className="admin__topbar">
          <button
            className="admin__topbar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <div className="admin__topbar-user">
            <div className="admin__topbar-avatar">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="admin__topbar-info">
              <span className="admin__topbar-name">{user.name}</span>
              <span className="admin__topbar-role">{user.role || 'Admin'}</span>
            </div>
            <button onClick={handleLogout} className="admin__topbar-logout" title="Déconnexion">
              ⏻
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="admin__content">
          {children}
        </main>
      </div>
    </div>
  );
}
