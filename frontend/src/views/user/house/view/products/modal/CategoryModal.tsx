'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CategoryOutputDTO } from '@/http/DTO/CategoryOutputDTO';
import { CreateCategoryDTO } from '@/http/DTO/CreateCategoryDTO';
import { UpdateCategoryDTO } from '@/http/DTO/UpdateCategoryDTO';

interface CategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  houseId: number;
  category?: CategoryOutputDTO | null;
}

export default function CategoryModal({ show, onClose, onSuccess, houseId, category }: CategoryModalProps) {
  const [data, setData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (category) {
      setData({ name: category.name, description: category.description });
    } else {
      setData({ name: '', description: '' });
    }
  }, [category, show]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (category) {
        const updateData: UpdateCategoryDTO = { id: category.id, ...data };
        await ApiService.updateCategory(updateData);
        toast.success('Categoría actualizada');
      } else {
        const createData: CreateCategoryDTO = { houseId, ...data };
        await ApiService.createCategory(createData);
        toast.success('Categoría creada');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Category action failed:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{category ? 'Editar' : 'Crear'} Categoría</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{category ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
