'use client';

const breakingNews = [
  { id: 'bn1', text: 'Urgent : Remaniement ministériel annoncé pour ce soir à 20h00', href: '/politique/remaniement' },
  { id: 'bn2', text: 'Football : Les Éléphants remportent le tournoi qualificatif de la CAN', href: '/sport/football-can' },
  { id: 'bn3', text: 'Économie : Le nouveau pont de Cocody officiellement ouvert à la circulation', href: '/economie/pont-cocody' },
];

import './BreakingNewsTicker.css';

/**
 * BreakingNewsTicker Component — L'Encre
 * 
 * Bandeau défilant en bas de page avec les alertes breaking news.
 * Fond rouge profond, texte blanc, badge URGENT en jaune.
 */
export default function BreakingNewsTicker() {
  if (breakingNews.length === 0) return null;

  // Dupliquer les news pour un défilement continu
  const tickerItems = [...breakingNews, ...breakingNews];

  return (
    <div className="ticker" role="marquee" aria-label="Dernières alertes">
      <div className="ticker__label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        ALERTE
      </div>
      <div className="ticker__track">
        <div className="ticker__content">
          {tickerItems.map((item, index) => (
            <span key={`${item.id}-${index}`} className="ticker__item">
              {item.text}
              <span className="ticker__separator">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
