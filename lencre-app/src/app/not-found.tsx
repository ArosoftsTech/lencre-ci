import Link from 'next/link';
import Image from 'next/image';
import './not-found.css';

export default function NotFound() {
  return (
    <main className="not-found-container">
      <div className="not-found-card">
        {/* Logo L'Encre */}
        <div className="not-found-logo">
          <Image 
            src="/images/logo-encre.png" 
            alt="L'Encre" 
            width={220} 
            height={60} 
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page introuvable</h2>
        
        <p className="not-found-text">
          L&apos;encre a séché sur cette page... Le contenu que vous recherchez semble avoir été déplacé, supprimé ou n&apos;a jamais existé.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="not-found-btn not-found-btn--primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Retour à l'accueil
          </Link>
          <Link href="/recherche" className="not-found-btn not-found-btn--outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Rechercher un article
          </Link>
        </div>
      </div>
    </main>
  );
}
