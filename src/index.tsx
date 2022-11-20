import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import './index.css';
import App from './App';

const root: Root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <App/>
);
