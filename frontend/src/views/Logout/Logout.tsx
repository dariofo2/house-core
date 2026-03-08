'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService from '@/http/axios-connector/axiosConnector';

const LogoutView = () => {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await ApiService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Force a full page reload to clear Next.js client-side cache 
        // and ensure Server Components (like the Banner) re-read the updated cookies.
        window.location.href = '/';
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="lead">Cerrando sesión...</p>
      </div>
    </div>
  );
};

export default LogoutView;
