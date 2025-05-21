/*import api from '../api';
import type { Boutique, BoutiqueFormData, UserOption } from '../../components/Boutiques/Boutique';

export const getAllBoutiques = async (): Promise<Boutique[]> => {
  const response = await api.get('/boutiques/');
  return response.data;
};

export const createBoutique = async (data: Omit<BoutiqueFormData, 'boutique_id'>): Promise<Boutique> => {
  const response = await api.post('/boutiques/', data);
  return response.data;
};

export const updateBoutique = async (boutique_id: number, data: BoutiqueFormData): Promise<Boutique> => {
  const response = await api.put(`/boutiques/${boutique_id}/`, data);
  return response.data;
};

export const deleteBoutique = async (boutique_id: number): Promise<void> => {
  await api.delete(`/boutiques/${boutique_id}/`);
};

export const getBoutiqueById = async (boutique_id: number): Promise<Boutique> => {
  const response = await api.get(`/boutiques/${boutique_id}/`);
  return response.data;
};

export const getResponsables = async (): Promise<UserOption[]> => {
  const response = await api.get('/users/');
  return response.data;
};

export const getGestionnaires = async (): Promise<UserOption[]> => {
  const response = await api.get('/users/');
  return response.data;
};*/

/*import api from '../api';
import type { Boutique, BoutiqueFormData, UserOption } from '../../components/Boutiques/boutiqueTypes';

export const getAllBoutiques = async (): Promise<Boutique[]> => {
  const response = await api.get('/boutiques/');
  return response.data;
};

export const createBoutique = async (data: Omit<BoutiqueFormData, 'boutique_id'>): Promise<Boutique> => {
  const response = await api.post('/boutiques/', data);
  return response.data;
};

export const updateBoutique = async (boutique_id: number, data: BoutiqueFormData): Promise<Boutique> => {
  const response = await api.put(`/boutiques/${boutique_id}/`, data);
  return response.data;
};

export const deleteBoutique = async (boutique_id: number): Promise<void> => {
  await api.delete(`/boutiques/${boutique_id}/`);
};

export const getBoutiqueById = async (boutique_id: number): Promise<Boutique> => {
  const response = await api.get(`/boutiques/${boutique_id}/`);
  return response.data;
};

// Utilise les endpoints spécifiques pour responsables et gestionnaires
export const getResponsables = async (): Promise<UserOption[]> => {
  const response = await api.get('/users/responsables/');
  return response.data;
};

export const getGestionnaires = async (): Promise<UserOption[]> => {
  const response = await api.get('/users/gestionnaires/');
  return response.data;
};*/

import api from '../api';
import type { Boutique, BoutiquesResponse } from '../../components/Boutiques/boutiqueTypes';

// ✅ GET - Liste paginée
export const getAllBoutiques = async (
  page: number = 1,
  limit: number = 6
): Promise<BoutiquesResponse> => {
  const response = await api.get('/boutiques/', {
    params: { page, limit }
  });
  return response.data;
};

// ✅ GET - Une seule boutique
export const getBoutique = async (id: number | string): Promise<Boutique> => {
  const response = await api.get(`/boutiques/${id}/`);
  return response.data;
};

// ✅ POST - Créer une boutique
export const createBoutique = async (data: Partial<Boutique>): Promise<Boutique> => {
  const response = await api.post('/boutiques/', data);
  return response.data;
};

// ✅ PUT - Mettre à jour une boutique
export const updateBoutique = async (
  id: number | string,
  data: Partial<Boutique>
): Promise<Boutique> => {
  const response = await api.put(`/boutiques/${id}/`, data);
  return response.data;
};

// ✅ DELETE - Supprimer une boutique
export const deleteBoutique = async (id: number | string): Promise<void> => {
  await api.delete(`/boutiques/${id}/`);
};
