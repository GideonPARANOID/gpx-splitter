import type Leaflet from 'leaflet';
import type { TrackPoint } from './types'

declare global {
  const L: Leaflet;
}

export const setMap = (points: TrackPoint[]) => {
  const map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const polyline = L.polyline(
    points.map((point) => [point['@_lat'], point['@_lon']]),
    { color: 'red' },
  ).addTo(map);

  map.fitBounds(polyline.getBounds());
};
