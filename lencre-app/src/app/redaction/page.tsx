'use client';

import { useState, useEffect } from 'react';
import { redactionFetch } from '@/lib/redactionAuth';
import Link from 'next/link';

interface DashboardStats {
  drafts: number;
  pending: number;
  published: number;
  storage_used_mb: number;
  storage_quota_mb: number;
}

export default function RedactionDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger le profil et les stats en parallèle
    Promise.all([
      redactionFetch('/redaction/profile').then(res => res.json()),
      redactionFetch('/redaction/dashboard-stats').then(res => res.json()),
    ])
      .then(([profileData, statsData]) => {
        setProfile(profileData.user);
        setStats(statsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4">Chargement de votre profil...</div>;
  }

  return (
    <div>
      <div className="cms-header">
        <h1>Bienvenue dans le Newsroom, {profile?.name || 'Rédacteur'}</h1>
      </div>

      <div className="cms-stats">
        <div className="cms-stat-card">
          <div className="cms-stat-card__icon">📝</div>
          <div className="cms-stat-card__value">{stats?.drafts ?? 0}</div>
          <div className="cms-stat-card__label">Brouillons en cours</div>
        </div>
        <div className="cms-stat-card">
          <div className="cms-stat-card__icon">⏳</div>
          <div className="cms-stat-card__value">{stats?.pending ?? 0}</div>
          <div className="cms-stat-card__label">En attente de relecture</div>
        </div>
        <div className="cms-stat-card">
          <div className="cms-stat-card__icon">✅</div>
          <div className="cms-stat-card__value">{stats?.published ?? 0}</div>
          <div className="cms-stat-card__label">Articles publiés</div>
        </div>
        <div className="cms-stat-card" style={{ borderColor: (stats?.storage_used_mb ?? 0) > ((stats?.storage_quota_mb ?? 100) * 0.9) ? 'red' : '' }}>
          <div className="cms-stat-card__icon">💾</div>
          <div className="cms-stat-card__value">
            {stats?.storage_used_mb ?? 0} / {stats?.storage_quota_mb ?? 100} MB
          </div>
          <div className="cms-stat-card__label">Espace média utilisé</div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Actions rapides</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/redaction/articles/new" className="cms-btn cms-btn--primary">
                + Rédiger un Article
            </Link>
            <Link href="/redaction/media" className="cms-btn cms-btn--secondary">
                🖼️ Uploader un média
            </Link>
        </div>
      </div>
    </div>
  );
}
