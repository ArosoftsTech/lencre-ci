import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { getArticles } from '@/lib/api';

/**
 * Page de Catégorie — L'Encre
 * 
 * Affiche la liste des articles pour une catégorie donnée.
 * Re-construite après la réorganisation du layout.
 */
export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category: categorySlug } = params;
  
  // Récupération des articles de la catégorie
  let articles: any[] = [];
  try {
    const response = await getArticles({ category: categorySlug });
    articles = response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    // On continue avec un tableau vide, la page affichera "Aucun article trouvé"
  }
  
  const categoryName = articles.length > 0 ? articles[0].category.name : categorySlug.replace(/-/g, ' ').toUpperCase();

  return (
      <div className="category-page">
        <header className="category-page__header" style={{ padding: '60px 0', backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
          <div className="container">
            <nav className="category-page__breadcrumb" style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
              <Link href="/">Accueil</Link> / <span>{categoryName}</span>
            </nav>
            <h1 className="category-page__title" style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase' }}>
              {categoryName}
            </h1>
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
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Aucun article trouvé dans cette catégorie.</p>
                <Link href="/" className="btn btn--primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                  Retour à l'accueil
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
  );
}
