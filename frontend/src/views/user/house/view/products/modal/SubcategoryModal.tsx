'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { SubcategoryOutputDTO } from '@/http/DTO/SubcategoryOutputDTO';
import { CreateSubcategoryDTO } from '@/http/DTO/CreateSubcategoryDTO';
import { UpdateSubcategoryDTO } from '@/http/DTO/UpdateSubcategoryDTO';

interface SubcategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId: number;
  subcategory?: SubcategoryOutputDTO | null;
}

export default function SubcategoryModal({ show, onClose, onSuccess, categoryId, subcategory }: SubcategoryModalProps) {
  const [data, setData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (subcategory) {
      setData({ name: subcategory.name, description: subcategory.description });
    } else {
      setData({ name: '', description: '' });
    }
  }, [subcategory, show]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (subcategory) {
        const updateData: UpdateSubcategoryDTO = { id: subcategory.id, categoryId, ...data };
        await ApiService.updateSubcategory(updateData);
        toast.success('Subcategoría actualizada');
      } else {
        const createData: CreateSubcategoryDTO = { categoryId, ...data };
        await ApiService.createSubcategory(createData);
        toast.success('Subcategoría creada');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Subcategory action failed:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{subcategory ? 'Editar' : 'Crear'} Subcategoría</h5>
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
              <button type="submit" className="btn btn-primary">{subcategory ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
