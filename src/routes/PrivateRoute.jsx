import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, tipoPermitido }) {
  const username = localStorage.getItem('username');
  const tipo = localStorage.getItem('tipo');

  if (!username || !tipo) {
    return <Navigate to="/" />;
  }

  if (tipoPermitido && tipo !== tipoPermitido) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
