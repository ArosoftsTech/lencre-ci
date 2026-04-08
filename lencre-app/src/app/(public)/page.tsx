import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import { getTrendingArticles, getArticles } from '@/lib/api';
import './page.css';

const videoItems = [
  {
    id: 'v1',
    title: 'Débat Hebdo : Quel avenir pour la tech africaine ?',
    duration: '45:20',
    thumbnailUrl: 'https://picsum.photos/seed/video1/800/450',
    views: '12.5k',
    type: 'Débat'
  },
  {
    id: 'v2',
    title: 'Immersion : Au cœur des marchés d\'Abidjan',
    duration: '12:05',
    thumbnailUrl: 'https://picsum.photos/seed/video2/800/450',
    views: '8.2k',
    type: 'Reportage'
  },
  {
    id: 'v3',
    title: 'Interview : Le Ministre de l\'Économie répond',
    duration: '28:10',
    thumbnailUrl: 'https://picsum.photos/seed/video3/800/450',
    views: '45k',
    type: 'Interview'
  }
];

/**
 * Page d'Accueil — L'Encre
 * 
 * Re-construite après la réorganisation du layout.
 * Enveloppée dans PublicLayoutWrapper pour inclure Header/Footer.
 */
export default async function HomePage() {
  const [monGriotArticles, mainArticlesResponse] = await Promise.all([
    getTrendingArticles(),
    getArticles(),
  ]);
  const mainArticles = mainArticlesResponse.data;

  // Préparer les slides pour le carousel (les 5 premiers articles)
  const heroSlides = mainArticles.slice(0, 5);
  // Les tendances pour la sidebar avec miniatures
  const trendItems = monGriotArticles.slice(0, 4);

  return (
      <div className="home">
        {/* =================================================================
           Section 0 — Hero Carousel Dynamique
           ================================================================= */}
        <HeroCarousel slides={heroSlides} trends={trendItems} />

        {/* =================================================================
           Section 1 — Mon Griot
           ================================================================= */}
        <section className="home__griot" aria-label="Mon Griot">
          <div className="container">
            <div className="home__griot-header">
              <h2 className="section-title section-title--light">Mon Griot</h2>
              <Link href="/mon-griot" className="home__griot-more">
                Tout voir
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
            <div className="home__griot-grid">
              {monGriotArticles.slice(0, 4).map((article: any) => (
                <article key={article.id} className="home__griot-card">
                  <Link href={`/${article.category.slug}/${article.slug}`} className="home__griot-card-link">
                    <div className="home__griot-card-image">
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="home__griot-card-img"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <span className={`badge ${article.category.color_code === '#C1121F' ? 'badge--rouge' : 'badge--bleu'} home__griot-badge`}>
                        {article.category.name}
                      </span>
                    </div>
                    <h3 className="home__griot-card-title">{article.title}</h3>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
           Section 2 — Articles Principaux
           ================================================================= */}
        <section className="home__main" aria-label="Articles à la une">
          <div className="container">
            <h2 className="section-title">À la Une</h2>
            <div className="home__main-grid">
              <div className="home__main-hero">
                <ArticleCard article={mainArticles[0]} variant="hero" />
              </div>
              <div className="home__main-sidebar">
                {mainArticles.slice(1, 4).map((article: any) => (
                  <ArticleCard key={article.id} article={article} variant="default" />
                ))}
              </div>
            </div>

            <div className="home__main-row">
              {mainArticles.slice(4).map((article: any) => (
                <ArticleCard key={article.id} article={article} variant="default" />
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — Vidéo & Audio */}
        <section className="home__video" aria-label="Vidéo et Audio">
           <div className="container">
             <div className="home__video-header">
               <h2 className="section-title section-title--light">Vidéo &amp; Audio</h2>
               <Link href="/video-audio" className="home__video-more">Tout voir</Link>
             </div>
             <div className="home__video-grid">
               {videoItems.map((item) => (
                 <article key={item.id} className="home__video-card">
                   <div className="home__video-card-thumb">
                     <Image
                       src={item.thumbnailUrl}
                       alt={item.title}
                       width={420}
                       height={236}
                       className="home__video-card-img"
                       sizes="(max-width: 768px) 100vw, 33vw"
                     />
                     <div className="home__video-card-play">▶</div>
                   </div>
                   <h3 className="home__video-card-title">{item.title}</h3>
                 </article>
               ))}
             </div>
           </div>
        </section>
      </div>
  );
}
