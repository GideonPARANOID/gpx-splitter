import React, { useState } from 'react';
import 'water.css';
import { split } from './util/convert';
import type { SplitRoute, RouteMetadata, SplitMethod } from './types';
import { metersToKilometers } from './util';
import * as c from './util/constants';

const App = () => {
  const [tableData, setTableData] = useState([]);
  const [infoMetadata, setInfoMetadata] = useState<RouteMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(null);

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

      setErrorMessage(null);
      setInfoMetadata(result.metadata);
      setTableData(generateTableData(input.file.name.replace(c.gpxSuffix, ''), result.parts));
    } catch (error) {
      setErrorMessage('Error encountered during splitting');
      setInfoMetadata(null);
      setTableData([]);
      console.error(error);
    }
  };

  const generateTableData = (inputFileName: string, parts: SplitRoute['parts']) =>
    parts.map(({ route, metadata }, index) => ({
      file: new File([route], `${inputFileName}-${index + 1}${c.gpxSuffix}`, { type: c.gpxMimeType }),
      metadata,
    }));

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
          <input type="number" name="parts" id="parts" min="2" max="10" defaultValue="2" required />

          <fieldset>
            <legend>Method</legend>

            <label htmlFor="method-distance">Distance</label>
            <input type="radio" name="method" id="method-distance" value="distance" required defaultChecked={true} />

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
              {infoMetadata === null ? (
                <td colSpan={2}>N/A</td>
              ) : (
                <>
                  <td>{metersToKilometers(infoMetadata.lengthMeters)}</td>
                  <td>{infoMetadata.pointsCount}</td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h2>Output</h2>
        <table id="tableData-table">
          <thead>
            <tr>
              <th scope="col">Number</th>
              <th scope="col">Distance (km)</th>
              <th scope="col">Points</th>
              <th scope="col">Download</th>
            </tr>
          </thead>
          <tbody id="tableData-table-body">
            {tableData.length === 0 || errorMessage !== null ? (
              <tr>
                <td colSpan={4}>{errorMessage === null ? 'N/A' : errorMessage}</td>
              </tr>
            ) : (
              tableData.map(({ file, metadata }, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{metersToKilometers(metadata.lengthMeters)}</td>
                  <td>{metadata.pointsCount}</td>
                  <td>
                    <a href={URL.createObjectURL(file)} download={file.name}>
                      Download
                    </a>
                  </td>
                </tr>
              ))
            )}
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
