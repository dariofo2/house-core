'use client';

import React from 'react';

interface DeleteConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

export default function DeleteConfirmationModal({ show, onClose, onConfirm, title, itemName }: DeleteConfirmationModalProps) {
  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            ¿Estás seguro de que deseas eliminar <strong>{itemName}</strong>? Esta acción no se puede deshacer.
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
