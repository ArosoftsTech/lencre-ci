'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  storage_quota_mb: number;
  storage_used_mb: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'journaliste',
    status: 'active',
    storage_quota_mb: 200,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await adminFetch('/users?per_page=100');
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Supprimer le compte de "${user.name}" ?`)) return;

    try {
      const res = await adminFetch(`/users/${user.id}`, { method: 'DELETE' });
      if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Erreur lors de la suppression');
          return;
      }
      setUsers(users.filter(u => u.id !== user.id));
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status || 'active',
        storage_quota_mb: user.storage_quota_mb || 200,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'journaliste',
        status: 'active',
        storage_quota_mb: 200,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/users/${editingId}` : '/users';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur de sauvegarde');
      
      setShowModal(false);
      loadUsers();
    } catch (err) {
      alert('Une erreur est survenue lors de l\'enregistrement.');
      console.error(err);
    }
  };

  if (loading) return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="cms-header">
        <h1>Équipe & Rédacteurs ({users.length})</h1>
        <button onClick={() => openModal()} className="cms-btn cms-btn--primary">
          + Ajouter un membre
        </button>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Nom & Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Quota (Média)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{u.email}</div>
                </td>
                <td>
                    <span style={{ padding: '2px 8px', background: '#f0f2f5', borderRadius: 4, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        {u.role.replace('_', ' ')}
                    </span>
                </td>
                <td>
                    <span className="cms-badge" style={{ background: u.status === 'active' ? '#e6f4ea' : '#fdecea', color: u.status === 'active' ? '#1b7a3a' : '#c1121f' }}>
                        {u.status === 'active' ? 'Actif' : u.status}
                    </span>
                </td>
                <td>
                  <div style={{ width: '100px', height: '6px', background: '#e8eaed', borderRadius: '3px', overflow: 'hidden', marginBottom: 4 }}>
                      <div style={{ height: '100%', background: (u.storage_used_mb > u.storage_quota_mb * 0.9) ? '#ef4444' : '#3b82f6', width: `${Math.min(100, (u.storage_used_mb / u.storage_quota_mb) * 100)}%` }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>
                      {u.storage_used_mb || 0} / {u.storage_quota_mb} MB
                  </span>
                </td>
                <td>
                  <div className="cms-table__actions">
                    <button onClick={() => openModal(u)} className="cms-btn cms-btn--secondary cms-btn--sm">✏️</button>
                    <button onClick={() => handleDelete(u)} className="cms-btn cms-btn--danger cms-btn--sm">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Montserrat' }}>
              {editingId ? 'Modifier un compte' : 'Créer un compte'}
            </h2>
            <form onSubmit={handleSubmit} className="cms-form" style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
              <div className="cms-form__group">
                <label className="cms-form__label">Nom complet</label>
                <input className="cms-form__input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="cms-form__group">
                <label className="cms-form__label">Email</label>
                <input type="email" className="cms-form__input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="cms-form__row">
                  <div className="cms-form__group">
                    <label className="cms-form__label">Mot de passe {!editingId && '*'}</label>
                    <input type="password" placeholder={editingId ? '(inchangé)' : ''} className="cms-form__input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} minLength={6} />
                  </div>
                  <div className="cms-form__group">
                    <label className="cms-form__label">Rôle</label>
                    <select className="cms-form__select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="journaliste">Journaliste</option>
                      <option value="redacteur_web">Rédacteur Web</option>
                      <option value="pigiste">Pigiste</option>
                      <option value="photographe">Photographe</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
              </div>
              <div className="cms-form__row">
                  <div className="cms-form__group">
                    <label className="cms-form__label">Statut</label>
                    <select className="cms-form__select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="active">Actif</option>
                      <option value="suspended">Suspendu</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>
                  <div className="cms-form__group">
                    <label className="cms-form__label">Quota (MB)</label>
                    <input type="number" min="0" className="cms-form__input" value={formData.storage_quota_mb} onChange={e => setFormData({...formData, storage_quota_mb: parseInt(e.target.value)})} required />
                  </div>
              </div>
              <div className="cms-form__actions">
                <button type="submit" className="cms-btn cms-btn--primary">Enregistrer</button>
                <button type="button" className="cms-btn cms-btn--secondary" onClick={() => setShowModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
