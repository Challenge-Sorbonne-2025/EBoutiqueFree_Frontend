import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';
import api from '../../services/api';
import {
  getProduit,
  createProduit,
  updateProduit
} from '../../services/produits/produitService';
import type { ProduitCreateDTO } from '../../services/produits/produitService';

interface ProduitFormData {
  nom_produit: string;
  prix: string;
  couleur: string;
  capacite: string;
  ram: string;
  modele_id: string;
}

interface ModeleOption {
  id: number;
  modele: string;
  marque: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.pathname.includes('/modifier');
  const isCreationInBoutique = location.pathname.includes('/boutiques');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modeles, setModeles] = useState<ModeleOption[]>([]);

  const [formData, setFormData] = useState<ProduitFormData>({
    nom_produit: '',
    prix: '',
    couleur: '',
    capacite: '',
    ram: '',
    modele_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const modelesResponse = await api.get('/modeles/');
        setModeles(modelesResponse.data);

        if (isEditMode && id) {
          const produit = await getProduit(id);
          setFormData({
            nom_produit: produit.nom_produit,
            prix: produit.prix.toString(),
            couleur: produit.couleur,
            capacite: produit.capacite.toString(),
            ram: produit.ram.toString(),
            modele_id: produit.modele.modele_id.toString()
          });
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const produitData: ProduitCreateDTO = {
        nom_produit: formData.nom_produit,
        prix: parseFloat(formData.prix),
        couleur: formData.couleur,
        capacite: parseFloat(formData.capacite),
        ram: parseFloat(formData.ram),
        modele_id: parseInt(formData.modele_id)
      };

      // Ajoute l'ID de la boutique si on est en création dans une boutique
      if (isCreationInBoutique && id) {
        produitData.boutique_id = parseInt(id);
      }

      if (isEditMode && id) {
        await updateProduit(id, produitData);
      } else {
        await createProduit(produitData);
      }

      const redirectPath = isCreationInBoutique && id
        ? `/boutiques/${id}/produits`
        : '/produits';

      navigate(redirectPath);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nom du produit"
            name="nom_produit"
            value={formData.nom_produit}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            select
            fullWidth
            label="Modèle"
            name="modele_id"
            value={formData.modele_id}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="">Sélectionnez un modèle</MenuItem>
            {modeles.map((modele) => (
              <MenuItem key={modele.id} value={modele.id.toString()}>
                {modele.marque} - {modele.modele}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Prix (€)"
            name="prix"
            type="number"
            value={formData.prix}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ step: '0.01', min: '0' }}
          />

          <TextField
            fullWidth
            label="Couleur"
            name="couleur"
            value={formData.couleur}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Capacité (Go)"
            name="capacite"
            type="number"
            value={formData.capacite}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="RAM (Go)"
            name="ram"
            type="number"
            value={formData.ram}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : isEditMode ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ProductForm;
