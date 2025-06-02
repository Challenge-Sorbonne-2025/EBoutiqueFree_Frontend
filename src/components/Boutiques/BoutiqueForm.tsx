import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from '@mui/material';
import {
  createBoutique,
  updateBoutique,
  getBoutiqueById
} from '../../services/boutiques/boutiqueService';
import type { BoutiqueCreate } from './Boutique';



const BoutiqueForm: React.FC = () => {
  const { boutique_id } = useParams(); // id peut être undefined
  const isEditMode = Boolean(boutique_id); // détermine si on est en mode modification
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BoutiqueCreate>({
    nom_boutique: '',
    adresse: '',
    ville: '',
    code_postal: '',
    departement: '',
    longitude: 0,
    latitude: 0,
    numero_telephone: '',
    email: '',
    responsable: 0,
    gestionnaire: []
  });

  // Chargement des données de la boutique si on est en mode édition
  useEffect(() => {
    if (isEditMode && boutique_id) {
      getBoutiqueById(parseInt(boutique_id))
        .then((data) => {
          setFormData({
            nom_boutique: data.nom_boutique,
            adresse: data.adresse,
            ville: data.ville,
            code_postal: data.code_postal,
            departement: data.departement || '',
            longitude: data.longitude || '0',
            latitude: data.latitude || '0',
            numero_telephone: data.numero_telephone || '',
            email: data.email || '',
            responsable: data.responsable || 0,
            gestionnaire: data.gestionnaire || []
          });
        })
        .catch((error) => {
          console.error('Erreur lors du chargement de la boutique:', error);
        });
    }
  }, [boutique_id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      longitude: formData.longitude,
      latitude: formData.latitude
    };

    try {
        if (isEditMode && boutique_id) {
        await updateBoutique(parseInt(boutique_id), payload); // id! forcé inutile ici car testé
      } else {
        await createBoutique(payload);
      }
      navigate('/boutiques'); // redirection après succès
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Modifier la boutique' : 'Ajouter une boutique'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Nom" name="nom_boutique" value={formData.nom_boutique} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Ville" name="ville" value={formData.ville} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Code Postal" name="code_postal" value={formData.code_postal} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Département" name="departement" value={formData.departement} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Téléphone" name="numero_telephone" value={formData.numero_telephone} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isEditMode ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default BoutiqueForm;
