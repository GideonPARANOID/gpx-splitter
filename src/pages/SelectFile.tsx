import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { metersToKilometers } from '../utils';
import { GPX } from '../models/GPX';

const New = () => {
  const navigate = useNavigate();
  const [gpx, setGPX] = useState<GPX | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    navigate('/split', { state: { gpx } });
  };

  const onChange = async (event) => {
    try {
      const gpx = await GPX.fromFile(event.target.files[0]);
      setGPX(gpx);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <section>
        <h2>Select file</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="gpx">GPX file</label>
          <input type="file" name="gpx" id="gpx" accept="application/gpx+xml" required onChange={onChange} />

          {error}
          <input type="submit" disabled={error !== null || gpx === null} />
        </form>
      </section>

      <section id="gpx">
        <h2>Info</h2>
        <table id="gpx-table">
          <thead>
            <tr>
              <th scope="col">Distance (km)</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody id="gpx-table-body">
            <tr>
              {gpx === null ? (
                <td colSpan={2}>N/A</td>
              ) : (
                <>
                  <td>{metersToKilometers(gpx.lengthMeters)}</td>
                  <td>{gpx.pointsCount}</td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
};

export default New;
