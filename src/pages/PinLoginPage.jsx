import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';

function PinLoginPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const PASSWORD = 'transportes123'; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const pinDoc = await getDoc(doc(db, 'pins', pin));
      if (!pinDoc.exists()) {
        setErro('PIN inválido');
        setLoading(false);
        return;
      }

      const email = pinDoc.data().email;
      await signInWithEmailAndPassword(auth, email, PASSWORD);

      // Esperar até que o tipo seja carregado no localStorage
      const esperarPorTipo = () => {
        return new Promise((resolve) => {
          const check = () => {
            const tipo = localStorage.getItem('tipo');
            if (tipo) return resolve(tipo);
            setTimeout(check, 100); // Verifica novamente após 100ms
          };
          check();
        });
      };

      const tipo = await esperarPorTipo();

      if (tipo === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Erro no login via PIN:', error);
      setErro('Erro ao iniciar sessão. Verifica o PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Bem-vindo</h1>

        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="Introduz o teu PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-3 border rounded text-center text-xl tracking-widest"
          required
        />

        {erro && <p className="text-red-600 text-center">{erro}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white p-3 rounded font-semibold ${
            loading ? 'opacity-50' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default PinLoginPage;
