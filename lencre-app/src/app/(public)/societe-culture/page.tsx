import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import '../page.css';

export const revalidate = 60;

export default async function SocieteCulturePage() {
  const [socRes, culRes] = await Promise.all([
    getArticles({ category: 'societe' }),
    getArticles({ category: 'culture' }),
  ]);

  const allArticles = [...socRes.data, ...culRes.data].sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return (
    <div className="category-page container">
      <header className="category-page__header">
        <h1 className="section-title">Société & Culture</h1>
        <p className="category-page__description">
          Dossiers, reportages et actualités culturelles : vivez les mutations de notre société.
        </p>
      </header>

      <div className="home__main-grid" style={{ marginTop: '2rem' }}>
        <div className="home__main-hero">
          {allArticles.length > 0 && <ArticleCard article={allArticles[0]} variant="hero" />}
        </div>
        <div className="home__main-sidebar">
          {allArticles.slice(1, 4).map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      </div>

      <div className="home__main-row" style={{ marginTop: '2rem' }}>
        {allArticles.slice(4).map((article) => (
          <ArticleCard key={article.id} article={article} variant="default" />
        ))}
      </div>

      {allArticles.length === 0 && (
        <p style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          Aucun article disponible pour le moment dans ces rubriques.
        </p>
      )}
    </div>
  );
}
