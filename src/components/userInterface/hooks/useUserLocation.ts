
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

