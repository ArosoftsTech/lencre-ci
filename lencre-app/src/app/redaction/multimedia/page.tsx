'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { redactionFetch } from '@/lib/redactionAuth';

interface MultimediaItem {
  id: number;
  title: string;
  type: 'video' | 'podcast';
  status: string;
  views_count: number;
  duration: string | null;
  created_at: string;
}

export default function RedactionMultimediaPage() {
  const [items, setItems] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await redactionFetch('/redaction/multimedia?per_page=50');
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
      await redactionFetch(`/redaction/multimedia/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      console.error('Erreur de suppression', err);
    }
  };

  const handleSubmit = async (id: number) => {
    if (!confirm('Soumettre ce média pour validation éditoriale ?')) return;
    try {
      await redactionFetch(`/redaction/multimedia/${id}/submit`, { method: 'POST' });
      loadItems();
    } catch (err) {
      console.error('Erreur de soumission', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published': return <span className="cms-badge cms-badge--published">Publié</span>;
      case 'review_pending': return <span className="cms-badge" style={{background:'#eef2ff', color:'#4f46e5'}}>En attente</span>;
      case 'rejected': return <span className="cms-badge" style={{background:'#fef2f2', color:'#ef4444'}}>Rejeté</span>;
      default: return <span className="cms-badge cms-badge--draft">Brouillon</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'video' 
      ? <span style={{ fontSize: '0.8rem' }}>🎬 Vidéo</span>
      : <span style={{ fontSize: '0.8rem' }}>🎧 Podcast</span>;
  };

  if (loading) return <div className="redaction-loading"><div className="redaction-loading__spinner" /><p>Chargement de vos médias...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Mes Médias ({items.length})</h1>
        <Link href="/redaction/multimedia/new" className="cms-btn cms-btn--primary" style={{ background: '#3b82f6' }}>
          + Ajouter un média
        </Link>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </td>
                <td>{getTypeBadge(item.type)}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div className="cms-table__actions">
                    {!['published', 'review_pending'].includes(item.status) && (
                      <>
                        <Link href={`/redaction/multimedia/${item.id}/edit`} className="cms-btn cms-btn--secondary cms-btn--sm">
                          ✏️ Modifier
                        </Link>
                        <button onClick={() => handleSubmit(item.id)} className="cms-btn cms-btn--sm" style={{ background: '#3b82f6', color: '#fff', border: 'none' }}>
                          📤 Soumettre
                        </button>
                        <button onClick={() => handleDelete(item.id, item.title)} className="cms-btn cms-btn--danger cms-btn--sm">
                          🗑️
                        </button>
                      </>
                    )}
                    {['published', 'review_pending'].includes(item.status) && (
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>
                        {item.status === 'published' ? 'Publié ✓' : 'En relecture...'}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  Vous n&apos;avez pas encore ajouté de média. Commencez par ajouter une vidéo ou un podcast !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
