export enum SplitMethod {
  POINTS = 'points',
  DISTANCE = 'distance',
}

interface TrackPoint {
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
