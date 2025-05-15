// src/routes/produitRoutes.tsx

import ProductForm from '../components/Produits/ProductForm';
import ProductList from '../components/Produits/ProductList';

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
  }
];

export default produitRoutes;
