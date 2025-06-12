import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import type { Boutique } from './Boutique';
import { createBoutique, getBoutiqueById, updateBoutique } from '../../services/boutiques/boutiqueService';
import { getAllResponsables } from '../../services/users/UserService';

interface BoutiqueFormData {
  nom_boutique: string;
  adresse: string;
  ville: string;
  code_postal: string;
  departement?: string;
  longitude?: string;
  latitude?: string;
  num_telephone?: string;
  email?: string;
  responsable: number | null;
}

const BoutiqueForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [formData, setFormData] = useState<BoutiqueFormData>({
    nom_boutique: '',
    adresse: '',
    ville: '',
    code_postal: '',
    departement: '',
    longitude: '',
    latitude: '',
    num_telephone: '',
    email: '', 
    responsable: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responsables, setResponsables] = useState<{id: number, username: string}[]>([]);

  // Récupérer les responsables au chargement du composant
  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        const responsablesRes = await getAllResponsables();
        if (Array.isArray(responsablesRes)) {
          setResponsables(responsablesRes.map(user => ({
            id: user.profile_id,
            username: user.username
          })));
          console.log("Responsables chargés avec succès", responsablesRes);
        } else {
          console.error("La réponse des responsables n'est pas un tableau", responsablesRes);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des responsables", err);
        setError("Erreur lors du chargement des responsables");
      }
    };

    fetchResponsables();
  }, []);

  // Récupérer les données de la boutique si on est en mode édition
  useEffect(() => {
    if (id && responsables.length > 0) {
      const fetchBoutique = async () => {
        setLoading(true);
        try {
          const data: Boutique = await getBoutiqueById(id);
          setFormData({
            nom_boutique: data.nom_boutique,
            adresse: data.adresse,
            ville: data.ville,
            code_postal: data.code_postal,
            departement: data.departement || '',
            longitude: data.longitude?.toString() || '',
            latitude: data.latitude?.toString() || '',
            num_telephone: data.num_telephone || '',
            email: data.email || '',
            responsable: data.responsable?.id || null
          });
        } catch (err) {
          setError("Erreur lors du chargement de la boutique");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchBoutique();
    }
  }, [id, responsables]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? Number(value) : null,
    }));
  };

  const validate = (): boolean => {
    if (!formData.nom_boutique.trim()) return setError("Nom requis"), false;
    if (!formData.adresse.trim()) return setError("Adresse requise"), false;
    if (!formData.ville.trim()) return setError("Ville requise"), false;
    if (!formData.code_postal.trim()) return setError("Code postal requis"), false;
    if (formData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      return setError("Format d'email invalide"), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);

    const longitude = formData.longitude ? parseFloat(formData.longitude) : null;
    const latitude = formData.latitude ? parseFloat(formData.latitude) : null;

    const formattedData = {
      ...formData,
      longitude: isNaN(longitude!) ? null : longitude,
      latitude: isNaN(latitude!) ? null : latitude,
    };

    try {
      if (id) {
        await updateBoutique(id, formattedData);
      } else {
        await createBoutique(formattedData);
      }
      navigate('/boutiques');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde de la boutique");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          {id ? "Modifier la boutique" : "Ajouter une nouvelle boutique"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {[
              { label: "Nom de la boutique", name: "nom_boutique", required: true },
              { label: "Adresse", name: "adresse", required: true },
              { label: "Ville", name: "ville", required: true },
              { label: "Code Postal", name: "code_postal", required: true },
              { label: "Département", name: "departement" },
              { label: "Longitude", name: "longitude" },
              { label: "Latitude", name: "latitude" },
              { label: "Numéro de téléphone", name: "num_telephone" },
              { label: "Email", name: "email", type: "email" }
            ].map(({ label, name, type, required }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                type={type || 'text'}
                value={formData[name as keyof BoutiqueFormData] || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={required}
              />
            ))}
            
            {/* Responsable */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Responsable</InputLabel>
              <Select
                name="responsable"
                value={formData.responsable || ''}
                onChange={handleSelectChange}
                label="Responsable"
              >
                <MenuItem value="">
                  <em>Sélectionner un responsable</em>
                </MenuItem>
                {responsables.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => navigate('/boutiques')}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {id ? "Mettre à jour" : "Ajouter"}
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default BoutiqueForm;