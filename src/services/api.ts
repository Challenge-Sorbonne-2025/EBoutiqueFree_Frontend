import axios from 'axios';
import { AUTH_API_CONFIG } from '../config/api';
import { getToken } from './auth';

// Création d'une instance axios avec la configuration authentifiée
const api = axios.create(AUTH_API_CONFIG);

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Rediriger vers la page de login si le token est invalide
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 