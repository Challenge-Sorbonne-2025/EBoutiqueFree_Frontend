// components/boutiques/BoutiquesList.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';

import { getAllBoutiques } from '../../services/boutiques/boutiqueService';
import BoutiqueDeleteButton from './BoutiqueDeleteButton';
import type { BoutiqueResponse } from './Boutique';


const BoutiquesList: React.FC = () => {
  const [boutiques, setBoutiques] = useState<BoutiqueResponse[]>([]);
  const navigate = useNavigate();

  // Fonction pour charger les boutiques depuis le backend
  const fetchBoutiques = async () => {
    try {
      const data = await getAllBoutiques();
      if (Array.isArray(data)) {
        setBoutiques(data);
      } 
      else if (data.results && Array.isArray(data.results)) {
        setBoutiques(data.results);
      }
      else {
        console.error('Les données récupérées ne sont pas un tableau');
      }
    }

    catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
    }
  };

  // Appelé au premier rendu pour charger la liste
  useEffect(() => {
    fetchBoutiques();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Liste des boutiques
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/boutiques/new')}
        sx={{ mb: 2 }}
      >
        Ajouter une boutique
      </Button>

      <List>
        {boutiques.map((boutique) => (
          <ListItem
            key={boutique.boutique_id}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/boutiques/edit/${boutique.boutique_id}`)}
                >
                  Modifier
                </Button>
                {/* Conversion de id en string ici */}
                <BoutiqueDeleteButton
                  boutique_id={boutique.boutique_id} // Conversion de id en string
                  onDeleted={fetchBoutiques}
                />
              </Box>
            }>
            <ListItemText
              primary={boutique.nom_boutique}
              secondary={`${boutique.ville}, ${boutique.adresse} (${boutique.code_postal})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BoutiquesList;
