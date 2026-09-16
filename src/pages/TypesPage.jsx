import React, { useEffect, useState } from 'react';
import { getTypes, createType } from '../services/apiService';
import Swal from 'sweetalert2';
import './TypesPage.css';

export const TypesPage = () => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await getTypes();
      setTypes(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los tipos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Advertencia', 'El nombre del tipo es requerido', 'warning');
      return;
    }
    try {
      await createType(formData);
      Swal.fire('Éxito', 'Tipo creado correctamente', 'success');
      setFormData({ name: '', description: '' });
      fetchTypes();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al crear el tipo', 'error');
    }
  };

  const getTypeIcon = (name) => {
    const typeName = (name || '').toLowerCase();
    if (typeName.includes('película') || typeName.includes('movie') || typeName.includes('film')) {
      return { icon: '🎬', className: 'movie' };
    }
    if (typeName.includes('serie') || typeName.includes('series') || typeName.includes('tv')) {
      return { icon: '📺', className: 'series' };
    }
    if (typeName.includes('documental') || typeName.includes('documentary')) {
      return { icon: '🎥', className: 'documentary' };
    }
    return { icon: '📁', className: 'other' };
  };

  const totalTypes = types.length;

  return (
    <div className="types-page">
      {/* HEADER */}
      <div className="types-header">
        <div className="header-top">
          <div>
            <h2>
              <span className="icon">📂</span>
              Gestión de Tipos
            </h2>
            <p className="subtitle">Administra los tipos de contenido (Películas, Series, etc.)</p>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="types-stats">
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <span className="stat-value">{totalTypes}</span>
            <span className="stat-label">Total Tipos</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-info">
            <span className="stat-value">
              {types.filter(t => {
                const name = (t.name || t.nombre || '').toLowerCase();
                return name.includes('película') || name.includes('movie') || name.includes('film');
              }).length}
            </span>
            <span className="stat-label">Películas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📺</div>
          <div className="stat-info">
            <span className="stat-value">
              {types.filter(t => {
                const name = (t.name || t.nombre || '').toLowerCase();
                return name.includes('serie') || name.includes('series') || name.includes('tv');
              }).length}
            </span>
            <span className="stat-label">Series</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="types-container">
        {/* FORMULARIO */}
        <div className="types-form-card">
          <div className="card-header">
            <span className="header-icon">➕</span>
            <h5>Agregar Tipo de Contenido</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Nombre del Tipo
                  <span className="required">*</span>
                  <span className="label-hint">Ej: Película, Serie, Documental, etc.</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Película, Serie, Documental..."
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
                  placeholder="Breve descripción del tipo de contenido..."
                />
                <div className="form-hint">Opcional: Describe las características de este tipo</div>
              </div>
              <button type="submit" className="btn-submit">
                <span>💾</span> Guardar Tipo
              </button>
            </form>
          </div>
        </div>

        {/* LISTADO */}
        <div className="types-list-card">
          <div className="card-header">
            <h5>Listado de Tipos</h5>
            <span className="badge-count">{types.length} tipos</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Cargando tipos...</p>
              </div>
            ) : types.length === 0 ? (
              <div className="empty-types">
                <div className="empty-icon">📂</div>
                <h4>No hay tipos registrados</h4>
                <p>Agrega tu primer tipo de contenido usando el formulario</p>
              </div>
            ) : (
              <table className="types-table">
                <thead>
                  <tr>
                    <th className="col-index">#</th>
                    <th>Tipo de Contenido</th>
                    <th className="col-description">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t, index) => {
                    const name = t.name || t.nombre || 'Sin nombre';
                    const { icon, className } = getTypeIcon(name);
                    return (
                      <tr key={t._id || index}>
                        <td className="col-index">{index + 1}</td>
                        <td className="col-name">
                          <div className="type-badge">
                            <div className={`type-icon ${className}`}>
                              {icon}
                            </div>
                            <span>{name}</span>
                          </div>
                        </td>
                        <td className="col-description">
                          {t.description || t.descripcion || (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              Sin descripción
                            </span>
                          )}
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