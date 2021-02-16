const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const tabuleiroRegras = require('./tabuleiro-regras');

const app = express();
app.use(express.static(`${__dirname}/../cliente`));

const servidor = http.createServer(app);
const io = socketio(servidor);
const { obterTabuleiro, obterCor, limpar, turno } = tabuleiroRegras(18);

io.on('connection', (sock) => {
    let cor = null;
    sock.emit('inicio', obterTabuleiro());

    sock.on('escolherCor', ({ vermelho, amarelo }) => {
        cor = obterCor(vermelho, amarelo);
    });
    
    sock.on('mensagem', (texto) => io.emit('mensagem', texto));

    sock.on('turno', ({ x, y }) => {
        if (cor != null){
            const ehVencedor = turno(x, y, cor);
            io.emit('turnoTabuleiro', obterTabuleiro());
            if (ehVencedor) {
                sock.emit('mensagem', "Você venceu!");
                io.emit('mensagem', "Nova rodada");
                limpar();
                io.emit('inicio');
            }
        }
    });
});

servidor.on('error', (erro) => console.log(erro));

servidor.listen(5000, () => console.log('Servidor pronto'));