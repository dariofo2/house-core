'use client';

import React from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { UserOutputDTO } from '@/http/DTO/UserOutputDTO';

interface DeleteUserModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserOutputDTO;
}

export default function DeleteUserModal({ show, onClose, onSuccess, user }: DeleteUserModalProps) {
  if (!show) return null;

  const handleDelete = async () => {
    try {
      await ApiService.deleteUser(user.id);
      toast.success('Usuario eliminado con éxito');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title fw-bold">Eliminar Usuario</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            ¿Estás seguro de que deseas eliminar a <strong>{user.name}</strong>? Esta acción no se puede deshacer.
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
