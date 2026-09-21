import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api-peliculas-dfhd.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Peticiones para Módulo Géneros
export const getGenres = () => API.get('/genres');
export const createGenre = (data) => API.post('/genres', data);

// Peticiones para Módulo Directores
export const getDirectors = () => API.get('/directors');
export const createDirector = (data) => API.post('/directors', data);

// Peticiones para Módulo Productoras
export const getProducers = () => API.get('/producers');
export const createProducer = (data) => API.post('/producers', data);

// Peticiones para Módulo Tipos
export const getTypes = () => API.get('/types');
export const createType = (data) => API.post('/types', data);

// Peticiones para Módulo Media (Películas/Series)
export const getMedia = () => API.get('/media');
export const getMediaById = (id) => API.get(`/media/${id}`);
export const createMedia = (data) => API.post('/media', data);
export const updateMedia = (id, data) => API.put(`/media/${id}`, data);
export const deleteMedia = (id) => API.delete(`/media/${id}`);

export default API;
