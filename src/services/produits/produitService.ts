import api from '../api';

// ----------- Interfaces -----------
export interface Produit {
  produit_id: number;
  nom_produit: string;
  prix: number;
  couleur: string;
  capacite: number;
  ram: number;
  boutique_id?: number;
  quantite_initiale?: number;
  validation_responsable: boolean;
  modele: {
    modele_id: number;
    modele: string;
    marque: string;
  };
  image?: string | null;
  boutiques?: string;
  user?: number;
}

export interface ProduitCreateDTO {
  nom_produit: string;
  prix: number;
  couleur: string;
  capacite: number;
  ram: number;
  modele_id: number;
  boutique_id?: number;
}

export interface ProduitsResponse {
  results: Produit[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ----------- Services -----------

// ✅ GET paginé (tous les produits)
export const getAllProduits = async (
  page: number = 1,
  limit: number = 6
): Promise<ProduitsResponse> => {
  const response = await api.get('/produits/', {
    params: { page, limit }
  });
  return response.data;
};

// ✅ GET paginé filtré par boutique
export const getProduitsByBoutique = async (
  boutiqueId: string | number,
  page: number = 1,
  limit: number = 6
): Promise<ProduitsResponse> => {
  const response = await api.get('/produits/', {
    params: {
      boutique: boutiqueId, // assure-toi que ce nom correspond au paramètre backend (peut être ?boutique_id selon l'API)
      page,
      limit
    }
  });
  return response.data;
};

// ✅ GET un seul produit
export const getProduit = async (id: number | string): Promise<Produit> => {
  const response = await api.get(`/produits/${id}/`);
  return response.data;
};

// ✅ POST création
export const createProduit = async (produitData: ProduitCreateDTO): Promise<Produit> => {
  const response = await api.post('/produits/', produitData);
  return response.data;
};

// ✅ PUT/PATCH modification
export const updateProduit = async (
  id: number | string,
  produitData: ProduitCreateDTO
): Promise<Produit> => {
  const response = await api.put(`/produits/${id}/`, produitData);
  return response.data;
};

// ✅ DELETE suppression
export const deleteProduit = async (id: number | string): Promise<void> => {
  await api.delete(`/produits/${id}/`);
};
