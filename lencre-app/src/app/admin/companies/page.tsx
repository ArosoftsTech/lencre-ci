'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/auth';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Image from 'next/image';

interface Company {
  id: number;
  name: string;
  sector: string | null;
  logo: string | null;
  active_offers_count: number;
  is_featured: boolean;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await adminFetch('/company-profiles');
      const data = await res.json();
      setCompanies(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openDeleteModal = (id: number, name: string) => {
    setCompanyToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminFetch(`/company-profiles/${companyToDelete.id}`, { method: 'DELETE' });
      setCompanies(companies.filter(c => c.id !== companyToDelete.id));
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
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
        <h1>Gestion des entreprises</h1>
        <Link href="/admin/companies/new" className="cms-btn cms-btn--primary">
          + Nouvelle entreprise
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>
      ) : (
        <div className="cms-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Logo</th>
                <th>Nom</th>
                <th>Secteur</th>
                <th>En avant (Ils recrutent)</th>
                <th>Offres actives</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>
                    {company.logo ? (
                      <Image src={company.logo} alt={company.name} width={40} height={40} unoptimized className="rounded-md object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">N/A</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{company.name}</td>
                  <td>{company.sector || '-'}</td>
                  <td>
                    {company.is_featured ? (
                      <span className="text-green-600 font-bold">Oui</span>
                    ) : (
                      <span className="text-gray-400">Non</span>
                    )}
                  </td>
                  <td>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {company.active_offers_count || 0}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/companies/${company.id}/edit`}
                        className="cms-btn cms-btn--secondary"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        ✎
                      </Link>
                      <button 
                        onClick={() => openDeleteModal(company.id, company.name)}
                        className="cms-btn cms-btn--danger"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucune entreprise trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteModalOpen && companyToDelete && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Supprimer l'entreprise"
          message={`Êtes-vous sûr de vouloir supprimer "${companyToDelete.name}" ?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
