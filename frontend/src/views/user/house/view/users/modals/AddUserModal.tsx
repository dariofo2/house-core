'use client';

import React, { useState } from 'react';
import { AddUserHouseDTO } from '@/http/DTO/AddUserHouseDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface AddUserModalProps {
  houseId: number;
  onSuccess: () => void;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ houseId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<AddUserHouseDTO>({
    userIdentifier: '',
    houseId: houseId,
    roleName: 'visitor', // Default role
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userIdentifier.trim()) {
      toast.error('Por favor, introduce el nombre o email del usuario.');
      return;
    }
    setLoading(true);
    try {
      await ApiService.addUserHouse(formData);
      toast.success('Usuario añadido a la casa.');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding user to house:', error);
      // Error handling is managed by the ApiService (toast)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-plus-fill me-2"></i>
              Añadir Usuario a la Casa
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-4">
                <label htmlFor="userIdentifier" className="form-label fw-bold">Nombre de usuario o Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-search"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    id="userIdentifier"
                    placeholder="Ej: dario o dario@example.com"
                    required
                    value={formData.userIdentifier}
                    onChange={(e) => setFormData({ ...formData, userIdentifier: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="form-text mt-2">
                  Escribe el nombre exacto o el correo electrónico del usuario registrado que quieres añadir.
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="roleName" className="form-label fw-bold">Rol en la Casa</label>
                <select
                  className="form-select"
                  id="roleName"
                  required
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                >
                  <option value="user">Usuario (Ver y gestionar stock)</option>
                  <option value="admin">Administrador (Control total de la casa)</option>
                  <option value="visitor">Visitante (Sólo lectura)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Añadiendo...
                  </>
                ) : (
                  'Añadir a la Casa'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
