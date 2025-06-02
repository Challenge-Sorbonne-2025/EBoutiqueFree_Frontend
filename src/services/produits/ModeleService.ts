import publicApi from '../publicApi';
import api from '../api';
import type { ModeleCreate } from '../../components/Modeles/Modele.ts';

export const getAllModeles = async () => {
  const response = await publicApi.get('/modeles/');
  console.log('Réponse API:', response.data);
  return response.data;
};

export const getModeleById = async (modele_id: number) => {
  const response = await publicApi.get(`/modeles/${modele_id}/`);
  return response.data;
};

export const createModele = async (modeleData: ModeleCreate) => {
  const response = await api.post('/modeles/', modeleData);
  return response.data;
};

export const updateModele = async (modele_id: number, modeleData: ModeleCreate) => {
  const response = await api.put(`/modeles/${modele_id}/`, modeleData);
  return response.data;
};

export const deleteModele = async (modele_id: number) => {
  const response = await api.delete(`/modeles/${modele_id}/`);
  return response.data;
};





