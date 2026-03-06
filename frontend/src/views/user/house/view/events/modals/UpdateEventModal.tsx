'use client';

import React, { useState } from 'react';
import { UpdateEventDTO } from '@/http/DTO/UpdateEventDTO';
import { EventOutputDTO } from '@/http/DTO/EventOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface UpdateEventModalProps {
  event: EventOutputDTO;
  onSuccess: () => void;
  onClose: () => void;
}

const UpdateEventModal: React.FC<UpdateEventModalProps> = ({ event, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<UpdateEventDTO>({
    id: event.id,
    name: event.name,
    description: event.description,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ApiService.updateEvent(formData);
      toast.success('Evento actualizado con éxito');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Evento</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Evento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventModal;
