import api from '../api';
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
};