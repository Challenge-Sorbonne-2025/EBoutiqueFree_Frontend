// src/services/api.ts
import axios from 'axios';
import { AUTH_API_CONFIG } from '../config/api';
import { getToken, clearToken } from './auth'; // L'import fonctionnera maintenant

const api = axios.create({
  ...AUTH_API_CONFIG,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken(); // Fonctionne maintenant
      
      // Évite la boucle de redirection
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?from=' + encodeURIComponent(window.location.pathname);
      }
    }
    
    // Gestion améliorée des erreurs
    const apiError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    };
    
    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);

export default api;