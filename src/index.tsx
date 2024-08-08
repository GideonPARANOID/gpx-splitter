import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'water.css';

import Page from './components/Page';
import SelectFile from './pages/SelectFile';
import Split from './pages/Split';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Page>
        <SelectFile />
      </Page>
    ),
  },
  {
    path: 'split',
    element: (
      <Page>
        <Split />
      </Page>
    ),
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
