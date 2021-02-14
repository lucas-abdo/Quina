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

const obterTabuleiro = (tela, numCelulas = 18) => {
    const ctx = tela.getContext('2d');
    const tamanhoCelula = Math.floor(tela.width / numCelulas);

    const preencherCirculo = (x, y, cor) => {
        ctx.beginPath();
        ctx.arc(x * tamanhoCelula, y * tamanhoCelula, tamanhoCelula / 2, 0, 2 * Math.PI);
        ctx.fillStyle = cor;
        ctx.fill();
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

    const limpar = () => {
        ctx.clearRect(0, 0, tela.width, tela.height);
    };

    const renderizarTabuleiro = (tabuleiro = []) => {
        tabuleiro.forEach((linha, y) => {
            linha.forEach((cor, x) => {
                cor && preencherCirculo(x, y, cor);
            });
        });
    };

    const reiniciar = (tabuleiro) => {
        limpar();
        desenharGrade();
        renderizarTabuleiro(tabuleiro);
    };

    const obterCoordenadasIntersecao = (x, y) => {
        return {
            x: Math.floor((x + tamanhoCelula / 2) / tamanhoCelula),
            y: Math.floor((y + tamanhoCelula / 2) / tamanhoCelula)
        };
    };

    return { preencherCirculo, reiniciar, obterCoordenadasIntersecao };
};

(() => {
    const tela = document.querySelector('canvas');
    const { preencherCirculo, reiniciar, obterCoordenadasIntersecao } = obterTabuleiro(tela);
    const sock = io();

    const aoClicar = (e) => {
        const { x, y } = obterCoordenadasDoMouse(tela, e);
        sock.emit('turno', obterCoordenadasIntersecao(x, y));
    };

    const aoMover = (e) => {
        const { x, y } = obterCoordenadasDoMouse(tela, e);
    };

    sock.on('tabuleiro', reiniciar);
    sock.on('mensagem', log);
    sock.on('turno', ({ x, y, cor }) => preencherCirculo(x, y, cor));

    document
        .querySelector('#chat-form')
        .addEventListener('submit', aoEnviarMensagem(sock));

    tela.addEventListener('click', aoClicar);
    tela.addEventListener('mousemove', aoMover);
})();