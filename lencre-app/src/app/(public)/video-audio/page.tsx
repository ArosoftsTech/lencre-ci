import Image from 'next/image';
import { getMultimedia } from '@/lib/api';
import '../page.css';

export const revalidate = 60;

export default async function VideoAudioPage() {
  const [vidRes, audRes] = await Promise.all([
    getMultimedia({ type: 'video', per_page: 50 }),
    getMultimedia({ type: 'podcast', per_page: 50 }),
  ]);

  const videos = vidRes.data;
  const podcasts = audRes.data;

  return (
    <div className="category-page container">
      <header className="category-page__header">
        <h1 className="section-title">Vidéo & Audio</h1>
        <p className="category-page__description">
          Vivez l&apos;info en son et en images : reportages exclusifs, podcasts et débats.
        </p>
      </header>

      {/* Section Vidéos */}
      {videos.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
            🎬 Vidéos
          </h2>
          <div className="video-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '2rem',
          }}>
            {videos.map((item) => (
              <a
                key={item.id}
                href={item.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="multimedia-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="multimedia-card__thumb">
                  <Image
                    src={item.thumbnail || `https://picsum.photos/seed/vid${item.id}/800/450`}
                    alt={item.title}
                    width={800}
                    height={450}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="multimedia-card__overlay">
                    <span className="multimedia-card__play">▶</span>
                  </div>
                  {item.duration && (
                    <span className="multimedia-card__duration">{item.duration}</span>
                  )}
                </div>
                <h3 className="multimedia-card__title">{item.title}</h3>
                {item.description && (
                  <p className="multimedia-card__desc">{item.description.substring(0, 120)}...</p>
                )}
                <div className="multimedia-card__meta">
                  {item.author?.name && <span>Par {item.author.name}</span>}
                  {item.views_count > 0 && <span>{item.views_count} vues</span>}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Section Podcasts */}
      {podcasts.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
            🎧 Podcasts
          </h2>
          <div className="podcast-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '2rem',
          }}>
            {podcasts.map((item) => (
              <a
                key={item.id}
                href={item.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="multimedia-card multimedia-card--podcast"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="multimedia-card__thumb multimedia-card__thumb--podcast">
                  <Image
                    src={item.thumbnail || `https://picsum.photos/seed/pod${item.id}/800/450`}
                    alt={item.title}
                    width={800}
                    height={450}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="multimedia-card__overlay">
                    <span className="multimedia-card__play">🎧</span>
                  </div>
                  {item.duration && (
                    <span className="multimedia-card__duration">{item.duration}</span>
                  )}
                </div>
                <h3 className="multimedia-card__title">{item.title}</h3>
                {item.description && (
                  <p className="multimedia-card__desc">{item.description.substring(0, 120)}...</p>
                )}
                <div className="multimedia-card__meta">
                  {item.author?.name && <span>Par {item.author.name}</span>}
                  {item.views_count > 0 && <span>{item.views_count} écoutes</span>}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {videos.length === 0 && podcasts.length === 0 && (
        <p style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          Aucun média disponible pour le moment.
        </p>
      )}
    </div>
  );
}
