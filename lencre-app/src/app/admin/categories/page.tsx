'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/auth';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface Category {
  id: number;
  name: string;
  slug: string;
  color_code: string;
  articles_count?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', color_code: '#0D1B2A' });
  const [isNew, setIsNew] = useState(false);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await adminFetch('/categories');
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  const handleSave = async () => {
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `/categories/${editingId}` : '/categories';

    const res = await adminFetch(endpoint, {
      method,
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setEditingId(null);
      setIsNew(false);
      setForm({ name: '', color_code: '#0D1B2A' });
      loadCategories();
    } else {
      const err = await res.json();
      alert(err.message || 'Erreur');
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setIsNew(false);
    setForm({ name: cat.name, color_code: cat.color_code });
  };

  const openDeleteModal = (id: number, name: string) => {
    setCategoryToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const res = await adminFetch(`/categories/${categoryToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        loadCategories();
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Catégories ({categories.length})</h1>
        <button
          className="cms-btn cms-btn--primary"
          onClick={() => { setIsNew(true); setEditingId(null); setForm({ name: '', color_code: '#0D1B2A' }); }}
        >
          + Nouvelle catégorie
        </button>
      </div>

      {/* Inline form */}
      {(isNew || editingId) && (
        <div className="cms-form" style={{ marginBottom: '1.5rem' }}>
          <div className="cms-form__row">
            <div className="cms-form__group">
              <label className="cms-form__label">Nom</label>
              <input
                className="cms-form__input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nom de la catégorie"
              />
            </div>
            <div className="cms-form__group">
              <label className="cms-form__label">Couleur</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={form.color_code}
                  onChange={(e) => setForm({ ...form, color_code: e.target.value })}
                  style={{ width: 40, height: 36, border: 'none', cursor: 'pointer' }}
                />
                <input
                  className="cms-form__input"
                  value={form.color_code}
                  onChange={(e) => setForm({ ...form, color_code: e.target.value })}
                  placeholder="#0D1B2A"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
          <div className="cms-form__actions" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
            <button className="cms-btn cms-btn--primary" onClick={handleSave}>
              {editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            <button className="cms-btn cms-btn--secondary" onClick={() => { setIsNew(false); setEditingId(null); }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Couleur</th>
              <th>Nom</th>
              <th>Slug</th>
              <th>Articles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <span style={{ display: 'inline-block', width: 20, height: 20, borderRadius: 4, background: cat.color_code, border: '1px solid #ddd' }} />
                </td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td style={{ color: '#888', fontSize: '0.85rem' }}>{cat.slug}</td>
                <td>{cat.articles_count ?? '—'}</td>
                <td>
                  <div className="cms-table__actions">
                    <button onClick={() => handleEdit(cat)} className="cms-btn cms-btn--secondary cms-btn--sm">
                      ✏️ Modifier
                    </button>
                    <button onClick={() => openDeleteModal(cat.id, cat.name)} className="cms-btn cms-btn--danger cms-btn--sm">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Supprimer la catégorie"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryToDelete?.name}" ? Cela pourrait impacter les articles associés.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
      />
    </div>
  );
}
