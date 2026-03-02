// Linhas vencedoras do jogo da velha
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Verifica se há um vencedor
export function checkWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

// Verifica se deu empate
export function checkDraw(board) {
  return board.every((cell) => cell !== '');
}

// Encontra jogada vencedora para um jogador
export function getWinningMove(board, player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      const testBoard = [...board];
      testBoard[i] = player;
      if (checkWinner(testBoard)) {
        return i;
      }
    }
  }
  return null;
}

// IA faz jogada com dificuldade moderada
export function getAIMove(board) {
  const available = board.map((cell, idx) => (cell === '' ? idx : null)).filter((i) => i !== null);
  if (available.length === 0) return null;

  // 1. Sempre tenta vencer se possível
  const winMove = getWinningMove(board, 'O');
  if (winMove !== null) return winMove;

  // 2. Sempre tenta bloquear vitória do jogador
  const blockMove = getWinningMove(board, 'X');
  if (blockMove !== null) return blockMove;

  // 3. 40% de chance de fazer jogada aleatória em vez de estratégica
  if (Math.random() < 0.4) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // 4. Centro
  if (board[4] === '') return 4;

  // 5. Cantos
  const corners = [0, 2, 6, 8].filter((i) => board[i] === '');
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 6. Qualquer posição livre
  return available[Math.floor(Math.random() * available.length)];
}

// Cria tabuleiro vazio
export function createEmptyBoard() {
  return ['', '', '', '', '', '', '', '', ''];
}
