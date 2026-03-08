'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { ProductOutputDTO } from '@/http/DTO/ProductOutputDTO';
import { CreateProductDTO } from '@/http/DTO/CreateProductDTO';
import { UpdateProductDTO } from '@/http/DTO/UpdateProductDTO';

interface ProductModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subcategoryId: number;
  houseId: number;
  product?: ProductOutputDTO | null;
}

export default function ProductModal({ show, onClose, onSuccess, subcategoryId, houseId, product }: ProductModalProps) {
  const [data, setData] = useState({
    name: '',
    description: '',
    unity: '',
    step: 1,
    minQuantity: 1,
  });

  useEffect(() => {
    if (product) {
      setData({
        name: product.name,
        description: (product as any).description || '',
        unity: (product.unity as string) || '',
        step: product.step,
        minQuantity: product.minQuantity,
      });
    } else {
      setData({
        name: '',
        description: '',
        unity: '',
        step: 1,
        minQuantity: 1,
      });
    }
  }, [product, show]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        const updateData: UpdateProductDTO = { 
          id: product.id, 
          ...data,
          unity: data.unity || null,
          photo: null
        };
        await ApiService.updateProduct(updateData);
        toast.success('Producto actualizado');
      } else {
        const createData: CreateProductDTO = { 
          subcategoryId, 
          houseId, 
          ...data,
          unity: data.unity || null,
          photo: null
        };
        await ApiService.createProduct(createData);
        toast.success('Producto creado');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Product action failed:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{product ? 'Editar' : 'Crear'} Producto</h5>
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
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Unidad (Kg, Litros, etc.)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Kg, ml, Ud"
                    value={data.unity}
                    onChange={(e) => setData({ ...data, unity: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Salto (+/-)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={data.step}
                    onChange={(e) => setData({ ...data, step: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Cantidad Mínima</label>
                <input
                  type="number"
                  className="form-control"
                  value={data.minQuantity}
                  onChange={(e) => setData({ ...data, minQuantity: parseInt(e.target.value) })}
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{product ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
