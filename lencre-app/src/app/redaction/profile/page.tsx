'use client';

import { useState, useEffect, FormEvent } from 'react';
import { redactionFetch } from '@/lib/redactionAuth';

export default function RedactionProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    redactionFetch('/redaction/profile')
      .then(res => res.json())
      .then(data => {
        setName(data.user.name);
        setEmail(data.user.email);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (password && password !== passwordConfirmation) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const body: any = { name };
      if (password) {
        body.password = password;
        body.password_confirmation = passwordConfirmation;
      }

      const res = await redactionFetch('/redaction/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setPassword('');
      setPasswordConfirmation('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="cms-header">
        <h1>Mon Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="cms-form" style={{ maxWidth: '600px' }}>
        {message.text && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            background: message.type === 'success' ? '#e6f4ea' : '#fdecea',
            color: message.type === 'success' ? '#1b7a3a' : '#c1121f'
          }}>
            {message.text}
          </div>
        )}

        <div className="cms-form__group">
          <label className="cms-form__label">Nom complet</label>
          <input
            type="text"
            className="cms-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">Adresse e-mail (Non modifiable)</label>
          <input
            type="email"
            className="cms-form__input"
            value={email}
            disabled
            style={{ background: '#f5f5f5', color: '#888' }}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' }} />
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Changer le mot de passe</h3>

        <div className="cms-form__group">
          <label className="cms-form__label">Nouveau mot de passe <small>(Optionnel)</small></label>
          <input
            type="password"
            className="cms-form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
          />
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            className="cms-form__input"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            minLength={6}
          />
        </div>

        <div className="cms-form__actions">
          <button type="submit" className="cms-btn cms-btn--primary" disabled={loading} style={{ background: '#3b82f6' }}>
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
