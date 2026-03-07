import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Routing Component
const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]), // User Location (Dhaka)
        L.latLng(end[0], end[1])      // Destination
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#006a4e', opacity: 0.8, weight: 5 }] // Bangladesh Green Path
      }
    }).addTo(map);

    return () => {
      try {
        // Modal close korle map theke control ta soriye nibo
        map.removeControl(routingControl);
        
        // 🔥 MAGIC FIX: 
        // Background theke route er data firot ashle jeno 'null' error na dey, 
        // tar jonne amra purono map er reference ta abar set kore dicchi.
        routingControl._map = map; 
      } catch (e) {
        console.warn("Routing cleanup handled gracefully.");
      }
    };
  }, [map, start, end]);

  return null;
};

const MapComponent = ({ destinationCoords }) => {
  const dhakaCoords = [23.8103, 90.4125]; // Default Starting Point (Dhaka)

  return (
    <div className="w-full h-full rounded-xl overflow-hidden z-0">
      <MapContainer 
        center={dhakaCoords} 
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Call Routing Machine with Coordinates */}
        {destinationCoords && (
          <RoutingMachine start={dhakaCoords} end={destinationCoords} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;