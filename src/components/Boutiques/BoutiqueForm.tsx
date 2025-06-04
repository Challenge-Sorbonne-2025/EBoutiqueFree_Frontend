import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Grid,
  CircularProgress,
  FormHelperText,
  OutlinedInput
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { BoutiqueCreate } from './Boutique';
import { getAllGestionnaires, getAllResponsables } from '../../services/users/UserService';
import { updateBoutique, createBoutique } from '../../services/boutiques/boutiqueService';
import { useParams, useNavigate } from 'react-router-dom';

interface Props {
  initialValues?: Partial<BoutiqueCreate>;
  loading?: boolean;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export default function BoutiqueForm({

  initialValues = {},
  loading = false, 
 
}: Props) {
  const [formData, setFormData] = useState<BoutiqueCreate>({
    nom_boutique: '',
    adresse: '',
    ville: '',
    code_postal: '',
    departement: '',
    longitude: 0,
    latitude: 0,
    numero_telephone: '',
    email: '',
    responsable: null,
    gestionnaires: [] as number[],
    ...initialValues
  });
 const {id } = useParams();
 const navigate = useNavigate();
  const [responsables, setResponsables] = useState<{id: number, username: string}[]>([]);
  const [gestionnaires, setGestionnaires] = useState<{id: number, username: string}[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<BoutiqueCreate>>({});

  useEffect(() => {
    // Charger les responsables et gestionnaires disponibles
    const fetchUsers = async () => {
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

        const gestionnairesRes = await getAllGestionnaires();
        if (Array.isArray(gestionnairesRes)) {
          setGestionnaires(gestionnairesRes.map(user => ({
            id: user.profile_id,
            username: user.username
          })));
          console.log("Gestionnaires chargés avec succès", gestionnairesRes);
        } else {
          console.error("La réponse des gestionnaires n'est pas un tableau", gestionnairesRes);   
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Efface l'erreur quand l'utilisateur modifie le champ
    if (formErrors[name as keyof BoutiqueCreate]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : 0,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? Number(value) : null,
    }));
  };

  const handleGestionnairesChange = (e: SelectChangeEvent<typeof formData.gestionnaires>) => {
  const value = e.target.value;
  setFormData(prev => ({
    ...prev,
    gestionnaires: typeof value === 'string'
      ? value.split(',').map(Number)
      : value,
  }));
};

  const validateForm = (): boolean => {
    const errors: Partial<BoutiqueCreate> = {};
    
    if (!formData.nom_boutique) errors.nom_boutique = 'Requis';
    if (!formData.adresse) errors.adresse = 'Requis';
    if (!formData.ville) errors.ville = 'Requis';
    if (!formData.code_postal) errors.code_postal = 'Requis';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.error('Validation failed', formErrors);
      return;
    }
    try{
      if (id !== undefined || initialValues && Object.keys(initialValues).length > 0) {
        // Logique de mise à jour de la boutique
        console.log('Mise à jour de la boutique avec les données:', formData);        
          await updateBoutique(Number(id), formData);
          navigate(`/boutiques`); // Redirection vers la page de la boutique après mise à jour
      }
      else {
        // Logique de création de la boutique
        console.log('Création d\'une nouvelle boutique avec les données:', formData);
        await createBoutique(formData);
        navigate('/boutiques'); // Redirection vers la liste des boutiques après création
      }
      
    }
    catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);      
  };
}

  
  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          {initialValues && Object.keys(initialValues).length > 0 ? 'Modifier la boutique' : 'Ajouter une boutique'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {/* Nom de la boutique */}
          <TextField
            fullWidth
            label="Nom de la boutique"
            name="nom_boutique"
            value={formData.nom_boutique}
            onChange={handleChange}
            margin="normal"
            required
            error={Boolean(formErrors.nom_boutique)}
            helperText={formErrors.nom_boutique}
          />

          {/* Adresse */}
          <TextField
            fullWidth
            label="Adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            margin="normal"
            required
            error={Boolean(formErrors.adresse)}
            helperText={formErrors.adresse}
          />

          {/* Ville et Code postal */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ville"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                margin="normal"
                required
                error={Boolean(formErrors.ville)}
                helperText={formErrors.ville}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code postal"
                name="code_postal"
                value={formData.code_postal}
                onChange={handleChange}
                margin="normal"
                required
                error={Boolean(formErrors.code_postal)}
                helperText={formErrors.code_postal}
              />
            </Grid>
          </Grid>

          {/* Département */}
          <TextField
            fullWidth
            label="Département"
            name="departement"
            value={formData.departement}
            onChange={handleChange}
            margin="normal"
          />

          {/* Coordonnées GPS */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                inputProps={{ step: 'any' }}
                value={formData.longitude || ''}
                onChange={handleNumberChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                inputProps={{ step: 'any' }}
                value={formData.latitude || ''}
                onChange={handleNumberChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          {/* Téléphone et Email */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="numero_telephone"
                type="tel"
                value={formData.numero_telephone}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          {/* Responsable */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Responsable</InputLabel>
            <Select
              name="responsable"
              value={formData.responsable}
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

          {/* Gestionnaires */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Gestionnaires</InputLabel>
            <Select
             name='gestionnaires'
              multiple
              value={formData.gestionnaires}
              onChange={handleGestionnairesChange}
              input={<OutlinedInput label="Gestionnaires" />}
              // renderValue={(selected) => (
              //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              //     {selected.map((value) => {
              //       const gestionnaire = gestionnaires.find(g => g.id === value);
              //       return (
              //         <Chip key={value} label={gestionnaire?.username || value} size="small" />
              //       );
              //     })}
              //   </Box>
              // )}

                            renderValue={(selected) =>
                    gestionnaires
                      .filter((g) => selected.includes(g.id))
                      .map((g) => g.username)
                      .join(', ')
                  }
            >
              {gestionnaires.map(gestionnaire => (
                <MenuItem key={gestionnaire.id} value={gestionnaire.id}>
                  {/* {gestionnaire.username} */}
                  <Checkbox checked={formData.gestionnaires.includes(gestionnaire.id)} />
                  <ListItemText primary={gestionnaire.username} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Sélectionnez un ou plusieurs gestionnaires
            </FormHelperText>
          </FormControl>

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'En cours...' : 'Valider la boutique'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}