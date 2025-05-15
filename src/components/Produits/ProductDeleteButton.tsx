import { Button } from '@mui/material';
import { deleteProduit } from '../../services/produits/produitService';

interface Props {
  id: string; // type correct
  onDeleted: () => void;
}

const ProductDeleteButton: React.FC<Props> = ({ id, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await deleteProduit(id); // string attendu ici
      onDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);
    }
  };

  return (
    <Button variant="outlined" color="error" onClick={handleDelete}>
      Supprimer
    </Button>
  );
};

export default ProductDeleteButton;
