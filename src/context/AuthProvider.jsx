// context/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const username = firebaseUser.email.split('@')[0];
            const userRef = doc(db, 'utilizadores', firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const tipo = userSnap.data().tipo;
              setUser(username);
              setTipo(tipo);

              // Guardar em localStorage
              localStorage.setItem('username', username);
              localStorage.setItem('tipo', tipo);
            }
          } else {
            setUser(null);
            setTipo(null);
            localStorage.removeItem('username');
            localStorage.removeItem('tipo');
          }

          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Erro ao definir persistência:', error);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, tipo }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
