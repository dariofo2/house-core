'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CategoryOutputDTO } from '@/http/DTO/CategoryOutputDTO';
import { CreateCookRecipeProductDTO } from '@/http/DTO/CreateCookRecipeProductDTO';
import { UpdateCookRecipeProductDTO } from '@/http/DTO/UpdateCookRecipeProductDTO';
import { CookRecipeProductOutputDTO } from '@/http/DTO/CookRecipeProductOutputDTO';

interface RecipeProductModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  houseId: number;
  cookRecipeId: number;
  recipeProduct?: CookRecipeProductOutputDTO | null;
}

export default function RecipeProductModal({ show, onClose, onSuccess, houseId, cookRecipeId, recipeProduct }: RecipeProductModalProps) {
  const [categories, setCategories] = useState<CategoryOutputDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ productId: 0, quantity: 1 });

  useEffect(() => {
    if (show) {
      fetchProducts();
      if (recipeProduct) {
        setData({ productId: recipeProduct.productId, quantity: recipeProduct.quantity || 1 });
      } else {
        setData({ productId: 0, quantity: 1 });
      }
    }
  }, [show, recipeProduct]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await ApiService.getCategoryJoinProduct(houseId);
      setCategories(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProductDetails = categories
    .flatMap(cat => cat.subcategories || [])
    .flatMap(sub => sub.products || [])
    .find(p => p.id === data.productId);

  useEffect(() => {
    if (selectedProductDetails && data.quantity === 0) {
      setData(prev => ({ ...prev, quantity: selectedProductDetails.step || 1 }));
    }
  }, [data.productId, selectedProductDetails]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.productId === 0) return toast.error('Selecciona un producto');
    
    try {
      if (recipeProduct) {
        const updateData: UpdateCookRecipeProductDTO = { cookRecipeId, productId: data.productId, quantity: data.quantity };
        await ApiService.updateCookRecipeProduct(updateData);
        toast.success('Ingrediente actualizado');
      } else {
        const createData: CreateCookRecipeProductDTO = { cookRecipeId, productId: data.productId, quantity: data.quantity };
        await ApiService.createCookRecipeProduct(createData);
        toast.success('Ingrediente añadido');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{recipeProduct ? 'Editar' : 'Añadir'} Ingrediente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Producto</label>
                <select 
                  className="form-select" 
                  value={data.productId} 
                  onChange={(e) => setData({ ...data, productId: parseInt(e.target.value), quantity: 0 })}
                  disabled={!!recipeProduct}
                  required
                >
                  <option value="0">Selecciona un producto...</option>
                  {categories.map(cat => (
                    <optgroup key={cat.id} label={cat.name}>
                      {cat.subcategories?.map(sub => (
                        <React.Fragment key={sub.id}>
                          {sub.products?.map(prod => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name} ({prod.unity as string || 'uds'}) - Paso: {prod.step}
                            </option>
                          ))}
                        </React.Fragment>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Cantidad necesaria {selectedProductDetails ? `(${selectedProductDetails.unity as string || 'uds'})` : ''}
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={data.quantity}
                  onChange={(e) => setData({ ...data, quantity: parseFloat(e.target.value) })}
                  min={selectedProductDetails?.step || 0.01}
                  step={selectedProductDetails?.step || 0.01}
                  required
                />
                {selectedProductDetails && (
                  <div className="form-text">
                    Este producto se mide en incrementos de <strong>{selectedProductDetails.step}</strong>.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{recipeProduct ? 'Actualizar' : 'Añadir'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
