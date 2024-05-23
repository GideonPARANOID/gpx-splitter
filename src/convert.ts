import type { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { GPX, Point, RouteDescription, SplitMethod, Splitter, TrackPoint } from './types';
import haversine from 'haversine';

declare global {
  const XMLParser: XMLParser;
  const XMLBuilder: XMLBuilder;
}

const defaultArgs = {
  ignoreAttributes: false,
};

export const split = (data: string, parts: number, method: SplitMethod): RouteDescription[] => {
  // @ts-expect-error global available
  const parser = new XMLParser(defaultArgs);
  // @ts-expect-error global available
  const builder = new XMLBuilder(defaultArgs);

  const parsed = parser.parse(data);

  const chunks = method === SplitMethod.POINTS ? splitPoints(parsed, parts) : splitDistance(parsed, parts);

  return chunks.map((chunk) => ({ route: builder.build(chunk.route), metadata: chunk.metadata }));
};

const splitPoints: Splitter = (parsed, parts) => {
  const distanceFromStart = calculateDistancesFromStart(parsed.gpx.trk.trkseg.trkpt);
  const quantity = parsed.gpx.trk.trkseg.trkpt.length;
  const chunkLength = quantity / parts;

  return new Array(parts).fill(undefined).map((_, index) => {
    const output = structuredClone(parsed);

    const startIndex = Math.floor(index * chunkLength);
    const endIndex = Math.min(Math.ceil(startIndex + chunkLength), quantity - 1);

    console.log(`chunk ${index} indices: ${startIndex}-${endIndex}`);

    output.gpx.trk.trkseg.trkpt = output.gpx.trk.trkseg.trkpt.slice(startIndex, endIndex - startIndex);
    output.gpx.metadata.name = `${output.gpx.metadata.name} part ${index + 1}`;
    output.gpx.trk.name = `${output.gpx.trk.name} part ${index + 1}`;
    return {
      route: output,
      metadata: { lengthMeters: distanceFromStart[endIndex] - distanceFromStart[startIndex] },
    };
  });
};

const splitDistance: Splitter = (parsed, parts) => {
  const distanceFromStart = calculateDistancesFromStart(parsed.gpx.trk.trkseg.trkpt);

  const partDistance = distanceFromStart[distanceFromStart.length - 1] / parts;

  console.log(`total points: ${distanceFromStart.length}`);
  console.log(`total distance: ${distanceFromStart[distanceFromStart.length - 1]}`);
  console.log(`chunk distance: ${partDistance}`);

  return new Array(parts).fill(undefined).map((_, index) => {
    const output = structuredClone(parsed);

    const startIndex = getLessThanIndex(distanceFromStart, partDistance * index);
    const endIndex = getLessThanIndex(distanceFromStart, partDistance * (index + 1));

    console.log(`chunk ${index} indices: ${startIndex}-${endIndex}`);

    output.gpx.trk.trkseg.trkpt = output.gpx.trk.trkseg.trkpt.slice(startIndex, endIndex - startIndex);
    output.gpx.metadata.name = `${output.gpx.metadata.name} part ${index + 1}`;
    output.gpx.trk.name = `${output.gpx.trk.name} part ${index + 1}`;
    return {
      route: output,
      metadata: { lengthMeters: distanceFromStart[endIndex] - distanceFromStart[startIndex] },
    };
  });
};

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
