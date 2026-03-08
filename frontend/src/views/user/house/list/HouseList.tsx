'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HouseOutputDTO } from '@/http/DTO/HouseOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import CreateHouseModal from './modals/CreateHouseModal';
import EditHouseModal from './modals/EditHouseModal';
import DeleteHouseModal from './modals/DeleteHouseModal';

const HouseListView = () => {
  const [houses, setHouses] = useState<HouseOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [houseToEdit, setHouseToEdit] = useState<HouseOutputDTO | null>(null);
  const [houseToDelete, setHouseToDelete] = useState<HouseOutputDTO | null>(null);
  const router = useRouter();

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.listHouses();
      setHouses(data);
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const handleEnterHouse = (id: number) => {
    router.push(`/user/house/view/${id}`);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Casas</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-house-add me-2"></i>Nueva Casa
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : houses.length === 0 ? (
        <div className="alert alert-info text-center py-5 shadow-sm">
          <p className="mb-3">Aún no perteneces a ninguna casa.</p>
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Crea tu primera casa
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {houses.map((house) => (
            <div key={house.id} className="col">
              <div className="card h-100 shadow-sm border-0 transition-hover">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{house.name}</h5>
                  <p className="card-text text-muted text-truncate" style={{ maxHeight: '3em' }}>
                    {house.description || 'Sin descripción.'}
                  </p>
                  <p className="card-text small text-secondary">
                    <i className="bi bi-calendar3 me-2"></i>
                    Creada el {new Date(house.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex gap-2 pb-3 px-3">
                  <button 
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => handleEnterHouse(house.id)}
                  >
                    Entrar
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    title="Editar casa"
                    onClick={() => setHouseToEdit(house)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    title="Borrar casa"
                    onClick={() => setHouseToDelete(house)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateHouseModal 
          onSuccess={fetchHouses} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}

      {houseToEdit && (
        <EditHouseModal 
          house={houseToEdit}
          onSuccess={fetchHouses}
          onClose={() => setHouseToEdit(null)}
        />
      )}

      {houseToDelete && (
        <DeleteHouseModal 
          house={houseToDelete}
          onSuccess={fetchHouses}
          onClose={() => setHouseToDelete(null)}
        />
      )}

      <style jsx>{`
        .transition-hover {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .transition-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default HouseListView;
