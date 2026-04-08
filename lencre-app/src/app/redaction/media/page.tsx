'use client';

import { useEffect, useState, useRef } from 'react';
import { redactionFetch } from '@/lib/redactionAuth';

interface MediaFile {
  filename: string;
  url: string;
  size: number;
}

export default function RedactionMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await redactionFetch('/redaction/media');
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

    setErrorMsg('');
    setUploading(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', selectedFiles[i]);

      try {
        const res = await redactionFetch('/redaction/media/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) {
           const errData = await res.json();
           setErrorMsg(errData.message || 'Erreur lors de l\'upload');
        }
      } catch (err) {
        console.error(err);
      }
    }

    setUploading(false);
    loadFiles();

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Supprimer "${filename}" ?`)) return;

    await redactionFetch(`/redaction/media/${filename}`, { method: 'DELETE' });
    loadFiles();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (loading) return <div className="redaction-loading"><div className="redaction-loading__spinner" /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Ma Médiathèque ({files.length} fichiers)</h1>
        <label className="cms-btn cms-btn--primary" style={{ cursor: 'pointer', background: '#3b82f6' }}>
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

      {errorMsg && (
        <div style={{ padding: '1rem', background: '#fdecea', color: '#c1121f', borderRadius: '8px', marginBottom: '1rem' }}>
          {errorMsg}
        </div>
      )}

      {files.length === 0 ? (
        <div className="cms-form" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</p>
          <p style={{ color: '#888' }}>Aucun fichier dans votre médiathèque personnelle. Importez votre première image !</p>
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
                  <button onClick={() => handleDelete(file.filename)} className="cms-btn cms-btn--danger cms-btn--sm" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
