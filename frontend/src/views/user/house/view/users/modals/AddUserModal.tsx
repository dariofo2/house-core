'use client';

import React, { useState, useEffect } from 'react';
import { AddUserHouseDTO } from '@/http/DTO/AddUserHouseDTO';
import { UserOutputDTO } from '@/http/DTO/UserOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface AddUserModalProps {
  houseId: number;
  onSuccess: () => void;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ houseId, onSuccess, onClose }) => {
  const [users, setUsers] = useState<UserOutputDTO[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [formData, setFormData] = useState<AddUserHouseDTO>({
    userId: 0,
    houseId: houseId,
    roleName: 'USER', // Default role
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await ApiService.listUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.userId === 0) {
      toast.error('Por favor, selecciona un usuario.');
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Añadir Usuario a la Casa</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">Usuario</label>
                <select
                  className="form-select"
                  id="userId"
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                  disabled={loadingUsers}
                >
                  <option value={0}>Selecciona un usuario...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {loadingUsers && <div className="form-text">Cargando usuarios...</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="roleName" className="form-label">Rol en la Casa</label>
                <select
                  className="form-select"
                  id="roleName"
                  required
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador de Casa</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || loadingUsers}>
                {loading ? 'Añadiendo...' : 'Añadir Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
