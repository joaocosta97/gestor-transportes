// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PinLoginPage from './pages/PinLoginPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal de login via PIN */}
        <Route path="/" element={<PinLoginPage />} />

        {/* Rota protegida: Página do utilizador normal */}
        <Route
          path="/home"
          element={
            <PrivateRoute tipoPermitido="utilizador">
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Rota protegida: Painel de administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute tipoPermitido="admin">
              <AdminPage />
            </PrivateRoute>
          }
        />

        {/* Rota inválida → redireciona para login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
