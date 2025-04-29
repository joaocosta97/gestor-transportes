import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const fakeEmail = `${username}@gestor.com`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, fakeEmail, pin);
      const uid = userCredential.user.uid;

      // Ir buscar o tipo ao Firestore
      const userRef = doc(db, 'utilizadores', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const tipo = userData.tipo;

        // Guardar no localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('tipo', tipo);

        // Redirecionar com base no tipo
        if (tipo === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        toast.error('Utilizador não registado na base de dados');
      }

    } catch (error) {
      toast.error('Utilizador ou PIN incorretos');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="PIN"
          className="w-full p-3 rounded border"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
