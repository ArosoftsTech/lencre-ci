import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import './ArticleCard.css';

/**
 * ArticleCard Component — L'Encre
 * 
 * Carte article avec :
 * - Image 16:9 avec badge rubrique
 * - Titre en Montserrat Bold
 * - Extrait tronqué (2 lignes max)
 * - Auteur et date
 * - Animation hover (élévation + translation)
 * 
 * Props:
 * - article: données de l'article provenant de l'API
 * - variant: 'default' | 'compact' | 'hero' (taille de la carte)
 */
interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'hero';
}

/**
 * Formater la date au format français : Le JJ/MM/AAAA
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `Le ${day}/${month}/${year}`;
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  // Le nouveau format pour la couleur côté Laravel est '#C1121F' ou autre hex.
  // Pour garder la logique CSS, on compare le code ou on peut utiliser un slug.
  // Le style badge--rouge est pour '#C1121F' (rouge l'encre).
  const badgeColor = article.category.color_code === '#C1121F' ? 'badge--rouge' : 'badge--bleu';

  return (
    <article className={`article-card article-card--${variant}`}>
      <Link href={`/${article.category.slug}/${article.slug}`} className="article-card__link">
        {/* Image */}
        <div className="article-card__image-wrapper">
          <Image
            src={article.featured_image}
            alt={article.title}
            width={640}
            height={360}
            className="article-card__image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className={`badge article-card__badge ${badgeColor}`}>
            {article.category.name}
          </span>
          {article.is_urgent && (
            <span className="badge badge--jaune article-card__badge-urgent">
              Urgent
            </span>
          )}
        </div>

        {/* Contenu */}
        <div className="article-card__content">
          <h3 className="article-card__title">{article.title}</h3>
          {variant !== 'compact' && (
            <p className="article-card__excerpt">{article.excerpt}</p>
          )}
          <div className="article-card__meta">
            <span className="article-card__author">
              Par : {article.author.name}
            </span>
            <span className="article-card__date">
              {formatDate(article.published_at || article.created_at)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
