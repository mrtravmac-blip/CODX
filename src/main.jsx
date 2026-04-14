import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { FamilyProvider } from './context/FamilyContext';
import './styles.css';
import { registerSW } from './registerSW';

registerSW();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FamilyProvider>
          <App />
        </FamilyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
