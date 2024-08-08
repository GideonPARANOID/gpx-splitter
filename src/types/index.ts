export enum SplitMethod {
  POINTS = 'points',
  DISTANCE = 'distance',
}

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

export interface GPXSchema {
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
