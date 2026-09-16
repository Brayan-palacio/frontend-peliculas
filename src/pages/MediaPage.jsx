import React, { useEffect, useState } from 'react';
import { 
  getMedia, 
  createMedia, 
  updateMedia, 
  deleteMedia, 
  getGenres, 
  getDirectors, 
  getProducers, 
  getTypes 
} from '../services/apiService';
import Swal from 'sweetalert2';
import './MediaPage.css';

export const MediaPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [producers, setProducers] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterType, setFilterType] = useState('');

  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    serial: '',
    title: '',
    synopsis: '',
    url: '',
    coverImage: '',
    releaseYear: new Date().getFullYear(),
    genre: '',
    director: '',
    producer: '',
    type: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resMedia, resG, resD, resP, resT] = await Promise.all([
        getMedia(),
        getGenres(),
        getDirectors(),
        getProducers(),
        getTypes()
      ]);

      const media = resMedia.data.data || resMedia.data || [];
      setMediaList(media);
      setFilteredList(media);
      setGenres(resG.data.data || resG.data || []);
      setDirectors(resD.data.data || resD.data || []);
      setProducers(resP.data.data || resP.data || []);
      setTypes(resT.data.data || resT.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = mediaList;

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(m => 
        (m.title || m.titulo || '').toLowerCase().includes(term) ||
        (m.serial || '').toLowerCase().includes(term)
      );
    }

    if (filterGenre) {
      result = result.filter(m => 
        (m.genre?._id === filterGenre || m.genre === filterGenre)
      );
    }

    if (filterType) {
      result = result.filter(m => 
        (m.type?._id === filterType || m.type === filterType)
      );
    }

    setFilteredList(result);
  }, [mediaList, searchTerm, filterGenre, filterType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMedia(editingId, formData);
        Swal.fire('Éxito', 'Producción actualizada correctamente', 'success');
      } else {
        await createMedia(formData);
        Swal.fire('Éxito', 'Producción registrada correctamente', 'success');
      }
      resetForm();
      fetchData();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al guardar la producción', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      serial: item.serial || '',
      title: item.title || item.titulo || '',
      synopsis: item.synopsis || item.sinopsis || '',
      url: item.url || '',
      coverImage: item.coverImage || item.imagen || '',
      releaseYear: item.releaseYear || item.anioEstreno || new Date().getFullYear(),
      genre: item.genre?._id || item.genre || '',
      director: item.director?._id || item.director || '',
      producer: item.producer?._id || item.producer || '',
      type: item.type?._id || item.type || ''
    });
    // Abrir modal
    document.getElementById('mediaModal').querySelector('.btn-close')?.click();
    setTimeout(() => {
      document.getElementById('mediaModal').querySelector('[data-bs-toggle="modal"]')?.click();
    }, 100);
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteMedia(id);
        Swal.fire('Eliminado', 'La producción ha sido eliminada', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la producción', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  const stats = {
    total: mediaList.length,
    movies: mediaList.filter(m => 
      (m.type?.name || m.type?.nombre || '').toLowerCase().includes('película')
    ).length,
    series: mediaList.filter(m => 
      (m.type?.name || m.type?.nombre || '').toLowerCase().includes('serie')
    ).length
  };

  return (
    <div className="media-page">
      {/* HEADER */}
      <div className="media-header">
        <div className="header-top">
          <div className="header-title">
            <span className="icon">🎬</span>
            <h2>Catálogo de Películas y Series</h2>
          </div>
          <button 
            className="btn-add" 
            data-bs-toggle="modal" 
            data-bs-target="#mediaModal"
            onClick={resetForm}
          >
            <span>+</span> Agregar Producción
          </button>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎥</div>
            <div className="stat-info">
              <span className="stat-value">{stats.movies}</span>
              <span className="stat-label">Películas</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📺</div>
            <div className="stat-info">
              <span className="stat-value">{stats.series}</span>
              <span className="stat-label">Series</span>
            </div>
          </div>
        </div>
      </div>

      {/* BÚSQUEDA Y FILTROS */}
      <div className="search-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por título o serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        <div className="filters-group">
          <select 
            className="filter-select"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            <option value="">Todos los géneros</option>
            {genres.map(g => (
              <option key={g._id} value={g._id}>
                {g.name || g.nombre}
              </option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {types.map(t => (
              <option key={t._id} value={t._id}>
                {t.name || t.nombre}
              </option>
            ))}
          </select>

          <button 
            className="btn-clear-filters"
            onClick={() => {
              setFilterGenre('');
              setFilterType('');
              setSearchTerm('');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* CONTADOR DE RESULTADOS */}
      <div className="results-counter">
        <div className="count">
          <span>{filteredList.length}</span> {filteredList.length === 1 ? 'resultado' : 'resultados'}
        </div>
        {filteredList.length > 0 && (
          <div className="detail">
            Mostrando {filteredList.length} de {mediaList.length} producciones
          </div>
        )}
      </div>

      {/* GRID DE PELÍCULAS */}
      {loading ? (
        <div className="movies-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-100 shadow-sm" style={{ opacity: 0.6 }}>
              <div style={{ 
                height: '280px', 
                background: 'var(--bg-secondary)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <div className="card-body">
                <div style={{ 
                  height: '20px', 
                  width: '80%', 
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <div style={{ 
                  height: '12px', 
                  width: '100%', 
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  marginBottom: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <div style={{ 
                  height: '12px', 
                  width: '60%', 
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No se encontraron producciones</h3>
          <p>Intenta con otros filtros o agrega nuevo contenido</p>
          <button 
            className="btn-add-empty"
            data-bs-toggle="modal" 
            data-bs-target="#mediaModal"
            onClick={resetForm}
          >
            <span>+</span> Agregar primera producción
          </button>
        </div>
      ) : (
        <div className="movies-grid">
          {filteredList.map((m) => (
            <div className="col" key={m._id} style={{ padding: 0 }}>
              <div className="card h-100 shadow-sm" style={{ 
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)'
              }}>
                <img 
                  src={m.coverImage || m.imagen || 'https://via.placeholder.com/300x400?text=Sin+Imagen'} 
                  className="card-img-top" 
                  alt={m.title || m.titulo} 
                  style={{ height: '280px', objectFit: 'cover' }}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400'; 
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0" style={{ 
                      color: 'var(--text-h)',
                      fontWeight: 600
                    }}>
                      {m.title || m.titulo}
                    </h5>
                    <span className="badge bg-secondary">{m.releaseYear || m.anioEstreno}</span>
                  </div>
                  <p className="card-text text-muted small flex-grow-1" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: 'var(--text-secondary)'
                  }}>
                    {m.synopsis || m.sinopsis}
                  </p>
                  <div className="mb-2 small" style={{ color: 'var(--text-secondary)' }}>
                    <div><strong style={{ color: 'var(--text-h)' }}>Género:</strong> {m.genre?.name || m.genre?.nombre || 'N/A'}</div>
                    <div><strong style={{ color: 'var(--text-h)' }}>Director:</strong> {m.director?.names || m.director?.nombre || 'N/A'}</div>
                    <div><strong style={{ color: 'var(--text-h)' }}>Productora:</strong> {m.producer?.name || m.producer?.nombre || 'N/A'}</div>
                    <div><strong style={{ color: 'var(--text-h)' }}>Tipo:</strong> {m.type?.name || m.type?.nombre || 'N/A'}</div>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <a 
                      href={m.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-outline-primary btn-sm flex-grow-1"
                      style={{
                        borderColor: 'var(--accent)',
                        color: 'var(--accent)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Ver Película
                    </a>
                    <button 
                      className="btn btn-warning btn-sm" 
                      data-bs-toggle="modal" 
                      data-bs-target="#mediaModal"
                      onClick={() => handleEdit(m)}
                      style={{
                        background: 'var(--accent-bg)',
                        borderColor: 'var(--accent)',
                        color: 'var(--accent)'
                      }}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(m._id, m.title || m.titulo)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderColor: '#ef4444',
                        color: '#ef4444'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORMULARIO (tu modal existente) */}
      <div className="modal fade" id="mediaModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px'
          }}>
            <div className="modal-header" style={{
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              borderRadius: '16px 16px 0 0'
            }}>
              <h5 className="modal-title" style={{ color: 'var(--text-h)', fontWeight: 600 }}>
                {editingId ? 'Editar Producción' : 'Agregar Producción'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
                style={{ filter: 'var(--text-h)' }}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body row g-3" style={{ padding: '24px' }}>
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Serial Único</label>
                  <input 
                    type="text" 
                    name="serial" 
                    className="form-control" 
                    value={formData.serial} 
                    onChange={handleChange} 
                    required 
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Título</label>
                  <input 
                    type="text" 
                    name="title" 
                    className="form-control" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Sinopsis</label>
                  <textarea 
                    name="synopsis" 
                    className="form-control" 
                    rows="2" 
                    value={formData.synopsis} 
                    onChange={handleChange} 
                    required 
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>URL de la Película / Serie</label>
                  <input 
                    type="url" 
                    name="url" 
                    className="form-control" 
                    value={formData.url} 
                    onChange={handleChange} 
                    required 
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>URL de la Imagen de Carátula</label>
                  <input 
                    type="url" 
                    name="coverImage" 
                    className="form-control" 
                    value={formData.coverImage} 
                    onChange={handleChange} 
                    required 
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Año de Estreno</label>
                  <input 
                    type="number" 
                    name="releaseYear" 
                    className="form-control" 
                    value={formData.releaseYear} 
                    onChange={handleChange} 
                    required 
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Género</label>
                  <select 
                    name="genre" 
                    className="form-select" 
                    value={formData.genre} 
                    onChange={handleChange} 
                    required
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {genres.map(g => <option key={g._id} value={g._id}>{g.name || g.nombre}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Director</label>
                  <select 
                    name="director" 
                    className="form-select" 
                    value={formData.director} 
                    onChange={handleChange} 
                    required
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {directors.map(d => <option key={d._id} value={d._id}>{d.names || d.nombre}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Productora</label>
                  <select 
                    name="producer" 
                    className="form-select" 
                    value={formData.producer} 
                    onChange={handleChange} 
                    required
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {producers.map(p => <option key={p._id} value={p._id}>{p.name || p.nombre}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={{ color: 'var(--text-h)', fontWeight: 500 }}>Tipo</label>
                  <select 
                    name="type" 
                    className="form-select" 
                    value={formData.type} 
                    onChange={handleChange} 
                    required
                    style={{
                      background: 'var(--bg-input)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-h)',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="">Seleccione...</option>
                    {types.map(t => <option key={t._id} value={t._id}>{t.name || t.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{
                borderTop: '1px solid var(--border)',
                padding: '16px 24px'
              }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  data-bs-dismiss="modal"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 500
                  }}
                >
                  {editingId ? 'Guardar Cambios' : 'Crear Producción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};