import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import type { Boutique } from './boutiqueTypes';
import { createBoutique, getBoutique, updateBoutique } from '../../services/boutiques/boutiqueService';

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
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBoutique = async () => {
        setLoading(true);
        try {
          const data: Boutique = await getBoutique(id);
          setFormData({
            nom_boutique: data.nom_boutique,
            adresse: data.adresse,
            ville: data.ville,
            code_postal: data.code_postal,
            departement: data.departement || '',
            longitude: data.longitude?.toString() || '',
            latitude: data.latitude?.toString() || '',
            num_telephone: data.num_telephone || '',
            email: data.email || ''
          });
        } catch (err) {
          setError("Erreur lors du chargement de la boutique");
        } finally {
          setLoading(false);
        }
      };
      fetchBoutique();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      responsable: null,
      gestionnaires: []
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
