import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function AddRecordModal({ isOpen, onClose, onSave, initialData = {} }) {
  const tipo = localStorage.getItem('tipo');
  const isAdmin = tipo === 'admin';

  const [loggedUsername, setLoggedUsername] = useState('');
  const [userList, setUserList] = useState([]);
  const [viaturasList, setViaturasList] = useState([]);
  const [tarefasList, setTarefasList] = useState([]);

  const [viatura, setViatura] = useState('');
  const [tarefa, setTarefa] = useState('');
  const [outraTarefa, setOutraTarefa] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setLoggedUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'utilizadores'));
          const users = querySnapshot.docs.map(doc => doc.data().username);
          setUserList(users);
        } catch (error) {
          console.error('Erro ao buscar utilizadores:', error);
        }
      };
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!loggedUsername) return;

    const fetchViaturas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'viaturas'));
        const user = loggedUsername.toLowerCase().trim();
        const filtradas = [];

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          const acesso = data.acesso;

          const permitido = isAdmin ||
            (Array.isArray(acesso) && acesso.includes(user)) ||
            (typeof acesso === 'string' && acesso.toLowerCase().trim() === user);

          if (permitido) {
            filtradas.push(data.nome);
          }
        });

        setViaturasList(filtradas);
      } catch (error) {
        console.error('Erro ao buscar viaturas:', error);
      }
    };

    fetchViaturas();
  }, [loggedUsername, isAdmin]);

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tarefa'));
        const tarefas = querySnapshot.docs.map(doc => doc.data().nome);
        setTarefasList(tarefas);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };
    fetchTarefas();
  }, []);

  useEffect(() => {
    if (initialData) {
      setViatura(initialData.viatura || '');
      setTarefa(initialData.tarefa || '');
      setOutraTarefa('');
      setData(initialData.data || '');
      setHoraInicio(initialData.horaInicio || '');
      setHoraFim(initialData.horaFim || '');
      setUsername(initialData.username || (isAdmin ? '' : loggedUsername));
    }
  }, [initialData, isAdmin, loggedUsername]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const tarefaFinal = tarefa === 'Outro' ? outraTarefa : tarefa;

    const uid = localStorage.getItem('uid') || '';
    const usernameFinal = isAdmin ? username : loggedUsername;

    console.group('🩺 DIAGNÓSTICO DE SUBMISSÃO');
    console.log('📌 UID do localStorage:', uid);
    console.log('📌 Username:', usernameFinal);
    console.log('📦 REGISTO A ENVIAR:', {
      viatura,
      tarefa: tarefaFinal,
      data,
      horaInicio,
      horaFim,
      username: usernameFinal,
      uid
    });
    console.groupEnd();

    if (!uid || uid.length < 8) {
      alert('❗ UID inválido ou ausente. Login pode não ter sido bem feito.');
      return;
    }

    const registo = {
      viatura,
      tarefa: tarefaFinal,
      data,
      horaInicio,
      horaFim,
      username: usernameFinal,
      uid
    };

    onSave(registo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {initialData?.id ? 'Editar Registo' : 'Novo Registo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdmin && (
            <div>
              <label className="block mb-1 font-semibold">Utilizador</label>
              <select
                className="w-full p-2 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              >
                <option value="">Selecionar utilizador</option>
                {userList.map((user) => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold">Viatura</label>
            <select
              className="w-full p-2 border rounded"
              value={viatura}
              onChange={(e) => setViatura(e.target.value)}
              required
            >
              <option value="">Selecionar Viatura</option>
              {viaturasList.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Tarefa</label>
            <select
              className="w-full p-2 border rounded"
              value={tarefa}
              onChange={(e) => setTarefa(e.target.value)}
              required
            >
              <option value="">Selecionar Tarefa</option>
              {tarefasList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {tarefa === 'Outro' && (
            <div>
              <label className="block mb-1 font-semibold">Descreve a tarefa</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={outraTarefa}
                onChange={(e) => setOutraTarefa(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold">Data</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={data}
              onChange={(e) => setData(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Hora Início</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Hora Fim</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecordModal;
