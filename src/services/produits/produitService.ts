// src/services/produits/produitService.ts

import api from '../api';
import publicApi from '../publicApi';

export const getAllProduits = async () => {
  const response = await publicApi.get('/produits/');
  console.log('Réponse API:', response.data);
  return response.data;
};

export const getProduitById = async (id: number) => {
  const response = await publicApi.get(`/produits/${id}/`);
  return response.data;
};

export const createProduit = async (produitData: any) => {
  const response = await api.post('/produits/', produitData);
  return response.data;
};

export const updateProduit = async (id: string, produitData: any) => {
  const response = await api.put(`/produits/${id}/`, produitData);
  return response.data;
};

export const deleteProduit = async (id: number) => {
  const response = await api.delete(`/produits/${id}/`);
  return response.data;
};
