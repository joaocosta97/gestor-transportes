// routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function PrivateRoute({ children, tipoPermitido }) {
  const { user, tipo } = useAuth();

  if (!user || !tipo) {
    // Ainda não autenticado ou a carregar
    return <Navigate to="/" />;
  }

  if (tipoPermitido && tipo !== tipoPermitido) {
    // Tipo de utilizador não autorizado
    return <Navigate to={tipo === 'admin' ? '/admin' : '/home'} />;
  }

  return children;
}

export default PrivateRoute;
