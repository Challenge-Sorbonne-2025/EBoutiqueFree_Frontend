export const API_BASE_URL = 'http://localhost:8000/api';

// Configuration pour les requêtes publiques
export const PUBLIC_API_CONFIG = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
};

// Configuration pour les requêtes authentifiées
export const AUTH_API_CONFIG = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
};