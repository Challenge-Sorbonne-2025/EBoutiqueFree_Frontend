import { getProduitById } from "../../services/produits/produitService";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import type { ProduitResponse } from "./Produits";
import Header from "../Headers/Header"; // Assurez-vous que le chemin est correct

export default function DetailProduit() {
  const { id } = useParams();
  const [produit, setProduit] = useState<ProduitResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduit = async () => {
    console.log("produitId récupéré :", id); // Debug
    
    if (id && !isNaN(Number(id))) {
      try {
        const idd = Number(id);
        console.log("ID converti :", id); // Debug
        const response = await getProduitById(idd);
        console.log("Produit récupéré :", response);
        setProduit(response);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        setError("Erreur lors de la récupération du produit");
      } finally {
        setLoading(false);
      }
    } else {
      console.error("ID produit invalide :", id);
      setError("ID produit invalide");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduit();
  }, [id]); 

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <h1>Détail du Produit</h1>
        <p>Chargement du produit...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <h1>Détail du Produit</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </Box>
    );
  }

  if (!produit) {
    return (
      <Box sx={{ p: 3 }}>
        <h1>Détail du Produit</h1>
        <p>Produit non trouvé</p>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Header/>
      <br/>
      <h1>Détail du Produit</h1>      
      <Box>
        <h2>{produit.nom_produit}</h2>
        <p>Modèle: {produit.modele?.modele}</p>
        <p>Prix: {produit.prix} €</p>
        <p>RAM: {produit.ram}</p>
        <p>Capacité: {produit.capacite}</p>
      </Box>      
    </Box>
  );
}