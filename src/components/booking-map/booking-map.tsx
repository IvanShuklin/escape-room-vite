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
  LatLngTuple,
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

const DEFAULT_ZOOM = 12;
const MARKER_SIZE: [number, number] = [32, 40];
const MARKER_ANCHOR: [number, number] = [16, 40];
const MAP_PADDING: [number, number] = [40, 40];

const createMarkerIcon = (isActive: boolean): DivIcon =>
  divIcon({
    className: isActive ? 'map-marker map-marker--active' : 'map-marker',
    html: '',
    iconSize: MARKER_SIZE,
    iconAnchor: MARKER_ANCHOR,
  });

const getLatLng = (coords: [number, number]): LatLngTuple => {
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

  const selectedPlace =
    places.find((place) => place.id === selectedPlaceId) ?? null;

  useEffect(() => {
    if (!mapContainerRef.current || places.length === 0 || mapRef.current) {
      return;
    }

    const firstPlaceCoordinates = getLatLng(places[0].location.coords);

    mapRef.current = createMap(mapContainerRef.current, {
      center: firstPlaceCoordinates,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: false,
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      mapRef.current,
    );

    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 0);

    return () => {
      markersRef.current.forEach((currentMarker) => {
        currentMarker.remove();
      });

      markersRef.current = [];

      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || places.length === 0) {
      return;
    }

    markersRef.current.forEach((currentMarker) => {
      currentMarker.remove();
    });

    markersRef.current = places.map((place) => {
      const currentMarker = marker(getLatLng(place.location.coords), {
        icon: createMarkerIcon(place.id === selectedPlaceId),
      });

      currentMarker.on('click', () => {
        onPlaceChange(place.id);
      });

      currentMarker.addTo(map);

      return currentMarker;
    });

    if (selectedPlace) {
      map.setView(getLatLng(selectedPlace.location.coords), DEFAULT_ZOOM);
      return;
    }

    if (places.length === 1) {
      map.setView(getLatLng(places[0].location.coords), DEFAULT_ZOOM);
      return;
    }

    map.fitBounds(
      latLngBounds(places.map((place) => getLatLng(place.location.coords))),
      { padding: MAP_PADDING },
    );
  }, [places, selectedPlace, selectedPlaceId, onPlaceChange]);

  return (
    <div className="booking-map">
      <div className="map">
        <div className="map__container" ref={mapContainerRef} />
      </div>

      {selectedPlace && (
        <p className="booking-map__address">
          Вы&nbsp;выбрали: {selectedPlace.location.address}
        </p>
      )}
    </div>
  );
}
