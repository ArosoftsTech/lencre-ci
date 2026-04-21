import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import { getTrendingArticles, getArticles, getMultimedia } from '@/lib/api';
import './page.css';

/**
 * Page d'Accueil — L'Encre
 * 
 * Re-construite après la réorganisation du layout.
 * Enveloppée dans PublicLayoutWrapper pour inclure Header/Footer.
 */
export default async function HomePage() {
  const [monGriotArticles, mainArticlesResponse, multimediaResponse] = await Promise.all([
    getTrendingArticles(),
    getArticles(),
    getMultimedia({ per_page: 6 }),
  ]);
  const mainArticles = mainArticlesResponse.data;
  const multimediaItems = multimediaResponse.data;

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

        {/* Section 3 — Vidéo & Audio (Dynamique) */}
        <section className="home__video" aria-label="Vidéo et Audio">
           <div className="container">
             <div className="home__video-header">
               <h2 className="section-title section-title--light">Vidéo &amp; Audio</h2>
               <Link href="/video-audio" className="home__video-more">Tout voir</Link>
             </div>
             <div className="home__video-grid">
               {multimediaItems.length > 0 ? (
                 multimediaItems.slice(0, 3).map((item) => (
                   <article key={item.id} className="home__video-card">
                     <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="home__video-card-link">
                       <div className="home__video-card-thumb">
                         <Image
                           src={item.thumbnail || `https://picsum.photos/seed/media${item.id}/800/450`}
                           alt={item.title}
                           width={420}
                           height={236}
                           className="home__video-card-img"
                           sizes="(max-width: 768px) 100vw, 33vw"
                         />
                         <div className="home__video-card-play">
                           {item.type === 'video' ? '▶' : '🎧'}
                         </div>
                         {item.duration && (
                           <span className="home__video-card-duration">{item.duration}</span>
                         )}
                         <span className="home__video-card-type">
                           {item.type === 'video' ? 'VIDÉO' : 'PODCAST'}
                         </span>
                       </div>
                       <h3 className="home__video-card-title">{item.title}</h3>
                     </a>
                   </article>
                 ))
               ) : (
                 <p style={{ color: 'rgba(255,255,255,0.5)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                   Aucun média disponible pour le moment.
                 </p>
               )}
             </div>
           </div>
        </section>
      </div>
  );
}
