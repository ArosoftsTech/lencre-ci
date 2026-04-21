'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/auth';

interface MultimediaFormProps {
  initialData?: any;
  isEdit?: boolean;
  fetchFn?: typeof adminFetch;
  redirectPath?: string;
  showStatusField?: boolean;
}

export default function MultimediaForm({ 
  initialData, 
  isEdit, 
  fetchFn = adminFetch, 
  redirectPath = '/admin/multimedia',
  showStatusField = true 
}: MultimediaFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'video',
    external_url: initialData?.external_url || '',
    embed_url: initialData?.embed_url || '',
    thumbnail: initialData?.thumbnail || '',
    duration: initialData?.duration || '',
    is_featured: initialData?.is_featured || false,
    status: initialData?.status || 'draft',
  });

  const [loading, setLoading] = useState(false);
  const [previewEmbed, setPreviewEmbed] = useState(initialData?.embed_url || '');

  const generateYouTubeEmbed = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return null;
  };

  const generateYouTubeThumbnail = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    return null;
  };

  const handleExternalUrlChange = (url: string) => {
    const newData = { ...formData, external_url: url };

    // Auto-générer l'embed URL YouTube
    const embedUrl = generateYouTubeEmbed(url);
    if (embedUrl) {
      newData.embed_url = embedUrl;
      setPreviewEmbed(embedUrl);
    }

    // Auto-générer la miniature YouTube si vide
    if (!formData.thumbnail && formData.type === 'video') {
      const thumb = generateYouTubeThumbnail(url);
      if (thumb) newData.thumbnail = thumb;
    }

    setFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/multimedia/${initialData.id}` : '/multimedia';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetchFn(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la sauvegarde');
      }

      router.push(redirectPath);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      {/* SECTION : TYPE & INFORMATIONS */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
          Informations du Média
        </h2>

        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Titre *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="cms-form__input"
              placeholder="ex: Interview exclusive du Ministre"
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Type de média *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="cms-form__select"
            >
              <option value="video">🎬 Vidéo</option>
              <option value="podcast">🎧 Podcast</option>
            </select>
          </div>
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">URL externe * (YouTube, SoundCloud, Spotify...)</label>
          <input
            type="url"
            required
            value={formData.external_url}
            onChange={(e) => handleExternalUrlChange(e.target.value)}
            className="cms-form__input"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.4rem' }}>
            Collez le lien YouTube, SoundCloud ou Spotify. L&apos;embed sera généré automatiquement pour YouTube.
          </p>
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="cms-form__textarea"
            placeholder="Décrivez le contenu de ce média..."
          />
        </div>
      </section>

      {/* SECTION : DÉTAILS TECHNIQUES */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Détails Techniques
        </h2>

        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Durée</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="cms-form__input"
              placeholder="ex: 12:05 ou 1:28:30"
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">URL embed (iframe)</label>
            <input
              type="text"
              value={formData.embed_url}
              onChange={(e) => { setFormData({ ...formData, embed_url: e.target.value }); setPreviewEmbed(e.target.value); }}
              className="cms-form__input"
              placeholder="Auto-généré pour YouTube"
            />
          </div>
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">URL miniature (thumbnail)</label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="cms-form__input"
            placeholder="Auto-généré pour YouTube"
          />
          {formData.thumbnail && (
            <div style={{ marginTop: '0.75rem' }}>
              <img src={formData.thumbnail} alt="Aperçu miniature" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
          )}
        </div>

        {/* Aperçu embed */}
        {previewEmbed && (
          <div className="cms-form__group">
            <label className="cms-form__label">Aperçu intégré</label>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <iframe
                src={previewEmbed}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Aperçu"
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION : PUBLICATION */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Publication & Visibilité
        </h2>

        {showStatusField && (
          <div className="cms-form__group">
            <label className="cms-form__label">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="cms-form__select"
            >
              <option value="draft">Brouillon (Invisible)</option>
              <option value="published">Publié (En ligne)</option>
            </select>
          </div>
        )}

        <div className="cms-form__group">
          <label className="cms-form__checkbox">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            />
            <span>Mettre ce média à la une (Boost de visibilité)</span>
          </label>
        </div>
      </section>

      <div className="cms-form__actions">
        <button type="button" onClick={() => router.back()} disabled={loading} className="cms-btn cms-btn--secondary">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="cms-btn cms-btn--primary">
          {loading ? 'Traitement en cours...' : (isEdit ? 'Mettre à jour' : 'Enregistrer le média')}
        </button>
      </div>
    </form>
  );
}
