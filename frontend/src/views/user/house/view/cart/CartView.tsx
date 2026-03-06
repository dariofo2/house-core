'use client';

import React from 'react';
import Link from 'next/link';

const CartView = ({ houseId }: { houseId: number }) => {
  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Mis Casas</Link></li>
          <li className="breadcrumb-item"><Link href={`/user/house/view/${houseId}`}>Panel de Casa</Link></li>
          <li className="breadcrumb-item active">Carrito de la Compra</li>
        </ol>
      </nav>
      <h1>Carrito de la Compra</h1>
      <p className="lead text-muted">Próximamente: Productos pendientes de comprar.</p>
    </div>
  );
};

export default CartView;
