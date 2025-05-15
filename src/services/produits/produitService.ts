// src/services/produits/produitService.ts

import api from '../api';
import { getToken } from '../auth';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getAllProduits = async () => {
  const response = await api.get('/produits/', authHeader());
  return response.data;
};

export const getProduitById = async (id: string) => {
  const response = await api.get(`/produits/${id}/`, authHeader());
  return response.data;
};

export const createProduit = async (produitData: any) => {
  const response = await api.post('/produits/', produitData, authHeader());
  return response.data;
};

export const updateProduit = async (id: string, produitData: any) => {
  const response = await api.put(`/produits/${id}/`, produitData, authHeader());
  return response.data;
};

export const deleteProduit = async (id: string) => {
  const response = await api.delete(`/produits/${id}/`, authHeader());
  return response.data;
};
