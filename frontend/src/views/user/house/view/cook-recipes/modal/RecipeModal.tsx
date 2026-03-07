'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CookRecipeOutputDTO } from '@/http/DTO/CookRecipeOutputDTO';
import { CreateCookRecipeDTO } from '@/http/DTO/CreateCookRecipeDTO';
import { UpdateCookRecipeDTO } from '@/http/DTO/UpdateCookRecipeDTO';

interface RecipeModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  houseId: number;
  recipe?: CookRecipeOutputDTO | null;
}

export default function RecipeModal({ show, onClose, onSuccess, houseId, recipe }: RecipeModalProps) {
  const [data, setData] = useState({ name: '', description: '', steps: [] as string[] });
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    if (recipe) {
      setData({ name: recipe.name, description: recipe.description, steps: recipe.steps || [] });
    } else {
      setData({ name: '', description: '', steps: [] });
    }
  }, [recipe, show]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (recipe) {
        const updateData: UpdateCookRecipeDTO = { id: recipe.id, ...data, photo: null };
        await ApiService.updateCookRecipe(updateData);
        toast.success('Receta actualizada');
      } else {
        const createData: CreateCookRecipeDTO = { houseId, ...data };
        await ApiService.createCookRecipe(createData);
        toast.success('Receta creada');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Recipe action failed:', error);
    }
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    setData({ ...data, steps: [...data.steps, newStep] });
    setNewStep('');
  };

  const removeStep = (index: number) => {
    setData({ ...data, steps: data.steps.filter((_, i) => i !== index) });
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{recipe ? 'Editar' : 'Crear'} Receta</h5>
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
              <div className="mb-3">
                <label className="form-label font-weight-bold">Pasos de Preparación</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Añade un paso..."
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                  />
                  <button className="btn btn-outline-success" type="button" onClick={addStep}>Añadir</button>
                </div>
                <ul className="list-group">
                  {data.steps.map((step, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span><strong>{index + 1}.</strong> {step}</span>
                      <button type="button" className="btn-close" style={{ fontSize: '0.7rem' }} onClick={() => removeStep(index)}></button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{recipe ? 'Actualizar' : 'Crear'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
