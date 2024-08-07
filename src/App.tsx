import React from 'react';
import 'water.css';
import './App.css';

const App = () => {
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
        <form>
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
          Created by <a href="https://github.com/GideonPARANOID">GideonPARANOID</a>.
          Source available on <a href="https://github.com/GideonPARANOID/gpx-splitter">GitHub</a>
        </p>
      </footer>
    </>
  );
}

export default App;
