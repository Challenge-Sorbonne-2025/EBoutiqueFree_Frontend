// src/services/auth.ts
import api from './api';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginData {
  username: string;
  password: string;
}

// Nouveau : Type pour les tokens
interface AuthTokens {
  access: string;
  refresh: string;
}

export const login = async (data: LoginData): Promise<AuthTokens> => {
  try {
    const response = await api.post<LoginResponse>('/token/', data);
    const { access, refresh } = response.data;

    setTokens({ access, refresh });
    return { access, refresh };
  } catch (error) {
    throw new Error('Échec de la connexion: ' + (error as Error).message);
  }
};

// Nouveau : Gestion centralisée des tokens
export const setTokens = ({ access, refresh }: AuthTokens): void => {
  localStorage.setItem('token', access);
  localStorage.setItem('refreshToken', refresh);
};

// Renommé de logout à clearToken pour cohérence
export const clearToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

// Alias pour compatibilité (vous pouvez supprimer logout si vous voulez)
export const logout = clearToken;

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Nouveau : Rafraîchissement du token
export const refreshAuthToken = async (): Promise<AuthTokens> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await api.post<LoginResponse>('/token/refresh/', {
      refresh: refreshToken
    });

    const newTokens = {
      access: response.data.access,
      refresh: response.data.refresh || refreshToken // Garde l'ancien refresh token si non fourni
    };

    setTokens(newTokens);
    return newTokens;
  } catch (error) {
    clearToken();
    throw new Error('Échec du rafraîchissement du token: ' + (error as Error).message);
  }
};