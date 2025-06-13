import _, { useState } from 'react';
 
import useUserLocation from './hooks/useUserLocation';
import calculateDistance from './utils/calculateDistance';
import ProductDetails from './ProductDetails';
import BoutiqueMap from './BoutiqueMap';
import 'leaflet/dist/leaflet.css';
import Header_accueil from '../Headers/Header_accueil';
import { searchProduits } from '../../services/produits/produitService';

const RechercheProduit = () => {
  const [query, setQuery] = useState('');
  const [produit, setProduit] = useState<any | null>(null);
  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [error, setError] = useState('');

  const { location: userLocation, error: locationError } = useUserLocation();

  const handleSearch = async () => {
    try {
      const data = await searchProduits(query);
      setProduit(data);

      // Flatten all boutiques from all products
      const allBoutiques = data.flatMap((produit: any) =>
        produit.boutiques.map((b: any) => ({
          ...b,
          produit, // Optionally keep reference to the product
        }))
      );

      if (userLocation) {
        const [userLat, userLng] = userLocation;
        const boutiquesAvecDistance = allBoutiques.map((b: any) => ({
          ...b,
          distance: calculateDistance(userLat, userLng, b.latitude, b.longitude),
        }));
        const sorted = boutiquesAvecDistance.sort((a, b) => a.distance - b.distance);
        setBoutiques(sorted);
      } else {
        setBoutiques(allBoutiques);
      }

      setError('');
    } catch (err) {
      setProduit(null);
      setBoutiques([]);
      setError('Produit non trouvé.');
    }
  };

  return (
    <div className="recherche-container">
      {<Header_accueil />}
      <div className="search-box" style={{ padding: '1rem' }}>
        <h2>🔍 Rechercher votre smartphone</h2>
        <input
          type="text"
          name='query'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="nom, modele ou marque de votre smartphone"
          style={{ padding: '0.5rem', width: '100%', maxWidth: 400 }}
        />
        <button onClick={handleSearch} style={{ marginTop: '0.5rem' }}>
          Rechercher
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {locationError && <p style={{ color: 'orange' }}>{locationError}</p>}
      </div>

      {produit && (
        <>
          <ProductDetails produit={produit} boutiques={boutiques} />
          {userLocation && <BoutiqueMap userLocation={userLocation} boutiques={boutiques} />}
        </>
      )}
    </div>
  );
};

export default RechercheProduit;
