import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import PrinterSelection from './components/PrinterSelection';
import PrintStatus from './components/PrintStatus';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshJobs = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Impressão</h1>
      </header>
      
      <main>
        <div className="container">
          <div className="left-panel">
            <PrinterSelection 
              onSelectPrinter={setSelectedPrinter} 
              selectedPrinter={selectedPrinter} 
            />
            <FileUpload 
              selectedPrinter={selectedPrinter} 
              refreshJobs={refreshJobs} 
            />
          </div>
          
          <div className="right-panel">
            <PrintStatus key={refreshTrigger} />
          </div>
        </div>
      </main>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;