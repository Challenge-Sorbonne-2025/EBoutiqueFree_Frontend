import _, { useState } from 'react';
import { searchProduitByNom } from '../../services/userInterface/searchProductService';
import useUserLocation from './hooks/useUserLocation';
import calculateDistance from './utils/calculateDistance';
import ProductDetails from './ProductDetails';
import BoutiqueMap from './BoutiqueMap';
import 'leaflet/dist/leaflet.css';
import Header_accueil from '../Headers/Header_accueil';

const RechercheProduit = () => {
  const [nomRecherche, setNomRecherche] = useState('');
  const [produit, setProduit] = useState<any | null>(null);
  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [error, setError] = useState('');

  const { location: userLocation, error: locationError } = useUserLocation();

  const handleSearch = async () => {
    try {
      const data = await searchProduitByNom(nomRecherche);
      setProduit(data.produit);

      if (userLocation) {
        const [userLat, userLng] = userLocation;
        const boutiquesAvecDistance = data.boutiques.map((b: any) => ({
          ...b,
          distance: calculateDistance(userLat, userLng, b.latitude, b.longitude),
        }));
        const sorted = boutiquesAvecDistance.sort((a, b) => a.distance - b.distance);
        setBoutiques(sorted);
      } else {
        setBoutiques(data.boutiques);
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
        <h2>🔍 Rechercher un produit</h2>
        <input
          type="text"
          value={nomRecherche}
          onChange={(e) => setNomRecherche(e.target.value)}
          placeholder="Nom du produit"
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
