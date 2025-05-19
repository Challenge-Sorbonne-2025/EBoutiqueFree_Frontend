import { useState, useEffect } from 'react';
import axios from 'axios';
import type { BoutiqueFormData } from './Boutique';

interface Props {
  onSubmit: (data: BoutiqueFormData) => Promise<void> | void;
  initialValues?: Partial<BoutiqueFormData>;
  loading?: boolean;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export default function BoutiqueForm({
  onSubmit,
  initialValues = {},
  loading = false,
  onSuccess,
  onError
}: Props) {
  const [formData, setFormData] = useState<BoutiqueFormData>({
    nom_boutique: '',
    adresse: '',
    ville: '',
    code_postal: '',
    departement: '',
    longitude: undefined,
    latitude: undefined,
    num_telephone: '',
    email: '',
    responsable: undefined,
    gestionnaires: [],
    ...initialValues
  });

  const [responsables, setResponsables] = useState<{id: number, username: string}[]>([]);
  const [gestionnaires, setGestionnaires] = useState<{id: number, username: string}[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<BoutiqueFormData>>({});

  useEffect(() => {
    // Charger les responsables et gestionnaires disponibles
    const fetchUsers = async () => {
      try {
        const [responsablesRes, gestionnairesRes] = await Promise.all([
          axios.get('/api/users/responsables/'),
          axios.get('/api/users/gestionnaires/')
        ]);
        setResponsables(responsablesRes.data);
        setGestionnaires(gestionnairesRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Efface l'erreur quand l'utilisateur modifie le champ
    if (formErrors[name as keyof BoutiqueFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : undefined,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseInt(value) : null,
    }));
  };

  const handleGestionnairesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: number[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(parseInt(options[i].value));
      }
    }
    setFormData(prev => ({
      ...prev,
      gestionnaires: selectedValues,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<BoutiqueFormData> = {};
    
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

    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch (error) {
      console.error('Submission error:', error);
      onError?.(error);
      
      if (axios.isAxiosError(error)) {
        setFormErrors(prev => ({
          ...prev,
          ...error.response?.data.errors
        }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom de la boutique */}
      <div className="form-group">
        <label className="block mb-1 font-medium">
          Nom de la boutique <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nom_boutique"
          value={formData.nom_boutique}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${formErrors.nom_boutique ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {formErrors.nom_boutique && (
          <p className="text-red-500 text-sm mt-1">{formErrors.nom_boutique}</p>
        )}
      </div>

      {/* Adresse */}
      <div className="form-group">
        <label className="block mb-1 font-medium">
          Adresse <span className="text-red-500">*</span>
        </label>
        <textarea
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${formErrors.adresse ? 'border-red-500' : 'border-gray-300'}`}
          required
          rows={3}
        />
        {formErrors.adresse && (
          <p className="text-red-500 text-sm mt-1">{formErrors.adresse}</p>
        )}
      </div>

      {/* Ville et Code postal */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block mb-1 font-medium">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.ville ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {formErrors.ville && (
            <p className="text-red-500 text-sm mt-1">{formErrors.ville}</p>
          )}
        </div>

        <div className="form-group">
          <label className="block mb-1 font-medium">
            Code postal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code_postal"
            value={formData.code_postal}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${formErrors.code_postal ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {formErrors.code_postal && (
            <p className="text-red-500 text-sm mt-1">{formErrors.code_postal}</p>
          )}
        </div>
      </div>

      {/* Coordonnées GPS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block mb-1 font-medium">Longitude</label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={formData.longitude ?? ''}
            onChange={handleNumberChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="form-group">
          <label className="block mb-1 font-medium">Latitude</label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={formData.latitude ?? ''}
            onChange={handleNumberChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Téléphone et Email */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block mb-1 font-medium">Téléphone</label>
          <input
            type="tel"
            name="num_telephone"
            value={formData.num_telephone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="form-group">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Responsable */}
      <div className="form-group">
        <label className="block mb-1 font-medium">Responsable</label>
        <select
          name="responsable"
          value={formData.responsable ?? ''}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Sélectionner un responsable</option>
          {responsables.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {/* Gestionnaires */}
      <div className="form-group">
        <label className="block mb-1 font-medium">Gestionnaires</label>
        <select
          name="gestionnaires"
          multiple
          value={formData.gestionnaires.map(String)}
          onChange={handleGestionnairesChange}
          className="w-full p-2 border border-gray-300 rounded h-auto"
        >
          {gestionnaires.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Maintenez Ctrl (Windows) ou Command (Mac) pour sélectionner plusieurs gestionnaires
        </p>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                {/* Icône de chargement */}
              </svg>
              En cours...
            </span>
          ) : (
            'Valider la boutique'
          )}
        </button>
      </div>
    </form>
  );
}