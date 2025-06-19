import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import { searchProduits } from '../../services/produits/produitService';

const ResultSearchProducts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  type ProduitResponse = {
    produit_id: number;
    nom_produit: string;
    // ajoute d'autres propriétés selon la structure de tes produits
  };
  
  const [results, setResults] = useState<ProduitResponse[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchResults = async (query : string) => {
    try {
        if (!query) {
          throw new Error('Query is required for search');
        }
        const response = await searchProduits(query);
        setResults(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats de recherche:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (query) {
      fetchResults(query);
    } else {
      setResults([]);
      setLoading(false);
    }   
  }, [query]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h6" gutterBottom>
        Résultats pour « {query} »
      </Typography>

      {results.length === 0 ? (
        <Typography>Aucun produit trouvé.</Typography>
      ) : (
        <Grid container spacing={3}>
          {results.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.produit_id}>
              {/* Réutilise ton composant carte produit ici */}
              
              <Typography>{product.nom_produit}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ResultSearchProducts;
