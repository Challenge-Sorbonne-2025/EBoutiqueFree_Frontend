// src/components/BoutiqueMap.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

interface Props {
  userLocation: [number, number];
  boutiques: any[];
}

const BoutiqueMap: React.FC<Props> = ({ userLocation, boutiques }) => {
  return (
    <div className="map-container">
      <MapContainer center={userLocation} zoom={10} className="leaflet-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={userLocation}>
          <Popup>📍 Vous êtes ici</Popup>
        </Marker>

        {boutiques.map((b, i) => (
          <Marker key={i} position={[b.latitude, b.longitude]}>
            <Popup>
              <strong>{b.nom}</strong>
              <br />
              📦 Stock : {b.quantite}
              <br />
              📏 {b.distance?.toFixed(2)} km
            </Popup>
            <Polyline positions={[userLocation, [b.latitude, b.longitude]]} color="blue" />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BoutiqueMap;
