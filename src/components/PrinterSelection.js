import React, { useEffect, useState } from 'react';
import { getPrinters } from '../services/api';
import { toast } from 'react-toastify';

const PrinterSelection = ({ onSelectPrinter, selectedPrinter }) => {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        setLoading(true);
        const printersList = await getPrinters();
        setPrinters(printersList);
        if (printersList.length > 0 && !selectedPrinter) {
          onSelectPrinter(printersList[0].name);
        }
      } catch (error) {
        toast.error('Erro ao carregar impressoras. Verifique se o servidor está online.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrinters();
    // Atualizar a lista de impressoras a cada 30 segundos
    const interval = setInterval(fetchPrinters, 30000);
    return () => clearInterval(interval);
  }, [onSelectPrinter, selectedPrinter]);

  return (
    <div className="printer-selection">
      <h2>Selecione a Impressora</h2>
      {loading ? (
        <p>Carregando impressoras...</p>
      ) : printers.length > 0 ? (
        <select
          value={selectedPrinter || ''}
          onChange={(e) => onSelectPrinter(e.target.value)}
          className="printer-select"
        >
          <option value="" disabled>
            Selecione uma impressora
          </option>
          {printers.map((printer) => (
            <option key={printer.name} value={printer.name}>
              {printer.name} {printer.isDefault ? '(Padrão)' : ''}
            </option>
          ))}
        </select>
      ) : (
        <p>Nenhuma impressora encontrada no servidor Windows.</p>
      )}
    </div>
  );
};

export default PrinterSelection;