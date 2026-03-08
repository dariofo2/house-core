'use client';

import React, { useEffect, useState } from 'react';
import ApiService from '@/http/axios-connector/axiosConnector';
import { UserOutputDTO } from '@/http/DTO/UserOutputDTO';
import CreateUserModal from './modal/CreateUserModal';
import EditUserModal from './modal/EditUserModal';
import DeleteUserModal from './modal/DeleteUserModal';
import RolesModal from './modal/RolesModal';
import UpdatePasswordModal from './modal/UpdatePasswordModal';

export default function UserListView() {
  const [users, setUsers] = useState<UserOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // States for Modals visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Selected User for Edit/Delete/Roles
  const [selectedUser, setSelectedUser] = useState<UserOutputDTO | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.listUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: UserOutputDTO) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user: UserOutputDTO) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openRolesModal = (user: UserOutputDTO) => {
    setSelectedUser(user);
    setShowRolesModal(true);
  };

  const openPasswordModal = (user: UserOutputDTO) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Crear Nuevo Usuario
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
                  <th className="py-3 border-0">Email</th>
                  <th className="py-3 border-0">Roles</th>
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4">{user.id}</td>
                      <td className="fw-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.userRoles?.map((ur) => (
                          <span key={ur.id} className="badge bg-info text-dark me-1">
                            {ur.role.name}
                          </span>
                        ))}
                      </td>
                      <td className="text-end px-4">
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => openPasswordModal(user)}
                          title="Cambiar Contraseña"
                        >
                          Pass
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => openRolesModal(user)}
                        >
                          Roles
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEditModal(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => openDeleteModal(user)}
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

      {/* MODALS */}
      <CreateUserModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchUsers}
      />

      {selectedUser && (
        <>
          <EditUserModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={fetchUsers}
            user={selectedUser}
          />

          <DeleteUserModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={fetchUsers}
            user={selectedUser}
          />

          <RolesModal
            show={showRolesModal}
            onClose={() => setShowRolesModal(false)}
            user={selectedUser}
            onRolesChanged={fetchUsers}
          />

          <UpdatePasswordModal
            show={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            onSuccess={fetchUsers}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}
