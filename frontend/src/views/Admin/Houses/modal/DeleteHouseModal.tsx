'use client';

import React, { useState } from 'react';
import { HouseOutputDTO } from '@/http/DTO/HouseOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface DeleteHouseModalProps {
  house: HouseOutputDTO;
  onSuccess: () => void;
  onClose: () => void;
}

const DeleteHouseModal: React.FC<DeleteHouseModalProps> = ({ house, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await ApiService.deleteHouse(house.id);
      toast.success(`Casa "${house.name}" borrada con éxito.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting house:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content border-danger">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Borrar Casa</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              ¿Estás seguro de que quieres borrar la casa <strong>{house.name}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? 'Borrando...' : 'Borrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteHouseModal;
