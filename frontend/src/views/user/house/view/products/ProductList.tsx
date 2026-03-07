'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CategoryOutputDTO } from '@/http/DTO/CategoryOutputDTO';
import { SubcategoryOutputDTO } from '@/http/DTO/SubcategoryOutputDTO';
import { ProductOutputDTO } from '@/http/DTO/ProductOutputDTO';
import { ProductBatchOutputDTO } from '@/http/DTO/ProductBatchOutputDTO';

// Modals
import CategoryModal from './modal/CategoryModal';
import SubcategoryModal from './modal/SubcategoryModal';
import ProductModal from './modal/ProductModal';
import ProductBatchModal from './modal/ProductBatchModal';
import DeleteConfirmationModal from './modal/DeleteConfirmationModal';

export default function ProductListView({ houseId }: { houseId: number }) {
  const [categories, setCategories] = useState<CategoryOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  // States for Modals visibility
  const [modalType, setModalType] = useState<string | null>(null);
  
  // States for Selection
  const [selectedCategory, setSelectedCategory] = useState<CategoryOutputDTO | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryOutputDTO | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductOutputDTO | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ProductBatchOutputDTO | null>(null);

  useEffect(() => {
    fetchData();
  }, [houseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getCategoryJoinProduct(houseId);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (batchId: number) => {
    try {
      await ApiService.incrementProductBatch(batchId);
      fetchData();
    } catch (error) {
      console.error('Increment failed:', error);
    }
  };

  const handleDecrement = async (batchId: number) => {
    try {
      await ApiService.decrementProductBatch(batchId);
      fetchData();
    } catch (error) {
      console.error('Decrement failed:', error);
    }
  };

  // Delete Handlers
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await ApiService.deleteCategory(selectedCategory.id);
      toast.success('Categoría eliminada');
      fetchData();
      setModalType(null);
    } catch (error) { console.error(error); }
  };

  const handleDeleteSubcategory = async () => {
    if (!selectedSubcategory) return;
    try {
      await ApiService.deleteSubcategory(selectedSubcategory.id);
      toast.success('Subcategoría eliminada');
      fetchData();
      setModalType(null);
    } catch (error) { console.error(error); }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await ApiService.deleteProduct(selectedProduct.id);
      toast.success('Producto eliminado');
      fetchData();
      setModalType(null);
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Mis Casas</Link></li>
          <li className="breadcrumb-item"><Link href={`/user/house/view/${houseId}`}>Panel de Casa</Link></li>
          <li className="breadcrumb-item active">Inventario</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Inventario de Productos</h1>
        <button className="btn btn-primary" onClick={() => { setSelectedCategory(null); setModalType('category'); }}>
          <i className="bi bi-plus-circle me-2"></i>Nueva Categoría
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-0">No hay categorías creadas todavía.</p>
        </div>
      ) : (
        <div className="accordion shadow-sm" id="categoriesAccordion">
          {categories.map((category) => {
            const isExpanded = expandedCategoryId === category.id;
            return (
              <div className="accordion-item border-0 mb-3 rounded overflow-hidden" key={category.id}>
                <h2 className="accordion-header shadow-sm">
                  <div className="d-flex align-items-center bg-white pe-3">
                    <button 
                      className={`accordion-button ${!isExpanded ? 'collapsed' : ''} fw-bold py-3`} 
                      type="button"
                      onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                    >
                      {category.name}
                    </button>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedCategory(category); setModalType('category'); }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => { setSelectedCategory(category); setModalType('deleteCategory'); }}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </h2>
                <div className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}>
                  <div className="accordion-body bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0 text-secondary fw-bold">Subcategorías</h5>
                      <button className="btn btn-sm btn-outline-success" onClick={() => { setSelectedCategory(category); setSelectedSubcategory(null); setModalType('subcategory'); }}>
                        + Nueva Subcategoría
                      </button>
                    </div>
                    
                    {(!category.subcategories || category.subcategories.length === 0) ? (
                      <p className="small text-muted mb-0">Esta categoría no tiene subcategorías.</p>
                    ) : (
                      category.subcategories.map((sub) => (
                        <div className="card border-0 shadow-sm mb-3" key={sub.id}>
                          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                            <h6 className="mb-0 fw-bold">{sub.name}</h6>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-link text-primary p-0" onClick={() => { setSelectedSubcategory(sub); setModalType('subcategory'); }}>Editar</button>
                              <button className="btn btn-sm btn-link text-danger p-0" onClick={() => { setSelectedSubcategory(sub); setModalType('deleteSubcategory'); }}>Borrar</button>
                            </div>
                          </div>
                          <div className="card-body pt-0">
                            <div className="table-responsive">
                              <table className="table table-sm table-hover align-middle mb-0">
                                <thead className="small text-muted">
                                  <tr>
                                    <th>Producto</th>
                                    <th className="text-center">Stock</th>
                                    <th className="text-end">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sub.products?.map((prod) => {
                                    const totalStock = prod.productBatches?.reduce((acc, b) => acc + b.quantity, 0) || 0;
                                    const isLow = totalStock <= prod.minQuantity;
                                    return (
                                      <tr key={prod.id}>
                                        <td>
                                          <div className="fw-bold">{prod.name}</div>
                                          <div className="small text-muted">{prod.minQuantity} {prod.unity as string || ''} mín.</div>
                                        </td>
                                        <td className="text-center">
                                          <div className={`badge ${isLow ? 'bg-danger' : 'bg-success'} fs-6`}>
                                            {totalStock} {prod.unity as string || ''}
                                          </div>
                                        </td>
                                        <td className="text-end">
                                          <div className="btn-group btn-group-sm">
                                            {prod.productBatches && prod.productBatches.length > 0 ? (
                                              <>
                                                <button className="btn btn-outline-secondary" onClick={() => handleDecrement(prod.productBatches[0].id)}>-</button>
                                                <button className="btn btn-outline-secondary" onClick={() => handleIncrement(prod.productBatches[0].id)}>+</button>
                                              </>
                                            ) : (
                                              <button className="btn btn-outline-success" onClick={() => { setSelectedProduct(prod); setSelectedBatch(null); setModalType('batch'); }}>
                                                + Stock
                                              </button>
                                            )}
                                            <button className="btn btn-outline-primary ms-2" onClick={() => { setSelectedSubcategory(sub); setSelectedProduct(prod); setModalType('product'); }}>
                                              <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-outline-danger" onClick={() => { setSelectedProduct(prod); setModalType('deleteProduct'); }}>
                                              <i className="bi bi-trash"></i>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  <tr>
                                    <td colSpan={3} className="text-center py-2">
                                      <button className="btn btn-sm btn-link" onClick={() => { setSelectedSubcategory(sub); setSelectedProduct(null); setModalType('product'); }}>
                                        + Añadir Producto
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      <CategoryModal
        show={modalType === 'category'}
        onClose={() => setModalType(null)}
        onSuccess={fetchData}
        houseId={houseId}
        category={selectedCategory}
      />

      <SubcategoryModal
        show={modalType === 'subcategory'}
        onClose={() => setModalType(null)}
        onSuccess={fetchData}
        categoryId={selectedCategory?.id || 0}
        subcategory={selectedSubcategory}
      />

      <ProductModal
        show={modalType === 'product'}
        onClose={() => setModalType(null)}
        onSuccess={fetchData}
        subcategoryId={selectedSubcategory?.id || 0}
        houseId={houseId}
        product={selectedProduct}
      />

      <ProductBatchModal
        show={modalType === 'batch'}
        onClose={() => setModalType(null)}
        onSuccess={fetchData}
        productId={selectedProduct?.id || 0}
        batch={selectedBatch}
      />

      {/* DELETE MODALS */}
      <DeleteConfirmationModal
        show={modalType === 'deleteCategory'}
        onClose={() => setModalType(null)}
        onConfirm={handleDeleteCategory}
        title="Eliminar Categoría"
        itemName={selectedCategory?.name || ''}
      />
      
      <DeleteConfirmationModal
        show={modalType === 'deleteSubcategory'}
        onClose={() => setModalType(null)}
        onConfirm={handleDeleteSubcategory}
        title="Eliminar Subcategoría"
        itemName={selectedSubcategory?.name || ''}
      />

      <DeleteConfirmationModal
        show={modalType === 'deleteProduct'}
        onClose={() => setModalType(null)}
        onConfirm={handleDeleteProduct}
        title="Eliminar Producto"
        itemName={selectedProduct?.name || ''}
      />
    </div>
  );
}
