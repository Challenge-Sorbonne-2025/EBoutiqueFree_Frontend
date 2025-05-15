// components/boutiques/BoutiqueDeleteButton.tsx

import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteBoutique } from '../../services/boutiques/boutiqueService';

// Typage du paramètre id comme string, car c'est ce que tu passes depuis BoutiqueList.tsx
interface BoutiqueDeleteButtonProps {
  id: string;
  onDeleted: () => void;
}

const BoutiqueDeleteButton: React.FC<BoutiqueDeleteButtonProps> = ({ id, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await deleteBoutique(id); // Passer l'id comme string
      onDeleted(); // Appeler la fonction onDeleted pour mettre à jour la liste
    } catch (error) {
      console.error('Erreur lors de la suppression de la boutique:', error);
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={handleDelete}
    >
      Supprimer
    </Button>
  );
};

export default BoutiqueDeleteButton;
