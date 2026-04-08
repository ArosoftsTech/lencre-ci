'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SubscribeModal from '@/components/SubscribeModal/SubscribeModal';
import './Header.css';
const mainNav = [
  { label: 'Politique', href: '/politique' },
  { label: 'Économie', href: '/economie' },
  { label: 'Culture', href: '/culture' },
  { label: 'Etude & Emploi', href: '/etude-emploi' },
  { label: 'Sport', href: '/sport' },
  { label: 'Société', href: '/societe' },
  { label: 'Vidéo & Audio', href: '/video-audio' },
];



/**
 * Header Component — L'Encre
 * 
 * Header fixe bleu nuit avec :
 * - Barre supérieure : logo, recherche, réseaux sociaux
 * - Menu principal (1ère ligne de navigation)
 * - Menu secondaire (2ème ligne, fond plus sombre)
 * - Menu burger responsive sur mobile
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header" role="banner">
      {/* Barre supérieure */}
      <div className="header__top">
        <div className="header__top-inner container">
          {/* Logo */}
          <Link href="/" className="header__logo" aria-label="L'Encre - Accueil">
            <Image src="/images/logo-encre.png" alt="L'Encre" width={180} height={50} className="header__logo-img" />
          </Link>

          {/* Recherche */}
          <Link href="/recherche" className="header__search" aria-label="Rechercher">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          {/* Réseaux sociaux + Notifications */}
          <div className="header__actions">
            {/* Icône cloche notifications */}
            <Link href="/notifications" className="header__notification" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="header__notification-badge">3</span>
            </Link>

            {/* Réseaux sociaux */}
            <div className="header__socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="header__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="header__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="header__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="header__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="header__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Burger mobile */}
            <button
              className={`header__burger ${mobileMenuOpen ? 'header__burger--active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation desktop */}
      <nav className="header__nav-primary" aria-label="Menu principal">
        <div className="header__nav-inner container" style={{ position: 'relative' }}>
          <div className="header__nav-links">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="header__nav-link">
                {item.label}
              </Link>
            ))}
          </div>
          <button
            className="header__subscribe-btn"
            onClick={() => setIsSubscribeOpen(true)}
          >
            S&apos;abonner
          </button>
        </div>
      </nav>



      {/* Navigation mobile (slide-in) */}
      <div className={`header__mobile-menu ${mobileMenuOpen ? 'header__mobile-menu--open' : ''}`}>
        <div className="header__mobile-menu-overlay" onClick={toggleMobileMenu}></div>
        <nav className="header__mobile-menu-panel" aria-label="Menu mobile">
          <div className="header__mobile-section">
            <h3 className="header__mobile-section-title">Menu Principal</h3>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header__mobile-link"
                onClick={toggleMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <button
              className="header__mobile-link header__mobile-link--subscribe"
              onClick={() => {
                toggleMobileMenu();
                setIsSubscribeOpen(true);
              }}
            >
              S&apos;abonner
            </button>
          </div>

        </nav>
      </div>
      {/* Modal d'abonnement */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </header>
  );
}
