// CLEAN WORKING CHESS AI - Fast and Functional
import { Chess, Square } from 'chess.js';

// Standard piece values
const PIECE_VALUES = {
  'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
};

// Standard position weights
const POSITION_WEIGHTS = {
  'p': [ // Pawn weights
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  'n': [ // Knight weights
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  'b': [ // Bishop weights
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  'r': [ // Rook weights
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
  ],
  'q': [ // Queen weights
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  'k': [ // King weights
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ]
};

// Strong opening moves
const STRONG_OPENINGS = ['e4', 'd4', 'Nf3', 'c4', 'Nc3', 'e3', 'd3', 'Bc4', 'Bf4', 'O-O'];

// Clean position evaluation
function evaluatePosition(game: Chess): number {
  try {
    if (game.isCheckmate()) {
      return game.turn() === 'w' ? -10000 : 10000;
    }
    
    if (game.isDraw()) {
      return 0;
    }
    
    let score = 0;
    const board = game.board();
    
    // Material and position evaluation
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece) {
          const isWhite = piece.color === 'w';
          const square = String.fromCharCode(97 + file) + (rank + 1) as Square;
          
          // Material value
          const materialValue = PIECE_VALUES[piece.type as keyof typeof PIECE_VALUES] || 0;
          score += isWhite ? materialValue : -materialValue;
          
          // Position value
          const positionValue = evaluateSquare(square, piece.type, isWhite);
          score += isWhite ? positionValue : -positionValue;
        }
      }
    }
    
    // Center control bonus
    const centerSquares = ['d4', 'e4', 'd5', 'e5'];
    for (const square of centerSquares) {
      const piece = game.get(square as Square);
      if (piece) {
        score += piece.color === 'w' ? 50 : -50;
      }
    }
    
    // Mobility bonus
    const currentMoves = game.moves().length;
    score += currentMoves * 5;
    
    return score;
  } catch (error) {
    console.error('Error evaluating position:', error);
    return 0;
  }
}

function evaluateSquare(square: Square, piece: string, isWhite: boolean): number {
  try {
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    const adjustedRank = isWhite ? rank : 7 - rank;
    
    const pieceType = piece.toLowerCase() as keyof typeof POSITION_WEIGHTS;
    const weights = POSITION_WEIGHTS[pieceType];
    
    if (weights && weights[adjustedRank] && weights[adjustedRank][file] !== undefined) {
      return weights[adjustedRank][file];
    }
    
    return 0;
  } catch (error) {
    console.error('Error evaluating square:', error);
    return 0;
  }
}

// Clean move evaluation
function evaluateMove(game: Chess, move: string): number {
  try {
    let score = 0;
    
    // Test the move
    const moveObj = game.move(move);
    if (!moveObj) return 0;
    
    // Check for checkmate
    if (game.isCheckmate()) {
      score += 10000;
    }
    
    // Check for check
    if (game.isCheck()) {
      score += 200;
    }
    
    // Check for captures
    if (moveObj.captured) {
      score += 100;
      
      // Bonus for good captures
      const capturedValue = PIECE_VALUES[moveObj.captured as keyof typeof PIECE_VALUES] || 0;
      const movingValue = PIECE_VALUES[moveObj.piece as keyof typeof PIECE_VALUES] || 0;
      if (movingValue < capturedValue) {
        score += (capturedValue - movingValue) / 10;
      }
    }
    
    // Check for castling
    if (move.includes('O-O')) {
      score += 150;
    }
    
    // Check for pawn promotion
    if (moveObj.promotion) {
      score += 300;
    }
    
    // Bonus for center moves
    if (moveObj.to) {
      const file = moveObj.to.charCodeAt(0) - 97;
      const rank = parseInt(moveObj.to[1]) - 1;
      if (file >= 2 && file <= 5 && rank >= 2 && rank <= 5) {
        score += 30;
      }
    }
    
    // Position evaluation after move
    score += evaluatePosition(game);
    
    // Undo the move
    game.undo();
    
    return score;
  } catch (error) {
    console.error('Error evaluating move:', error);
    return 0;
  }
}

// Clean minimax (shallow depth for speed)
function minimax(game: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  try {
    if (depth === 0 || game.isGameOver()) {
      return evaluatePosition(game);
    }
    
    const moves = game.moves();
    if (moves.length === 0) return evaluatePosition(game);
    
    if (maximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        game.move(move);
        const evaluation = minimax(game, depth - 1, alpha, beta, false);
        game.undo();
        
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        game.move(move);
        const evaluation = minimax(game, depth - 1, alpha, beta, true);
        game.undo();
        
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  } catch (error) {
    console.error('Error in minimax:', error);
    return 0;
  }
}

// CLEAN WORKING getBestMove
export async function getBestMove(game: Chess, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
  try {
    console.log('CLEAN AI thinking...', { difficulty, fen: game.fen() });
    
    const moves = game.moves();
    if (moves.length === 0) {
      console.log('No legal moves available');
      return '';
    }
    
    const moveHistory = game.history();
    const moveCount = moveHistory.length;
    
    // Strong opening moves
    if (moveCount < 4) {
      const openingMoves = moves.filter(move => STRONG_OPENINGS.includes(move));
      if (openingMoves.length > 0) {
        const selectedMove = openingMoves[Math.floor(Math.random() * openingMoves.length)];
        console.log('Strong opening move:', selectedMove);
        return selectedMove;
      }
    }
    
    // Set search depth based on difficulty (shallow for speed)
    const depth = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1 : 1;
    
    // Evaluate all moves
    const moveScores: { move: string; score: number }[] = [];
    
    for (const move of moves) {
      // For tactical moves, use shallow minimax
      if (move.includes('x') || move.includes('+') || move.includes('#')) {
        game.move(move);
        const score = minimax(game, depth, -Infinity, Infinity, game.turn() === 'w');
        game.undo();
        moveScores.push({ move, score });
      } else {
        // For quiet moves, use fast move evaluation
        const score = evaluateMove(game, move);
        moveScores.push({ move, score });
      }
    }
    
    // Ensure we have valid moves
    if (moveScores.length === 0) {
      console.log('No valid moves found, using fallback');
      return moves[0] || '';
    }
    
    // Sort moves by score
    moveScores.sort((a, b) => {
      if (game.turn() === 'w') {
        return b.score - a.score;
      } else {
        return a.score - b.score;
      }
    });
    
    console.log('Move scores:', moveScores.slice(0, 5));
    
    // Select move based on difficulty
    if (difficulty === 'easy') {
      const topMoves = moveScores.slice(0, Math.min(3, moveScores.length));
      const selected = topMoves[Math.floor(Math.random() * topMoves.length)];
      return selected.move;
    } else if (difficulty === 'medium') {
      const topMoves = moveScores.slice(0, Math.min(2, moveScores.length));
      const selected = topMoves[Math.floor(Math.random() * topMoves.length)];
      return selected.move;
    } else {
      return moveScores[0].move;
    }
  } catch (error) {
    console.error('Error in getBestMove:', error);
    // Fallback to first legal move
    const moves = game.moves();
    return moves[0] || '';
  }
}
