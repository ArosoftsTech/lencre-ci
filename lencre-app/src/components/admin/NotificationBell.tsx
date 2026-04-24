'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications, PendingItem } from '@/hooks/useNotifications';

export default function NotificationBell() {
  const { pendingItems, count, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="admin-notifications" ref={dropdownRef}>
      <button 
        className="admin-notifications__trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <span className="admin-notifications__icon">🔔</span>
        {count > 0 && <span className="admin-notifications__badge">{count}</span>}
      </button>

      {isOpen && (
        <div className="admin-notifications__dropdown">
          <div className="admin-notifications__header">
            <h3>Notifications</h3>
            <span className="admin-notifications__count">{count} en attente</span>
          </div>

          <div className="admin-notifications__list">
            {loading && pendingItems.length === 0 ? (
              <div className="admin-notifications__empty">Chargement...</div>
            ) : pendingItems.length > 0 ? (
              pendingItems.map((item) => (
                <Link 
                  key={`${item.type}-${item.id}`} 
                  href={item.type === 'article' ? '/admin/validation' : '/admin/multimedia'}
                  className="admin-notifications__item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="admin-notifications__item-icon">
                    {item.type === 'article' ? '📝' : '🎬'}
                  </div>
                  <div className="admin-notifications__item-content">
                    <p className="admin-notifications__item-title">{item.title}</p>
                    <p className="admin-notifications__item-meta">
                      Par <strong>{item.author}</strong> • {formatDate(item.created_at)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="admin-notifications__empty">
                <p>Aucune notification</p>
                <span>Tout est à jour !</span>
              </div>
            )}
          </div>

          {count > 0 && (
            <div className="admin-notifications__footer">
              <Link href="/admin/validation" onClick={() => setIsOpen(false)}>
                Voir toutes les soumissions
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
