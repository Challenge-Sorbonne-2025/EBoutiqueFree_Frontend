import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import publicApi from '../services/publicApi';

interface Product {
    id: number;
    nom: string;
    prix: number;
    couleur: string;
    capacite: number;
    ram: number;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await publicApi.get('/produits/');
                console.log('Réponse API:', response.data); // Pour déboguer
                
                // Vérifier si response.data est un tableau
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else if (response.data.results && Array.isArray(response.data.results)) {
                    // Si les données sont dans un champ 'results' (format courant de DRF)
                    setProducts(response.data.results);
                } else {
                    setError('Format de données incorrect');
                    console.error('Format de données reçu:', response.data);
                }
            } catch (err) {
                setError('Erreur lors du chargement des produits');
                console.error('Erreur:', err);
            }
        };

        fetchProducts();
    }, []);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    // Vérifier si products est bien un tableau avant d'utiliser map
    if (!Array.isArray(products)) {
        return <Typography color="error">Erreur de format des données</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Liste des Produits
            </Typography>
            <Box sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
            }}>
                {products.map((product) => (
                    <Card key={product.id}>
                        <CardContent>
                            <Typography variant="h6">{product.nom}</Typography>
                            <Typography variant="body1">
                                Prix: {product.prix}€
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.couleur}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.capacite}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.ram}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
} 