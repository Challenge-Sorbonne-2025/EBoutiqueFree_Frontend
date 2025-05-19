import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { getAllBoutiques } from '../../services/boutiques/boutiqueService';
import BoutiqueDeleteButton from './BoutiqueDeleteButton';
import type { Boutique } from './Boutique';

const BoutiqueList = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const fetchBoutiques = async () => {
    try {
      const data = await getAllBoutiques();
      console.log(data)
      if (Array.isArray(data)){
        setBoutiques(data);
      }
      else if  (data.results && Array.isArray(data.results)) {
                    // Si les données sont dans un champ 'results' (format courant de DRF)
              setBoutiques(data.results);
                }
       else {
              setError('Format de données incorrect');
              console.error('Format de données reçu:', data);
            }
      
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoutiques();
  }, []);

   if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    // Vérifier si products est bien un tableau avant d'utiliser map
    if (!Array.isArray(boutiques)) {
        return <Typography color="error">Erreur de format des données</Typography>;
    }

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Liste des boutiques</Typography>
      
      <Button
        variant="contained"
        onClick={() => navigate('/boutiques/new')}
        sx={{ mb: 3 }}
      >
        Créer une boutique
      </Button>

      <List>
        {boutiques.map((boutique) => (
          <ListItem
            key={boutique.boutique_id}
            divider
            secondaryAction={
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/boutiques/edit/${boutique.boutique_id}`)}
                  sx={{ mr: 1 }}
                >
                  Modifier
                </Button>
                <BoutiqueDeleteButton 
                  boutique_id={boutique.boutique_id} 
                  onDeleted={fetchBoutiques} 
                />
              </>
            }
          >
            <ListItemText
              primary={boutique.nom_boutique}
              secondary={`${boutique.adresse}, ${boutique.ville} (${boutique.code_postal})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BoutiqueList;