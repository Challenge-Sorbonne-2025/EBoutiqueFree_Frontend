import React, { useState, useEffect } from 'react';
import Header from '../Headers/Header';
import { getAllProduits } from '../../services/produits/produitService';
import type { ProduitResponse } from './Produits';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';  
import { Link, useNavigate} from 'react-router-dom';
import { Container, Grid, Typography, Card } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ProductsPage: React.FC = () =>  {
  const [products, setProducts] = useState<ProduitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Fonction pour récupérer tous les produits
  const fetchProduits = async () => {
      try {
        setLoading(true);        
        const data = await getAllProduits(page, 6); // 
        if (data.results && Array.isArray(data.results)) {
          setProducts(data.results);
          setTotalPages(Math.ceil(data.count / 6));
        } else {
          throw new Error('Format de données incorrect');
        }
      } catch (err) {
        console.error('Erreur chargement produits :', err);
        
      } finally {
        setLoading(false);
      }
    };
 
     useEffect(() => {
    fetchProduits();
  }, [page]);

   const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (query.trim()) {
    navigate(`/recherche?query=${encodeURIComponent(query.trim())}`);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
         <Header/>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Chargement des produits...</div>
        </div>
      </div>
    );
  }
  return (
  <Box sx={{ minHeight: '100vh', bgcolor: 'gray.50' }}>
    {/* Header */}
    <Header />

    {/* Main Content */}
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Titre + options */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4} flexWrap="wrap" gap={4}>
        {/* <Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
            Nos smartphones
          </Typography>
        </Box> */}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
  <Typography variant="h5" fontWeight="bold" color="text.primary">
    Nos smartphones
  </Typography>

  <form onSubmit={handleSearch}>
    <Box display="flex" alignItems="center" gap={1} sx={{ ml: 2 }}>
      <TextField
        size="small"
        placeholder="Rechercher un produit..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary">
        Rechercher
      </Button>
    </Box>
  </form>
</Box>
      </Box>

      {/* Grille des produits */}
      <Grid container spacing={3}>
        {products.map((product) => (
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

              <Typography variant="subtitle1" fontWeight="medium">
                {product.nom_produit || 'Product'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.modele?.modele || 'Description du produit'}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" color="text.primary" mt={1}>
                {product.prix ? `${product.prix} €` : '€10.99'}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </Box>

      {/* Message si aucun produit */}
      {products.length === 0 && !loading && (
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary">
            Aucun produit disponible pour le moment.
          </Typography>
        </Box>
      )}
    </Container>
  </Box>
);
}
export default ProductsPage;
