'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { UserHouseOutputDTO } from '@/http/DTO/UserHouseOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import AddUserModal from './modals/AddUserModal';
import UpdateUserRoleModal from './modals/UpdateUserRoleModal';
import RemoveUserModal from './modals/RemoveUserModal';

const UserListView = ({ houseId }: { houseId: number }) => {
  const [houseUsers, setHouseUsers] = useState<UserHouseOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<UserHouseOutputDTO | null>(null);
  const [userToRemove, setUserToRemove] = useState<UserHouseOutputDTO | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.getUsersHouse(houseId);
      setHouseUsers(data);
    } catch (error) {
      console.error('Error fetching house users:', error);
    } finally {
      setLoading(false);
    }
  }, [houseId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Mis Casas</Link></li>
          <li className="breadcrumb-item"><Link href={`/user/house/view/${houseId}`}>Panel de Casa</Link></li>
          <li className="breadcrumb-item active">Usuarios</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="text-muted">Usuarios que tienen acceso a esta casa.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-person-plus me-2"></i>Añadir Usuario
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : houseUsers.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <p>No se encontraron usuarios para esta casa.</p>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol en Casa</th>
                <th>Fecha Unión</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {houseUsers.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        {item.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold">{item.user.name}</span>
                    </div>
                  </td>
                  <td>{item.user.email}</td>
                  <td>
                    <span className={`badge ${item.role.name === 'ADMIN' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                      {item.role.name}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setUserToUpdate(item)}
                      title="Cambiar rol"
                    >
                      <i className="bi bi-shield-lock"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setUserToRemove(item)}
                      title="Eliminar de la casa"
                    >
                      <i className="bi bi-person-x"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddUserModal 
          houseId={houseId}
          onSuccess={fetchUsers}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {userToUpdate && (
        <UpdateUserRoleModal 
          houseId={houseId}
          userHouse={userToUpdate}
          onSuccess={fetchUsers}
          onClose={() => setUserToUpdate(null)}
        />
      )}

      {userToRemove && (
        <RemoveUserModal 
          houseId={houseId}
          userHouse={userToRemove}
          onSuccess={fetchUsers}
          onClose={() => setUserToRemove(null)}
        />
      )}
    </div>
  );
};

export default UserListView;
