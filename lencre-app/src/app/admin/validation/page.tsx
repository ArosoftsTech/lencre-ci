'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/auth';
import ActionModal from '@/components/admin/ActionModal';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: { name: string };
  author: { name: string };
  status: string;
  created_at: string;
}

export default function AdminValidationPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'prompt' | 'textarea';
    action: 'validate' | 'reject' | 'request-revision' | null;
    article: Article | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    action: null,
    article: null,
  });

  useEffect(() => {
    loadPendingArticles();
  }, []);

  const loadPendingArticles = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    try {
      const res = await adminFetch('/articles?status=review_pending&per_page=50');
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openModal = (article: Article, action: 'validate' | 'reject' | 'request-revision') => {
    let title = '';
    let message = '';
    let type: 'confirm' | 'prompt' = 'confirm';

    if (action === 'validate') {
      title = 'Publier l\'article';
      message = `Êtes-vous sûr de vouloir publier l'article "${article.title}" immédiatement ?`;
      type = 'confirm';
    } else if (action === 'reject') {
      title = 'Refuser l\'article';
      message = 'Veuillez indiquer le motif du refus (ce mot sera transmis au rédacteur) :';
      type = 'textarea';
    } else if (action === 'request-revision') {
      title = 'Demander des corrections';
      message = 'Veuillez indiquer les corrections attendues :';
      type = 'textarea';
    }

    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
      action,
      article,
    });
  };

  const executeAction = async (motif?: string) => {
    const { article, action } = modalConfig;
    if (!article || !action) return;

    setProcessingId(article.id);
    setModalConfig(prev => ({ ...prev, isOpen: false }));

    try {
      const res = await adminFetch(`/articles/${article.id}/${action}`, {
        method: 'POST',
        body: JSON.stringify({ motif }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Erreur lors de l\'opération');
      } else {
        setArticles(articles.filter(a => a.id !== article.id));
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }

    setProcessingId(null);
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement des soumissions...</p></div>;

  return (
    <div>
      <div className="cms-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Validation des Articles ({articles.length})</h1>
        <button 
          onClick={() => loadPendingArticles(true)} 
          className="cms-btn"
          style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          🔄 Actualiser
        </button>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Auteur</th>
              <th>Catégorie</th>
              <th>Soumis le</th>
              <th>Actions (Modération)</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td style={{ maxWidth: 300 }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>
                      <Link href={`/admin/articles/${article.id}/edit`} style={{ color: '#0D1B2A', textDecoration: 'underline' }}>
                          📄 Lire l&apos;article complet
                      </Link>
                  </div>
                </td>
                <td>{article.author?.name}</td>
                <td>{article.category?.name || '—'}</td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {new Date(article.created_at).toLocaleDateString('fr-FR')} à {new Date(article.created_at).getHours()}h{new Date(article.created_at).getMinutes().toString().padStart(2, '0')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => openModal(article, 'validate')} 
                        disabled={processingId === article.id}
                        className="cms-btn" 
                        style={{ background: '#10b981', color: '#fff', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    >
                      ✓ Publier
                    </button>
                    <button 
                        onClick={() => openModal(article, 'request-revision')} 
                        disabled={processingId === article.id}
                        className="cms-btn" 
                        style={{ background: '#f59e0b', color: '#fff', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    >
                      ✏️ Demander révision
                    </button>
                    <button 
                        onClick={() => openModal(article, 'reject')} 
                        disabled={processingId === article.id}
                        className="cms-btn" 
                        style={{ background: '#ef4444', color: '#fff', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    >
                      ✕ Refuser
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {articles.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉</div>
                  Aucun article en attente de validation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ActionModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmLabel={modalConfig.action === 'validate' ? 'Publier' : 'Confirmer'}
        confirmColor={modalConfig.action === 'validate' ? '#10b981' : (modalConfig.action === 'reject' ? '#ef4444' : '#f59e0b')}
        onConfirm={executeAction}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        placeholder={modalConfig.action === 'reject' ? 'Motif du refus...' : 'Détails des corrections...'}
      />
    </div>
  );
}
