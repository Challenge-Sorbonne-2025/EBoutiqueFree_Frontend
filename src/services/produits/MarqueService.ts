import publicApi from '../publicApi';
import api from '../api';
import type { MarqueCreate } from '../../components/Marques/Marque.ts';

export const getAllMarques = async () => {
  const response = await publicApi.get('/marques/');
  return response.data;
};

export const getMarqueById = async (marque_id: number) => {
  const response = await publicApi.get(`/marques/${marque_id}/`);
  return response.data;
};


export const createMarque = async (marqueData: MarqueCreate) => {
  const response = await api.post('/marques/', marqueData);
  return response.data;
};


export const updateMarque = async (marque_id: number, marqueData: MarqueCreate) => {
  const response = await api.put(`/marques/${marque_id}/`, marqueData);
  return response.data;
};


export const deleteMarque = async (marque_id: number) => {
  const response = await api.delete(`/marques/${marque_id}/`);
  return response.data;
};


