import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const getPrinters = async () => {
  try {
    const response = await api.get('/printers');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar impressoras:', error);
    throw error;
  }
};

export const submitPrintJob = async (jobData) => {
  try {
    const response = await api.post('/print', jobData);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar trabalho de impressão:', error);
    throw error;
  }
};