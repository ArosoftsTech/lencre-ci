import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { getArticles } from '@/lib/api';

export const metadata = {
  title: 'Mon Griot - Toute l\'actualité | L\'Encre',
  description: 'Retrouvez toute l\'actualité et les derniers articles publiés sur L\'Encre.',
};

/**
 * Page Mon Griot — L'Encre
 * 
 * Cette page sert de fil d'actualité global, affichant tous les articles récents
 * indépendamment de leur catégorie.
 */
export default async function MonGriotPage() {
  // Récupération de tous les articles (sans filtre de catégorie)
  let articles: any[] = [];
  let response: any = { last_page: 1, current_page: 1 };
  try {
    response = await getArticles();
    articles = response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
  }

  return (
      <div className="category-page">
        <header className="category-page__header" style={{ padding: '60px 0', backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
          <div className="container">
            <nav className="category-page__breadcrumb" style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
              <Link href="/">Accueil</Link> / <span>Mon Griot</span>
            </nav>
            <h1 className="category-page__title" style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase' }}>
              MON GRIOT
            </h1>
            <p style={{ marginTop: '10px', fontSize: '1.2rem', color: '#555' }}>
              Toute l'actualité en temps réel
            </p>
          </div>
        </header>

        <section className="category-page__content" style={{ padding: '60px 0' }}>
          <div className="container">
            {articles.length > 0 ? (
              <div className="category-page__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {articles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} variant="default" />
                ))}
              </div>
            ) : (
              <div className="category-page__empty" style={{ textAlign: 'center', padding: '100px 0' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Aucun article publié pour le moment.</p>
                <Link href="/" className="btn btn--primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                  Retour à l'accueil
                </Link>
              </div>
            )}
            
            {/* Pagination UI - À implémenter plus tard si nécessaire */}
            {response.last_page > 1 && (
               <div style={{ marginTop: '40px', textAlign: 'center' }}>
                 <p style={{ color: '#666' }}>Page {response.current_page} sur {response.last_page}</p>
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
                    {/* Les boutons de pagination seront ajoutés ici */}
                 </div>
               </div>
            )}
          </div>
        </section>
      </div>
  );
}
