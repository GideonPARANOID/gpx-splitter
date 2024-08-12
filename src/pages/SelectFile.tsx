import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { metersToKilometers } from '../utils';
import Loading from '../components/Loading';
import Map from '../components/Map';
import GPX from '../models/GPX';

import './SelectFile.css';

const SelectFile = () => {
  const navigate = useNavigate();
  const [gpx, setGPX] = useState<GPX | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    navigate('/split', { state: { gpx: GPX.serialise(gpx) } });
  };

  const onChange = async (event) => {
    try {
      setLoading(true);
      const gpx = await GPX.fromFile(event.target.files[0]);
      setGPX(gpx);
      setError(null);
    } catch (e) {
      setGPX(null);
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <>
      <section>
        <h2>Select file</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="gpx">GPX file</label>
          <input type="file" name="gpx" id="gpx" accept="application/gpx+xml" required onChange={onChange} />

          <input type="submit" disabled={error !== null || gpx === null} />
        </form>
      </section>

      <section>
        <h2>Info</h2>
        {gpx === null ? (
          <div className={'info'}>
            {loading && (
              <div className={'loading'}>
                <Loading />
              </div>
            )}

            {!loading && !error && 'N/A - select a GPX to view info.'}

            {!loading && error && `Error parsing GPX - ${error}`}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Distance (km)</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{metersToKilometers(gpx.lengthMeters)}</td>
                <td>{gpx.pointsCount}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Map</h2>
        <Map rootGPX={gpx} />
      </section>
    </>
  );
};

export default SelectFile;
