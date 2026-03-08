'use client';

import React, { useState } from 'react';
import { UpdateUserHouseDTO } from '@/http/DTO/UpdateUserHouseDTO';
import { UserHouseOutputDTO } from '@/http/DTO/UserHouseOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface UpdateUserRoleModalProps {
  houseId: number;
  userHouse: UserHouseOutputDTO;
  onSuccess: () => void;
  onClose: () => void;
}

const UpdateUserRoleModal: React.FC<UpdateUserRoleModalProps> = ({ houseId, userHouse, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<UpdateUserHouseDTO>({
    userId: userHouse.user.id,
    houseId: houseId,
    roleName: userHouse.role.name,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ApiService.updateUserHouse(formData);
      toast.success('Rol actualizado con éxito');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cambiar Rol de {userHouse.user.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="small text-muted mb-3">
                Cambia el rol de este usuario dentro de esta casa.
              </p>
              <div className="mb-3">
                <label htmlFor="roleName" className="form-label">Nuevo Rol</label>
                <select
                  className="form-select"
                  id="roleName"
                  required
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                >
                  <option value="admin">Administrador de Casa</option>
                  <option value="user">Usuario de Casa</option>
                  <option value="visitor">Visitante de Casa</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Rol'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;
