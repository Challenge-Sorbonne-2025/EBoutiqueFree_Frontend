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
import type {ProduitResponse} from './Produits';



const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProduitResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
        const data = await getAllProduits();
        // Vérifier si response.data est un tableau
        if (Array.isArray(data)) {
          setProducts(data);
        } 
        else if (data.results && Array.isArray(data.results)) {
            // Si les données sont dans un champ 'results' (format courant de DRF)
            setProducts(data.results);
        } else {
            setError('Format de données incorrect');
            console.error('Format de données reçu:', data);
        }

      } catch (err) {
      console.error('Erreur chargement produits :', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  // Vérifier si products est bien un tableau avant d'utiliser map
  if (!Array.isArray(products)) {
      return <Typography color="error">Erreur de format des données</Typography>;
    }


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Produits
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate('/products/new')}
      >
        Ajouter un produit
      </Button>
      <Box sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
      }}>
        {products.map((product) => (
          <Card key={product.produit_id}>
            <CardContent>
              <Typography variant="h6">{product.nom_produit}</Typography>
              <Typography>Prix: {product.prix}€</Typography>
              <Typography>Couleur: {product.couleur}</Typography>
              <Typography>Capacité: {product.capacite} Go</Typography>
              <Typography>RAM: {product.ram} Go</Typography>
              <Typography>Marque: {product.modele.marque.marque}</Typography>
              <Typography>Modele: {product.modele.modele}</Typography>
              <Box mt={2} sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/products/edit/${product.produit_id}`)}
                >
                  Modifier
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/products/${product.produit_id}`)}
                >
                  Voir plus
                </Button>
                <ProductDeleteButton
                  id={product.produit_id} 
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
