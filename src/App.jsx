import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública: Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Rota protegida: Home para utilizadores normais */}
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

        {/* Qualquer outra rota inválida → redireciona para login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
