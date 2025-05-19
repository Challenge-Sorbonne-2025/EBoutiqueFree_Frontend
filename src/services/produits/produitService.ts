import api from '../api';

export interface Marque {
  marque_id: number;
  marque: string;
}

export interface Modele {
  modele_id: number;
  modele: string;
  marque: Marque;
}

export interface ProduitCreateDTO {
  nom_produit: string;
  modele_id: number;
  prix: number;
  couleur: string;
  capacite: number;
  ram: number;
}

export const getAllProduits = async (): Promise<{
  produit_id: number;
  nom_produit: string;
  modele: Modele;
  prix: number;
  couleur: string;
  capacite: number;
  ram: number;
  validation_responsable: boolean;
}[]> => {
  const response = await api.get('/produits/');
  return response.data;
};

export const getProduit = async (id: string): Promise<{
  produit_id: number;
  nom_produit: string;
  modele: Modele;
  prix: number;
  couleur: string;
  capacite: number;
  ram: number;
  validation_responsable: boolean;
}> => {
  const response = await api.get(`/produits/${id}/`);
  return response.data;
};

export const createProduit = async (produitData: ProduitCreateDTO) => {
  const response = await api.post('/produits/', produitData);
  return response.data;
};

export const updateProduit = async (id: string, produitData: Partial<ProduitCreateDTO>) => {
  const response = await api.put(`/produits/${id}/`, produitData);
  return response.data;
};

export const deleteProduit = async (id: string): Promise<void> => {
  await api.delete(`/produits/${id}/`);
};