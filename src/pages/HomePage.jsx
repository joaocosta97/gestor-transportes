import { useState, useEffect } from 'react';
import FloatingButton from '../components/FloatingButton';
import AddRecordModal from '../components/AddRecordModal';
import LogoutButton from '../components/LogoutButton';
import UserInfo from '../components/UserInfo';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registos, setRegistos] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);

  const username = localStorage.getItem('username');

  const fetchRegistos = async () => {
    try {
      const q = query(
        collection(db, 'registos'),
        where('username', '==', username),
        orderBy('dataHoraInicio', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const dados = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRegistos(dados);
    } catch (error) {
      console.error('Erro ao buscar registos:', error);
    }
  };

  const handleSaveRecord = async (data) => {
    try {
      const dataHoraInicio = new Date(`${data.data}T${data.horaInicio}`);
      await addDoc(collection(db, 'registos'), {
        ...data,
        username,
        createdAt: new Date(),
        dataHoraInicio,
      });
      console.log('Registo adicionado com sucesso');
      fetchRegistos();
    } catch (error) {
      console.error('Erro ao adicionar registo:', error);
    }
  };

  const handleEditRecord = (registo) => {
    setRecordToEdit(registo);
    setIsModalOpen(true);
  };

  const handleUpdateRecord = async (data) => {
    try {
      const dataHoraInicio = new Date(`${data.data}T${data.horaInicio}`);
      const recordRef = doc(db, 'registos', recordToEdit.id);

      await updateDoc(recordRef, {
        ...data,
        dataHoraInicio,
      });

      console.log('Registo atualizado com sucesso');
      setRecordToEdit(null);
      fetchRegistos();
    } catch (error) {
      console.error('Erro ao atualizar registo:', error);
    }
  };

  useEffect(() => {
    fetchRegistos();
  }, []);

  return (
    <div className="min-h-screen bg-green-100 p-4 relative">
      {/* Botões no topo */}
      <UserInfo />
      <LogoutButton />
      <br />
      <br />
      <h1 className="text-2xl font-bold mb-6">Os teus Registos</h1>

      {/* Lista de registos */}
      <div className="space-y-4">
        {registos.map((registo) => (
          <div key={registo.id} className="bg-white p-4 rounded shadow">
            <p><strong>Viatura:</strong> {registo.viatura}</p>
            <p><strong>Tarefa:</strong> {registo.tarefa}</p>
            <p><strong>Data:</strong> {registo.data}</p>
            <p><strong>Hora:</strong> {registo.horaInicio} - {registo.horaFim}</p>

            {/* Botão para editar */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditRecord(registo)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
        {registos.length === 0 && (
          <p className="text-gray-600">Ainda não existem registos.</p>
        )}
      </div>

      {/* Modal para criar ou editar */}
      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRecordToEdit(null);
        }}
        onSave={recordToEdit ? handleUpdateRecord : handleSaveRecord}
        initialData={recordToEdit}
      />

      {/* Botão flutuante */}
      <FloatingButton onClick={() => setIsModalOpen(true)} />
    </div>
  );
}

export default HomePage;
