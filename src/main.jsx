import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    const username = email.split('@')[0]; // extrair "joao.costa" de "joao.costa@gestor.com"
    localStorage.setItem('username', username);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      theme="light"
    />
  </React.StrictMode>
);
