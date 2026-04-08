'use client';

import { useEffect, useState, useRef } from 'react';
import { adminFetch } from '@/lib/auth';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface MediaFile {
  filename: string;
  url: string;
  size: number;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await adminFetch('/media');
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setUploading(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', selectedFiles[i]);

      try {
        await adminFetch('/media/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.error(err);
      }
    }

    setUploading(false);
    loadFiles();

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openDeleteModal = (filename: string) => {
    setFileToDelete(filename);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminFetch(`/media/${fileToDelete}`, { method: 'DELETE' });
      setFiles(files.filter(f => f.filename !== fileToDelete));
      setDeleteModalOpen(false);
      setFileToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la suppression du média.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Médiathèque ({files.length} fichiers)</h1>
        <label className="cms-btn cms-btn--primary" style={{ cursor: 'pointer' }}>
          {uploading ? 'Upload...' : '📁 Importer des images'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="cms-form" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</p>
          <p style={{ color: '#888' }}>Aucun fichier dans la médiathèque. Importez votre première image !</p>
        </div>
      ) : (
        <div className="cms-media-grid">
          {files.map((file) => (
            <div key={file.filename} className="cms-media-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt={file.filename} className="cms-media-card__img" />
              <div className="cms-media-card__info">
                <div className="cms-media-card__name" title={file.filename}>{file.filename}</div>
                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: 2 }}>{formatSize(file.size)}</div>
                <div className="cms-media-card__actions">
                  <button onClick={() => handleCopyUrl(file.url)} className="cms-btn cms-btn--secondary cms-btn--sm" title="Copier l'URL">
                    📋
                  </button>
                  <button onClick={() => openDeleteModal(file.filename)} className="cms-btn cms-btn--danger cms-btn--sm" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Supprimer le média"
        message={`Êtes-vous sûr de vouloir supprimer définitivement le fichier "${fileToDelete}" ?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
      />
    </div>
  );
}
