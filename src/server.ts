import app from './app';

app.listen(3333, () => {
  const started = new Date().toLocaleTimeString();
  console.log('Desafio 06: Banco de dados e upload de arquivos no Node.js - Asaph Fernandes');
  console.log(`Serve started in port 3333 at ${started}`);
});
