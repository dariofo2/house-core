'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HouseOutputDTO } from '@/http/DTO/HouseOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import Link from 'next/link';

interface HouseViewProps {
  id: number;
}

const HouseView: React.FC<HouseViewProps> = ({ id }) => {
  const [house, setHouse] = useState<HouseOutputDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchHouseData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.getHouseById(id);
      setHouse(data);
    } catch (error) {
      console.error('Error fetching house data:', error);
      // If error (e.g., 404 or unauthorized), redirect back to list
      router.replace('/user/house/list');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchHouseData();
  }, [fetchHouseData]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!house) return null;

  const dashboardItems = [
    {
      title: 'Inventario',
      icon: 'bi-box-seam',
      description: 'Gestiona productos, categorías y existencias.',
      link: `/user/house/view/${id}/products`,
      color: 'primary'
    },
    {
      title: 'Recetas',
      icon: 'bi-journal-richtext',
      description: 'Prepara platos descontando stock automáticamente.',
      link: `/user/house/view/${id}/cook-recipes`,
      color: 'success'
    },
    {
      title: 'Eventos',
      icon: 'bi-calendar-event',
      description: 'Controla recordatorios y cronómetros de la casa.',
      link: `/user/house/view/${id}/events`,
      color: 'info'
    },
    {
      title: 'Usuarios',
      icon: 'bi-people',
      description: 'Gestiona quién tiene acceso a esta casa.',
      link: `/user/house/view/${id}/users`,
      color: 'warning'
    },
    {
      title: 'Carrito de la Compra',
      icon: 'bi-cart',
      description: 'Lista de productos que faltan y necesitas comprar.',
      link: `/user/house/view/${id}/cart`,
      color: 'danger'
    }
  ];

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Mis Casas</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{house.name}</li>
        </ol>
      </nav>

      <div className="row mb-5 align-items-center">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold">{house.name}</h1>
          <p className="lead text-muted">{house.description || 'Sin descripción disponible.'}</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link href="/user/house/list" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Volver al listado
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {dashboardItems.map((item, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <Link href={item.link} className="text-decoration-none">
              <div className={`card h-100 border-0 shadow-sm transition-hover border-bottom border-4 border-${item.color}`}>
                <div className="card-body text-center py-4">
                  <div className={`display-5 text-${item.color} mb-3`}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h5 className="card-title fw-bold text-dark">{item.title}</h5>
                  <p className="card-text text-muted small">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <style jsx>{`
        .transition-hover {
          transition: all 0.2s ease-in-out;
        }
        .transition-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default HouseView;
