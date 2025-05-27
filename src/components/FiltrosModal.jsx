import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function FiltrosModal({ isOpen, onClose, onApply, initialFilters }) {
  const [filtroUtilizador, setFiltroUtilizador] = useState('');
  const [filtroViatura, setFiltroViatura] = useState('');
  const [filtroTarefa, setFiltroTarefa] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [userList, setUserList] = useState([]);
  const [viaturasList, setViaturasList] = useState([]);
  const [tarefaList, setTarefaList] = useState([]);

  useEffect(() => {
    if (initialFilters) {
      setFiltroUtilizador(initialFilters.utilizador || '');
      setFiltroViatura(initialFilters.viatura || '');
      setFiltroTarefa(initialFilters.tarefa || '');
      setDataInicio(initialFilters.dataInicio || '');
      setDataFim(initialFilters.dataFim || '');
    }
  }, [initialFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'utilizadores'));
        const viaturasSnap = await getDocs(collection(db, 'viaturas'));
        const tarefaSnap = await getDocs(collection(db, 'tarefa'));

        const users = usersSnap.docs.map(doc => doc.data().username);
        const viaturas = viaturasSnap.docs.map(doc => doc.data().nome);
        const tarefa = tarefaSnap.docs.map(doc => doc.data().nome);

        setUserList(users);
        setViaturasList(viaturas);
        setTarefaList(tarefa);
      } catch (error) {
        console.error('Erro ao buscar dados para filtros:', error);
      }
    };

    fetchData();
  }, []);

  const handleApply = () => {
    onApply({
      utilizador: filtroUtilizador,
      viatura: filtroViatura,
      tarefa: filtroTarefa,
      dataInicio,
      dataFim,
    });
    onClose();
  };

  const handleClear = () => {
    setFiltroUtilizador('');
    setFiltroViatura('');
    setFiltroTarefa('');
    setDataInicio('');
    setDataFim('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Filtros</h2>

        <div className="space-y-4">

          <select
            className="w-full p-2 border rounded"
            value={filtroUtilizador}
            onChange={(e) => setFiltroUtilizador(e.target.value)}
          >
            <option value="">Filtrar por utilizador</option>
            {userList.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            value={filtroViatura}
            onChange={(e) => setFiltroViatura(e.target.value)}
          >
            <option value="">Filtrar por viatura</option>
            {viaturasList.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            value={filtroTarefa}
            onChange={(e) => setFiltroTarefa(e.target.value)}
          >
            <option value="">Filtrar por tarefa</option>
            {tarefaList.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltrosModal;
