const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const tabuleiroRegras = require('./tabuleiro-regras');

const app = express();
app.use(express.static(`${__dirname}/../cliente`));

const servidor = http.createServer(app);
const io = socketio(servidor);
const { obterTabuleiro, limpar, turno } = tabuleiroRegras(18);

let entrada = 0;

io.on('connection', (sock) => {
    ++entrada;
    const cor = entrada == 1 ? 'rgb(180, 0, 0)' : (entrada == 2 ? "rgb(235, 180, 0)" : 'black');
    
    sock.emit('tabuleiro', obterTabuleiro());
    
    sock.on('mensagem', (texto) => io.emit('mensagem', texto));

    sock.on('turno', ({ x, y }) => {
        const ehVencedor = turno(x, y, cor);
        io.emit('turnoTabuleiro', obterTabuleiro());
        if (ehVencedor) {
            sock.emit('mensagem', "Você venceu!");
            io.emit('mensagem', "Nova rodada");
            limpar();
            io.emit('tabuleiro');
        }
    });
});

servidor.on('error', (erro) => console.log(erro));

servidor.listen(5000, () => console.log('Servidor pronto'));