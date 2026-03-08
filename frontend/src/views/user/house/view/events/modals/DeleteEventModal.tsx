'use client';

import React, { useState } from 'react';
import { EventOutputDTO } from '@/http/DTO/EventOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface DeleteEventModalProps {
  event: EventOutputDTO;
  onSuccess: () => void;
  onClose: () => void;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ event, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await ApiService.deleteEvent(event.id);
      toast.success(`Evento "${event.name}" eliminado con éxito.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content border-danger">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Eliminar Evento</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              ¿Estás seguro de que quieres eliminar el evento <strong>{event.name}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
