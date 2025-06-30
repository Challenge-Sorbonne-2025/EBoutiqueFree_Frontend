import type { StockCreate } from '../../components/Stocks/Stock';
import  publicApi  from '../publicApi'
import api from '../api';

export const getAllProduitsWithoutPagination = async () => {
  let allProducts: any[] = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const response = await publicApi.get('/produits/', {
      params:{
        page:page,
      }});
      allProducts = [...allProducts, ...response.data.results];
      if (response.data.next) {
        page++;
      }
      else {
        hasNextPage = false;
      }
   
  }
  return allProducts;
};

export const createStock = async (stockData: StockCreate): Promise<any> => {
  const response = await api.post('/stocks/', stockData);
  return response.data;
}