'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/auth';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: { name: string };
  author: { name: string };
  status: string;
  created_at: string;
  ai_score: number | null;
  ai_level: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ai_analysis_reports?: any[];
}

export default function AdminValidationPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewReport, setViewReport] = useState<any>(null);

  useEffect(() => {
    loadPendingArticles();
  }, []);

  const loadPendingArticles = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    try {
      const res = await adminFetch('/articles?status=pending_review&per_page=50');
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAction = async (article: Article, action: 'validate' | 'reject' | 'request-revision') => {
    let motif = '';
    let ai_override_reason = '';
    
    if (action === 'reject') {
      const input = prompt('Veuillez indiquer le motif du refus (ce mot sera transmis au rédacteur) :');
      if (input === null) return;
      if (!input.trim()) { alert('Le motif est obligatoire pour un refus.'); return; }
      motif = input;
    } else if (action === 'request-revision') {
      const input = prompt('Veuillez indiquer les corrections attendues :');
      if (input === null) return;
      if (!input.trim()) { alert('Vous devez préciser les corrections attendues.'); return; }
      motif = input;
    } else if (action === 'validate') {
      if (article.ai_level === 'BLOQUE' || article.ai_level === 'CORRECTIONS') {
          const input = prompt(`ATTENTION: Cet article a un mauvais score IA (${article.ai_level}). Veuillez justifier la publication forcée :`);
          if (input === null) return;
          if (!input.trim()) { alert('Une justification est obligatoire pour forcer la publication.'); return; }
          ai_override_reason = input;
      } else {
          if (!confirm('Êtes-vous sûr de vouloir publier cet article immédiatement ?')) return;
      }
    }

    setProcessingId(article.id);

    try {
      const body: any = { motif };
      if (ai_override_reason) {
          body.ai_override_reason = ai_override_reason;
      }

      const res = await adminFetch(`/articles/${article.id}/${action}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Erreur lors de l\'opération');
      } else {
        // Retirer de la liste
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
              <th>Analyse IA</th>
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
                  {article.ai_level ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: article.ai_level === 'FIABLE' ? '#059669' : (article.ai_level === 'CORRECTIONS' ? '#d97706' : '#dc2626') 
                      }}>
                        Score: {article.ai_score}/100
                      </span>
                      <span style={{ fontSize: '0.75rem', padding: '2px 4px', borderRadius: 4, background: '#f3f4f6', alignSelf: 'flex-start' }}>
                        {article.ai_level}
                      </span>
                      {article.ai_analysis_reports && article.ai_analysis_reports.length > 0 && (
                          <button 
                            onClick={() => setViewReport(article.ai_analysis_reports![0])}
                            style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', marginTop: 4 }}
                          >
                            Voir le détail
                          </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.85rem' }}>
                      <span className="cms-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#9ca3af' }}></span>
                      Analyse en cours...
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => handleAction(article, 'validate')} 
                        disabled={processingId === article.id}
                        className="cms-btn" 
                        style={{ background: '#10b981', color: '#fff', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    >
                      ✓ Publier
                    </button>
                    <button 
                        onClick={() => handleAction(article, 'request-revision')} 
                        disabled={processingId === article.id}
                        className="cms-btn" 
                        style={{ background: '#f59e0b', color: '#fff', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    >
                      ✏️ Demander révision
                    </button>
                    <button 
                        onClick={() => handleAction(article, 'reject')} 
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
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉</div>
                  Aucun article en attente de validation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewReport && (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }}>
            <div style={{
                background: '#fff', borderRadius: '8px', padding: '2rem',
                width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Rapport d&apos;Analyse IA</h2>
                    <button 
                        onClick={() => setViewReport(null)}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}
                    >×</button>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Indicateurs Globaux</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '6px', flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>Score de fiabilité</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: viewReport.score >= 80 ? '#059669' : (viewReport.score >= 50 ? '#d97706' : '#dc2626') }}>{viewReport.score}/100</div>
                        </div>
                        <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '6px', flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>Niveau</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{viewReport.level}</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Résumé / Recommandation</h3>
                    <p style={{ color: '#4b5563', lineHeight: 1.5 }}>{viewReport.recommendation || 'Aucune recommandation.'}</p>
                </div>

                {viewReport.flags && viewReport.flags.length > 0 && (
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Alerte(s) Détectée(s)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {viewReport.flags.map((flag: any) => (
                                <div key={flag.id} style={{ 
                                    padding: '1rem', 
                                    borderRadius: '6px', 
                                    borderLeft: `4px solid ${flag.severity === 'high' ? '#dc2626' : (flag.severity === 'medium' ? '#d97706' : '#3b82f6')}`,
                                    background: flag.severity === 'high' ? '#fef2f2' : (flag.severity === 'medium' ? '#fffbeb' : '#eff6ff') 
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <strong style={{ 
                                            textTransform: 'uppercase', fontSize: '0.75rem',
                                            color: flag.severity === 'high' ? '#991b1b' : (flag.severity === 'medium' ? '#92400e' : '#1e40af') 
                                        }}>
                                            {flag.flag_type}
                                        </strong>
                                        {flag.paragraph_index && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Paragraphe {flag.paragraph_index}</span>}
                                    </div>
                                    <div style={{ color: '#374151', fontSize: '0.9rem' }}>{flag.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
