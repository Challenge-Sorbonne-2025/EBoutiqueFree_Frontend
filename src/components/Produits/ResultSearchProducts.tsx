import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Grid, Typography, CircularProgress, Box, Card, Pagination, Container, Button } from '@mui/material';
import { searchProduits } from '../../services/produits/produitService';
import type { ProduitResponse } from '../../components/Produits/Produits';
import Header from '../Headers/Header';

const ResultSearchProducts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');  
  const [results, setResults] = useState<ProduitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


  const fetchResults = async (query : string) => {
    try {
        if (!query) {
          throw new Error('Query is required for search');
        }
        const response = await searchProduits(query);
        setResults(response);
        setTotalPages(Math.ceil(response.length / itemsPerPage));

        // Pagination côté frontend
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setResults(response.slice(startIndex, endIndex));
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
  }, [query, page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Header/>
        <Typography variant="h6" gutterBottom>
          Chargement des résultats... </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    
    <Box sx={{ minHeight: '100vh', bgcolor: 'gray.50' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
            Nos smartphones - recherche pour « {query} »
        </Typography>
      

      {results.length === 0 ? (
        <Typography>Aucun produit trouvé.</Typography>
      ) : (
        <Grid container spacing={3}>
          {results.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.produit_id}>
              <Card sx={{ p: 2, textAlign: 'center', border: '1px solid #e0e0e0', boxShadow: 1, '&:hover': { boxShadow: 3 } }}>
              <Link to={`/products/${product.produit_id}`} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  width: 130,
                  height: 130,
                  mx: 'auto',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.nom_produit}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%" width="100%" color="grey.400">
                    <svg width="40" height="40" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </Box>
                )}
              </Box>
              </Link>
              
              <Typography>{product.nom_produit}</Typography>
              <Typography variant="subtitle2" fontWeight="bold" color="text.primary" mt={1}>
                              {product.prix ? `${product.prix} €` : '€10.99'}
              </Typography>
              <Button
                component={Link}
                to={`/products/${product.produit_id}`}
                variant="contained"
                color="primary"
                
                sx={{ mt: 2 }}
              >
                voir en boutique
              </Button>
              </Card>
          </Grid>           
          ))}
        </Grid>        
      )}
      {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}

      </Container>
    </Box>
  );
};

export default ResultSearchProducts;
