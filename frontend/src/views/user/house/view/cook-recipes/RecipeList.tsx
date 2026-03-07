'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CookRecipeOutputDTO } from '@/http/DTO/CookRecipeOutputDTO';
import { CookRecipeProductOutputDTO } from '@/http/DTO/CookRecipeProductOutputDTO';

// Modals
import RecipeModal from './modal/RecipeModal';
import RecipeProductModal from './modal/RecipeProductModal';
import DeleteConfirmationModal from './modal/DeleteConfirmationModal';

export default function RecipeListView({ houseId }: { houseId: number }) {
  const [recipes, setRecipes] = useState<CookRecipeOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // States for Modals
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<CookRecipeOutputDTO | null>(null);
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState<CookRecipeProductOutputDTO | null>(null);

  useEffect(() => {
    fetchData();
  }, [houseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.listJoinByHouse(houseId);
      // Ensure data is an array
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeRecipe = async (id: number) => {
    try {
      await ApiService.makeCookRecipe(id);
      toast.success('¡Receta preparada con éxito! El inventario se ha actualizado.');
      fetchData();
    } catch (error) {
      console.error('Make recipe failed:', error);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!selectedRecipe) return;
    try {
      await ApiService.deleteCookRecipe(selectedRecipe.id);
      toast.success('Receta eliminada');
      fetchData();
      setModalType(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIngredientDirect = async (recipeId: number, productId: number) => {
    try {
      await ApiService.deleteCookRecipeProduct(recipeId, productId);
      toast.success('Ingrediente quitado');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIngredient = async () => {
    if (!selectedRecipe || !selectedRecipeProduct) return;
    try {
      await ApiService.deleteCookRecipeProduct(selectedRecipe.id, selectedRecipeProduct.productId);
      toast.success('Ingrediente eliminado');
      fetchData();
      setModalType(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Mis Casas</Link></li>
          <li className="breadcrumb-item"><Link href={`/user/house/view/${houseId}`}>Panel de Casa</Link></li>
          <li className="breadcrumb-item active">Recetas</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Recetas de Cocina</h1>
        <button className="btn btn-primary" onClick={() => { setSelectedRecipe(null); setModalType('recipe'); }}>
          <i className="bi bi-plus-circle me-2"></i>Nueva Receta
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">No hay recetas creadas todavía.</p>
        </div>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div className="col-md-6 mb-4" key={recipe.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
                  <h4 className="mb-0 fw-bold text-primary">{recipe.name}</h4>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary border-0" 
                      title="Editar Receta"
                      onClick={() => { setSelectedRecipe(recipe); setModalType('recipe'); }}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger border-0" 
                      title="Eliminar Receta"
                      onClick={() => { setSelectedRecipe(recipe); setModalType('deleteRecipe'); }}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">{recipe.description}</p>
                  
                  <h6 className="fw-bold small text-uppercase text-secondary mb-2">Ingredientes</h6>
                  <ul className="list-group list-group-flush mb-3">
                    {recipe.cookRecipeProducts?.map((rp) => {
                      const prod = rp.product;
                      const totalStock = prod?.productBatches?.reduce((acc, b) => acc + b.quantity, 0) || 0;
                      const hasEnoughStock = totalStock >= rp.quantity;
                      
                      return (
                        <li key={rp.id} className={`list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent py-1 ${!hasEnoughStock ? 'text-danger' : ''}`}>
                          <span className="small d-flex align-items-center">
                            {!hasEnoughStock && <i className="bi bi-exclamation-triangle-fill me-1" title="Stock insuficiente"></i>}
                            {prod ? prod.name : 'Producto desconocido'} 
                            <strong className="ms-1">({rp.quantity} {prod?.unity as string || 'uds'})</strong>
                            {!hasEnoughStock && (
                              <span className="ms-2 badge bg-danger-subtle text-danger border border-danger" style={{ fontSize: '0.65rem' }}>
                                Stock: {totalStock}
                              </span>
                            )}
                          </span>
                          <div className="btn-group btn-group-sm ms-2">
                            <button 
                              className="btn btn-sm btn-link text-primary p-0 me-2" 
                              title="Editar cantidad"
                              onClick={() => { setSelectedRecipe(recipe); setSelectedRecipeProduct(rp); setModalType('ingredient'); }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-link text-danger p-0" 
                              title="Quitar ingrediente"
                              onClick={() => handleDeleteIngredientDirect(recipe.id, rp.productId)}
                            >
                              <i className="bi bi-x-circle-fill"></i>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                    <li className="list-group-item px-0 bg-transparent border-0 mt-1">
                      <button className="btn btn-sm btn-link p-0 text-success text-decoration-none fw-bold" onClick={() => { setSelectedRecipe(recipe); setSelectedRecipeProduct(null); setModalType('ingredient'); }}>
                        <i className="bi bi-plus-lg me-1"></i>Añadir ingrediente
                      </button>
                    </li>
                  </ul>

                  {recipe.steps && recipe.steps.length > 0 && (
                    <>
                      <h6 className="fw-bold small text-uppercase text-secondary mb-2">Preparación</h6>
                      <div className="small text-muted mb-3 border-start ps-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {recipe.steps.map((step, idx) => (
                          <div key={idx} className="mb-2">
                            <span className="badge bg-secondary-subtle text-secondary me-2">{idx + 1}</span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="card-footer bg-white border-0 pb-3">
                  {(() => {
                    const allHaveStock = recipe.cookRecipeProducts?.every(rp => {
                      const stock = rp.product?.productBatches?.reduce((acc, b) => acc + b.quantity, 0) || 0;
                      return stock >= rp.quantity;
                    });
                    
                    return (
                      <button 
                        className={`btn ${allHaveStock ? 'btn-warning' : 'btn-outline-secondary'} w-100 fw-bold shadow-sm`} 
                        onClick={() => handleMakeRecipe(recipe.id)}
                        disabled={!allHaveStock || !recipe.cookRecipeProducts || recipe.cookRecipeProducts.length === 0}
                      >
                        <i className="bi bi-fire me-2"></i>
                        {allHaveStock ? 'PREPARAR' : 'FALTAN INGREDIENTES'}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECIPE MODAL */}
      <RecipeModal
        show={modalType === 'recipe'}
        onClose={() => setModalType(null)}
        onSuccess={fetchData}
        houseId={houseId}
        recipe={selectedRecipe}
      />

      {/* INGREDIENT MODAL */}
      {selectedRecipe && (
        <RecipeProductModal
          show={modalType === 'ingredient'}
          onClose={() => setModalType(null)}
          onSuccess={fetchData}
          houseId={houseId}
          cookRecipeId={selectedRecipe.id}
          recipeProduct={selectedRecipeProduct}
        />
      )}

      {/* DELETE CONFIRMATION MODALS */}
      <DeleteConfirmationModal
        show={modalType === 'deleteRecipe'}
        onClose={() => setModalType(null)}
        onConfirm={handleDeleteRecipe}
        title="Eliminar Receta"
        itemName={selectedRecipe?.name || ''}
      />

      <DeleteConfirmationModal
        show={modalType === 'deleteIngredient'}
        onClose={() => setModalType(null)}
        onConfirm={handleDeleteIngredient}
        title="Eliminar Ingrediente"
        itemName={selectedRecipeProduct?.product?.name || 'el ingrediente'}
      />
    </div>
  );
}
