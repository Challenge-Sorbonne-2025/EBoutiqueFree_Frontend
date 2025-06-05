import  { useState, useEffect, useRef } from 'react';
import type { Boutique } from './Boutique'
import '../../assets/styles/StoreFinder.css';

// Ajout de la déclaration de la propriété google sur window
declare global {
  interface Window {
    google: any;
  }
}

// Déclaration minimale du namespace google pour TypeScript
declare namespace google.maps {
  export interface GeocoderResult {
    geometry: {
      location: {
        lat(): number;
        lng(): number;
      };
    };
  }
  export type GeocoderStatus = string;
}

const BoutiqueMapProximite = () => {
  const [map, setMap] = useState(null);
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  // URL
  const API_BASE_URL = 'http://localhost:8000'; 
  useEffect(() => {
    // Chargement de l'API Google Maps
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC6iCA5P0ycIXnG_UMuxZWOYoA5fxK_XjA&libraries=places`;
      script.async = true;
      script.onload = () => {
        initializeAutocomplete();
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeAutocomplete = () => {
    if (window.google && autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ['geocode'],
          componentRestrictions: { country: 'fr' }
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          initializeMap(coords);
        }
      });
    }
  };

  const initializeMap = async (userCoords: { lat: number; lng: number }) => {
    setIsLoading(true);
    
    try {
      // Créer la carte
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: userCoords,
        zoom: 12
      });

      // Marqueur pour la position de l'utilisateur
      new window.google.maps.Marker({
        position: userCoords,
        map: newMap,
        title: "Votre position",
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

      setMap(newMap);

      // Récupérer les boutiques depuis l'API Django
      await fetchBoutiques(userCoords, newMap);
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
      alert('Erreur lors du chargement de la carte');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBoutiques = async (
    userCoords: { lat: number; lng: number },
    mapInstance: any
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/boutiques-produits/?lat=${userCoords.lat}&lon=${userCoords.lng}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert('Aucune boutique proche avec du stock.');
          return;
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const boutiques: Boutique[] = await response.json();

      // Ajouter les marqueurs des boutiques
      boutiques.forEach((boutique: Boutique, index: number) => {
        const boutiquePosition = { 
          lat: parseFloat(boutique.lat), 
          lng: parseFloat(boutique.lon) 
        };

        const infoContent = `
          <div style="max-width: 300px;">
            <h3>${index + 1}. ${boutique.boutique}</h3>
            <p><strong>Ville:</strong> ${boutique.ville}</p>
            <p><strong>Adresse:</strong> ${boutique.adresse}</p>
            <p><strong>Produit:</strong> ${boutique.produit}</p>
            <p><strong>Marque:</strong> ${boutique.marque}</p>
            <p><strong>Modèle:</strong> ${boutique.modele}</p>
            <p><strong>Prix:</strong> ${boutique.prix} €</p>
            <p><strong>Quantité:</strong> ${boutique.quantite}</p>
          </div>
        `;

        const marker = new window.google.maps.Marker({
          position: boutiquePosition,
          map: mapInstance,
          label: `${index + 1}`,
          title: boutique.boutique
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
      alert('Erreur lors de la récupération des boutiques');
    }
  };

  const handleUseMyPosition = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          initializeMap(userCoords);
        },
        (error) => {
          setIsLoading(false);
          alert("Impossible de récupérer votre position.");
          console.error(error);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const handleAddressSearch = () => {
    if (!address.trim()) {
      alert('Veuillez entrer une adresse');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const coords = { 
          lat: location.lat(), 
          lng: location.lng() 
        };
        initializeMap(coords);
      } else {
        alert('Adresse non trouvée: ' + status);
      }
    });
  };

  return (
    <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      <div className="store-finder-container">
        <h1> Trouver mon produit dans la boutique la plus proche</h1>     

        <div className="search-form">
          <div className="search-fields">
            <div className="field">
              <button
                onClick={() => setShowAddressInput(!showAddressInput)}
                className="search-input"
                style={{ cursor: 'pointer' }}
              >
                Saisir votre adresse
              </button>
            </div>
            <div className="field">
              <button
                onClick={handleUseMyPosition}
                disabled={isLoading}
                className="search-input"
                style={{ 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Chargement...' : 'Utiliser ma position'}
              </button>
            </div>
          </div>
        </div>
</div>     

      {/* Champ d'adresse */}
      {showAddressInput && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <input
            ref={autocompleteRef}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Entrez votre adresse"
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '300px',
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <button
            onClick={handleAddressSearch}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Rechercher
          </button>
        </div>
      )}

      {/* Carte */}
      <div
        ref={mapRef}
        style={{
          height: '600px',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}
      />
    </div>
  );
};

export default BoutiqueMapProximite;