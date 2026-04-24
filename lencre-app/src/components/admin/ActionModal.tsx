'use client';

import React, { useState, useEffect } from 'react';

interface ActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'prompt' | 'input' | 'textarea';
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  onConfirm: (value?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ActionModal({
  isOpen,
  title,
  message,
  type = 'confirm',
  placeholder = 'Entrez votre texte ici...',
  defaultValue = '',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  confirmColor = '#C1121F',
  onConfirm,
  onCancel,
  isLoading = false
}: ActionModalProps) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(type !== 'confirm' ? inputValue : undefined);
  };

  return (
    <div className="cms-modal-overlay" onClick={onCancel}>
      <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cms-modal__body">
          <div className="cms-modal__icon">
             {type === 'confirm' ? '⚠️' : '📝'}
          </div>
          <h3 className="cms-modal__title">{title}</h3>
          <p className="cms-modal__text">{message}</p>
          
          {(type === 'prompt' || type === 'input' || type === 'textarea') && (
            <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              {type === 'prompt' ? (
                <input
                  type="text"
                  className="cms-modal__input"
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
              ) : type === 'textarea' ? (
                <textarea
                  className="cms-modal__input"
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={4}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  className="cms-modal__input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                />
              )}
            </div>
          )}
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
            onClick={handleConfirm}
            style={{ backgroundColor: confirmColor }}
            disabled={isLoading || ((type === 'prompt' || type === 'input') && !inputValue.trim())}
          >
            {isLoading ? 'Traitement...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
