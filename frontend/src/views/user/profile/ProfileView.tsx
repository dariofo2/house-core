'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserOutputDTO } from '@/http/DTO/UserOutputDTO';
import ChangePasswordModal from './modals/ChangePasswordModal';

const ProfileView = () => {
  const [user, setUser] = useState<UserOutputDTO | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    // Get user from cookies (stored during login)
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='))
      ?.split('=')[1];

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie)) as UserOutputDTO;
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse user cookie', e);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Inicio</Link></li>
          <li className="breadcrumb-item active">Mi Perfil</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-4 text-center">
              <div className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="fw-bold mb-0">{user.name}</h2>
              <p className="mb-0 opacity-75">{user.email}</p>
            </div>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Ajustes de Cuenta</h5>
              
              <div className="d-grid gap-3">
                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded border">
                  <div>
                    <h6 className="mb-1 fw-bold">Seguridad</h6>
                    <p className="small text-muted mb-0">Protege tu cuenta con una contraseña segura.</p>
                  </div>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    Cambiar Contraseña
                  </button>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded border opacity-50">
                  <div>
                    <h6 className="mb-1 fw-bold">Notificaciones</h6>
                    <p className="small text-muted mb-0">Próximamente: Configura tus alertas.</p>
                  </div>
                  <button className="btn btn-sm btn-secondary disabled">Configurar</button>
                </div>
              </div>

              <div className="mt-5 text-center">
                <Link href="/user/house/list" className="btn btn-link text-decoration-none">
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al listado de casas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal 
          userId={user.id}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileView;
