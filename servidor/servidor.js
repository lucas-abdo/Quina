const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
app.use(express.static(`${__dirname}/../cliente`));

const servidor = http.createServer(app);
const io = socketio(servidor);

let entrada = 0;

io.on('connection', (sock) => {
    ++entrada;
    const cor = entrada == 1 ? 'red' : (entrada == 2 ? 'yellow' : 'black');
    sock.on('mensagem', (texto) => io.emit('mensagem', texto));
    sock.on('turno', ({ x, y }) => io.emit('turno', { x, y, cor }));
    io.emit('tabuleiro');
});

servidor.on('error', (erro) => console.log(erro));

servidor.listen(5000, () => console.log('Servidor pronto'));