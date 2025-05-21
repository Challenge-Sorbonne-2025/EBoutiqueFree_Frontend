import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Typography,
  Alert
} from '@mui/material';
import {
  getProduitsByBoutique,
  deleteProduit
} from '../../services/produits/produitService';
import type { Produit } from '../../services/produits/produitService';
import { useNavigate, useParams } from 'react-router-dom';

const ProductList: React.FC = () => {
  const { id: boutiqueId } = useParams<{ id: string }>();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!boutiqueId) return;

    const fetchProduits = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProduitsByBoutique(boutiqueId, page, 6);
        setProduits(data.results);
        setTotalPages(Math.ceil(data.count / 6));
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [boutiqueId, page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    try {
      await deleteProduit(id);
      setProduits(prev => prev.filter(p => p.produit_id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAjouterProduit = () => {
    if (boutiqueId) {
      navigate(`/boutiques/${boutiqueId}/produits/nouveau`);
    } else {
      navigate('/produits/nouveau');
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
        <Typography variant="h4">
          {boutiqueId ? `Produits de la boutique #${boutiqueId}` : 'Liste des Produits'}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAjouterProduit}>
          Ajouter
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {produits.map((produit) => (
            <Grid item xs={12} sm={6} md={4} key={produit.produit_id}>
              <Box border={1} borderRadius={2} p={2}>
                <Typography variant="h6">{produit.nom_produit}</Typography>
                <Typography>Prix: {produit.prix} €</Typography>
                <Typography>Couleur: {produit.couleur}</Typography>
                <Typography>Capacité: {produit.capacite} Go</Typography>
                <Typography>RAM: {produit.ram} Go</Typography>
                {produit.image && (
                  <img
                    src={produit.image}
                    alt={produit.nom_produit}
                    style={{ width: '100%', marginTop: 10 }}
                  />
                )}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/produits/modifier/${produit.produit_id}`)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(produit.produit_id)}
                  >
                    Supprimer
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </Box>
    </Container>
  );
};

export default ProductList;
