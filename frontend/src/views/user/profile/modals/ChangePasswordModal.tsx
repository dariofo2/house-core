'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';

interface ChangePasswordModalProps {
  userId: number;
  onClose: () => void;
}

export default function ChangePasswordModal({ userId, onClose }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (formData.newPassword.length < 3) {
      toast.error('La nueva contraseña debe tener al menos 3 caracteres.');
      return;
    }

    setLoading(true);
    try {
      // Hashing is now handled internally by ApiService.updateUserPassword
      await ApiService.updateUserPassword({
        id: userId,
        lastPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success('Contraseña actualizada correctamente.');
      onClose();
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">
              <i className="bi bi-key-fill me-2"></i>
              Cambiar Contraseña
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Contraseña Actual</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  disabled={loading}
                />
              </div>
              <hr />
              <div className="mb-3">
                <label className="form-label fw-bold">Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Contraseña'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
