import type { XMLBuilder, XMLParser } from 'fast-xml-parser';

declare global {
  const XMLParser: XMLParser;
  const XMLBuilder: XMLBuilder;
}

const defaultArgs = {
  ignoreAttributes: false,
};

export const split = (data: string, parts: number = 10): string[] => {
  // @ts-expect-error global available
  const parser = new XMLParser(defaultArgs);
  // @ts-expect-error global available
  const builder = new XMLBuilder(defaultArgs);

  return new Array(parts).fill(undefined).map((_, index) => {
    const parsed = parser.parse(data);

    console.log(parsed);

    const quantity = parsed.gpx.trk.trkseg.trkpt.length;
    const chunkLength = quantity / parts;
    console.log(`chunk ${index}`, parsed.gpx);

    // console.log(parsed.gpx.trk.trkseg.trkpt)
    parsed.gpx.trk.trkseg.trkpt = parsed.gpx.trk.trkseg.trkpt.slice(
      Math.round(index * chunkLength),
      (index + 1) * chunkLength,
    );
    parsed.gpx.metadata.name = `${parsed.gpx.metadata.name} day ${index + 1}`;
    parsed.gpx.trk.name = `${parsed.gpx.trk.name} day ${index + 1}`;
    return builder.build(parsed);
  });
};
