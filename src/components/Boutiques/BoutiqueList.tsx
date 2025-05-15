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

// Typage basique pour une boutique. Tu peux améliorer en fonction du modèle réel.
interface Boutique {
  id: number; // id de type number venant du backend
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
}

const BoutiquesList: React.FC = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const navigate = useNavigate();

  // Fonction pour charger les boutiques depuis le backend
  const fetchBoutiques = async () => {
    try {
      const data = await getAllBoutiques();
      setBoutiques(data);
    } catch (error) {
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
            key={boutique.id}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/boutiques/edit/${boutique.id}`)}
                >
                  Modifier
                </Button>
                {/* Conversion de id en string ici */}
                <BoutiqueDeleteButton
                  id={boutique.id.toString()} // Conversion de id en string
                  onDeleted={fetchBoutiques}
                />
              </Box>
            }
          >
            <ListItemText
              primary={boutique.nom}
              secondary={`${boutique.ville}, ${boutique.adresse} (${boutique.code_postal})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BoutiquesList;
