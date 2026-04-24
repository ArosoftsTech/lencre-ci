'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { redactionFetch } from '@/lib/redactionAuth';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: { name: string };
  status: string;
  created_at: string;
}

export default function RedactionArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await redactionFetch('/redaction/articles?per_page=50');
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err) {
      console.error('Erreur de chargement', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Supprimer le brouillon "${title}" ?\nCeci est irréversible.`)) return;

    try {
      await redactionFetch(`/redaction/articles/${id}`, { method: 'DELETE' });
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erreur de suppression', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published': return <span className="cms-badge cms-badge--published">Publié</span>;
      case 'review_pending': return <span className="cms-badge" style={{background:'#eef2ff', color:'#4f46e5'}}>En relecture Editoriale</span>;
      case 'rejected': return <span className="cms-badge" style={{background:'#fef2f2', color:'#ef4444'}}>Refusé éditeur</span>;
      case 'edit_requested': return <span className="cms-badge" style={{background:'#fffbeb', color:'#d97706'}}>Révision requise</span>;
      default: return <span className="cms-badge cms-badge--draft">Brouillon</span>;
    }
  };

  if (loading) return <div className="redaction-loading"><div className="redaction-loading__spinner" /><p>Chargement de vos articles...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Mes Articles ({articles.length})</h1>
        <Link href="/redaction/articles/new" className="cms-btn cms-btn--primary" style={{ background: '#3b82f6' }}>
          + Rédiger un article
        </Link>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {article.title}
                </td>
                <td>{article.category?.name || '—'}</td>
                <td>{getStatusBadge(article.status || 'draft')}</td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {new Date(article.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div className="cms-table__actions">
                    <Link href={`/redaction/articles/${article.id}/edit`} className="cms-btn cms-btn--secondary cms-btn--sm">
                      ✏️ {['published', 'review_pending'].includes(article.status) ? 'Voir' : 'Modifier'}
                    </Link>
                    {!['published', 'review_pending'].includes(article.status) && (
                      <button onClick={() => handleDelete(article.id, article.title)} className="cms-btn cms-btn--danger cms-btn--sm">
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'#888' }}>
                  Vous n'avez pas encore écrit d'article.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
