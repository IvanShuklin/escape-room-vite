import 'leaflet/dist/leaflet.css';
import './contacts-map.css';

import { divIcon, map as createMap, marker, tileLayer } from 'leaflet';
import type {
  DivIcon,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import { useEffect, useRef } from 'react';

type ContactsMapProps = {
  center: [number, number];
};

const defaultZoom = 16;

const createIcon = (): DivIcon =>
  divIcon({
    className: 'contacts-map-marker',
    html: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });

export default function ContactsMap({ center }: ContactsMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = createMap(mapContainerRef.current, {
      center,
      zoom: defaultZoom,
      scrollWheelZoom: false,
    });

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      mapRef.current,
    );

    markerRef.current = marker(center, {
      icon: createIcon(),
    });

    markerRef.current.addTo(mapRef.current);

    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 0);

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;

      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center]);

  return (
    <div className="contacts__map">
      <div className="map">
        <div className="map__container" ref={mapContainerRef} />
      </div>
    </div>
  );
}
