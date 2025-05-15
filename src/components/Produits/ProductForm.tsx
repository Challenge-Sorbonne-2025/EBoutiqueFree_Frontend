import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import {
  createProduit,
  getProduitById,
  updateProduit
} from '../../services/produits/produitService';

interface ProduitFormData {
  nom: string;
  prix: string;
  couleur: string;
  capacite: string;
  ram: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams(); // id est une string ou undefined
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProduitFormData>({
    nom: '',
    prix: '',
    couleur: '',
    capacite: '',
    ram: ''
  });

  // Charger les données du produit si en mode modification
  useEffect(() => {
    if (isEditMode && id) {
      getProduitById(id).then((data) => {
        setFormData({
          nom: data.nom,
          prix: data.prix.toString(),
          couleur: data.couleur,
          capacite: data.capacite.toString(),
          ram: data.ram.toString()
        });
      }).catch((err) => {
        console.error('Erreur chargement produit :', err);
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
      prix: parseFloat(formData.prix),
      capacite: parseInt(formData.capacite),
      ram: parseInt(formData.ram)
    };

    try {
      if (isEditMode && id) {
        await updateProduit(id, payload);
      } else {
        await createProduit(payload);
      }
      navigate('/produits');
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5">
          {isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Nom" name="nom" value={formData.nom} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Prix" name="prix" value={formData.prix} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Couleur" name="couleur" value={formData.couleur} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Capacité" name="capacite" value={formData.capacite} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="RAM" name="ram" value={formData.ram} onChange={handleChange} margin="normal" required />
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

export default ProductForm;
