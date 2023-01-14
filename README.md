# Quina

Versão online do jogo de tabuleiro Quina. O jogador ganha se atingir um dos seguintes:
- Formar sequência de 5 peças em qualquer direção
- Fizer 5 capturas

Joga-se em turnos, cada jogador colocando uma peça por turno.
Para realizar a captura o jogador deve cercar duas peças consecutivas do oponente, ilustrativamente: xoox -> o jogador da peça "x" realizou captura e as peças "o" são retiradas do tabuleiro.

# Desenvolvimento

Aplicação simples em JavaScript que depende dos pacotes node: ```http```, ```express``` e ```socket.io```

## Como rodar
Dentro da pasta ```servidor``` executar o comando ```npm install```, em seguida executar o comando ```node servidor.js``` e a aplicação será iniciada

