import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import fs from 'fs/promises';

const loadFile = async (filename = 'input.gpx') =>
  (await fs.readFile(filename)).toString();

const writeFile = async (filename, content) =>
  await fs.writeFile(filename, content);

const split = async (files = 10) => {
  const data = await loadFile();

  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
  });

  for (let i = 0; i < files; i++) {
    const parsed = parser.parse(data);

    const quantity = parsed.gpx.trk.trkseg.trkpt.length;
    const chunkLength = quantity / files;
    console.log(`chunk ${i}`, parsed.gpx);

    //    console.log(parsed.gpx.trk.trkseg.trkpt)
    parsed.gpx.trk.trkseg.trkpt = parsed.gpx.trk.trkseg.trkpt.slice(
      Math.round(i * chunkLength),
      (i + 1) * chunkLength,
    );
    parsed.gpx.metadata.name = `${parsed.gpx.metadata.name} day ${i + 1}`;
    parsed.gpx.trk.name = `${parsed.gpx.trk.name} day ${i + 1}`;
    await writeFile(`output-${i}.gpx`, builder.build(parsed));
  }
};

void split();
