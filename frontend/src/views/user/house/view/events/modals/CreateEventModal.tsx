'use client';

import React, { useState } from 'react';
import { CreateEventDTO } from '@/http/DTO/CreateEventDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import { toast } from 'react-toastify';

interface CreateEventModalProps {
  houseId: number;
  onSuccess: () => void;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ houseId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<CreateEventDTO>({
    houseId: houseId,
    name: '',
    description: '',
    maxDays: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ApiService.createEvent(formData);
      toast.success('Evento creado con éxito');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Nuevo Evento</h5>
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
              <div className="mb-3">
                <label htmlFor="maxDays" className="form-label">Días Máximos (Frecuencia)</label>
                <input
                  type="number"
                  className="form-control"
                  id="maxDays"
                  required
                  min={1}
                  value={formData.maxDays}
                  onChange={(e) => setFormData({ ...formData, maxDays: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Evento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
