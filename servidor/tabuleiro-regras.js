tabuleiroRegras = (tamanho) => {
    let tabuleiro;
    const intersecoes = tamanho + 1;
    const obterTabuleiro = () => tabuleiro;

    const limpar = () => {
        tabuleiro = Array(intersecoes).fill().map(() => Array(intersecoes).fill(null));
    };

    const turno = (x, y, cor) => {
        tabuleiro[y][x] = cor;
        return ehTurnoVencedor(x, y);
    };

    const dentroDosLimites = (x, y) => {
        return y >= 0 && y < tabuleiro.length && x >= 0 && x < tabuleiro[y].length;
    };

    const numRepetidos = (x, y, dx, dy) => {
        let i = 1;
        while (dentroDosLimites(x + i * dx, y + i * dy) &&
        tabuleiro[y + i * dy][x + i * dx] == tabuleiro[y][x]) {
            i++;
        }
        return i - 1;
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

    limpar();

    return { obterTabuleiro, limpar, turno };
};

module.exports = tabuleiroRegras;