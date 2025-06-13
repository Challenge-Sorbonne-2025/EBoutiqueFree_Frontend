// src/services/userInterface/searchBoutiqueService.ts
import publicApi from '../publicApi';

export const getAllBoutiques = async () => {
  const response = await publicApi.get('/boutiques/');
  return response.data;
};

export const searchBoutiquesByNom = async (nom: string) => {
  try {
    const response = await publicApi.get(`/boutiques/search`, {
      params: { nom },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la recherche de boutiques');
  }
};
