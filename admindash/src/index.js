import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DashMain from './DashMain';
import AddSongForm from './AddSongForm';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DashMain />
    <AddSongForm />
  </React.StrictMode>
);
