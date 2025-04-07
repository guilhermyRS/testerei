const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'PrintSystemBackend',
  description: 'Sistema de impressão - Backend',
  script: path.join(__dirname, 'src/app.js'),
  nodeOptions: [],
  env: {
    name: "NODE_ENV",
    value: "production"
  }
});

svc.on('install', function() {
  svc.start();
  console.log('Serviço instalado e iniciado!');
});

svc.install();