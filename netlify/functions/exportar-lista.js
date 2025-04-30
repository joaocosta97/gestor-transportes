import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore/lite';

// Usa o mesmo firebaseConfig do frontend
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

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const q = query(collection(db, 'registos'), orderBy('dataHoraInicio', 'asc'));
    const snapshot = await getDocs(q);

    const dados = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao exportar registos:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
