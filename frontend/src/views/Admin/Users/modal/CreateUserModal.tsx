'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CreateUserDTO } from '@/http/DTO/CreateUserDTO';

interface CreateUserModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ show, onClose, onSuccess }: CreateUserModalProps) {
  const [createData, setCreateData] = useState<CreateUserDTO>({ name: '', password: '', email: '' });

  if (!show) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.createUserAdmin(createData);
      toast.success('Usuario creado con éxito');
      setCreateData({ name: '', password: '', email: '' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Crear Usuario</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleCreate}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={createData.email}
                  onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={createData.password}
                  onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
