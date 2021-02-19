const log = (texto) => {
    const parente = document.querySelector('#events');
    const elemento = document.createElement('li');
    elemento.innerHTML = texto;

    parente.appendChild(elemento);
    parente.scrollTop = parente.scrollHeight;
};

const aoEnviarMensagem = (sock) => (e) => {
    e.preventDefault();

    const caixaTexto = document.querySelector('#chat');
    const texto = caixaTexto.value;
    caixaTexto.value = '';

    sock.emit('mensagem', texto);
};

const obterCoordenadasDoMouse = (elemento, evento) => {
    const { top, left } = elemento.getBoundingClientRect();
    const { clientX, clientY } = evento;

    return {
        x: clientX - left,
        y: clientY - top
    };
};

const aoEscolherCor = (sock, { vermelho, amarelo }) => (e) => {
    e.preventDefault();
    sock.emit('escolherCor', { vermelho, amarelo });
};

const obterTabuleiro = (tela, numCelulas = 18) => {
    const ctx = tela.getContext('2d');
    const tamanhoCelula = Math.floor(tela.width / numCelulas);

    const desenharTabuleiro = (tabuleiro) => {
        limpar();
        desenharGrade();
        renderizarTabuleiro(tabuleiro);
    };

    const limpar = () => {
        ctx.clearRect(0, 0, tela.width, tela.height);
    };

    const desenharGrade = () => {
        ctx.beginPath();
        for (let i = 0; i < numCelulas + 1; i++) {
            ctx.moveTo(i * tamanhoCelula, 0);
            ctx.lineTo(i * tamanhoCelula, numCelulas * tamanhoCelula);
            
            ctx.moveTo(0, i * tamanhoCelula);
            ctx.lineTo(numCelulas * tamanhoCelula, i * tamanhoCelula);
        }
        ctx.stroke();
    };

    const renderizarTabuleiro = (tabuleiro = []) => {
        tabuleiro.forEach((coluna, x) => {
            coluna.forEach((cor, y) => {
                cor && preencherCirculo(x, y, cor);
            });
        });
    };
    
    const preencherCirculo = (x, y, cor) => {
        ctx.beginPath();
        ctx.arc(x * tamanhoCelula, y * tamanhoCelula, tamanhoCelula / 2, 0, 2 * Math.PI);
        ctx.fillStyle = cor;
        ctx.fill();
    };

    const obterCoordenadasIntersecao = (x, y) => {
        return {
            x: Math.floor((x + tamanhoCelula / 2) / tamanhoCelula),
            y: Math.floor((y + tamanhoCelula / 2) / tamanhoCelula)
        };
    };

    return { desenharTabuleiro, obterCoordenadasIntersecao };
};

const atualizarContadoresCapturas = (capturas) => {
    capturasVermelho = document.querySelector('#capturasVermelho');
    capturasAmarelo = document.querySelector('#capturasAmarelo');

    capturasVermelho.innerHTML = capturas[0][1];
    capturasAmarelo.innerHTML = capturas[1][1];
};

(() => {
    const tela = document.querySelector('canvas');
    const { desenharTabuleiro, obterCoordenadasIntersecao } = obterTabuleiro(tela);
    const sock = io();

    sock.on('inicio', desenharTabuleiro);
    sock.on('turnoTabuleiro', desenharTabuleiro);
    sock.on('mensagem', log);
    sock.on('capturas', atualizarContadoresCapturas);

    const aoClicar = (e) => {
        const { x, y } = obterCoordenadasDoMouse(tela, e);
        sock.emit('turno', obterCoordenadasIntersecao(x, y));
    };

    const aoMover = (e) => {
        const { x, y } = obterCoordenadasDoMouse(tela, e);
    };

    tela.addEventListener('click', aoClicar);
    tela.addEventListener('mousemove', aoMover);

    document
        .querySelector('#chat-form')
        .addEventListener('submit', aoEnviarMensagem(sock));

    document
        .querySelector('#vermelho')
        .addEventListener('click', aoEscolherCor(sock, { vermelho: true, amarelo: false }));
    
    document
        .querySelector('#amarelo')
        .addEventListener('click', aoEscolherCor(sock, { vermelho: false, amarelo: true }));
})();