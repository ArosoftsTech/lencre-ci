'use client';

import { useState } from 'react';
import './SubscribeModal.css';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    setSubmitted(true);

    // Reset après 3 secondes
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
      setName('');
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="subscribe-modal__overlay" onClick={onClose}>
      <div className="subscribe-modal" onClick={(e) => e.stopPropagation()}>
        {/* Bouton fermer */}
        <button className="subscribe-modal__close" onClick={onClose} aria-label="Fermer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="subscribe-modal__header">
              <div className="subscribe-modal__logo">
                <span className="subscribe-modal__logo-l">ℓ</span>
                <span className="subscribe-modal__logo-text">encre</span>
              </div>
              <h2 className="subscribe-modal__title">Restez informé</h2>
              <p className="subscribe-modal__subtitle">
                Recevez chaque jour les actualités les plus importantes directement dans votre boîte mail.
              </p>
            </div>

            {/* Formulaire */}
            <form className="subscribe-modal__form" onSubmit={handleSubmit}>
              <div className="subscribe-modal__field">
                <label htmlFor="subscribe-name" className="subscribe-modal__label">
                  Nom complet
                </label>
                <input
                  id="subscribe-name"
                  type="text"
                  className="subscribe-modal__input"
                  placeholder="Ex: Jean Kouadio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="subscribe-modal__field">
                <label htmlFor="subscribe-email" className="subscribe-modal__label">
                  Adresse e-mail
                </label>
                <input
                  id="subscribe-email"
                  type="email"
                  className="subscribe-modal__input"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="subscribe-modal__submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="subscribe-modal__spinner"></span>
                ) : (
                  "S'abonner gratuitement"
                )}
              </button>

              <p className="subscribe-modal__privacy">
                🔒 Vos données sont protégées. Désabonnement en un clic.
              </p>
            </form>

            {/* Avantages */}
            <div className="subscribe-modal__benefits">
              <div className="subscribe-modal__benefit">
                <span className="subscribe-modal__benefit-icon">📰</span>
                <span>Actualités exclusives</span>
              </div>
              <div className="subscribe-modal__benefit">
                <span className="subscribe-modal__benefit-icon">⚡</span>
                <span>Alertes en temps réel</span>
              </div>
              <div className="subscribe-modal__benefit">
                <span className="subscribe-modal__benefit-icon">🎯</span>
                <span>Contenus personnalisés</span>
              </div>
            </div>
          </>
        ) : (
          /* Message de succès */
          <div className="subscribe-modal__success">
            <div className="subscribe-modal__success-icon">✅</div>
            <h2 className="subscribe-modal__success-title">Bienvenue !</h2>
            <p className="subscribe-modal__success-text">
              Votre abonnement a bien été pris en compte. Vérifiez votre boîte mail pour confirmer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
