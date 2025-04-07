import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { submitPrintJob } from '../services/api';
import { toast } from 'react-toastify';

const FileUpload = ({ selectedPrinter, refreshJobs }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [copies, setCopies] = useState(1);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Por favor, selecione um arquivo PDF válido');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Selecione um arquivo PDF');
      return;
    }
    
    if (!selectedPrinter) {
      toast.error('Selecione uma impressora');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload para o Supabase
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/\s+/g, '_');
      const fileName = `${timestamp}-${safeFileName}`;
      const bucketName = 'print-files';
      const filePath = `${fileName}`;
      
      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error('Erro no upload para Supabase:', error);
        throw new Error(`Erro no upload: ${error.message}`);
      }
      
      console.log('Upload concluído:', data);
      
      // Gerar URL assinada do arquivo para o backend acessar
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600); // URL válida por 1 hora
        
      if (urlError) {
        throw new Error(`Erro ao gerar URL: ${urlError.message}`);
      }
      
      console.log('URL gerada:', urlData.signedUrl);
      
      // Enviar trabalho para o backend
      await submitPrintJob({
        fileUrl: urlData.signedUrl,
        fileName: safeFileName,
        printer: selectedPrinter,
        copies: parseInt(copies),
        filePath: `${bucketName}/${filePath}` // Caminho completo no Supabase
      });
      
      toast.success('Arquivo enviado para impressão!');
      setFile(null);
      // Limpar o input file
      document.getElementById('file').value = '';
      refreshJobs();
      
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(`Erro ao enviar arquivo: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload de Arquivo PDF</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Selecione um arquivo PDF:</label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="copies">Cópias:</label>
          <input
            type="number"
            id="copies"
            min="1"
            max="100"
            value={copies}
            onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
            disabled={uploading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!file || !selectedPrinter || uploading}
          className="submit-button"
        >
          {uploading ? 'Enviando...' : 'Imprimir'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;