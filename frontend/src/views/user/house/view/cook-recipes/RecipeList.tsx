'use client';

import React from 'react';
import Link from 'next/link';

const RecipeListView = ({ houseId }: { houseId: number }) => {
  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Mis Casas</Link></li>
          <li className="breadcrumb-item"><Link href={`/user/house/view/${houseId}`}>Panel de Casa</Link></li>
          <li className="breadcrumb-item active">Recetas</li>
        </ol>
      </nav>
      <h1>Recetas de Cocina</h1>
      <p className="lead text-muted">Próximamente: Lista de recetas y preparación automática.</p>
    </div>
  );
};

export default RecipeListView;
