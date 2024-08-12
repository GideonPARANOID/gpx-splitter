import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import 'water.css';

import Page from './components/Page';
import SelectFile from './pages/SelectFile';
import Split from './pages/Split';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Page>
              <SelectFile />
            </Page>
          }
        />
        <Route
          path="/split"
          element={
            <Page>
              <Split />
            </Page>
          }
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
