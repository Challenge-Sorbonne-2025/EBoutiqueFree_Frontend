// src/hooks/useUserLocation.ts
import { useEffect, useState } from 'react';

// Hook personnalisé pour obtenir la position actuelle de l'utilisateur
const useUserLocation = () => {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Utilise l'API Geolocation du navigateur
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation([latitude, longitude]);
        setError(null);
      },
      (_) => {
        setError('Impossible d’obtenir la position.');
        setLocation(null);
      }
    );
  }, []);

  return { location, error };
};

export default useUserLocation;

/*import { useState, useEffect } from 'react';

// Hook pour récupérer la position utilisateur (lat, lng)
export function useUserLocation() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n’est pas supportée par ce navigateur.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError(err.message)
    );
  }, []);

  return { location, error };
}
*/