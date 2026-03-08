'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HouseOutputDTO } from '@/http/DTO/HouseOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import CreateHouseModal from './modal/CreateHouseModal';
import EditHouseModal from './modal/EditHouseModal';
import DeleteHouseModal from './modal/DeleteHouseModal';

export default function HouseListView() {
  const [houses, setHouses] = useState<HouseOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [houseToEdit, setHouseToEdit] = useState<HouseOutputDTO | null>(null);
  const [houseToDelete, setHouseToDelete] = useState<HouseOutputDTO | null>(null);
  const router = useRouter();

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.listAllHouses();
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Gestión de Casas (Admin)</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Crear Nueva Casa
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">ID</th>
                  <th className="py-3 border-0">Nombre</th>
                  <th className="py-3 border-0">Descripción</th>
                  <th className="py-3 border-0">Fecha Creación</th>
                  <th className="py-3 border-0 text-end px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : houses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No se encontraron casas.
                    </td>
                  </tr>
                ) : (
                  houses.map((house) => (
                    <tr key={house.id}>
                      <td className="px-4">{house.id}</td>
                      <td className="fw-bold text-primary">{house.name}</td>
                      <td className="text-truncate" style={{ maxWidth: '300px' }}>
                        {house.description || 'Sin descripción'}
                      </td>
                      <td>{new Date(house.createdAt).toLocaleDateString()}</td>
                      <td className="text-end px-4">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEnterHouse(house.id)}
                        >
                          Entrar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => setHouseToEdit(house)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setHouseToDelete(house)}
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
    </div>
  );
}
