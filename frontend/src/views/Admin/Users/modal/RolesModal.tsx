'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { UserOutputDTO } from '@/http/DTO/UserOutputDTO';
import { RoleOutputDTO } from '@/http/DTO/RoleOutputDTO';
import { RoleName } from '@/common/enum/role.enum';

interface RolesModalProps {
  show: boolean;
  onClose: () => void;
  user: UserOutputDTO;
  onRolesChanged: () => void;
}

export default function RolesModal({ show, onClose, user, onRolesChanged }: RolesModalProps) {
  const [userRoles, setUserRoles] = useState<RoleOutputDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchUserRoles();
    }
  }, [show, user.id]);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const roles = await ApiService.getUserRoles(user.id);
      setUserRoles(roles);
    } catch (error) {
      console.error('Failed to fetch user roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (roleName: string) => {
    try {
      await ApiService.addUserRole(user.id, roleName);
      toast.success(`Rol ${roleName} añadido con éxito`);
      fetchUserRoles();
      onRolesChanged();
    } catch (error) {
      console.error('Failed to add role:', error);
    }
  };

  const handleRemoveRole = async (roleName: string) => {
    try {
      await ApiService.deleteUserRole(user.id, roleName);
      toast.success(`Rol ${roleName} eliminado con éxito`);
      fetchUserRoles();
      onRolesChanged();
    } catch (error) {
      console.error('Failed to remove role:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">Roles de {user.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body pt-0">
            <h6 className="text-secondary small fw-bold text-uppercase mb-3">Roles Actuales</h6>
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {userRoles.length > 0 ? (
                  userRoles.map((role) => (
                    <div key={role.id} className="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
                      {role.name}
                      <button
                        className="btn-close small"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => handleRemoveRole(role.name)}
                      ></button>
                    </div>
                  ))
                ) : (
                  <span className="text-muted small">No tiene roles asignados.</span>
                )}
              </div>
            )}

            <hr />

            <h6 className="text-secondary small fw-bold text-uppercase mb-3">Añadir Nuevo Rol</h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.values(RoleName).map((role) => {
                const hasRole = userRoles.some((ur) => ur.name === role);
                if (hasRole) return null;
                return (
                  <button key={role} className="btn btn-sm btn-outline-info" onClick={() => handleAddRole(role)}>
                    + {role}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

