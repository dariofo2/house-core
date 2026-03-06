'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { LoginDTO } from '@/http/DTO/LoginDTO';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const credentials: LoginDTO = { name: username, password };
    try {
      await ApiService.login(credentials);
      toast.success('¡Sesión iniciada con éxito!');
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Bienvenido</h2>
            <p className="text-muted">Inicia sesión en House Core</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label small fw-bold text-secondary text-uppercase">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                className="form-control form-control-lg bg-light border-0 shadow-sm"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label small fw-bold text-secondary text-uppercase">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-control form-control-lg bg-light border-0 shadow-sm"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Entrando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="small text-muted mb-0">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-primary fw-bold text-decoration-none">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
