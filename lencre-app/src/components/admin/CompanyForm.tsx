'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/auth';

interface CompanyFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function CompanyForm({ initialData, isEdit }: CompanyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    logo: initialData?.logo || '',
    description: initialData?.description || '',
    website: initialData?.website || '',
    sector: initialData?.sector || '',
    is_featured: initialData?.is_featured || false,
    sort_order: initialData?.sort_order || 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/company-profiles/${initialData.id}` : '/company-profiles';
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

      router.push('/admin/companies');
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      {/* SECTION : INFORMATIONS DE L'ENTREPRISE */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Profil de l'Entreprise
        </h2>

        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Nom de l'entreprise *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="cms-form__input"
              placeholder="ex: L'Encre Press Group"
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Secteur d'activité</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="cms-form__input"
              placeholder="ex: Média, Technologie, BTP..."
            />
          </div>
        </div>

        <div className="cms-form__row">
          <div className="cms-form__group">
            <label className="cms-form__label">Site Web officiel</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="cms-form__input"
              placeholder="https://www.exemple.com"
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Ordre d'affichage (Tri)</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="cms-form__input"
              placeholder="0"
            />
          </div>
        </div>
      </section>

      {/* SECTION : IDENTITÉ VISUELLE & DESCRIPTION */}
      <section className="cms-form__section">
        <h2 className="cms-form__section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          Identité & Présentation
        </h2>

        <div className="cms-form__group">
          <label className="cms-form__label">Logo de l'entreprise (URL)</label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            className="cms-form__input"
            placeholder="URL du logo (format carré recommandé)"
          />
        </div>

        <div className="cms-form__group">
          <label className="cms-form__label">À propos de l'entreprise</label>
          <textarea
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="cms-form__textarea"
            placeholder="Brève présentation de l'entreprise et de ses activités..."
          />
        </div>

        <div className="cms-form__group">
          <label className="cms-form__checkbox">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            />
            <span>Mettre en avant (Visible dans la section "Ils recrutent")</span>
          </label>
        </div>
      </section>

      <div className="cms-form__actions">
        <button type="button" onClick={() => router.back()} disabled={loading} className="cms-btn cms-btn--secondary">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="cms-btn cms-btn--primary">
          {loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour le profil' : 'Enregistrer l\'entreprise')}
        </button>
      </div>
    </form>
  );
}
