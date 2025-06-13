import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Typography,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { getAllProduits, deleteProduit } from '../../services/produits/produitService';
import type { ProduitResponse } from './Produits';
import { canEditOrDelete } from '../../services/auth';


const ProductList: React.FC = () => {
  const [produits, setProduits] = useState<ProduitResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Vérification des permissions
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchProduits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProduits(page, 6);
      if (data.results && Array.isArray(data.results)) {
        setProduits(data.results);
        setTotalPages(Math.ceil(data.count / 6));
      } else {
        throw new Error('Format de données incorrect');
      }
    } catch (err) {
      console.error('Erreur chargement produits :', err);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, [page]);

  useEffect(() => {
    // Vérification des permissions pour l'édition et la suppression
    const checkPermissions = async () => {
      const authorized = await canEditOrDelete();
      setIsAuthorized(authorized);
    };
    checkPermissions();
  }, []);


  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId === null) return;
    try {
      await deleteProduit(selectedProductId);
      setProduits(prev => prev.filter(p => p.produit_id !== selectedProductId));
      setOpenDialog(false);
      setSelectedProductId(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Liste des Produits</Typography>
        { isAuthorized && (
        <Button variant="contained" color="primary" onClick={() => navigate('/products/new')}>
          Ajouter
        </Button>)}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {produits.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.produit_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.nom_produit}</Typography>
                  <Typography>Prix: {product.prix} €</Typography>
                  <Typography>Couleur: {product.couleur}</Typography>
                  <Typography>Capacité: {product.capacite} Go</Typography>
                  <Typography>RAM: {product.ram} Go</Typography>
                  <Typography>Marque: {product.modele?.marque?.marque}</Typography>
                  <Typography>Modèle: {product.modele?.modele}</Typography>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.nom_produit}
                      style={{ width: '100%', marginTop: 10 }}
                    />
                  )}
                  <Box mt={2} display="flex" gap={1}>
                    {isAuthorized && (<Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/products/edit/${product.produit_id}`)}
                    >
                      Modifier
                    </Button>)}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/products/${product.produit_id}`)}
                    >
                      Voir plus
                    </Button>
                   {isAuthorized &&( <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(product.produit_id)}
                    >
                      Supprimer
                    </Button>)}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </Box>

      {/* Dialog de confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce produit ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductList;
