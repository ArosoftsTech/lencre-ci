"use client";

import Link from 'next/link';
import Image from 'next/image';
import './Footer.css';

/**
 * Footer Component — L'Encre
 * 
 * Fond blanc avec 4 colonnes (logo/description, rubriques, à propos, newsletter/réseaux sociaux).
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container container">
        <div className="footer__grid">
          
          {/* Colonne 1: Logo & Description */}
          <div className="footer__col">
            <Link href="/" className="footer__logo" aria-label="L'Encre - Accueil">
              <Image src="/images/logo-encre.png" alt="L'Encre" width={180} height={54} className="footer__logo-img" />
            </Link>
            <p className="footer__description">
              L'information comme source de liberté par les journalistes ivoiriens. L'actualité qui fait avancer la Côte d'Ivoire en un seul endroit.
            </p>
          </div>

          {/* Colonne 2: Rubriques */}
          <div className="footer__col">
            <h3 className="footer__col-title">Rubriques</h3>
            <ul className="footer__menu">
              <li><Link href="/mon-griot" className="footer__link">Le griot</Link></li>
              <li><Link href="/eco-politique" className="footer__link">Eco et Politique</Link></li>
              <li><Link href="/societe-culture" className="footer__link">Société et Culture</Link></li>
              <li><Link href="/sante-sport" className="footer__link">Santé et Sport</Link></li>
              <li><Link href="/video-audio" className="footer__link">Video et Audio</Link></li>
            </ul>
          </div>

          {/* Colonne 3: À propos */}
          <div className="footer__col">
            <h3 className="footer__col-title">À propos</h3>
            <ul className="footer__menu">
              <li><Link href="/nous-rejoindre" className="footer__link">Nous rejoindre</Link></li>
              <li><Link href="/contact" className="footer__link">Nous contacter</Link></li>
              <li><Link href="/mentions-legales" className="footer__link">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="footer__link">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Colonne 4: Newsletter & Réseaux */}
          <div className="footer__col">
            <h3 className="footer__col-title">Newsletter</h3>
            <p className="footer__newsletter-desc">
              Abonnez-vous à notre newsletter pour ne rien rater.
            </p>
            <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Adresse e-mail" required className="footer__input" />
              <button type="submit" className="footer__btn">S'inscrire</button>
            </form>
            
            <div className="footer__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} L'Encre.info - Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
