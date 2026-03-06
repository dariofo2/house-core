'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CreateUserDTO } from '@/http/DTO/CreateUserDTO';
import { useRouter } from 'next/navigation';

export default function RegisterView() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const userData: CreateUserDTO = { name: username, email, password };

    try {
      await ApiService.createUser(userData);
      toast.success('¡Cuenta creada con éxito!');
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0 my-5" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Regístrate</h2>
            <p className="text-muted">Crea una cuenta en House Core</p>
          </div>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label small fw-bold text-secondary text-uppercase">
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                className="form-control form-control-lg bg-light border-0 shadow-sm"
                placeholder="Ej. JuanPerez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label small fw-bold text-secondary text-uppercase">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control form-control-lg bg-light border-0 shadow-sm"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
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
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label small fw-bold text-secondary text-uppercase">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control form-control-lg bg-light border-0 shadow-sm"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="small text-muted mb-0">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-primary fw-bold text-decoration-none">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
