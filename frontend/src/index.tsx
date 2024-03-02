import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppContextProvider } from './app-context';
import AppRouterProvider from './router/router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <AppRouterProvider />
    </AppContextProvider>
  </React.StrictMode>
);
