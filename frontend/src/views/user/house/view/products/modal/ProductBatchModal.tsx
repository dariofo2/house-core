'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { ProductBatchOutputDTO } from '@/http/DTO/ProductBatchOutputDTO';
import { CreateProductBatchDTO } from '@/http/DTO/CreateProductBatchDTO';
import { UpdateProductBatchDTO } from '@/http/DTO/UpdateProductBatchDTO';

interface ProductBatchModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  batch?: ProductBatchOutputDTO | null;
}

export default function ProductBatchModal({ show, onClose, onSuccess, productId, batch }: ProductBatchModalProps) {
  const [data, setData] = useState({
    quantity: 0,
    expirationDate: '',
  });

  useEffect(() => {
    if (batch) {
      setData({
        quantity: batch.quantity,
        expirationDate: batch.expirationDate ? batch.expirationDate.split('T')[0] : '',
      });
    } else {
      setData({
        quantity: 0,
        expirationDate: '',
      });
    }
  }, [batch, show]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (batch) {
        const updateData: UpdateProductBatchDTO = { 
          id: batch.id, 
          quantity: data.quantity,
          expirationDate: data.expirationDate || null
        };
        await ApiService.updateProductBatch(updateData);
        toast.success('Lote actualizado');
      } else {
        const createData: CreateProductBatchDTO = { 
          productId, 
          quantity: data.quantity,
          expirationDate: data.expirationDate || null
        };
        await ApiService.createProductBatch(createData);
        toast.success('Lote creado');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Batch action failed:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{batch ? 'Editar' : 'Crear'} Lote</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Cantidad Inicial</label>
                <input
                  type="number"
                  className="form-control"
                  value={data.quantity}
                  onChange={(e) => setData({ ...data, quantity: parseFloat(e.target.value) })}
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Caducidad (Opcional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={data.expirationDate}
                  onChange={(e) => setData({ ...data, expirationDate: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{batch ? 'Actualizar' : 'Añadir'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
