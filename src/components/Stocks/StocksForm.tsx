import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { StockCreate } from './Stock';
import { getBoutiqueById } from '../../services/boutiques/boutiqueService';

import { createStock, getAllProduitsWithoutPagination } from '../../services/stocks/StockService';

const StocksForm: React.FC = () => {
  const { boutiqueId } = useParams();
  const navigate = useNavigate();

  const [stockData, setStockData] = useState<StockCreate>({
    quantite: 0,
    seuil_alerte: 0,
    boutique: 0,
    produit: 0,
  });

  const [boutique , setBoutique] = useState<any>({}); 
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chargement des boutiques
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const data: any = await getAllProduitsWithoutPagination();
        if (Array.isArray(data)) {
          setProduits(data);
        } 
        else if (data && Array.isArray(data.results)) {
          setProduits(data.results);
        }
        else {
          console.error('Les données récupérées ne sont pas un tableau');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des boutiques:', error);
      }
    };
    fetchProduits();
  }, []);

  // Chargement des modèles
  useEffect(() => {
  const fetchBoutique = async () => {
    try {
      const data = await getBoutiqueById(Number(boutiqueId));
      if (data) {
        setBoutique(data);
        setStockData((prev) => ({
          ...prev,
          boutique: data.boutique_id
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la boutique:', error);
    }
  };
  if (boutiqueId) {
    fetchBoutique();
  }
}, [boutiqueId]);


  const handleChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockData({ ...stockData, [e.target.name]: e.target.value });
  };

  const handleSelectChangeStock = (e: SelectChangeEvent<string>) => { // ✅ Type corrigé
    setStockData({ ...stockData, [e.target.name]: e.target.value });
  };  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    //  Conversion des strings en numbers pour l'API
    const payload = {
      ...stockData,
      quantite: Number(stockData.quantite),
      seuil_alerte: Number(stockData.seuil_alerte),
      boutique: Number(stockData.boutique),
      produit: Number(stockData.produit)
    };

    try {
            
      await createStock(payload);
      // ✅ Redirection après la création ou la mise à jour
      navigate(-1);
     
    } catch (error: any) {
      console.error('Erreur lors de la soumission :', error);
      setError(error.message || 'Erreur lors de la soumission du formulaire');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Affichage du loading pendant que les données se chargent
  if (loading) {
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
  if (!boutiqueId) {
  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography color="error">
          ID de la boutique manquant dans l'URL.
        </Typography>
      </Box>
    </Container>
  );
}

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5">
          {'Ajouter un produit existante dans la boutique # ' + boutique.nom_boutique}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Produits</InputLabel>
            <Select
              name="produit"
              value={stockData.produit.toString()}
              onChange={handleSelectChangeStock}
              label="Produit"
            >
              {produits.map((prod) => (
                <MenuItem key={prod.produit_id} value={prod.produit_id}>
                  {prod.nom_produit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField 
            fullWidth 
            label="quantité" 
            name="quantite" 
            value={stockData.quantite} 
            onChange={handleChangeStock} 
            margin="normal" 
            required 
            type="number"
          />
          
                <TextField 
          fullWidth 
          label="Boutique" 
          name="boutique" 
          value={boutique.nom_boutique || ''} 
          margin="normal" 
          disabled 
        />
          
          <TextField 
            fullWidth 
            label="seuil d'alerte" 
            name="seuil_alerte" 
            value={stockData.seuil_alerte} 
            onChange={handleChangeStock} 
            margin="normal" 
            required 
            type="number"
          />
          
          <Box  mt={3} display="flex" justifyContent="space-between">
             <Button variant="outlined" onClick={() => navigate(-1)} style={{ marginRight: 8 }}>
                            Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                             {loading ? <CircularProgress size={24} /> : 'add_stock'}
                            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default StocksForm;