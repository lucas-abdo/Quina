tabuleiroRegras = (tamanho) => {
    let tabuleiro;
    let cores;
    let capturas;
    const intersecoes = tamanho + 1;
    const QTD_PECAS_CAPTURA = 2;

    const obterTabuleiro = () => tabuleiro;

    const obterCor = (vermelho, amarelo) => {
        if (vermelho && cores[0][1] == false) {
            cores[0][1] = true;
            return cores[0][0];
        }
        else if (amarelo && cores[1][1] == false) {
            cores[1][1] = true;
            return cores[1][0];
        }
        return null;
    };

    const limpar = () => {
        tabuleiro = Array(intersecoes).fill().map(() => Array(intersecoes).fill(null));
        cores = ['rgb(180, 0, 0)', 'rgb(235, 180, 0)'].map((cor) => [cor, false]);
        capturas = [cores[0][0], cores[1][0]].map((cor) => [cor, 0]);
    };

    const turno = (x, y, cor) => {
        tabuleiro[x][y] = cor;
        atualizarCapturas(x, y);
        return ehTurnoVencedor(x, y);
    };

    const atualizarCapturas = (x, y) => {
        for (let dx = -1; dx < 2; dx++) {
            for (dy = -1; dy < 2; dy++) {
                if (dx == 0 && dy == 0) {
                    continue;
                }

                const pecasOponente = contarPecasOponente(x, y, dx, dy);

                if (podeCapturar(x, y, dx, dy, pecasOponente)) {
                    realizarCaptura(x, y, dx, dy);
                }
            }
        }
    };

    const contarPecasOponente = (x, y, dx, dy) => {
        let i = 1;
        let pecasOponente = 0;
        while (dentroDosLimites(x + i * dx, y + i * dy) &&
            tabuleiro[x + i * dx][y + i * dy] != null &&
            tabuleiro[x + i * dx][y + i * dy] != tabuleiro[x][y] && i <= QTD_PECAS_CAPTURA) {
                pecasOponente++;
                i++;
        }
        return pecasOponente;
    };

    const dentroDosLimites = (x, y) => {
        return x >= 0 && x < tabuleiro.length && y >= 0 && y < tabuleiro[x].length;
    };

    const podeCapturar = (x, y, dx, dy, pecasOponente) => {
        return pecasOponente == QTD_PECAS_CAPTURA && tabuleiro[x + (pecasOponente + 1) * dx][y + (pecasOponente + 1) * dy] == tabuleiro[x][y];
    };

    const realizarCaptura = (x, y, dx, dy) => {
        for (let k = 0; k < QTD_PECAS_CAPTURA; k++) {
            tabuleiro[x + (QTD_PECAS_CAPTURA - k) * dx][y + (QTD_PECAS_CAPTURA - k) * dy] = null;
            if (capturas[k][0] == tabuleiro[x][y]) {
                capturas[k][1]++;
            }
        }
    };

    const ehTurnoVencedor = (x, y) => {
        return venceuPorQuina(x, y) || venceuPorCapturas();
    };

    const venceuPorQuina = (x, y) => {
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

    const venceuPorCapturas = () => {
        for (let i = 0; i < 2; i++) {
            if (capturas[i][1] >= 5) {
                return true;
            }
        }
    };

    limpar();

    return { obterTabuleiro, obterCor, limpar, turno };
};

module.exports = tabuleiroRegras;