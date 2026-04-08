'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="cms-modal-overlay" onClick={onCancel}>
      <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cms-modal__body">
          <span className="cms-modal__icon">⚠️</span>
          <h3 className="cms-modal__title">{title}</h3>
          <p className="cms-modal__text">{message}</p>
        </div>
        <div className="cms-modal__footer">
          <button 
            className="cms-btn cms-btn--secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button 
            className="cms-btn cms-btn--primary" 
            onClick={onConfirm}
            style={{ backgroundColor: '#C1121F' }}
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
