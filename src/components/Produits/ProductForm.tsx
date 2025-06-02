import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  createProduit,
  getProduitById,
  updateProduit
} from '../../services/produits/produitService';
import type { ProduitCreate } from './Produits';
import { getAllBoutiques } from '../../services/boutiques/boutiqueService';
import { getAllModeles } from '../../services/produits/ModeleService';
const ProductForm: React.FC = () => {
  const { produit_id } = useParams(); // id est une string ou undefined
  const isEditMode = Boolean(produit_id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProduitCreate>({
    boutique_id: 0,
    quantite_initiale: 0,
    nom_produit: '',
    prix: 0,
    couleur: '',
    capacite: 0,
    ram: 0,
    modele: 0 ,
   
  });
  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [modeles, setModeles] = useState<any[]>([]);

  // Charger les données du produit si en mode modification
  useEffect(() => {
    if (isEditMode && produit_id) {
      getProduitById(produit_id).then((data) => {
        setFormData({
          nom_produit: data.nom_produit,
          prix: data.prix,
          couleur: data.couleur,
          capacite: data.capacite,
          ram: data.ram,
          boutique_id: data.boutique_id,
          quantite_initiale: data.quantite_initiale,
          modele: data.modele,
        });
      }).catch((err) => {
        console.error('Erreur chargement produit :', err);
      });
    }
  }, [produit_id, isEditMode]);

  // ===========================================================================================
  // Recuperation des Boutiques existantes avant l'ajout ou la modification d'un produit
  // ===========================================================================================
  useEffect(() => {
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
      } catch (error) {
        console.error('Erreur lors du chargement des boutiques:', error);
      }
    };
    fetchBoutiques();
  }, []);

  // ===========================================================================================
  // Recuperation des Modeles existants avant l'ajout ou la modification d'un produit
  // ===========================================================================================
  useEffect(() => {
    const fetchModeles = async () => {
      try {
        const data = await getAllModeles();
        if (Array.isArray(data)) {
          setModeles(data);
        }
        else if (data.results && Array.isArray(data.results)) {
          setModeles(data.results);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des modeles:', error);
      }
    };
    fetchModeles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      prix: formData.prix,
      capacite: formData.capacite,
      ram: formData.ram
    };

    try {
      if (isEditMode && produit_id) {
        await updateProduit(produit_id, payload);
      } else {
        await createProduit(payload);
      }
      navigate('/products');
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Boutique</InputLabel>
            <Select
              name="boutique_id"
              value={formData.boutique_id}
              onChange={handleSelectChange}
              label="Boutique"
            >
              {boutiques.map((boutique) => (
                <MenuItem key={boutique.boutique_id} value={boutique.boutique_id}>
                  {boutique.nom_boutique}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField fullWidth label="Quantité initiale" name="quantite_initiale" value={formData.quantite_initiale} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Nom" name="nom_produit" value={formData.nom_produit} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Prix" name="prix" value={formData.prix} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Couleur" name="couleur" value={formData.couleur} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Capacité" name="capacite" value={formData.capacite} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="RAM" name="ram" value={formData.ram} onChange={handleChange} margin="normal" required />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Modele</InputLabel>
            <Select
              name="modele"
              value={formData.modele}
              onChange={handleSelectChange}
              label="modele"
            >
              {modeles.map((modele) => (
                <MenuItem key={modele.modele_id} value={modele.modele_id}>
                  {modele.modele}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
