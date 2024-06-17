import type { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { GPX, SplitRoute, SplitMethod, Splitter } from './types';
import { calculateDistancesFromStart, getLessThanIndex } from './utils';
import { setMap } from './map';

declare global {
  const XMLParser: XMLParser;
  const XMLBuilder: XMLBuilder;
}

const defaultArgs = {
  ignoreAttributes: false,
};

export const split = (data: string, parts: number, method: SplitMethod): SplitRoute => {
  // @ts-expect-error global available
  const parser = new XMLParser(defaultArgs);
  // @ts-expect-error global available
  const builder = new XMLBuilder(defaultArgs);

  const parsed = parser.parse(data);
  const points = parsed.gpx.trk.trkseg.trkpt;

  // TODO figure out a better place to set the map than in here
  setMap(points);

  const distanceFromStart = calculateDistancesFromStart(points);

  console.log(`total points: ${points.length}`);
  console.log(`total distance: ${distanceFromStart[distanceFromStart.length - 1]}`);

  const chunks = (method === SplitMethod.POINTS ? splitPoints(points, parts) : splitDistance(points, parts)).map(
    (chunk, index) => {
      const output = structuredClone(parsed);
      const startIndex = chunk[0];
      const endIndex = chunk[1];

      console.log(`chunk ${index} indices: ${startIndex}-${endIndex}`);

      output.gpx.trk.trkseg.trkpt = output.gpx.trk.trkseg.trkpt.slice(startIndex, endIndex);
      output.gpx.metadata.name = `${output.gpx.metadata.name} part ${index + 1}`;
      output.gpx.trk.name = `${output.gpx.trk.name} part ${index + 1}`;

      return {
        route: builder.build(output),
        metadata: {
          pointsCount: endIndex - startIndex,
          lengthMeters: distanceFromStart[endIndex] - distanceFromStart[startIndex],
        },
      };
    },
  );

  return {
    parts: chunks,
    metadata: {
      pointsCount: distanceFromStart.length,
      lengthMeters: distanceFromStart[distanceFromStart.length - 1],
    },
  };
};

const splitPoints: Splitter = (points, parts) => {
  const distanceFromStart = calculateDistancesFromStart(points);
  const chunkLength = points.length / parts;

  return new Array(parts).fill(undefined).map((_, index) => {
    const startIndex = Math.floor(index * chunkLength);
    const endIndex = Math.min(Math.ceil(startIndex + chunkLength), points.length - 1);

    return [startIndex, endIndex];
  });
};

const splitDistance: Splitter = (points, parts) => {
  const distanceFromStart = calculateDistancesFromStart(points);
  const partDistance = distanceFromStart[distanceFromStart.length - 1] / parts;

  console.log(`chunk distance: ${partDistance}`);

  return new Array(parts).fill(undefined).map((_, index) => {
    const startIndex = getLessThanIndex(distanceFromStart, partDistance * index);
    const endIndex = getLessThanIndex(distanceFromStart, partDistance * (index + 1));

    return [startIndex, endIndex];
  });
};
