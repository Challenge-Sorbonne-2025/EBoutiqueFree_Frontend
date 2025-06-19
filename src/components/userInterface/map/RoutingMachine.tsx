// src/components/Map/RoutingMachine.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

// TypeScript: Extend Leaflet with Routing for type safety
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

interface RoutingMachineProps {
  from: [number, number];
  to: [number, number];
}

const RoutingMachine = ({ from, to }: RoutingMachineProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(...from),
        L.latLng(...to)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: () => null,
      // 🛠️ ajout via cast `as any` pour éviter TypeScript error
      ...( {
        draggableWaypoints: false
      } as any )
    });

    control.addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, from, to]);

  return null;
};

export default RoutingMachine;
