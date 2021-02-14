tabuleiroRegras = (tamanho) => {
    let tabuleiro;
    let capturas;
    const intersecoes = tamanho + 1;
    const obterTabuleiro = () => tabuleiro;

    const limpar = () => {
        tabuleiro = Array(intersecoes).fill().map(() => Array(intersecoes).fill(null));
        capturas = Array(2).fill().map(() => Array(2).fill(null));
    };

    const turno = (x, y, cor) => {
        tabuleiro[x][y] = cor;
        atualizarCapturas(x, y, cor);
        return ehTurnoVencedor(x, y);
    };

    const atualizarCapturas = (x, y) => {
        for (let dx = -1; dx < 2; dx++) {
            for (dy = -1; dy < 2; dy++) {
                if (dx == 0 && dy == 0){
                    continue;
                }
            }
        }
    };

    const ehTurnoVencedor = (x, y) => {
        for (let dx = -1; dx < 1; dx++) {
            for (let dy = -1; dy < 2; dy++) {
                if (dx == 0 && dy == 0) {
                    continue;
                }

                const counter = numRepetidos(x, y, dx, dy) + numRepetidos(x, y, -dx, -dy) + 1;

                if (counter >= 5) {
                    return true;
                }
            }
        }
    };

    const numRepetidos = (x, y, dx, dy) => {
        let i = 1;
        while (dentroDosLimites(x + i * dx, y + i * dy) &&
        tabuleiro[x + i * dx][y + i * dy] == tabuleiro[x][y]) {
            i++;
        }
        return i - 1;
    };

    const dentroDosLimites = (x, y) => {
        return x >= 0 && x < tabuleiro.length && y >= 0 && y < tabuleiro[x].length;
    };

    limpar();

    return { obterTabuleiro, limpar, turno };
};

module.exports = tabuleiroRegras;