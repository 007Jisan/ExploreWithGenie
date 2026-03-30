import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const fallbackCities = [
  [23.8103, 90.4125],
  [22.3569, 91.7832],
  [24.8949, 91.8687],
  [22.8456, 89.5403],
];

const getDistance = (start, end) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(end[0] - start[0]);
  const dLng = toRad(end[1] - start[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(start[0])) *
      Math.cos(toRad(end[0])) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
};

const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return undefined;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#006a4e', opacity: 0.85, weight: 5 }],
      },
    }).addTo(map);

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (error) {
        return undefined;
      }
      return undefined;
    };
  }, [map, start, end]);

  return null;
};

const MapComponent = ({ lat, lng, destinationCoords, destinationLabel = 'Destination' }) => {
  const [startCoords, setStartCoords] = useState([23.8103, 90.4125]);
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const finalDestination = useMemo(() => {
    if (Array.isArray(destinationCoords) && destinationCoords.length === 2) {
      return destinationCoords;
    }

    if (typeof lat === 'number' && typeof lng === 'number') {
      return [lat, lng];
    }

    return null;
  }, [destinationCoords, lat, lng]);

  useEffect(() => {
    if (!finalDestination) return;

    const nearestCity = fallbackCities.reduce((closest, city) => {
      if (!closest) return city;
      return getDistance(city, finalDestination) < getDistance(closest, finalDestination)
        ? city
        : closest;
    }, null);

    if (!navigator.geolocation) {
      setStartCoords(nearestCity || [23.8103, 90.4125]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setStartCoords([coords.latitude, coords.longitude]),
      () => setStartCoords(nearestCity || [23.8103, 90.4125]),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [finalDestination]);

  if (!finalDestination) {
    return null;
  }

  if (googleMapsApiKey) {
    const src = `https://www.google.com/maps/embed/v1/directions?key=${googleMapsApiKey}&origin=${startCoords[0]},${startCoords[1]}&destination=${finalDestination[0]},${finalDestination[1]}&mode=driving`;
    return (
      <div className="w-full h-full rounded-xl overflow-hidden z-0 bg-slate-100">
        <iframe
          title={`Google route map to ${destinationLabel}`}
          src={src}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden z-0">
      <MapContainer
        center={startCoords}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine start={startCoords} end={finalDestination} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
