import React, { useEffect, useState } from 'react';
import { getAllProduits } from '../../services/produits/produitService';
// import { getResponsables } from '../../services/boutiques/boutiqueService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductDeleteButton from './ProductDeleteButton';

// Définition de l'interface Produit directement dans le composant
interface Produit {
  produit_id: number;
  nom_produit: string;
  modele: {
    modele_id: number;
    modele: string;
    marque: {
      marque_id: number;
      marque: string;
    };
  };
  prix: number;
  couleur: string;
  capacite: number;
  ram: number;
  validation_responsable: boolean;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [hasBoutique, setHasBoutique] = useState<boolean>(false);
  // const [checkingBoutique, setCheckingBoutique] = useState<boolean>(true);
  const navigate = useNavigate();

  // const checkBoutique = async () => {
  //   try {
  //     const  {hasBoutique} = await getResponsables();
  //     setHasBoutique(hasBoutique);
  //     if (hasBoutique) {
  //       await fetchProducts();
  //     }
  //   } catch (err) {
  //     console.error('Erreur vérification boutique:', err);
  //     setError('Impossible de vérifier votre boutique');
  //   } finally {
  //     setCheckingBoutique(false);
  //   }
  // };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [error, setError] = useState<string>('');
      const data = await getAllProduits();
      console.log(data)
      if (Array.isArray(data)){
          setProducts(data);
      }
      else if ( (data.results) && (Array.isArray(data.results)))
      
        {
          setProducts(data.results)
        }
        else {
           setError('Format de données incorrect');
              console.error('Format de données reçu:', data);
            }

    } catch (err) {
      console.error('Erreur chargement produits:', err);
      setError('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // checkBoutique();
    fetchProducts()
  }, []);

  
    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

      // Vérifier si products est bien un tableau avant d'utiliser map
    if (!Array.isArray(products)) {
        return <Typography color="error">Erreur de format des données</Typography>;
    }

  // if (checkingBoutique) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // if (!hasBoutique) {
  //   return (
  //     <Box sx={{ p: 3, textAlign: 'center' }}>
  //       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
  //         Gestion des Produits
  //       </Typography>
  //       <Grid container justifyContent="center">
  //         <Grid item xs={12} md={8}>
  //           <Alert severity="warning" sx={{ mb: 4 }}>
  //             <Typography variant="body1" fontWeight="bold">
  //               Configuration requise
  //             </Typography>
  //             <Typography variant="body2">
  //               Vous devez créer une boutique avant de pouvoir ajouter des produits.
  //             </Typography>
  //           </Alert>
  //           <Box sx={{ mt: 4 }}>
  //             <Button
  //               variant="contained"
  //               size="large"
  //               onClick={() => navigate('/boutique/create')}
  //               sx={{ px: 4, py: 2 }}
  //             >
  //               Créer ma Boutique
  //             </Button>
  //           </Box>
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   );
  // }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={fetchProducts}>
          Réessayer
        </Button>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Liste des Produits
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography>Votre boutique ne contient aucun produit pour le moment.</Typography>
        </Alert>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/products/new')}
          sx={{ px: 4 }}
        >
          Ajouter votre premier produit
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Liste des Produits</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products/new')}
        >
          Ajouter un produit
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.produit_id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {product.nom_produit}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography><strong>Marque:</strong> {product.modele.marque.marque}</Typography>
                  <Typography><strong>Modèle:</strong> {product.modele.modele}</Typography>
                  <Typography><strong>Prix:</strong> {product.prix.toFixed(2)}€</Typography>
                  <Typography><strong>Couleur:</strong> {product.couleur}</Typography>
                  <Typography><strong>Capacité:</strong> {product.capacite} Go</Typography>
                  <Typography><strong>RAM:</strong> {product.ram} Go</Typography>
                </Box>
                <Chip
                  label={product.validation_responsable ? "Validé" : "En attente"}
                  color={product.validation_responsable ? "success" : "warning"}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/produits/edit/${product.produit_id}`)}
                  >
                    Modifier
                  </Button>
                  <ProductDeleteButton
                    id={product.produit_id.toString()}
                    onDeleted={fetchProducts}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;