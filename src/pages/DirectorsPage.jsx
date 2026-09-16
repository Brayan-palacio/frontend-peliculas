import React, { useEffect, useState } from 'react';
import { getDirectors, createDirector } from '../services/apiService';
import Swal from 'sweetalert2';
import './DirectorsPage.css';

export const DirectorsPage = () => {
  const [directors, setDirectors] = useState([]);
  const [names, setNames] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const res = await getDirectors();
      setDirectors(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los directores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!names.trim()) {
      Swal.fire('Advertencia', 'El nombre del director es requerido', 'warning');
      return;
    }
    try {
      await createDirector({ names });
      Swal.fire('Éxito', 'Director creado correctamente', 'success');
      setNames('');
      fetchDirectors();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al crear director', 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const totalDirectors = directors.length;
  const activeDirectors = directors.filter(d => d.status !== 'Inactive').length;
  const inactiveDirectors = directors.filter(d => d.status === 'Inactive').length;

  return (
    <div className="directors-page">
      {/* HEADER */}
      <div className="directors-header">
        <div className="header-top">
          <div>
            <h2>
              <span className="icon">🎬</span>
              Gestión de Directores
            </h2>
            <p className="subtitle">Administra los directores de películas y series</p>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="directors-stats">
        <div className="stat-card">
          <div className="stat-icon">👨‍🎨</div>
          <div className="stat-info">
            <span className="stat-value">{totalDirectors}</span>
            <span className="stat-label">Total Directores</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{activeDirectors}</span>
            <span className="stat-label">Activos</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⛔</div>
          <div className="stat-info">
            <span className="stat-value">{inactiveDirectors}</span>
            <span className="stat-label">Inactivos</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="directors-container">
        {/* FORMULARIO */}
        <div className="directors-form-card">
          <div className="card-header">
            <span className="header-icon">➕</span>
            <h5>Agregar Director</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Nombres y Apellidos
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  placeholder="Ej: Steven Spielberg"
                  required
                />
                <div className="form-hint">
                  Ingresa el nombre completo del director
                </div>
              </div>
              <button type="submit" className="btn-submit">
                <span>💾</span> Guardar Director
              </button>
            </form>
          </div>
        </div>

        {/* LISTADO */}
        <div className="directors-list-card">
          <div className="card-header">
            <h5>Listado de Directores</h5>
            <span className="badge-count">{directors.length} directores</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Cargando directores...</p>
              </div>
            ) : directors.length === 0 ? (
              <div className="empty-directors">
                <div className="empty-icon">🎬</div>
                <h4>No hay directores registrados</h4>
                <p>Agrega tu primer director usando el formulario</p>
              </div>
            ) : (
              <table className="directors-table">
                <thead>
                  <tr>
                    <th className="col-index">#</th>
                    <th>Director</th>
                    <th className="col-status">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {directors.map((d, index) => {
                    const isActive = d.status !== 'Inactive';
                    const name = d.names || d.nombre || 'Sin nombre';
                    return (
                      <tr key={d._id || index}>
                        <td className="col-index">{index + 1}</td>
                        <td className="col-name">
                          <div className="director-avatar">
                            <div className="avatar-circle">
                              {getInitials(name)}
                            </div>
                            <span>{name}</span>
                          </div>
                        </td>
                        <td className="col-status">
                          <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                            <span className="dot"></span>
                            {isActive ? 'Activo' : 'Inactivo'}
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