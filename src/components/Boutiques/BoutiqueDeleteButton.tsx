import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteBoutique } from '../../services/boutiques/boutiqueService';

interface BoutiqueDeleteButtonProps {
  boutique_id: number;
  onDeleted: () => void;
}

const BoutiqueDeleteButton: React.FC<BoutiqueDeleteButtonProps> = ({ 
  boutique_id, 
  onDeleted 
}) => {
  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette boutique ?")) {
      try {
        await deleteBoutique(boutique_id);
        onDeleted();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert("Échec de la suppression");
      }
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteIcon />}
      onClick={handleDelete}
      sx={{ ml: 1 }}
    >
      Supprimer
    </Button>
  );
};

export default BoutiqueDeleteButton;