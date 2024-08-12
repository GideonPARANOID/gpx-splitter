import type { GPXSchema } from '../types';
import { calculateDistancesFromStart, getLessThanIndex } from '../utils';
import XML from './XML';
import type { LatLngTuple } from 'leaflet';

export default class GPX extends XML<GPXSchema> {
  private static readonly mimeType = 'application/gpx+xml';
  private static readonly suffix = '.gpx';

  private readonly parsed: GPXSchema;
  public readonly name: string;
  public readonly pointsCount: number;
  public readonly lengthMeters: number;

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // string serialising to survive react-router state transitions

  public static serialise(gpx: GPX): string {
    return JSON.stringify(gpx);
  }

  public static deserialise(json: string): GPX {
    const { name, parsed } = JSON.parse(json);
    return new GPX(name, parsed);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // parsing

  protected static parseXML(raw: string): GPXSchema {
    const parsed = new XML<GPXSchema>().parse(raw);

    if (!parsed.gpx) {
      throw new Error('Cannot parse GPX file');
    }
    return parsed;
  }

  public static async fromFile(file: File) {
    return new GPX(file.name, GPX.parseXML(await file.text()));
  }

  constructor(name: string, parsed: GPXSchema) {
    super();
    this.name = name;
    this.parsed = parsed;

    const distanceFromStart = calculateDistancesFromStart(this.parsed.gpx.trk.trkseg.trkpt);
    this.pointsCount = distanceFromStart.length;
    this.lengthMeters = distanceFromStart[distanceFromStart.length - 1];
  }

  public toFile(): File {
    return new File([this.build(this.parsed)], this.name, { type: GPX.mimeType });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // drawing
  // TODO assess whether this should be pulled out into own util

  public toLine(): LatLngTuple[] {
    return this.parsed.gpx.trk.trkseg.trkpt.map(
      (point): LatLngTuple => [Number(point['@_lat']), Number(point['@_lon'])],
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // spliting

  public createPart(startIndex: number, endIndex: number, partNumber: number): GPX {
    const parsed = structuredClone(this.parsed);
    parsed.gpx.trk.trkseg.trkpt = parsed.gpx.trk.trkseg.trkpt.slice(startIndex, endIndex);

    parsed.gpx.metadata.name = `${parsed.gpx.metadata.name} part ${partNumber}`;
    parsed.gpx.trk.name = `${parsed.gpx.trk.name} part ${partNumber}`;

    return new GPX(`${this.name.replace(GPX.suffix, '')}-${partNumber}${GPX.suffix}`, parsed);
  }

  public splitPoints(parts: number): GPX[] {
    const points = this.parsed.gpx.trk.trkseg.trkpt;

    const partLength = points.length / parts;

    console.log(`part length: ${partLength}`);

    return new Array(parts).fill(undefined).map((_, index) => {
      const startIndex = Math.floor(index * partLength);
      const endIndex = Math.min(Math.ceil(startIndex + partLength), points.length - 1);

      return this.createPart(startIndex, endIndex, index + 1);
    });
  }

  public splitDistance(parts: number): GPX[] {
    const points = this.parsed.gpx.trk.trkseg.trkpt;
    const distanceFromStart = calculateDistancesFromStart(points);
    const partDistance = distanceFromStart[distanceFromStart.length - 1] / parts;

    console.log(`part distance: ${partDistance}`);

    return new Array(parts).fill(undefined).map((_, index) => {
      const startIndex = getLessThanIndex(distanceFromStart, partDistance * index);
      const endIndex = getLessThanIndex(distanceFromStart, partDistance * (index + 1));

      return this.createPart(startIndex, endIndex, index + 1);
    });
  }
}
