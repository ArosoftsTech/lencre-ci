'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/auth';

interface DashboardStats {
  articles_count: number;
  categories_count: number;
  users_count: number;
  recent_articles: Array<{
    id: number;
    title: string;
    published_at: string | null;
    category: { name: string };
    author: { name: string };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminFetch('/dashboard/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Dashboard</h1>
      </div>

      <div className="cms-stats">
        <div className="cms-stat-card">
          <div className="cms-stat-card__icon">📝</div>
          <div className="cms-stat-card__value">{stats.articles_count}</div>
          <div className="cms-stat-card__label">Articles</div>
        </div>
        <div className="cms-stat-card">
          <div className="cms-stat-card__icon">📂</div>
          <div className="cms-stat-card__value">{stats.categories_count}</div>
          <div className="cms-stat-card__label">Catégories</div>
        </div>
        <div className="cms-stat-card">
          <div className="cms-stat-card__icon">👥</div>
          <div className="cms-stat-card__value">{stats.users_count}</div>
          <div className="cms-stat-card__label">Utilisateurs</div>
        </div>
      </div>

      <div className="cms-header">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Articles récents</h2>
        <Link href="/admin/articles/new" className="cms-btn cms-btn--primary">
          + Nouvel article
        </Link>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Auteur</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_articles.map((article) => (
              <tr key={article.id}>
                <td>
                  <Link href={`/admin/articles/${article.id}/edit`} style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500 }}>
                    {article.title}
                  </Link>
                </td>
                <td>{article.category.name}</td>
                <td>{article.author.name}</td>
                <td>
                  <span className={`cms-badge ${article.published_at ? 'cms-badge--published' : 'cms-badge--draft'}`}>
                    {article.published_at ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
