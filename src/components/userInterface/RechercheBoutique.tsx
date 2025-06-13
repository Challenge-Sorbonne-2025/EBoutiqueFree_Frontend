import _, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, /*Polyline*/ } from 'react-leaflet';
import useUserLocation from './hooks/useUserLocation';
import calculateDistance from './utils/calculateDistance';
import { getAllBoutiques } from '../../services/userInterface/searchShopService'; // à créer si pas existant
import 'leaflet/dist/leaflet.css';
import Header_accueil from '../Headers/Header_accueil';
import RoutingMachine from './map/RoutingMachine';

const RechercheBoutique = () => {
  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { location: userLocation, error: locationError } = useUserLocation();

  // Récupère toutes les boutiques au chargement
  useEffect(() => {
    const fetchBoutiques = async () => {
      try {
        const data = await getAllBoutiques(); // doit renvoyer une liste de boutiques
        if (userLocation) {
          const [userLat, userLng] = userLocation;
          const boutiquesAvecDistance = data.map((b: any) => ({
            ...b,
            distance: calculateDistance(userLat, userLng, b.latitude, b.longitude)
          }));
          // Triées par distance
          const sorted = boutiquesAvecDistance.sort((a: { distance: number; }, b: { distance: number; }) => a.distance - b.distance);
          setBoutiques(sorted);
          setFiltered(sorted);
        } else {
          setBoutiques(data);
          setFiltered(data);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des boutiques', err);
      }
    };

    fetchBoutiques();
  }, [userLocation]);

  // Filtrage en temps réel
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = boutiques.filter(
      (b) =>
        b.nom.toLowerCase().includes(term) ||
        (b.code_postal && b.code_postal.toString().includes(term))
    );
    setFiltered(result);
  }, [searchTerm, boutiques]);

  return (
    <div style={{ padding: '1rem' }}>
          {<Header_accueil />}
      <h2>📍 Recherche de Boutiques</h2>

      <input
        type="text"
        placeholder="🔎 Nom ou Code Postal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', maxWidth: 400 }}
      />

      {locationError && <p style={{ color: 'orange' }}>{locationError}</p>}

      <ul style={{ marginTop: '1rem' }}>
        {filtered.map((b, i) => (
          <li key={i}>
            🏪 {b.nom} — 📍 {b.code_postal} — 📏 {b.distance?.toFixed(2)} km
          </li>
        ))}
      </ul>

      {userLocation && (
        <MapContainer
          center={userLocation}
          zoom={10}
          style={{ height: '400px', width: '100%', marginTop: '1rem' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Position utilisateur */}
          <Marker position={userLocation}>
            <Popup>📍 Vous êtes ici</Popup>
          </Marker>

          {/* Boutiques filtrées */}
          {filtered.map((b, i) => (
            <Marker key={i} position={[b.latitude, b.longitude]}>
              <Popup>
                <strong>{b.nom}</strong>
                <br />
                Code postal : {b.code_postal}
                <br />
                📏 {b.distance?.toFixed(2)} km
              </Popup>
          
              {/* Itinéraire routier réel */}
              <RoutingMachine from={userLocation} to={[b.latitude, b.longitude]} />
            </Marker>
            /*<Marker key={i} position={[b.latitude, b.longitude]}>
              <Popup>
                <strong>{b.nom}</strong>
                <br />
                Code postal : {b.code_postal}
                <br />
                📏 {b.distance?.toFixed(2)} km
              </Popup>
              <Polyline positions={[userLocation, [b.latitude, b.longitude]]} color="blue" />
            </Marker>*/
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default RechercheBoutique;
