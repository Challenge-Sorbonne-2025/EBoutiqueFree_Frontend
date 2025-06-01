import ProductForm from '../components/Produits/ProductForm';
import ProductList from '../components/Produits/ProductList';
import RechercheProduit from '../components/userInterface/RechercheProduit';

const produitRoutes = [
  {
    path: '/produits',
    element: <ProductList />
  },
  {
    path: '/produits/nouveau',
    element: <ProductForm />
  },
  {
    path: '/produits/modifier/:id',
    element: <ProductForm />
  },
  {
    path: '/boutiques/:id/produits',
    element: <ProductList />
  },
  {
    path: '/boutiques/:id/produits/nouveau',
    element: <ProductForm />
  },
  {
    path: '/modeles/recherche', // ✅ Route de recherche
    element: <RechercheProduit />
  }
];

export default produitRoutes;
