const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
app.use(express.static(`${__dirname}/../cliente`));

const servidor = http.createServer(app);
const io = socketio(servidor);

io.on('connection', (sock) => {
    sock.on('mensagem', (texto) => io.emit('mensagem', texto));
});

servidor.on('error', (erro) => console.log(erro));

servidor.listen(5000, () => console.log('Servidor pronto'));