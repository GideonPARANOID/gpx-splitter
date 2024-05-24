import { split } from './convert';
import type { SplitRoute, RouteMetadata, SplitMethod } from './types';
import { metersToKilometers } from './utils';
import * as c from './constants';

addEventListener('submit', async (event): Promise<void> => {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);

  console.log('event', event, formData);

  const input = {
    file: formData.get('gpx') as File,
    parts: parseInt(formData.get('parts') as string, 10),
    method: formData.get('method') as SplitMethod,
  };

  console.log(input);

  try {
    const result = await split(await input.file.text(), input.parts, input.method);

    setInfo(result.metadata);
    setOutput(input.file.name.replace(c.gpxSuffix, ''), result.parts);
  } catch (error) {
    setError('Error encountered during splitting');
    throw error;
  }
});

const setError = (error: string): void => {
  document.getElementById('info-table-body').innerHTML = `
<tr>
  <td colspan="2">${error}</td>
</tr>`;

  document.getElementById('output-table-body').innerHTML = `
<tr>
  <td colspan="4">${error}</td>
</tr>`;
};

const setInfo = (metadata: RouteMetadata): void => {
  document.getElementById('info-table-body').innerHTML = `
<tr>
  <td>${metersToKilometers(metadata.lengthMeters)}</td>
  <td>${metadata.pointsCount}</td>
</tr>`;
};

const setOutput = (inputFileName: string, parts: SplitRoute['parts']): void => {
  const rows = parts.map((content, index) => {
    const file = new File([content.route], `${inputFileName}-${index + 1}${c.gpxSuffix}`, {
      type: c.gpxMimeType,
    });

    return createOutputRow(file, index + 1, content.metadata);
  });

  const outputTableBody = (document.getElementById('output-table-body').innerHTML = rows.join(''));
};

const createOutputRow = (file: File, index: number, metadata: RouteMetadata): string => `
<tr>
  <th scope="row">${index}</th>
  <td>${metersToKilometers(metadata.lengthMeters)}</td>
  <td>${metadata.pointsCount}</td>
  <td><a href="${URL.createObjectURL(file)}" download="${file.name}">Download</a></td>
</tr>`;
