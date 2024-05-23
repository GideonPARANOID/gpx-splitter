import type { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { GPX, SplitMethod } from './types';

declare global {
  const XMLParser: XMLParser;
  const XMLBuilder: XMLBuilder;
}

type Splitter = (parsed: GPX, parts: number) => GPX[];

const defaultArgs = {
  ignoreAttributes: false,
};

export const split = (data: string, parts: number, method: SplitMethod): string[] => {
  // @ts-expect-error global available
  const parser = new XMLParser(defaultArgs);
  // @ts-expect-error global available
  const builder = new XMLBuilder(defaultArgs);

  const parsed = parser.parse(data);

  const chunks = method === SplitMethod.POINTS ? splitPoints(parsed, parts) : splitDistance(parsed, parts);

  return chunks.map((chunk) => builder.build(chunk));
};

const splitPoints: Splitter = (parsed, parts) => {
  const quantity = parsed.gpx.trk.trkseg.trkpt.length;
  const chunkLength = quantity / parts;

  return new Array(parts).fill(undefined).map((_, index) => {
    const output = structuredClone(parsed);

    output.gpx.trk.trkseg.trkpt = output.gpx.trk.trkseg.trkpt.slice(
      Math.round(index * chunkLength),
      (index + 1) * chunkLength,
    );
    output.gpx.metadata.name = `${output.gpx.metadata.name} part ${index + 1}`;
    output.gpx.trk.name = `${output.gpx.trk.name} part ${index + 1}`;
    return output;
  });
};

const splitDistance: Splitter = (parsed, parts) => {
  // distance expressed in degrees
  const distanceFromStart = parsed.gpx.trk.trkseg.trkpt
    .map((trackPoint) => ({
      x: parseFloat(trackPoint['@_lat']),
      y: parseFloat(trackPoint['@_lon']),
    }))
    .reduce((total, current, index, list) => {
      if (index === 0) {
        return [0];
      }

      const last = list[index - 1];
      const distanceFromLast = ((current.x - last.x) ** 2 + (current.y - last.y) ** 2) ** 0.5;
      return [...total, distanceFromLast + total[index - 1]];
    }, []);

  const partDistance = distanceFromStart[distanceFromStart.length - 1] / parts;

  console.log(`total points: ${distanceFromStart.length}`);
  console.log(`total distance: ${distanceFromStart[distanceFromStart.length - 1]}`);
  console.log(`chunk distance: ${partDistance}`);

  return new Array(parts).fill(undefined).map((_, index) => {
    const output = structuredClone(parsed);

    const partDistanceToStartAt = partDistance * index;
    const startIndex = distanceFromStart.reduce(
      (found, current, index) => (partDistanceToStartAt <= current ? index : found),
      0,
    );

    const partDistanceToEndAt = partDistance * (index + 1);
    const endIndex =
      distanceFromStart.length -
      distanceFromStart
        .reverse()
        .reduce((found, current, index) => (partDistanceToEndAt <= current ? index : found), 0);

    console.log(`chunk ${index} indices: ${startIndex}-${endIndex}`);

    output.gpx.trk.trkseg.trkpt = output.gpx.trk.trkseg.trkpt.slice(startIndex, endIndex - startIndex);
    output.gpx.metadata.name = `${output.gpx.metadata.name} part ${index + 1}`;
    output.gpx.trk.name = `${output.gpx.trk.name} part ${index + 1}`;
    return output;
  });

  // return [parsed];
};
