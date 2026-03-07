'use client';

import Link from 'next/link';
import React from 'react';

export default function AdminView() {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-body p-5">
          <h1 className="fw-bold text-primary mb-4">Panel de Administración</h1>
          <p className="lead text-muted">
            Bienvenido al panel de gestión global de House Core.
          </p>
          <hr />
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card bg-light border-0 text-center p-4 mb-3">
                <h3 className="fw-bold">Usuarios</h3>
                <p>Gestionar cuentas de usuario</p>
                <Link href="/admin/users/list" className="btn btn-outline-primary btn-sm">
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light border-0 text-center p-4 mb-3">
                <h3 className="fw-bold">Casas</h3>
                <p>Gestionar registros de casas</p>
                <button className="btn btn-outline-primary btn-sm">Ver todas</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light border-0 text-center p-4 mb-3">
                <h3 className="fw-bold">Sistema</h3>
                <p>Configuración global</p>
                <button className="btn btn-outline-primary btn-sm">Configurar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
