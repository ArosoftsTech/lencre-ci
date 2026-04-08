'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginRedaction } from '@/lib/redactionAuth';
import './login.css';

export default function RedactionLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginRedaction(email, password);
      router.push('/redaction');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="redaction-login">
      <div className="redaction-login__card">
        <div className="redaction-login__header">
          <div className="redaction-login__logo">
            <Image src="/images/logo-encre.png" alt="L'Encre" width={200} height={60} className="redaction-login__logo-img" />
          </div>
          <p className="redaction-login__subtitle" style={{ color: '#3b82f6' }}>Espace Newsroom</p>
        </div>

        <form onSubmit={handleSubmit} className="redaction-login__form">
          {error && <div className="redaction-login__error">{error}</div>}

          <div className="redaction-login__field">
            <label htmlFor="email">Adresse e-mail Rédacteur</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="journaliste@lencre.ci"
              required
              autoFocus
            />
          </div>

          <div className="redaction-login__field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="redaction-login__submit"
            style={{ background: '#3b82f6' }}
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Accéder au Newsroom'}
          </button>
        </form>
      </div>
    </div>
  );
}
