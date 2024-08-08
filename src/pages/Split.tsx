import React, { useState } from 'react';
import { useLocation } from 'react-router';

import { SplitMethod } from '../types';
import { metersToKilometers } from '../utils';
import { GPX } from '../models/GPX';

const App = () => {
  const { state } = useLocation();

  console.log(state);

  const [tableData, setTableData] = useState<GPX[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>(null);

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    console.log('event', event, formData);

    const input = {
      parts: parseInt(formData.get('parts') as string, 10),
      method: formData.get('method') as SplitMethod,
    };

    console.log(input);

    try {
      const result =
        formData.get('method') === SplitMethod.POINTS
          ? state.gpx.splitPoints(input.parts)
          : state.gpx.splitDistance(input.parts); //await split(await input.file.text(), input.parts, input.method);

      console.log(result);
      setErrorMessage(null);
      setTableData(result);
    } catch (error) {
      setErrorMessage('Error encountered during splitting');
      setTableData([]);
      console.error(error);
    }
  };

  return (
    <>
      <section>
        <h2>Options</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="parts">Number of parts</label>
          <input type="number" name="parts" id="parts" min="2" max="10" defaultValue="2" required />

          <fieldset>
            <legend>Method</legend>

            <label htmlFor="method-distance">Distance</label>
            <input
              type="radio"
              name="method"
              id="method-distance"
              value={SplitMethod.DISTANCE}
              required
              defaultChecked={true}
            />

            <label htmlFor="method-points">Points</label>
            <input type="radio" name="method" id="method-points" value={SplitMethod.POINTS} required />
          </fieldset>
          <input type="submit" />
        </form>
      </section>
      <section>
        <h2>Split files</h2>
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
              tableData.map((part, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{metersToKilometers(part.lengthMeters)}</td>
                  <td>{part.pointsCount}</td>
                  <td>
                    <a href={URL.createObjectURL(part.toFile())} download={part.name}>
                      Download
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default App;
