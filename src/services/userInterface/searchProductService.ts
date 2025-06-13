//import api from '../api';
import publicApi from '../publicApi';
import type { Produit } from '../produits/produitService';
interface BoutiqueStock {
  nom: string;
  quantite: number;
}

interface ProduitSearchResponse {
  produit: Produit;
  boutiques: BoutiqueStock[];
}

export const searchProduitByNom = async (
  nom: string
): Promise<ProduitSearchResponse> => {
  const response = await publicApi.get('/produits/search/', {
    params: { nom }
  });
  return response.data;
};
