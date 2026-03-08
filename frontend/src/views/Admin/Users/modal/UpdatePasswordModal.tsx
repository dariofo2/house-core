'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { UserOutputDTO } from '@/http/DTO/UserOutputDTO';
import { UpdateUserPasswordDTO } from '@/http/DTO/UpdateUserPasswordDTO';

interface UpdatePasswordModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserOutputDTO;
}

export default function UpdatePasswordModal({ show, onClose, onSuccess, user }: UpdatePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const passwordData: UpdateUserPasswordDTO = {
        id: user.id,
        lastPassword: '', // Admin doesn't need last password
        newPassword: newPassword,
      };
      await ApiService.updateUserPassword(passwordData);
      toast.success('Contraseña actualizada con éxito');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-warning">
          <div className="modal-header bg-warning">
            <h5 className="modal-title fw-bold">Actualizar Contraseña: {user.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleUpdatePassword}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-warning" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
