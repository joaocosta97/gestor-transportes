import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('username');
      localStorage.removeItem('tipo');
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Sair
    </button>
  );
}

export default LogoutButton;
