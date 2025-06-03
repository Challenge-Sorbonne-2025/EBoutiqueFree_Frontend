// src/routes/produitRoutes.tsx

import ProductForm from '../components/Produits/ProductForm';
import ProductList from '../components/Produits/ProductList';
import DetailProduit from '../components/Produits/DetailProduit';

const produitRoutes = [
  {
    path: '/products',
    element: <ProductList />
  },
  {
    path: '/products/new',
    element: <ProductForm />
  },
  {
    path: '/products/edit/:id',
    element: <ProductForm />
  },
  {
    path : '/products/:id',
    element: <DetailProduit/>
  }
];

export default produitRoutes;
