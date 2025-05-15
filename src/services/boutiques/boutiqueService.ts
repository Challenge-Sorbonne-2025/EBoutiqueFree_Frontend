// services/boutiques/boutiqueService.ts

import api from '../api';
import { getToken } from '../auth';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getAllBoutiques = async () => {
  const response = await api.get('/boutiques/', authHeader());
  return response.data;
};

// Prendre l'id en tant que string
export const getBoutiqueById = async (id: string) => {
  const response = await api.get(`/boutiques/${id}/`, authHeader());
  return response.data;
};

export const createBoutique = async (boutiqueData: any) => {
  const response = await api.post('/boutiques/', boutiqueData, authHeader());
  return response.data;
};

export const updateBoutique = async (id: string, boutiqueData: any) => {
  const response = await api.put(`/boutiques/${id}/`, boutiqueData, authHeader());
  return response.data;
};

export const deleteBoutique = async (id: string) => {
  const response = await api.delete(`/boutiques/${id}/`, authHeader());
  return response.data;
};
