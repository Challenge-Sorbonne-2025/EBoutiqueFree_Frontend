// src/services/produits/produitService.ts

import api from '../api';
import publicApi from '../publicApi';
import type { ProduitsResponsePage,ProduitResponse , ProduitCreate } from '../../components/Produits/Produits';

export const getAllProduits = async (
  page: number = 1,
  limit: number = 6
): Promise<ProduitsResponsePage> => {
  const response = await publicApi.get('/produits/', {
    params: {
      page: page,
      limit: limit,
    },
  });
  console.log('Réponse API:', response.data);
  return response.data;
};

export const getProduitsByBoutique = async (
  boutiqueId: number | string,
)=> {
  try {
  const response = await publicApi.get(`/boutiques/getProduitByBoutiqueId/`, {
    params: {
      boutique_id: boutiqueId,
    },
  });
   if (!Array.isArray(response.data)) {
      console.error('Réponse inattendue:', response.data);
      throw new Error('Format de données inattendu');
    }    
    return response.data;
  } 
  catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};
  // return response.data;


export const getProduitById = async (id: number | string ) : Promise<ProduitResponse> => {
  const response = await publicApi.get(`/produits/${id}/`);
  return response.data;
};

export const createProduit = async (produitData: ProduitCreate): Promise<ProduitResponse> => {
  const response = await api.post('/produits/', produitData);
  return response.data;
};

export const updateProduit = async (id: number | string, produitData: ProduitCreate): Promise<ProduitResponse> => {
  const response = await api.put(`/produits/${id}/`, produitData);
  return response.data;
};

export const deleteProduit = async (id: number | string) => {
  const response = await api.delete(`/produits/${id}/`);
  return response.data;
};

export const searchProduits = async (
  query: string): Promise<ProduitResponse[]> => {
  const response = await publicApi.get('/produits/search_product/', {
    params: { query: query }
  });
  if (!Array.isArray(response.data)) {
    console.error('Réponse inattendue:', response.data);
    throw new Error('Format de données inattendu');
  }
  console.log('Réponse de recherche de produits:', response.data);
  return response.data;
};

export const paginateArray = <T>(array: T[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    data: array.slice(startIndex, endIndex),
    totalPages: Math.ceil(array.length / limit),
    currentPage: page,
    totalItems: array.length,
    hasMore: endIndex < array.length
  };
};


