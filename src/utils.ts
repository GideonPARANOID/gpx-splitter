import haversine from 'haversine';
import type { Point, TrackPoint } from './types';

export const convertTrackPoint = (trackPoint: TrackPoint): Point => ({
  latitude: parseFloat(trackPoint['@_lat']),
  longitude: parseFloat(trackPoint['@_lon']),
});

export const calculateDistanceBetweenPoints = (one: Point, two: Point) => haversine(one, two, { unit: 'meter' });

// calculate a list of distances from the previous points, expressed in degrees
export const calculateDistancesFromStart = (points: TrackPoint[]): number[] =>
  points
    .map((point) => convertTrackPoint(point))
    .reduce((total, current, index, list) => {
      if (index === 0) {
        return [0];
      }

      const last = list[index - 1];
      return [...total, calculateDistanceBetweenPoints(current, last) + total[index - 1]];
    }, []);

// get the index of a the last value below the value for an ordered list of numbers
export const getLessThanIndex = (quantities: number[], value: number): number =>
  quantities.reduce((found, current, index) => {
    if (value < current && index === 0) {
      return 0;
    }

    return value < current ? found : index;
  }, -1);

export const metersToKilometers = (meters: number): string => (meters / 1e3).toFixed(3);
