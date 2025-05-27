import { useState, useEffect } from 'react';
import FloatingButton from '../components/FloatingButton';
import AddRecordModal from '../components/AddRecordModal';
import LogoutButton from '../components/LogoutButton';
import FiltrosModal from '../components/FiltrosModal';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltrosModalOpen, setIsFiltrosModalOpen] = useState(false);
  const [registos, setRegistos] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);

  const [filtros, setFiltros] = useState({
    utilizador: '',
    viatura: '',
    tarefa: '',
    dataInicio: '',
    dataFim: '',
  });

  const fetchRegistos = async () => {
    try {
      const ref = collection(db, 'registos');
      const condicoes = [];

      if (filtros.utilizador) condicoes.push(where('username', '==', filtros.utilizador));
      if (filtros.viatura) condicoes.push(where('viatura', '==', filtros.viatura));
      if (filtros.tarefa) condicoes.push(where('tarefa', '==', filtros.tarefa));
      if (filtros.dataInicio) condicoes.push(where('data', '>=', filtros.dataInicio));
      if (filtros.dataFim) condicoes.push(where('data', '<=', filtros.dataFim));

      const q = query(ref, ...condicoes, orderBy('dataHoraInicio', 'desc'));
      const snapshot = await getDocs(q);

      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRegistos(dados);
    } catch (error) {
      console.error('Erro ao buscar registos:', error);
    }
  };

  useEffect(() => {
    fetchRegistos();
  }, [filtros]);

  const handleSaveRecord = async (data) => {
    try {
      const dataHoraInicio = new Date(`${data.data}T${data.horaInicio}`);
      await addDoc(collection(db, 'registos'), {
        ...data,
        createdAt: new Date(),
        dataHoraInicio,
      });
      fetchRegistos();
    } catch (error) {
      console.error('Erro ao adicionar registo:', error);
    }
  };

  const handleEditRecord = (data) => {
    setRecordToEdit(data);
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
      setRecordToEdit(null);
      fetchRegistos();
    } catch (error) {
      console.error('Erro ao atualizar registo:', error);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteDoc(doc(db, 'registos', id));
      fetchRegistos();
    } catch (error) {
      console.error('Erro ao apagar registo:', error);
    }
  };

  const abrirFiltros = () => {
    setIsFiltrosModalOpen(true);
  };

  const aplicarFiltros = (novosFiltros) => {
    setFiltros(novosFiltros);
  };

  const exportarParaSheets = async () => {
    try {
      const res = await fetch('/.netlify/functions/exportar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registos),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      alert(data.message || 'Exportação concluída!');
    } catch (err) {
      console.error('Erro ao exportar para o Google Sheets:', err);
      alert('Erro ao exportar para o Google Sheets.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4 relative">
      {/* Topo com Logout à esquerda e Exportar à direita */}
      <div className="flex justify-between items-center mb-4">
        <LogoutButton />
        <button
          onClick={exportarParaSheets}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Exportar
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Todos os Registos</h1>

      {/* Lista de registos */}
      <div className="space-y-4">
        {registos.map((registo) => (
          <div key={registo.id} className="bg-white p-4 rounded shadow">
            <p><strong>Utilizador:</strong> {registo.username}</p>
            <p><strong>Viatura:</strong> {registo.viatura}</p>
            <p><strong>Tarefa:</strong> {registo.tarefa}</p>
            <p><strong>Data:</strong> {registo.data}</p>
            <p><strong>Hora:</strong> {registo.horaInicio} - {registo.horaFim}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditRecord(registo)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteRecord(registo.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Apagar
              </button>
            </div>
          </div>
        ))}
        {registos.length === 0 && (
          <p className="text-gray-600">Nenhum registo encontrado.</p>
        )}
      </div>

      {/* Modal de criação/edição */}
      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRecordToEdit(null);
        }}
        onSave={recordToEdit ? handleUpdateRecord : handleSaveRecord}
        initialData={recordToEdit}
      />

      {/* Modal de filtros */}
      <FiltrosModal
        isOpen={isFiltrosModalOpen}
        onClose={() => setIsFiltrosModalOpen(false)}
        onApply={aplicarFiltros}
        initialFilters={filtros}
      />

      {/* Botão flutuante para adicionar registo */}
      <FloatingButton onClick={() => setIsModalOpen(true)} />

      {/* Botão flutuante para filtros (lupa) */}
      <button
        onClick={abrirFiltros}
        className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
        </svg>
      </button>
    </div>
  );
}

export default AdminPage;
