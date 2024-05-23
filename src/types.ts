export enum SplitMethod {
  POINTS = 'points',
  DISTANCE = 'distance',
}

export interface RouteMetadata {
  pointsCount: number;
  lengthMeters: number;
}

export interface SplitRoute {
  parts: {
    route: string;
    metadata: RouteMetadata;
  }[];
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
