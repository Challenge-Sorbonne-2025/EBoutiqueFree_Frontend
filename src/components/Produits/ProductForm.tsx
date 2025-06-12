import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
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
  const { produit_id } = useParams();
  const navigate = useNavigate();
  
  // Initialisation avec des valeurs par défaut appropriées
  const [formData, setFormData] = useState<ProduitCreate>({
    boutique_id: '',
    quantite_initiale: '',
    nom_produit: '',
    prix: '',
    couleur: '',
    capacite: '',
    image: '',  
    ram: '',
    modele: '',
  });
  
  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [modeles, setModeles] = useState<any[]>([]);
  const isEditMode = location.pathname.includes('/edit');
  const isCreationInBoutique = location.pathname.includes('/boutiques');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // Nouveau state pour tracker le chargement des données
  const [error, setError] = useState<string | null>(null);

  // Chargement des boutiques
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

  // Chargement des modèles
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

  // Chargement du produit pour l'édition - VERSION AVEC DEBUG
  useEffect(() => {
    console.log('🔍 useEffect déclenché - isEditMode:', isEditMode, 'produitId:', produit_id);
    
    const fetchProduit = async () => {  
      if (!isEditMode || !produit_id) {
        console.log('❌ Pas de chargement - isEditMode:', isEditMode, 'produitId:', produit_id);
        setDataLoaded(true);
        return;
      }

      console.log('🚀 Début du chargement du produit...');
      setLoading(true);
      setError(null);
      
      try {
        console.log('📡 Appel API getProduitById avec ID:', produit_id);
        const data = await getProduitById(produit_id);
        
        console.log('✅ Données reçues de l\'API:', data);
        console.log('🏪 Boutiques:', data.boutiques);
        console.log('📱 Modèle:', data.modele);
        
        const premiereBoutique = data.boutiques?.[0];
        console.log('🎯 Première boutique sélectionnée:', premiereBoutique);
        
        const newFormData = {
          boutique_id: premiereBoutique?.boutique_id?.toString() || '',
          quantite_initiale: premiereBoutique?.quantite?.toString() || '',
          nom_produit: data.nom_produit || '',
          prix: data.prix || '',
          couleur: data.couleur || '',
          capacite: data.capacite || '',
          image: data.image || '',
          ram: data.ram || '',
          modele: data.modele?.modele_id?.toString() || '',
        };
        
        console.log('📝 Nouvelles données du formulaire:', newFormData);
        setFormData(newFormData);
        
        // Vérification après setFormData
        setTimeout(() => {
          console.log('⏰ FormData après setState (dans timeout):', newFormData);
        }, 100);
        
        setDataLoaded(true);
        console.log('✅ Chargement terminé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du produit:', error);
        setError('Erreur lors de la récupération du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [produit_id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => { // ✅ Type corrigé
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Conversion des strings en numbers pour l'API
    const payload = {
      ...formData,
      boutique_id: Number(formData.boutique_id),
      quantite_initiale: Number(formData.quantite_initiale),
      prix: Number(formData.prix),
      capacite: Number(formData.capacite),
      ram: Number(formData.ram),
      modele: Number(formData.modele)
    };

    try {
      if (isEditMode && produit_id) {
        await updateProduit(produit_id, payload);
      } else {
        if (isCreationInBoutique && produit_id) {
          payload.boutique_id = parseInt(produit_id);
        }
        await createProduit(payload);
      }

      const redirectPath = isCreationInBoutique && produit_id
        ? `/boutiques/${produit_id}/produits`
        : '/products';
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Erreur lors de la soumission :', error);
      setError(error.message || 'Erreur lors de la soumission du formulaire');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Affichage du loading pendant que les données se chargent
  if (loading || (isEditMode && !dataLoaded)) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
          <Typography ml={2}>Chargement...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

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
          
          <TextField 
            fullWidth 
            label="Quantité initiale" 
            name="quantite_initiale" 
            value={formData.quantite_initiale} 
            onChange={handleChange} 
            margin="normal" 
            required 
            type="number"
          />
          
          <TextField 
            fullWidth 
            label="Nom" 
            name="nom_produit" 
            value={formData.nom_produit} 
            onChange={handleChange} 
            margin="normal" 
            required 
          />
          
          <TextField 
            fullWidth 
            label="Prix" 
            name="prix" 
            value={formData.prix} 
            onChange={handleChange} 
            margin="normal" 
            required 
            type="number"
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
            label="Capacité" 
            name="capacite" 
            value={formData.capacite} 
            onChange={handleChange} 
            margin="normal" 
            required 
            type="number"
          />
          
          <TextField 
            fullWidth 
            label="Image URL" 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            margin="normal"  
          />
          
          <TextField 
            fullWidth 
            label="RAM" 
            name="ram" 
            value={formData.ram} 
            onChange={handleChange} 
            margin="normal" 
            required 
            type="number"
          />
          
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
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isEditMode ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ProductForm;