export enum SplitMethod {
  POINTS = 'points',
  DISTANCE = 'distance',
}

export type Splitter = (parsed: GPX, parts: number) => GPX[];

export interface Point {
  x: number;
  y: number;
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
