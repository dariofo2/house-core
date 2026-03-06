'use client';

import React, { useState } from 'react';
import { UserHouseOutputDTO } from '@/http/DTO/UserHouseOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface RemoveUserModalProps {
  houseId: number;
  userHouse: UserHouseOutputDTO;
  onSuccess: () => void;
  onClose: () => void;
}

const RemoveUserModal: React.FC<RemoveUserModalProps> = ({ houseId, userHouse, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      await ApiService.deleteUserHouse(userHouse.user.id, houseId);
      toast.success(`Usuario ${userHouse.user.name} eliminado de la casa.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error removing user from house:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content border-danger">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Eliminar Usuario de la Casa</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              ¿Estás seguro de que quieres eliminar a <strong>{userHouse.user.name}</strong> de esta casa?
              Este usuario ya no podrá acceder a los datos de esta casa.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleRemove} disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveUserModal;
