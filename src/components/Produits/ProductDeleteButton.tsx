import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { deleteProduit } from '../../services/produits/produitService';

interface Props {
  id: string;
  onDeleted: () => void;
}

const ProductDeleteButton: React.FC<Props> = ({ id, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await deleteProduit(id);
      onDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      setError('Échec de la suppression. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        onClick={handleDelete}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Suppression...' : 'Supprimer'}
      </Button>
      {error && (
        <div style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </div>
      )}
    </>
  );
};

export default ProductDeleteButton;