import { useState, useEffect } from 'react';

function FiltrosModal({ isOpen, onClose, onApply, initialFilters }) {
  const [filtroUtilizador, setFiltroUtilizador] = useState('');
  const [filtroViatura, setFiltroViatura] = useState('');
  const [filtroTarefa, setFiltroTarefa] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    if (initialFilters) {
      setFiltroUtilizador(initialFilters.utilizador || '');
      setFiltroViatura(initialFilters.viatura || '');
      setFiltroTarefa(initialFilters.tarefa || '');
      setDataInicio(initialFilters.dataInicio || '');
      setDataFim(initialFilters.dataFim || '');
    }
  }, [initialFilters]);

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
        <br />
        <br />
        <h2 className="text-2xl font-bold mb-4">Filtros</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Filtrar por utilizador"
            className="w-full p-2 border rounded"
            value={filtroUtilizador}
            onChange={(e) => setFiltroUtilizador(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por viatura"
            className="w-full p-2 border rounded"
            value={filtroViatura}
            onChange={(e) => setFiltroViatura(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por tarefa"
            className="w-full p-2 border rounded"
            value={filtroTarefa}
            onChange={(e) => setFiltroTarefa(e.target.value)}
          />
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
