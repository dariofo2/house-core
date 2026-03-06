'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { EventOutputDTO } from '@/http/DTO/EventOutputDTO';
import ApiService from '@/http/axios-connector/axiosConnector';
import CreateEventModal from './modals/CreateEventModal';
import UpdateEventModal from './modals/UpdateEventModal';
import DeleteEventModal from './modals/DeleteEventModal';
import { toast } from 'react-toastify';

const EventListView = ({ houseId }: { houseId: number }) => {
  const [events, setEvents] = useState<EventOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventToUpdate, setEventToUpdate] = useState<EventOutputDTO | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventOutputDTO | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiService.getEventByHouseId(houseId);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [houseId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleReset = async (id: number) => {
    try {
      await ApiService.resetEvent(id);
      toast.success('Temporizador reseteado');
      fetchEvents();
    } catch (error) {
      console.error('Error resetting event:', error);
    }
  };

  const calculateDaysLeft = (updatedAt: string, maxDays: number) => {
    const lastUpdate = new Date(updatedAt);
    const deadline = new Date(lastUpdate.getTime() + maxDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (daysLeft: number) => {
    if (daysLeft < 0) return <span className="badge bg-danger">Vencido ({Math.abs(daysLeft)} d)</span>;
    if (daysLeft <= 2) return <span className="badge bg-warning text-dark">Urgente ({daysLeft} d)</span>;
    return <span className="badge bg-success">Al día ({daysLeft} d)</span>;
  };

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/user/house/list">Mis Casas</Link></li>
          <li className="breadcrumb-item"><Link href={`/user/house/view/${houseId}`}>Panel de Casa</Link></li>
          <li className="breadcrumb-item active">Eventos</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Eventos y Temporizadores</h1>
          <p className="text-muted">Gestiona las tareas recurrentes de tu casa.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>Nuevo Evento
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <p>No hay eventos configurados para esta casa.</p>
          <button className="btn btn-outline-primary" onClick={() => setShowCreateModal(true)}>
            Crear el primer evento
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {events.map((event) => {
            const daysLeft = calculateDaysLeft(event.updatedAt, event.maxDays);
            return (
              <div key={event.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 position-relative">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold mb-0">{event.name}</h5>
                      {getStatusBadge(daysLeft)}
                    </div>
                    <p className="card-text text-muted small mb-3">
                      {event.description || 'Sin descripción.'}
                    </p>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Frecuencia: {event.maxDays} días</span>
                        <span>Último reset: {new Date(event.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className={`progress-bar ${daysLeft < 0 ? 'bg-danger' : daysLeft <= 2 ? 'bg-warning' : 'bg-success'}`}
                          role="progressbar" 
                          style={{ width: `${Math.max(0, Math.min(100, (daysLeft / event.maxDays) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-primary flex-grow-1"
                        onClick={() => handleReset(event.id)}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>Reset
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setEventToUpdate(event)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => setEventToDelete(event)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal 
          houseId={houseId}
          onSuccess={fetchEvents}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {eventToUpdate && (
        <UpdateEventModal 
          event={eventToUpdate}
          onSuccess={fetchEvents}
          onClose={() => setEventToUpdate(null)}
        />
      )}

      {eventToDelete && (
        <DeleteEventModal 
          event={eventToDelete}
          onSuccess={fetchEvents}
          onClose={() => setEventToDelete(null)}
        />
      )}
    </div>
  );
};

export default EventListView;
