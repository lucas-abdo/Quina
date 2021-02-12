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

(() => {
    const sock = io();

    sock.on('mensagem', log);

    document
        .querySelector('#chat-form')
        .addEventListener('submit', aoEnviarMensagem(sock));
})();