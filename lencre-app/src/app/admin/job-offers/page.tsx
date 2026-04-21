'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/auth';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface JobOffer {
  id: number;
  title: string;
  company_name: string;
  type: string;
  status: string;
  deadline_at: string | null;
  published_at: string | null;
}

export default function AdminJobOffersPage() {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<{ id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      // Fetch showing all statuses for admin
      const res = await adminFetch('/job-offers?show_all=1&per_page=50');
      const data = await res.json();
      setOffers(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: number) => {
    try {
      const res = await adminFetch(`/job-offers/${id}/toggle-status`, { method: 'POST' });
      if (res.ok) {
        loadOffers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteModal = (id: number, title: string) => {
    setOfferToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!offerToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminFetch(`/job-offers/${offerToDelete.id}`, { method: 'DELETE' });
      setOffers(offers.filter(o => o.id !== offerToDelete.id));
      setDeleteModalOpen(false);
      setOfferToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la suppression.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="cms-header">
        <h1>Gestion des offres d'emploi</h1>
        <Link href="/admin/job-offers/new" className="cms-btn cms-btn--primary">
          + Nouvelle offre
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>
      ) : (
        <div className="cms-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Entreprise</th>
                <th>Type</th>
                <th>Date Limite</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td style={{ fontWeight: 500 }}>{offer.title}</td>
                  <td>{offer.company_name}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', background: '#eee', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {offer.type}
                    </span>
                  </td>
                  <td>{offer.deadline_at ? new Date(offer.deadline_at).toLocaleDateString('fr-FR') : '-'}</td>
                  <td>
                    <span className={`cms-badge ${offer.status === 'published' ? 'cms-badge--published' : 'cms-badge--draft'}`}>
                      {offer.status === 'published' ? 'Publié' : offer.status === 'archived' ? 'Archivé' : 'Brouillon'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(offer.id)}
                        className={`cms-btn ${offer.status === 'published' ? 'cms-btn--outline' : 'cms-btn--secondary'}`}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {offer.status === 'published' ? 'Archiver' : 'Publier'}
                      </button>
                      <Link 
                        href={`/admin/job-offers/${offer.id}/edit`}
                        className="cms-btn cms-btn--secondary"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        ✎
                      </Link>
                      <button 
                        onClick={() => openDeleteModal(offer.id, offer.title)}
                        className="cms-btn cms-btn--danger"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucune offre d'emploi trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteModalOpen && offerToDelete && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Supprimer l'offre"
          message={`Êtes-vous sûr de vouloir supprimer l'offre "${offerToDelete.title}" ? Cette action est irréversible.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
