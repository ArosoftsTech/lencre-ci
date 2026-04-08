import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { getArticles } from '@/lib/api';

/**
 * Page de Recherche — L'Encre
 * 
 * Re-construite pour restaurer la fonctionnalité de recherche.
 */
export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  
  // Utilisation de l'API générique pour l'instant (la recherche filtrée viendra plus tard)
  const response = await getArticles();
  const allArticles = response.data;
  
  // Filtrage local simple pour la reconstruction
  const results = allArticles.filter((a: any) => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  return (
      <div className="search-page">
        <header className="search-page__header" style={{ padding: '60px 0', borderBottom: '1px solid #eee' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h1 className="search-page__title" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px' }}>
              Résultats pour : <span style={{ color: 'var(--bleu-nuit)' }}>"{query}"</span>
            </h1>
            <p className="search-page__count" style={{ color: '#666' }}>{results.length} articles trouvés</p>
          </div>
        </header>

        <section className="search-page__results" style={{ padding: '60px 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            {results.length > 0 ? (
              <div className="search-page__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {results.map((article: any) => (
                  <ArticleCard key={article.id} article={article} variant="default" />
                ))}
              </div>
            ) : (
              <div className="search-page__empty" style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Aucun résultat pour cette recherche.</p>
              </div>
            )}
          </div>
        </section>
      </div>
  );
}
