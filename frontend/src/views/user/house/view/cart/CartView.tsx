'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ApiService from '@/http/axios-connector/axiosConnector';
import { ProductCarShopOutputDTO } from '@/http/DTO/ProductCarShopOutputDTO';
import { toast } from 'react-toastify';

interface CartItem extends ProductCarShopOutputDTO {
  toBuyQuantity: number;
  confirming?: boolean;
}

const CartView = ({ houseId }: { houseId: number }) => {
  const [products, setProducts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [houseId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getCarShopProducts(houseId);
      // Initialize toBuyQuantity with the difference between minQuantity and current quantity
      const initialItems: CartItem[] = data.map(item => ({
        ...item,
        toBuyQuantity: Math.max(0, item.minQuantity - (Number(item.quantity) || 0))
      }));
      setProducts(initialItems);
    } catch (error) {
      console.error('Error fetching cart products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (productId: number) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, toBuyQuantity: p.toBuyQuantity + (p.step || 1) }
          : p
      )
    );
  };

  const handleDecrement = (productId: number) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, toBuyQuantity: Math.max(0, p.toBuyQuantity - (p.step || 1)) }
          : p
      )
    );
  };

  const handleConfirm = async (product: CartItem) => {
    if (product.toBuyQuantity <= 0) {
      toast.warning('La cantidad a comprar debe ser mayor que 0');
      return;
    }

    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, confirming: true } : p));

    try {
      // Call the new backend endpoint to update the first batch found for that element
      await ApiService.confirmPurchase(product.id, product.toBuyQuantity);
      
      toast.success(`${product.name} actualizado correctamente`);
      
      // Re-fetch products to ensure the list is up to date according to the backend
      // If the product is now above the minimum quantity, it will disappear from getCarShopProducts
      await fetchProducts();
      
    } catch (error) {
      console.error('Error confirming purchase:', error);
      toast.error('Error al confirmar la compra');
    } finally {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, confirming: false } : p));
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/user/house/list">Mis Casas</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/user/house/view/${houseId}`}>Panel de Casa</Link>
          </li>
          <li className="breadcrumb-item active">Carrito de la Compra</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>
            <i className="bi bi-cart4 me-2"></i>
            Carrito de la Compra
          </h1>
          <p className="lead text-muted">
            Lista de productos necesarios basada en el stock actual y el mínimo configurado.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-success text-center py-5">
          <h3 className="mb-3">¡Todo al día!</h3>
          <p>No hay productos pendientes en la lista de la compra.</p>
          <Link href={`/user/house/view/${houseId}`} className="btn btn-primary mt-3">
            Volver al Panel
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="table-responsive bg-white rounded shadow-sm border">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Stock Actual</th>
                    <th className="text-center">Mínimo</th>
                    <th className="text-center">A Comprar</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {product.photo ? (
                            <img
                              src={product.photo}
                              alt={product.name}
                              className="rounded me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                              style={{ width: '40px', height: '40px' }}
                            >
                              <i className="bi bi-box-seam text-muted"></i>
                            </div>
                          )}
                          <div>
                            <div className="fw-bold">{product.name}</div>
                            <small className="text-muted">{product.description}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-danger rounded-pill">
                          {Number(product.quantity) || 0} {product.unity}
                        </span>
                      </td>
                      <td className="text-center text-muted">
                        {product.minQuantity} {product.unity}
                      </td>
                      <td className="text-center">
                        <div className="d-inline-flex align-items-center border rounded">
                          <button
                            className="btn btn-sm btn-light border-0"
                            onClick={() => handleDecrement(product.id)}
                            title="Restar"
                            disabled={product.confirming}
                          >
                            <i className="bi bi-dash-lg"></i>
                          </button>
                          <span className="px-3 fw-bold" style={{ minWidth: '60px' }}>
                            {product.toBuyQuantity}
                          </span>
                          <button
                            className="btn btn-sm btn-light border-0"
                            onClick={() => handleIncrement(product.id)}
                            title="Sumar"
                            disabled={product.confirming}
                          >
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        </div>
                        <div className="small text-muted mt-1">
                          Paso: {product.step} {product.unity}
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleConfirm(product)}
                          disabled={product.confirming}
                        >
                          {product.confirming ? (
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          ) : (
                            <i className="bi bi-check-lg me-1"></i>
                          )}
                          Confirmar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
