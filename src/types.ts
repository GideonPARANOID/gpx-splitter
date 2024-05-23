export enum SplitMethod {
  POINTS = 'points',
  DISTANCE = 'distance',
}

export interface RouteMetadata {
  lengthMeters: number;
}

export interface RouteDescription {
  route: string;
  metadata: RouteMetadata;
}

export type Splitter = (points: TrackPoint[], parts: number) => [number, number][];

export interface Point {
  latitude: number;
  longitude: number;
}

export interface TrackPoint {
  '@_lat': string;
  '@_lon': string;
  ele: number;
  time: string;
}

export interface GPX {
  gpx: {
    trk: {
      name: string;
      trkseg: {
        trkpt: TrackPoint[];
      };
    };
    metadata: {
      name: string;
    };
  };
}
