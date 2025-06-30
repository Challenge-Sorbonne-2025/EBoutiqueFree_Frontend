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
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getProduitsByBoutique,
  deleteProduit
} from '../../services/produits/produitService';
import { canEditOrDelete } from '../../services/auth';
import { useNavigate, useParams } from 'react-router-dom';
import type { ProduitResponse } from './Produits';
import { getBoutiqueById } from '../../services/boutiques/boutiqueService';

const ProductsListeByBoutiques: React.FC = () => {
  const { id: boutiqueId } = useParams<{ id: string }>();
  const [produits, setProduits] = useState<ProduitResponse[]>([]);
  const [allProduits, setAllProduits] = useState<ProduitResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const itemsPerPage = 6;
  const [boutique, setBoutique] = useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!boutiqueId) return;

    const fetchProduits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // L'API retourne directement un tableau, pas un objet avec results/count
        const data = await getProduitsByBoutique(Number(boutiqueId));   
        // Vérifier que data est bien un tableau
        if (!Array.isArray(data)) {
          throw new Error('Format de données inattendu');
        }
        setAllProduits(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));

        const boutiqueData = await getBoutiqueById(Number(boutiqueId));
        if (boutiqueData) {
          setBoutique(boutiqueData);
        }
        
        // Pagination côté frontend
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setProduits(data.slice(startIndex, endIndex));
        
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError("Erreur lors du chargement des produits");
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [boutiqueId, page]);

  useEffect(() => {
    const checkPermissions = async () => {
      const authorized = await canEditOrDelete();
      setIsAuthorized(authorized);
    };
    checkPermissions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    try {
      await deleteProduit(id);
      
      // Mettre à jour la liste complète
      const updatedAllProduits = allProduits.filter(p => p.produit_id !== id);
      setAllProduits(updatedAllProduits);
      
      // Recalculer la pagination
      setTotalPages(Math.ceil(updatedAllProduits.length / itemsPerPage));
      
      // Mettre à jour la page courante
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setProduits(updatedAllProduits.slice(startIndex, endIndex));
      
      // Si la page courante est vide et qu'on n'est pas sur la première page
      if (updatedAllProduits.slice(startIndex, endIndex).length === 0 && page > 1) {
        setPage(page - 1);
      }
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
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

  const handleUpdateStockProduit = () => {
    if (boutiqueId) {
      navigate(`/boutiques/${boutiqueId}/produits/addStock`);
    }

    else 
    {
      navigate('/produits/nouveau');
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
        {boutiqueId && (
      <IconButton onClick={() => navigate('/boutiques')} sx={{ mr: 2 }}>
        <ArrowBackIcon />
      </IconButton>
    )}
        <Typography variant="h4">
          {boutiqueId ? `Liste des produits de la boutique #-${boutique.nom_boutique}` : 'Liste des Produits'}
        </Typography> { isAuthorized && (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleAjouterProduit}>
            new
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdateStockProduit}>
            update stock
          </Button>
        </Box>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {produits.length === 0 ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <Typography variant="h6" color="text.secondary">
                Aucun produit trouvé pour cette boutique
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {produits.map((produit) => (
                <Grid item xs={12} sm={6} md={4} key={produit.produit_id}>
                  <Box border={1} borderRadius={2} p={2} borderColor="grey.300">
                    <Typography variant="h6" gutterBottom>
                      {produit.nom_produit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prix: {produit.prix} €
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Couleur: {produit.couleur}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Capacité: {produit.capacite} Go
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      RAM: {produit.ram} Go
                    </Typography>
                    
                    {/* Affichage des informations de la boutique */}
                    {isAuthorized && produit.boutiques && produit.boutiques.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Quantité: {produit.boutiques[0].quantite}
                      </Typography>
                    )}
                    
                    {/* Affichage du modèle et de la marque */}
                    {produit.modele && (
                      <Typography variant="body2" color="text.secondary">
                        {produit.modele.marque.marque} - {produit.modele.modele}
                      </Typography>
                    )}
                    
                    {produit.image && (
                      <Box sx={{
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
                            }}>
                        <img
                          src={produit.image}
                          alt={produit.nom_produit}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain', 
                          }}
                        />
                      </Box>
                    )}
                    
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      {isAuthorized && (<Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/boutiques/${boutiqueId}/produits/edit/${produit.produit_id}`)}
                      >
                        Modifier
                      </Button> )}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/products/${produit.produit_id}`)}
                    >
                      Voir plus
                    </Button>

                     {isAuthorized && ( <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(produit.produit_id)}
                      >
                        Supprimer
                      </Button>)}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Pagination - n'afficher que s'il y a des produits */}
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
        </>
      )}
    </Container>
  );
};
export default ProductsListeByBoutiques;