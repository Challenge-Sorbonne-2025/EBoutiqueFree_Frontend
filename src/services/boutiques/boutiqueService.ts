import type { Boutique, BoutiqueCreate, BoutiquesResponsePage } from '../../components/Boutiques/Boutique';
import api from '../api';
import publicApi from '../publicApi';


export const getAllBoutiques = async (
  page: number = 1,
  limit: number = 6
): Promise<BoutiquesResponsePage> => {
  const response = await publicApi.get('/boutiques/', {
    params: {
      page: page,
      limit: limit,}});
  return response.data;
};

export const getBoutiqueById = async (boutique_id: number | string) => {
  const response = await publicApi.get(`/boutiques/${boutique_id}/`);
  return response.data;
};

export const createBoutique = async (boutiqueData: Partial<BoutiqueCreate>): Promise<Boutique> => {
  const response = await api.post('/boutiques/', boutiqueData);
  return response.data;
};

export const updateBoutique = async (boutique_id: number | string, boutiqueData: Partial<BoutiqueCreate>):Promise<Boutique> => {
  const response = await api.put(`/boutiques/${boutique_id}/`, boutiqueData);
  return response.data;
};

export const deleteBoutique = async (boutique_id: number | string) => {
  const response = await api.delete(`/boutiques/${boutique_id}/`);
  return response.data;
};

export const geAllBoutiquesWithoutPagination = async () => {
  let allModels: any[] = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const response = await publicApi.get('/boutiques/', {
      params:{
        page:page,
      }});
      allModels = [...allModels, ...response.data.results];
      if (response.data.next) {
        page++;
      }
      else {
        hasNextPage = false;
      }
   
  }
  return allModels;
};

