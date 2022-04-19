import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';

import App from './App';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
