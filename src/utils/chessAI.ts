import { Chess } from 'chess.js';
import { Difficulty } from '../types/chess';

const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3.25,
  r: 5,
  q: 9,
  k: 0
};

const POSITION_WEIGHTS = {
  easy: {
    centerControl: 0.1,
    pieceDevelopment: 0.1,
    kingProtection: 0.1
  },
  medium: {
    centerControl: 0.3,
    pieceDevelopment: 0.3,
    kingProtection: 0.4,
    pawnStructure: 0.2,
    mobility: 0.2
  },
  hard: {
    centerControl: 0.5,
    pieceDevelopment: 0.4,
    kingProtection: 0.6,
    pawnStructure: 0.4,
    mobility: 0.4,
    attackingPotential: 0.5
  }
};

export function getPossibleMoves(game: Chess, square: string): string[] {
  return game.moves({ square, verbose: true }).map(move => move.to);
}

export function getBestMove(game: Chess, difficulty: Difficulty, depth: number = 3): string {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return '';

  const moveScores = moves.map(move => {
    const gameCopy = new Chess(game.fen());
    gameCopy.move(move);
    return {
      move,
      score: minimax(gameCopy, depth - 1, false, -Infinity, Infinity, difficulty)
    };
  });

  moveScores.sort((a, b) => b.score - a.score);

  // Difficulty-based move selection
  switch (difficulty) {
    case 'easy':
      return moveScores[Math.floor(Math.random() * Math.min(3, moves.length))].move.san;
    case 'medium':
      return moveScores[Math.floor(Math.random() * Math.min(2, moves.length))].move.san;
    case 'hard':
      return moveScores[0].move.san;
    default:
      return moves[Math.floor(Math.random() * moves.length)].san;
  }
}

function minimax(
  game: Chess,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  difficulty: Difficulty
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluatePosition(game, difficulty);
  }

  const moves = game.moves();
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move(move);
      const score = minimax(gameCopy, depth - 1, false, alpha, beta, difficulty);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move(move);
      const score = minimax(gameCopy, depth - 1, true, alpha, beta, difficulty);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

function evaluatePosition(game: Chess, difficulty: Difficulty): number {
  let score = 0;
  const weights = POSITION_WEIGHTS[difficulty];
  const board = game.board();

  // Material evaluation
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      if (piece) {
        const value = PIECE_VALUES[piece.type as keyof typeof PIECE_VALUES];
        score += piece.color === 'w' ? value : -value;

        // Position evaluation based on difficulty
        const positionScore = evaluateSquare(i, j, piece, game, weights);
        score += piece.color === 'w' ? positionScore : -positionScore;
      }
    });
  });

  return score;
}

function evaluateSquare(
  row: number,
  col: number,
  piece: { type: string; color: string },
  game: Chess,
  weights: any
): number {
  let score = 0;

  // Center control
  if ((row === 3 || row === 4) && (col === 3 || col === 4)) {
    score += weights.centerControl;
  }

  // Piece development
  if (piece.type !== 'p' && (row !== 0 && row !== 7)) {
    score += weights.pieceDevelopment;
  }

  // King protection
  if (piece.type === 'k') {
    const pawnShield = countPawnShield(row, col, piece.color, game);
    score += pawnShield * weights.kingProtection;
  }

  // Pawn structure
  if (piece.type === 'p') {
    if (isPawnChain(row, col, piece.color, game)) {
      score += weights.pawnStructure;
    }
    if (isPassedPawn(row, col, piece.color, game)) {
      score += weights.pawnStructure * 1.5;
    }
  }

  return score;
}

function countPawnShield(row: number, col: number, color: string, game: Chess): number {
  let count = 0;
  const board = game.board();
  const direction = color === 'w' ? -1 : 1;
  
  for (let i = -1; i <= 1; i++) {
    const newCol = col + i;
    const newRow = row + direction;
    
    if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
      const piece = board[newRow][newCol];
      if (piece && piece.type === 'p' && piece.color === color) {
        count++;
      }
    }
  }
  
  return count;
}

function isPawnChain(row: number, col: number, color: string, game: Chess): boolean {
  const board = game.board();
  const direction = color === 'w' ? -1 : 1;
  
  for (let i = -1; i <= 1; i += 2) {
    const newCol = col + i;
    const newRow = row + direction;
    
    if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
      const piece = board[newRow][newCol];
      if (piece && piece.type === 'p' && piece.color === color) {
        return true;
      }
    }
  }
  
  return false;
}

function isPassedPawn(row: number, col: number, color: string, game: Chess): boolean {
  const board = game.board();
  const direction = color === 'w' ? -1 : 1;
  const endRow = color === 'w' ? 0 : 7;
  
  for (let r = row + direction; r !== endRow; r += direction) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (c >= 0 && c < 8) {
        const piece = board[r][c];
        if (piece && piece.type === 'p' && piece.color !== color) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function calculateNewRating(playerRating: number, opponentRating: number, result: number): number {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(playerRating + K * (result - expectedScore));
}