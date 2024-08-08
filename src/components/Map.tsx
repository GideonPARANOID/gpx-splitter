import { MapContainer, TileLayer, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import type GPX from '../models/GPX';
import { randomColour } from '../utils';

import './Map.css';

type MapParams = {
  gpxs?: GPX[];
  rootGPX?: GPX;
};

const MapInner: React.FC<MapParams> = ({ gpxs, rootGPX }) => {
  const map = useMap();

  if (rootGPX) {
    map.fitBounds(rootGPX.toLine());
  }

  return (
    <>
      {[...(gpxs ?? []), rootGPX].filter(Boolean).map((gpx) => (
        <Polyline positions={gpx.toLine()} key={gpx.name} color={randomColour()} />
      ))}
    </>
  );
};

const Map: React.FC<MapParams> = ({ gpxs, rootGPX }) => {
  let center;
  let zoom;

  if (!gpxs && !rootGPX) {
    center = [0, 0];
    zoom = 1;
  }

  return (
    <MapContainer center={center} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInner gpxs={gpxs} rootGPX={rootGPX} />
    </MapContainer>
  );
};

export default Map;
