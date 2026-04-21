'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/auth';

interface JobOfferFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function JobOfferForm({ initialData, isEdit }: JobOfferFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company_name: initialData?.company_name || '',
    company_logo: initialData?.company_logo || '',
    description: initialData?.description || '',
    sector: initialData?.sector || '',
    education_level: initialData?.education_level || '',
    type: initialData?.type || 'emploi',
    location: initialData?.location || 'Abidjan',
    featured_image: initialData?.featured_image || '',
    is_featured: initialData?.is_featured || false,
    status: initialData?.status || 'draft',
    deadline_at: initialData?.deadline_at ? initialData.deadline_at.split('T')[0] : '',
    external_link: initialData?.external_link || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/job-offers/${initialData.id}` : '/job-offers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la sauvegarde');
      }

      router.push('/admin/job-offers');
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      {/* SECTION : INFORMATIONS GÉNÉRALES */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Informations Générales
        </h2>
        
        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Titre de l'offre *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="cms-form__input"
              placeholder="ex: Développeur Fullstack"
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Entreprise *</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="cms-form__input"
              placeholder="Nom de l'entreprise"
            />
          </div>
        </div>

        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Secteur d'activité</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="cms-form__input"
              placeholder="Ex: Informatique, BTP, Santé..."
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Niveau d'études requis</label>
            <input
              type="text"
              value={formData.education_level}
              onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
              className="cms-form__input"
              placeholder="Ex: BAC+3, Master..."
            />
          </div>
        </div>

        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Type de contrat *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="cms-form__select"
            >
              <option value="emploi">CDI / CDD (Emploi)</option>
              <option value="stage">Stage</option>
              <option value="freelance">Freelance / Indépendant</option>
              <option value="consultance">Consultance</option>
            </select>
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Localisation</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="cms-form__input"
              placeholder="Ville ou région"
            />
          </div>
        </div>
      </section>

      {/* SECTION : DÉTAILS DU POSTE */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Détails du Poste
        </h2>

        <div className="cms-form__group">
          <label className="cms-form__label">Description de l'offre</label>
          <textarea
            rows={8}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="cms-form__textarea"
            placeholder="Décrivez les missions, le profil recherché..."
          />
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">Lien externe pour postuler (Optionnel)</label>
          <input
            type="url"
            value={formData.external_link}
            onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
            className="cms-form__input"
            placeholder="https://..."
          />
          <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.4rem' }}>
            Si renseigné, le bouton "Postuler" redirigera vers ce lien.
          </p>
        </div>
      </section>

      {/* SECTION : PUBLICATION & VISIBILITÉ */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Publication & Visibilité
        </h2>

        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Date limite de candidature</label>
            <input
              type="date"
              value={formData.deadline_at}
              onChange={(e) => setFormData({ ...formData, deadline_at: e.target.value })}
              className="cms-form__input"
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Statut de l'offre</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="cms-form__select"
            >
              <option value="draft">Brouillon (Invisible)</option>
              <option value="published">Publié (En ligne)</option>
              {isEdit && <option value="archived">Archivé</option>}
            </select>
          </div>
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">Illustration / Image de couverture (URL)</label>
          <input
            type="url"
            value={formData.featured_image}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
            className="cms-form__input"
            placeholder="URL de l'image (optionnel)"
          />
        </div>

        <div className="cms-form__group">
          <label className="cms-form__checkbox">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            />
            <span>Mettre cette offre à la une (Boost de visibilité)</span>
          </label>
        </div>
      </section>

      <div className="cms-form__actions">
        <button type="button" onClick={() => router.back()} disabled={loading} className="cms-btn cms-btn--secondary">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="cms-btn cms-btn--primary">
          {loading ? 'Traitement en cours...' : (isEdit ? 'Mettre à jour l\'offre' : 'Publier l\'offre d\'emploi')}
        </button>
      </div>
    </form>
  );
}
