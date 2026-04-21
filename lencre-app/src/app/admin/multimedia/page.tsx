'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/auth';

interface MultimediaItem {
  id: number;
  title: string;
  slug: string;
  type: 'video' | 'podcast';
  status: string;
  views_count: number;
  duration: string | null;
  author: { name: string };
  created_at: string;
  published_at: string | null;
}

export default function AdminMultimediaPage() {
  const [items, setItems] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadItems();
  }, [filter]);

  const loadItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filter) params.append('type', filter);
      const res = await adminFetch(`/multimedia/admin?${params.toString()}`);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error('Erreur de chargement', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Supprimer "${title}" ?\nCette action est irréversible.`)) return;
    try {
      await adminFetch(`/multimedia/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      console.error('Erreur de suppression', err);
    }
  };

  const handleValidate = async (id: number) => {
    try {
      await adminFetch(`/multimedia/${id}/validate`, { method: 'POST' });
      loadItems();
    } catch (err) {
      console.error('Erreur de validation', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published': return <span className="cms-badge cms-badge--published">Publié</span>;
      case 'pending_review': return <span className="cms-badge" style={{background:'#eef2ff', color:'#4f46e5'}}>En attente</span>;
      case 'rejected': return <span className="cms-badge" style={{background:'#fef2f2', color:'#ef4444'}}>Rejeté</span>;
      default: return <span className="cms-badge cms-badge--draft">Brouillon</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'video' 
      ? <span style={{ fontSize: '0.8rem' }}>🎬 Vidéo</span>
      : <span style={{ fontSize: '0.8rem' }}>🎧 Podcast</span>;
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Multimédia ({items.length})</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setLoading(true); }}
            className="cms-form__select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <option value="">Tous les types</option>
            <option value="video">🎬 Vidéos</option>
            <option value="podcast">🎧 Podcasts</option>
          </select>
          <Link href="/admin/multimedia/new" className="cms-btn cms-btn--primary">
            + Nouveau média
          </Link>
        </div>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Auteur</th>
              <th>Statut</th>
              <th>Vues</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/multimedia/${item.id}/edit`} style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 500 }}>
                    {item.title}
                  </Link>
                </td>
                <td>{getTypeBadge(item.type)}</td>
                <td>{item.author?.name || '—'}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>{item.views_count}</td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div className="cms-table__actions">
                    <Link href={`/admin/multimedia/${item.id}/edit`} className="cms-btn cms-btn--secondary cms-btn--sm">
                      ✏️ Modifier
                    </Link>
                    {item.status === 'pending_review' && (
                      <button onClick={() => handleValidate(item.id)} className="cms-btn cms-btn--sm" style={{ background: '#22c55e', color: '#fff', border: 'none' }}>
                        ✓ Valider
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.id, item.title)} className="cms-btn cms-btn--danger cms-btn--sm">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  Aucun média pour le moment. Ajoutez votre première vidéo ou podcast !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
