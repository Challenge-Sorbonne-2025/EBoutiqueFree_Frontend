import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllProduits } from '../../services/produits/produitService';
import ProductDeleteButton from './ProductDeleteButton';

interface Product {
  id: number;
  nom: string;
  prix: number;
  couleur: string;
  capacite: number;
  ram: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const data = await getAllProduits();
      setProducts(data);
    } catch (err) {
      console.error('Erreur chargement produits :', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Produits
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate('/produits/new')}
      >
        Ajouter un produit
      </Button>
      <Box sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
      }}>
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent>
              <Typography variant="h6">{product.nom}</Typography>
              <Typography>Prix: {product.prix}€</Typography>
              <Typography>Couleur: {product.couleur}</Typography>
              <Typography>Capacité: {product.capacite} Go</Typography>
              <Typography>RAM: {product.ram} Go</Typography>
              <Box mt={2} sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/produits/edit/${product.id}`)}
                >
                  Modifier
                </Button>
                <ProductDeleteButton
                  id={product.id.toString()} // ✅ converti number → string
                  onDeleted={fetchProducts}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProductList;
