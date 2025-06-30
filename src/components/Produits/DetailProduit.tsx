import { getProduitById } from "../../services/produits/produitService";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import type { ProduitResponse } from "./Produits";
import Header from "../Headers/Header"; 
import { 
  Smartphone,  
  HardDrive,      
  Cpu,           
  Tag, 
  Palette  ,
  Euro       
} from "lucide-react";

export default function DetailProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <Header />
      <br />
      <h1 style={{ textAlign: "center" }}>Détail du Produit</h1>
<Box sx={{ display: "flex", gap: 4, mt: 5, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Image du produit */}
        <Box sx={{ flex: "1 1 300px", textAlign: "center" }}>
          <img
            src={produit.image || "https://via.placeholder.com/300x400?text=Image+produit"}
            alt={produit.nom_produit}
            style={{ width: "100%", maxWidth: "300px", height: "auto", borderRadius: "8px", objectFit: "cover" }}
          />
        </Box>
        {/* Infos produit */}

        {/* Infos produit alignées proprement */}
<Box sx={{ flex: "1 1 400px", display: 'flex', flexDirection: 'column', gap: 1 }}>
  <Typography style={{ fontSize: '2rem', margin: 0 }}>
     <Tag size={20} color="blue" />
    {produit.modele?.modele}
  </Typography>
  <Typography style={{ fontSize: '2rem', margin: 0 }}>
     <Smartphone size={24}  color="blue"/>
    {produit.nom_produit}
  </Typography>

  {produit.ram && (
    <Typography style={{ fontSize: '1.2rem' }}> <Cpu size={20} color="blue" /> <strong>RAM :</strong> {produit.ram}</Typography>
  )}

  {produit.capacite && (
    <Typography style={{ fontSize: '1.2rem' }}><HardDrive size={20} color="blue" /><strong> Capacité :</strong> {produit.capacite}</Typography>
  )}

  {produit.couleur && (
    <Typography style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}> <Palette size={24} color="blue"/> <strong>Couleur :</strong> {produit.couleur}</Typography>
  )}

  {produit.prix && (
    <Typography style={{ fontSize: '1.4rem', marginTop: '10px', color: 'blue' }}>
      <Euro size={24}/> <strong>{produit.prix} FCFA</strong>
    </Typography>
  )}
</Box>
 </Box>

  {/* Boutiques */}
  <Box sx={{ mt: 2 }}>
    <Typography variant="h4" gutterBottom>
      Disponibilité en boutiques :
    </Typography>
  </Box>
       <Grid container spacing={3} sx={{ mt: 3 }}>
       {/* <Typography variant="h4">Disponibilité en boutiques :</Typography>    <br />   */}
        {produit.boutiques.map((boutique) => (
           <Grid item xs={12} sm={5} md={3} key={boutique.boutique_id}>
           <Box border={1} borderRadius={2} p={2} borderColor="grey.300">
            <Typography variant="h6">{boutique.nom_boutique}</Typography>
            <Typography>{boutique.adresse}</Typography>
            <Typography>{boutique.ville} - {boutique.code_postal}</Typography>
            <Typography>{boutique.departement}</Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate('/iteneraire')}
                sx={{
                  color: 'blue',          
                  borderColor: 'blue',   
                  textTransform: 'none'           
                }}
              > itineraire
              </Button>
            </Box>
            </Box>
            </Grid>
        ))} 
 </Grid>
    </Box>
  );
}