import { useNavigate } from 'react-router-dom';
import { createBoutique } from '../../services/boutiques/boutiqueService';
import type { BoutiqueFormData } from './Boutique';
import BoutiqueForm from './BoutiqueForm';

export default function BoutiqueCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: BoutiqueFormData) => {
    try {
      await createBoutique({
        ...formData,
        responsable: formData.responsable || null,
        gestionnaires: formData.gestionnaires || []
      });
      navigate('/boutiques');
    } catch (error) {
      console.error("Erreur création boutique:", error);
      alert("Erreur lors de la création");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Créer une boutique</h2>
      <BoutiqueForm 
        onSubmit={handleSubmit}
        onSuccess={() => navigate('/boutiques')}
      />
    </div>
  );
}