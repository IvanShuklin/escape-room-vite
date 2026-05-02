import 'leaflet/dist/leaflet.css';
import './booking-map.css';

import {
  divIcon,
  latLngBounds,
  map as createMap,
  marker,
  tileLayer,
} from 'leaflet';
import type {
  DivIcon,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import { useEffect, useRef } from 'react';

import { BookingPlace } from '../../types/api';

type BookingMapProps = {
  places: BookingPlace[];
  selectedPlaceId: string | null;
  onPlaceChange: (placeId: string) => void;
};

const defaultZoom = 13;

const createIcon = (isActive: boolean): DivIcon =>
  divIcon({
    className: isActive ? 'map-marker map-marker--active' : 'map-marker',
    html: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });

const getLatLng = (coords: [number, number]): [number, number] => {
  const [first, second] = coords;

  return first > 40 ? [first, second] : [second, first];
};

export default function BookingMap({
  places,
  selectedPlaceId,
  onPlaceChange,
}: BookingMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || places.length === 0 || mapRef.current) {
      return;
    }

    const [lat, lng] = getLatLng(places[0].location.coords);

    mapRef.current = createMap(mapContainerRef.current, {
      center: [lat, lng],
      zoom: defaultZoom,
      scrollWheelZoom: false,
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      mapRef.current,
    );

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, [places]);

  useEffect(() => {
    if (!mapRef.current || places.length === 0) {
      return;
    }

    markersRef.current.forEach((currentMarker) => {
      currentMarker.remove();
    });

    markersRef.current = places.map((place) => {
      const [lat, lng] = getLatLng(place.location.coords);
      const isActive = place.id === selectedPlaceId;

      const currentMarker = marker([lat, lng], {
        icon: createIcon(isActive),
      });

      currentMarker.on('click', () => {
        onPlaceChange(place.id);
      });

      currentMarker.addTo(mapRef.current as LeafletMap);

      return currentMarker;
    });

    if (places.length === 1) {
      const [lat, lng] = getLatLng(places[0].location.coords);

      mapRef.current.setView([lat, lng], defaultZoom);

      return;
    }

    const bounds = latLngBounds(
      places.map((place) => getLatLng(place.location.coords)),
    );

    mapRef.current.fitBounds(bounds, { padding: [40, 40] });
  }, [places, selectedPlaceId, onPlaceChange]);

  useEffect(() => {
    if (!mapRef.current || !selectedPlaceId) {
      return;
    }

    const selectedPlace = places.find((place) => place.id === selectedPlaceId);

    if (!selectedPlace) {
      return;
    }

    const [lat, lng] = getLatLng(selectedPlace.location.coords);

    mapRef.current.setView([lat, lng], defaultZoom);
  }, [places, selectedPlaceId]);

  return (
    <div
      className="map"
      ref={mapContainerRef}
      style={{ height: '336px', width: '100%' }}
    />
  );
}
