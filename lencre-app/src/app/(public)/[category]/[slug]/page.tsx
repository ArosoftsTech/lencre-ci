import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug, getTrendingArticles } from '@/lib/api';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import './page.css';

type Props = {
  params: { category: string; slug: string };
};

// Génération dynamique des métadonnées (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let article = null;
  try {
    article = await getArticleBySlug(params.slug);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article pour les métadonnées:", error);
  }

  if (!article || article.category.slug !== params.category) {
    return { title: "Article introuvable — L'Encre" };
  }

  return {
    title: `${article.title} — L'Encre`,
    description: article.excerpt,
    openGraph: {
      images: [article.featured_image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  // 1. Récupérer l'article concerné
  let article = null;
  try {
    article = await getArticleBySlug(params.slug);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error);
  }

  // 2. Erreur 404 si non trouvé ou si l'URL /categorie/ ne match pas sa vraie catégorie
  if (!article || article.category.slug !== params.category) {
    notFound();
  }

  // 3. Articles recommandés (les plus lus / tendances) pour la sidebar
  let trendingArticles: any[] = [];
  try {
    const rawTrending = await getTrendingArticles();
    if (rawTrending && Array.isArray(rawTrending)) {
      trendingArticles = rawTrending;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des articles tendances:", error);
  }
  
  trendingArticles = trendingArticles.filter((a) => a.id !== article.id).slice(0, 3);

  // 4. Couleur du badge
  const badgeColor = article.category.color_code === '#C1121F' ? 'badge--rouge' : 'badge--bleu';

  // Pour la date
  const publishDate = new Date(article.published_at || article.created_at);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(publishDate);

  return (
    <main className="article-page">
      <div className="container article-page__container">
        {/* Colonne Principale (70%) */}
        <article className="article-page__main">
          {/* Header de l'article */}
          <header className="article-page__header">
            <Link href={`/${article.category.slug}`} className={`badge ${badgeColor} article-page__badge`}>
              {article.category.name}
            </Link>
            <h1 className="article-page__title">{article.title}</h1>
            {/* L'API Laravel ne renvoie pas 'subtitle' par défaut, on peut retirer ou réutiliser 'excerpt' si besoin */}
            
            <div className="article-page__meta">
              <div className="article-page__author-info">
                <span className="article-page__author-name">Par {article.author.name}</span>
                <span className="article-page__date">Le {formattedDate}</span>
              </div>

            </div>
          </header>

          {/* Image Principale (Hero) */}
          <figure className="article-page__hero">
            <div className="article-page__hero-img-container">
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                className="article-page__hero-img"
                priority
              />
            </div>
            {/* L'API Laravel ne renvoie pas 'imageCaption' pour l'instant */}
          </figure>

          {/* Corps de l'article (Provenant de l'API Laravel) */}
          <div className="article-page__body">
            <p className="article-page__lead">
              <strong>{article.excerpt}</strong>
            </p>
            
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Boutons de partage */}
          <ShareButtons 
            contentId={article.id} 
            title={article.title} 
            initialShareCount={article.shares_count} 
            contentType="article"
          />

        </article>

        {/* Colonne Latérale (30%) */}
        <aside className="article-page__sidebar">
          {/* Espace Pub */}
          <div className="article-page__ad">
            <span className="article-page__ad-label">Publicité</span>
            <div className="article-page__ad-placeholder">
              <p>Espace Publicitaire<br/>300x250</p>
            </div>
          </div>

          {/* Trending */}
          <div className="article-page__trending">
            <h3 className="sidebar-title">Les plus lus</h3>
            <div className="article-page__trending-list">
              {trendingArticles.map((tArticle, index) => (
                <Link key={tArticle.id} href={`/${tArticle.category.slug}/${tArticle.slug}`} className="trending-item">
                  <span className="trending-item__number">{index + 1}</span>
                  <div className="trending-item__content">
                    <h4 className="trending-item__title">{tArticle.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Espace Pub Vertical */}
          <div className="article-page__ad article-page__ad--sticky">
            <span className="article-page__ad-label">Publicité</span>
            <div className="article-page__ad-placeholder article-page__ad-placeholder--tall">
              <p>Espace Publicitaire<br/>300x600</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
