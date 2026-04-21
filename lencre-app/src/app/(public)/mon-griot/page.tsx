import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { getArticles } from '@/lib/api';
import '../../[category]/page.css';

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
      <div className="category-page container">
        <header className="category-page__header">
            <h1 className="section-title">Mon Griot</h1>
            <p className="category-page__description">
              Toute l'actualité en temps réel
            </p>
        </header>

        {articles.length > 0 ? (
          <div className="category-page__grid">
            {articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        ) : (
          <div className="category-page__empty">
            <p>Aucun article publié pour le moment.</p>
            <Link href="/" className="btn btn--primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              Retour à l'accueil
            </Link>
          </div>
        )}

        {/* Pagination UI - À implémenter plus tard si nécessaire */}
        {response.last_page > 1 && (
          <div className="category-page__pagination">
            <p className="category-page__page-info">Page {response.current_page} sur {response.last_page}</p>
          </div>
        )}
      </div>
  );
}
