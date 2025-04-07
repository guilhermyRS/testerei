import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrintStatus = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/jobs`);
      console.log('Resposta da API /jobs:', response.data); // 👈 debug
      // Ajuste aqui se a resposta for { jobs: [...] }
      setJobs(Array.isArray(response.data) ? response.data : response.data.jobs || []);
    } catch (error) {
      console.error('Erro ao buscar trabalhos de impressão:', error);
      setJobs([]); // Evita erro no map se a requisição falhar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'printing': return 'status-printing';
      case 'completed': return 'status-completed';
      case 'error': return 'status-error';
      default: return '';
    }
  };

  const cancelPrintJob = async (jobId) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cancel/${jobId}`);
      toast.success('Trabalho de impressão cancelado!');
      fetchJobs();
    } catch (error) {
      toast.error('Erro ao cancelar impressão');
    }
  };

  return (
    <div className="print-status">
      <h2>Trabalhos de Impressão</h2>
      <button onClick={fetchJobs} className="refresh-button">
        Atualizar
      </button>

      {loading ? (
        <p>Carregando trabalhos de impressão...</p>
      ) : Array.isArray(jobs) && jobs.length > 0 ? (
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Arquivo</th>
              <th>Impressora</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.fileName}</td>
                <td>{job.printer}</td>
                <td className={getStatusClass(job.status)}>
                  {job.status === 'pending' && 'Aguardando'}
                  {job.status === 'printing' && 'Imprimindo'}
                  {job.status === 'completed' && 'Concluído'}
                  {job.status === 'error' && 'Erro'}
                </td>
                <td>
                  {(job.status === 'pending' || job.status === 'printing') && (
                    <button
                      onClick={() => cancelPrintJob(job.id)}
                      className="cancel-button"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum trabalho de impressão encontrado.</p>
      )}
    </div>
  );
};

export default PrintStatus;
