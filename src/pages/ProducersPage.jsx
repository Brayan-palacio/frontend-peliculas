import React, { useEffect, useState } from 'react';
import { getProducers, createProducer } from '../services/apiService';
import Swal from 'sweetalert2';
import './ProducersPage.css';

export const ProducersPage = () => {
  const [producers, setProducers] = useState([]);
  const [formData, setFormData] = useState({ name: '', slogan: '', description: '' });
  const [loading, setLoading] = useState(true);

  const fetchProducers = async () => {
    setLoading(true);
    try {
      const res = await getProducers();
      setProducers(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar las productoras', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Advertencia', 'El nombre de la productora es requerido', 'warning');
      return;
    }
    try {
      await createProducer(formData);
      Swal.fire('Éxito', 'Productora creada correctamente', 'success');
      setFormData({ name: '', slogan: '', description: '' });
      fetchProducers();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al crear la productora', 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const totalProducers = producers.length;
  const activeProducers = producers.filter(p => p.status !== 'Inactive').length;
  const inactiveProducers = producers.filter(p => p.status === 'Inactive').length;

  return (
    <div className="producers-page">
      {/* HEADER */}
      <div className="producers-header">
        <div className="header-top">
          <div>
            <h2>
              <span className="icon">🏢</span>
              Gestión de Productoras
            </h2>
            <p className="subtitle">Administra las productoras de películas y series</p>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="producers-stats">
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <span className="stat-value">{totalProducers}</span>
            <span className="stat-label">Total Productoras</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{activeProducers}</span>
            <span className="stat-label">Activas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⛔</div>
          <div className="stat-info">
            <span className="stat-value">{inactiveProducers}</span>
            <span className="stat-label">Inactivas</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="producers-container">
        {/* FORMULARIO */}
        <div className="producers-form-card">
          <div className="card-header">
            <span className="header-icon">➕</span>
            <h5>Agregar Productora</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Nombre de la Productora
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Warner Bros Pictures"
                  required
                />
              </div>
              <div className="form-group">
                <label>Slogan</label>
                <input
                  type="text"
                  name="slogan"
                  className="form-control"
                  value={formData.slogan}
                  onChange={handleChange}
                  placeholder="Ej: 'Where Dreams Come True'"
                />
                <div className="form-hint">Frase icónica de la productora</div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Breve descripción de la productora..."
                />
              </div>
              <button type="submit" className="btn-submit">
                <span>💾</span> Guardar Productora
              </button>
            </form>
          </div>
        </div>

        {/* LISTADO */}
        <div className="producers-list-card">
          <div className="card-header">
            <h5>Listado de Productoras</h5>
            <span className="badge-count">{producers.length} productoras</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Cargando productoras...</p>
              </div>
            ) : producers.length === 0 ? (
              <div className="empty-producers">
                <div className="empty-icon">🏢</div>
                <h4>No hay productoras registradas</h4>
                <p>Agrega tu primera productora usando el formulario</p>
              </div>
            ) : (
              <table className="producers-table">
                <thead>
                  <tr>
                    <th className="col-index">#</th>
                    <th>Productora</th>
                    <th className="col-slogan">Slogan</th>
                    <th className="col-status">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {producers.map((p, index) => {
                    const isActive = p.status !== 'Inactive';
                    const name = p.name || p.nombre || 'Sin nombre';
                    return (
                      <tr key={p._id || index}>
                        <td className="col-index">{index + 1}</td>
                        <td className="col-name">
                          <div className="producer-logo">
                            <div className="logo-circle">
                              {getInitials(name)}
                            </div>
                            <span>{name}</span>
                          </div>
                        </td>
                        <td className="col-slogan">
                          {p.slogan ? (
                            <>
                              <span className="slogan-icon">"</span>
                              {p.slogan}
                              <span className="slogan-icon">"</span>
                            </>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                          )}
                        </td>
                        <td className="col-status">
                          <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                            <span className="dot"></span>
                            {isActive ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};