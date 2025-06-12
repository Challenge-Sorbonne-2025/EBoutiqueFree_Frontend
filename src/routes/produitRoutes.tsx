// src/routes/produitRoutes.tsx

import ProductForm from '../components/Produits/ProductForm';
import ProductList from '../components/Produits/ProductList';
import DetailProduit from '../components/Produits/DetailProduit';
import ProductsListeByBoutiques from '../components/Produits/ProductsListeByBoutiques';


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
    path: '/products/edit/:produit_id',
    element: <ProductForm />
  },

  {
    path : '/products/:id',
    element: <DetailProduit/>
  },
  {
    path: '/boutiques/:id/produits',
    element: <ProductsListeByBoutiques />
  },
  {
    path: '/boutiques/:id/produits/nouveau',
    element: <ProductForm />
  },
  // {
  //   path: '/modeles/recherche', // ✅ Route de recherche
  //   element: <RechercheProduit />
  // }
];

export default produitRoutes;
