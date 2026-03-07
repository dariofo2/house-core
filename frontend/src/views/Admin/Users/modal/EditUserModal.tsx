'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { UserOutputDTO } from '@/http/DTO/UserOutputDTO';
import { UpdateUserDTO } from '@/http/DTO/UpdateUserDTO';

interface EditUserModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserOutputDTO;
}

export default function EditUserModal({ show, onClose, onSuccess, user }: EditUserModalProps) {
  const [editData, setEditData] = useState<UpdateUserDTO>({ id: user.id, name: user.name, email: user.email });

  useEffect(() => {
    setEditData({ id: user.id, name: user.name, email: user.email });
  }, [user]);

  if (!show) return null;

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.updateUser(editData);
      toast.success('Usuario actualizado con éxito');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Editar Usuario</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleEdit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
