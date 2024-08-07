import React from 'react';
import 'water.css';
import { split } from './util/convert';
import type { SplitRoute, RouteMetadata, SplitMethod } from './types';
import { metersToKilometers } from './util';
import * as c from './util/constants';

const App = () => {
  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
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
  };

  const setError = (error: string): void => {
    document.getElementById('info-table-body')!.innerHTML = `
<tr>
  <td colspan="2">${error}</td>
</tr>`;

    document.getElementById('output-table-body')!.innerHTML = `
<tr>
  <td colspan="4">${error}</td>
</tr>`;
  };

  const setInfo = (metadata: RouteMetadata): void => {
    document.getElementById('info-table-body')!.innerHTML = `
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

    document.getElementById('output-table-body')!.innerHTML = rows.join('');
  };

  const createOutputRow = (file: File, index: number, metadata: RouteMetadata): string => `
<tr>
  <th scope="row">${index}</th>
  <td>${metersToKilometers(metadata.lengthMeters)}</td>
  <td>${metadata.pointsCount}</td>
  <td><a href="${URL.createObjectURL(file)}" download="${file.name}">Download</a></td>
</tr>`;

  return (
    <>
      <header>
        <h1>GPX Splitter</h1>
        <p>
          A tool for splitting GPX route files into several separate files, based either on the number of track points
          or distance.
        </p>
      </header>
      <section>
        <h2>Input</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="gpx">GPX file</label>
          <input type="file" name="gpx" id="gpx" accept="application/gpx+xml" required />

          <label htmlFor="parts">Number of parts</label>
          <input type="number" name="parts" id="parts" min="2" max="10" value="2" required />

          <fieldset>
            <legend>Method</legend>

            <label htmlFor="method-distance">Distance</label>
            <input type="radio" name="method" id="method-distance" value="distance" required checked />

            <label htmlFor="method-points">Points</label>
            <input type="radio" name="method" id="method-points" value="points" required />
          </fieldset>
          <input type="submit" />
        </form>
      </section>
      <section id="info">
        <h2>Info</h2>
        <table id="info-table">
          <thead>
            <tr>
              <th scope="col">Distance (km)</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody id="info-table-body">
            <tr>
              <td colSpan={2}>N/A</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h2>Output</h2>
        <table id="output-table">
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Distance (km)</th>
              <th scope="col">Points</th>
              <th scope="col">Download</th>
            </tr>
          </thead>
          <tbody id="output-table-body">
            <tr>
              <td colSpan={4}>N/A</td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer>
        <p>
          Created by <a href="https://github.com/GideonPARANOID">GideonPARANOID</a>. Source available on{' '}
          <a href="https://github.com/GideonPARANOID/gpx-splitter">GitHub</a>
        </p>
      </footer>
    </>
  );
};

export default App;
