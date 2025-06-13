import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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


import { canEditOrDelete } from '../../services/auth';
import { getAllBoutiques } from '../../services/boutiques/boutiqueService';
// import BoutiqueDeleteButton from './BoutiqueDeleteButton';
import type { Boutique } from './Boutique';


const BoutiqueList: React.FC = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const[isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoutiques = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllBoutiques(page, 6);
        setBoutiques(data.results);
        setTotalPages(Math.ceil(data.count / 6));
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des boutiques");
      } finally {
        setLoading(false);
      }
    };

    fetchBoutiques();
  }, [page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const checkPermissions = async () => {
      const authorized = await canEditOrDelete();
      setIsAuthorized(authorized);
    };

    checkPermissions();
  }, []);


  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
        <Typography variant="h4">Liste des Boutiques</Typography>
        {isAuthorized && (<Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/boutiques/nouveau')}
        >
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
          {boutiques.map((boutique) => (
            <Grid item xs={12} sm={6} md={4} key={boutique.boutique_id}>
              <Box border={1} borderRadius={2} p={2}>
                <Typography variant="h6">{boutique.nom_boutique}</Typography>
                <Typography>{boutique.adresse}</Typography>
                <Typography>{boutique.ville} - {boutique.code_postal}</Typography>
                <Typography>{boutique.departement}</Typography>
                <Typography>{boutique.num_telephone}</Typography>
                <Typography>{boutique.email}</Typography>

                <Box mt={2} display="flex" justifyContent="space-between">
                  {isAuthorized &&(<Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/boutiques/edit/${boutique.boutique_id}`)} // ✅ corrigé ici
                  >
                    Modifier
                  </Button>)}

                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/boutiques/${boutique.boutique_id}/produits`)}
                  >
                    Voir produits
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

export default BoutiqueList;

