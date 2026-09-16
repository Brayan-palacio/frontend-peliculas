import React, { useEffect, useState } from 'react';
import { getGenres, createGenre } from '../services/apiService';
import Swal from 'sweetalert2';
import './GenresPage.css';

export const GenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const res = await getGenres();
      setGenres(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los géneros', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGenre(formData);
      Swal.fire('Éxito', 'Género creado correctamente', 'success');
      setFormData({ name: '', description: '' });
      fetchGenres();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al crear el género', 'error');
    }
  };

  const totalGenres = genres.length;
  const activeGenres = genres.filter(g => g.status !== 'Inactive').length;
  const inactiveGenres = genres.filter(g => g.status === 'Inactive').length;

  return (
    <div className="genres-page">
      {/* HEADER */}
      <div className="genres-header">
        <div className="header-top">
          <div>
            <h2>
              <span className="icon">🏷️</span>
              Gestión de Géneros
            </h2>
            <p className="subtitle">Administra los géneros de películas y series</p>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="genres-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-value">{totalGenres}</span>
            <span className="stat-label">Total Géneros</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{activeGenres}</span>
            <span className="stat-label">Activos</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⛔</div>
          <div className="stat-info">
            <span className="stat-value">{inactiveGenres}</span>
            <span className="stat-label">Inactivos</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="genres-container">
        {/* FORMULARIO */}
        <div className="genres-form-card">
          <div className="card-header">
            <span className="header-icon">➕</span>
            <h5>Agregar Nuevo Género</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Género</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Acción, Comedia, Drama..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Breve descripción del género..."
                />
              </div>
              <button type="submit" className="btn-submit">
                <span>💾</span> Guardar Género
              </button>
            </form>
          </div>
        </div>

        {/* LISTADO */}
        <div className="genres-list-card">
          <div className="card-header">
            <h5>Listado de Géneros</h5>
            <span className="badge-count">{genres.length} géneros</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ 
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '4px solid var(--border)',
                  borderTop: '4px solid var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                  Cargando géneros...
                </p>
              </div>
            ) : genres.length === 0 ? (
              <div className="empty-genres">
                <div className="empty-icon">🏷️</div>
                <h4>No hay géneros registrados</h4>
                <p>Agrega tu primer género usando el formulario</p>
              </div>
            ) : (
              <table className="genres-table">
                <thead>
                  <tr>
                    <th className="col-index">#</th>
                    <th>Nombre</th>
                    <th className="col-description">Descripción</th>
                    <th className="col-status">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {genres.map((g, index) => {
                    const isActive = g.status !== 'Inactive';
                    return (
                      <tr key={g._id || index}>
                        <td className="col-index">{index + 1}</td>
                        <td className="col-name">{g.name || g.nombre}</td>
                        <td className="col-description">
                          {g.description || g.descripcion || 'Sin descripción'}
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