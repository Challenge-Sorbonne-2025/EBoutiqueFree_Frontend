// services/boutiques/boutiqueService.ts

import api from '../api';
import publicApi from '../publicApi';


export const getAllBoutiques = async () => {
  const response = await publicApi.get('/boutiques/');
  return response.data;
};

// Prendre l'id en tant que string
export const getBoutiqueById = async (boutique_id: number) => {
  const response = await publicApi.get(`/boutiques/${boutique_id}/`);
  return response.data;
};

export const createBoutique = async (boutiqueData: any) => {
  const response = await api.post('/boutiques/', boutiqueData);
  return response.data;
};

export const updateBoutique = async (boutique_id: number, boutiqueData: any) => {
  const response = await api.put(`/boutiques/${boutique_id}/`, boutiqueData);
  return response.data;
};

export const deleteBoutique = async (boutique_id: number) => {
  const response = await api.delete(`/boutiques/${boutique_id}/`);
  return response.data;
};
