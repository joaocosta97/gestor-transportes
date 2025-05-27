import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyCoYCSn7MAs_x0S-srk9ilvZD2UjmI_Zf8',
  authDomain: 'gestor-transportes.firebaseapp.com',
  projectId: 'gestor-transportes',
  storageBucket: 'gestor-transportes.firebasestorage.app',
  messagingSenderId: '122269694638',
  appId: '1:122269694638:web:9b604a4c8dc9c03f6ccb3f',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async (req, context) => {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { status: 405 }
    );
  }

  try {
    const q = query(collection(db, 'registos'), orderBy('dataHoraInicio', 'asc'));
    const snapshot = await getDocs(q);

    const dados = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(dados), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao exportar registos:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno no servidor' }),
      { status: 500 }
    );
  }
};