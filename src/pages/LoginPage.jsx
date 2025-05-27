import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
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
      // Garante persistência local antes do login
      await setPersistence(auth, browserLocalPersistence);

      // Autenticação com PIN
      const userCredential = await signInWithEmailAndPassword(auth, fakeEmail, pin);
      const uid = userCredential.user.uid;

      if (!uid) {
        console.error('❌ UID ausente após login!');
        alert('Falha no login. UID ausente.');
        return;
      }

      // Ir buscar o tipo de utilizador
      const userRef = doc(db, 'utilizadores', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const tipo = userSnap.data().tipo;

        // Guardar em localStorage (redundante mas útil para fallback)
        localStorage.setItem('uid', uid);
        localStorage.setItem('username', username);
        localStorage.setItem('tipo', tipo);

        console.log('✅ UID guardado no localStorage:', uid);

        // Redirecionar consoante o tipo
        navigate(tipo === 'admin' ? '/admin' : '/home');
      } else {
        alert('Utilizador não registado na base de dados');
      }
      } catch (error) {
        alert('Utilizador ou PIN incorretos');
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
