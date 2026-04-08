'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/auth';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface Article {
  id: number;
  title: string;
  slug: string;
  published_at: string | null;
  category: { name: string };
  author: { name: string };
  created_at: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<{ id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await adminFetch('/articles?per_page=50');
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openDeleteModal = (id: number, title: string) => {
    setArticleToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminFetch(`/articles/${articleToDelete.id}`, { method: 'DELETE' });
      setArticles(articles.filter(a => a.id !== articleToDelete.id));
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Articles ({articles.length})</h1>
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
                <td>{article.category?.name}</td>
                <td>{article.author?.name}</td>
                <td>
                  <span className={`cms-badge ${article.published_at ? 'cms-badge--published' : 'cms-badge--draft'}`}>
                    {article.published_at ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {new Date(article.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div className="cms-table__actions">
                    <Link href={`/admin/articles/${article.id}/edit`} className="cms-btn cms-btn--secondary cms-btn--sm">
                      ✏️ Modifier
                    </Link>
                    <button onClick={() => openDeleteModal(article.id, article.title)} className="cms-btn cms-btn--danger cms-btn--sm">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer l'article "${articleToDelete?.title}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
      />
    </div>
  );
}
