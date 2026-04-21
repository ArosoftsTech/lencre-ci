import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import '../page.css';

export const revalidate = 60;

export default async function VideoAudioPage() {
  const [vidRes, audRes] = await Promise.all([
    getArticles({ category: 'video' }),
    getArticles({ category: 'audio' }),
  ]);

  const allArticles = [...vidRes.data, ...audRes.data].sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return (
    <div className="category-page container">
      <header className="category-page__header">
        <h1 className="section-title">Vidéo & Audio</h1>
        <p className="category-page__description">
          Vivez l'info en son et en images : reportages exclusifs, podcasts et débats.
        </p>
      </header>

      <div className="video-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem', 
        marginTop: '2rem' 
      }}>
        {allArticles.map((article) => (
          <div key={article.id} className="video-item" style={{ position: 'relative' }}>
             <ArticleCard article={article} variant="default" />
             <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                zIndex: 2,
                pointerEvents: 'none'
             }}>
                {article.category.slug.toUpperCase()}
             </div>
          </div>
        ))}
      </div>

      {allArticles.length === 0 && (
        <p style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          Aucun média disponible pour le moment.
        </p>
      )}
    </div>
  );
}
