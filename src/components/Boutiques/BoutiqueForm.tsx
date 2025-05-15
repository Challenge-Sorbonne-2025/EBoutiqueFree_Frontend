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

interface BoutiqueFormData {
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  departement: string;
  longitude: string;
  latitude: string;
  num_telephone: string;
  email: string;
}

const BoutiqueForm: React.FC = () => {
  const { id } = useParams(); // id peut être undefined
  const isEditMode = Boolean(id); // détermine si on est en mode modification
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BoutiqueFormData>({
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    departement: '',
    longitude: '',
    latitude: '',
    num_telephone: '',
    email: ''
  });

  // Chargement des données de la boutique si on est en mode édition
  useEffect(() => {
    if (isEditMode && id) {
      getBoutiqueById(id as string)
        .then((data) => {
          setFormData({
            nom: data.nom,
            adresse: data.adresse,
            ville: data.ville,
            code_postal: data.code_postal,
            departement: data.departement || '',
            longitude: data.longitude?.toString() || '',
            latitude: data.latitude?.toString() || '',
            num_telephone: data.num_telephone || '',
            email: data.email || ''
          });
        })
        .catch((error) => {
          console.error('Erreur lors du chargement de la boutique:', error);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      longitude: parseFloat(formData.longitude),
      latitude: parseFloat(formData.latitude)
    };

    try {
      if (isEditMode && id) {
        await updateBoutique(id as string, payload); // id! forcé inutile ici car testé
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
          <TextField fullWidth label="Nom" name="nom" value={formData.nom} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Ville" name="ville" value={formData.ville} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Code Postal" name="code_postal" value={formData.code_postal} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Département" name="departement" value={formData.departement} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Téléphone" name="num_telephone" value={formData.num_telephone} onChange={handleChange} margin="normal" />
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
