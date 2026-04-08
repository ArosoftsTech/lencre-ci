import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import './page.css';

type Props = {
  params: { slug: string }; // In API context, we use the author's numerical ID or slug string. We'll pass ID.
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const authorId = parseInt(params.slug);
  if (isNaN(authorId)) return { title: "Auteur introuvable — L'Encre" };

  const response = await getArticles({ author_id: authorId });
  const authorArticles = response.data;

  if (authorArticles.length === 0) {
    return { title: "Auteur introuvable — L'Encre" };
  }

  const author = authorArticles[0].author;
  return {
    title: `${author.name} — L'Encre`,
    description: `Tous les articles publiés par ${author.name} sur L'Encre.`,
  };
}

export default async function AuthorPage({ params }: Props) {
  const authorId = parseInt(params.slug);
  if (isNaN(authorId)) notFound();

  // 1. Récupérer tous les articles de l'auteur par ID
  const response = await getArticles({ author_id: authorId });
  const authorArticles = response.data;

  // 2. Si aucun article, on affiche 404 (idéalement l'API fournirait l'auteur indépendamment)
  if (authorArticles.length === 0) {
    notFound();
  }

  // 3. Infos de l'auteur depuis la relation de l'article
  const author = authorArticles[0].author;
  const articleCount = authorArticles.length;

  return (
    <main className="author-page">
      <div className="container">
        {/* En-tête de l'auteur */}
        <header className="author-page__header">
          <div className="author-page__profile">
            <div className="author-page__avatar">
              {/* Le backend ne retourne pas d'avatarUrl par défaut dans User. On utilise ses initiales. */}
              <span className="author-page__initials">
                {author.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="author-page__info">
              <h1 className="author-page__name">{author.name}</h1>
              <p className="author-page__role">{author.role || 'Journaliste / Rédacteur'}</p>
              <p className="author-page__stats">
                {articleCount} article{articleCount > 1 ? 's' : ''} publié{articleCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </header>

        {/* Liste des articles */}
        <div className="author-page__content">
          <h2 className="author-page__section-title">Ses publications</h2>
          
          <div className="author-page__grid">
            {authorArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>

        {/* Pagination simulée */}
        {articleCount > 0 && (
          <div className="author-page__pagination">
            <button className="author-page__btn" disabled>Précédent</button>
            <span className="author-page__page-info">Page 1 sur 1</span>
            <button className="author-page__btn" disabled>Suivant</button>
          </div>
        )}
      </div>
    </main>
  );
}
