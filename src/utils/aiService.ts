// AI Service for Chess Coaching
import { Chess } from 'chess.js';
import { getBestMove } from './chessAI';

// Piece values for material evaluation
const PIECE_VALUES = {
  p: 1,   // pawn
  n: 3,   // knight
  b: 3,   // bishop
  r: 5,   // rook
  q: 9,   // queen
  k: 0    // king (not used in material calculation)
};

class ChessAIService {
  constructor() {
    console.log('Chess AI Service initialized');
  }

  // Analyze the current position
  async analyzePosition(game: Chess, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
    try {
      const bestMove = await getBestMove(game, difficulty);
      const evaluation = this.evaluatePosition(game);
      
      let analysis = `Position Evaluation: ${evaluation > 0 ? '+' : ''}${evaluation}\n`;
      analysis += `Best Move: ${bestMove}\n`;
      
      if (game.isCheck()) {
        analysis += '⚠️ Position is in check!\n';
      }
      
      if (game.isCheckmate()) {
        analysis += '🎯 Checkmate!\n';
      } else if (game.isDraw()) {
        analysis += '🤝 Draw position\n';
      }
      
      // Calculate winning chances
      const winningChances = this.calculateWinningChances(evaluation);
      analysis += `Winning Chances: ${winningChances}%\n`;
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing position:', error);
      return 'Error analyzing position. Please try again.';
    }
  }

  // Explain a specific move
  async explainMove(game: Chess, move: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
    try {
      const gameCopy = new Chess(game.fen());
      const moveResult = gameCopy.move(move);
      
      if (!moveResult) {
        return 'Invalid move.';
      }
      
      let explanation = `Move: ${move}\n\n`;
      
      // Check for tactical elements
      if (gameCopy.isCheckmate()) {
        explanation += '🎯 CHECKMATE! This move delivers checkmate.\n';
      } else if (gameCopy.isCheck()) {
        explanation += '⚡ CHECK! This move gives check.\n';
      }
      
      if (moveResult.captured) {
        explanation += `📦 CAPTURE: ${moveResult.piece} captures ${moveResult.captured}\n`;
        
        const capturedValue = PIECE_VALUES[moveResult.captured as keyof typeof PIECE_VALUES] || 0;
        const movingValue = PIECE_VALUES[moveResult.piece as keyof typeof PIECE_VALUES] || 0;
        
        if (capturedValue > movingValue) {
          explanation += '✅ Good capture - capturing higher value piece\n';
        } else if (capturedValue < movingValue) {
          explanation += '⚠️ Risky capture - losing material\n';
        } else {
          explanation += '⚖️ Equal capture - trading equal material\n';
        }
      }
      
      if (move.includes('O-O')) {
        explanation += '🏰 CASTLING: Improves king safety and develops rook\n';
      }
      
      // Positional analysis
      if (moveResult.to) {
        const file = moveResult.to.charCodeAt(0) - 97;
        const rank = parseInt(moveResult.to[1]) - 1;
        
        if (file >= 3 && file <= 4 && rank >= 3 && rank <= 4) {
          explanation += '🎯 CENTER CONTROL: Moves to center square\n';
        }
      }
      
      if (moveResult.piece === 'n' || moveResult.piece === 'b') {
        explanation += '♟️ DEVELOPMENT: Develops minor piece\n';
      }
      
      if (moveResult.piece === 'p') {
        if (moveResult.to && moveResult.to[1] === '8') {
          explanation += '👑 PROMOTION: Pawn promotes to queen!\n';
        } else if (Math.abs(parseInt(moveResult.to[1]) - parseInt(moveResult.from[1])) === 2) {
          explanation += '🚀 ADVANCE: Pawn advances two squares\n';
        }
      }
      
      return explanation;
    } catch (error) {
      console.error('Error explaining move:', error);
      return 'Error explaining move. Please try again.';
    }
  }

  // Provide a hint for the current position
  async provideHint(game: Chess, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
    try {
      const bestMove = await getBestMove(game, difficulty);
      const explanation = await this.explainMove(game, bestMove, difficulty);
      
      return `💡 HINT: ${bestMove}\n\n${explanation}`;
    } catch (error) {
      console.error('Error providing hint:', error);
      return 'Error providing hint. Please try again.';
    }
  }

  // Evaluate the overall game
  async evaluateGame(game: Chess, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
    try {
      const evaluation = this.evaluatePosition(game);
      const winningChances = this.calculateWinningChances(evaluation);
      const bestMove = await getBestMove(game, difficulty);
      
      let gameEvaluation = `Game Evaluation: ${evaluation > 0 ? '+' : ''}${evaluation}\n`;
      gameEvaluation += `Winning Chances: ${winningChances}%\n`;
      gameEvaluation += `Best Move: ${bestMove}\n\n`;
      
      if (game.isCheckmate()) {
        gameEvaluation += '🎯 GAME OVER: Checkmate!\n';
      } else if (game.isDraw()) {
        gameEvaluation += '🤝 GAME OVER: Draw\n';
      } else if (game.isCheck()) {
        gameEvaluation += '⚡ Position is in check\n';
      }
      
      // Game phase analysis
      const moveCount = game.history().length;
      if (moveCount < 10) {
        gameEvaluation += '📖 Opening phase\n';
      } else if (moveCount < 30) {
        gameEvaluation += '⚔️ Middlegame phase\n';
      } else {
        gameEvaluation += '🏁 Endgame phase\n';
      }
      
      return gameEvaluation;
    } catch (error) {
      console.error('Error evaluating game:', error);
      return 'Error evaluating game. Please try again.';
    }
  }

  // Calculate winning chances based on evaluation
  private calculateWinningChances(evaluation: number): string {
    const absEval = Math.abs(evaluation);
    
    if (absEval < 50) {
      return '50-50';
    } else if (absEval < 100) {
      return evaluation > 0 ? '60-40' : '40-60';
    } else if (absEval < 200) {
      return evaluation > 0 ? '70-30' : '30-70';
    } else if (absEval < 500) {
      return evaluation > 0 ? '80-20' : '20-80';
    } else {
      return evaluation > 0 ? '90-10' : '10-90';
    }
  }

  // Evaluate position (simplified version)
  private evaluatePosition(game: Chess): number {
    if (game.isCheckmate()) {
      return game.turn() === 'w' ? -10000 : 10000;
    }
    
    if (game.isDraw()) {
      return 0;
    }
    
    let score = 0;
    const board = game.board();
    
    // Material evaluation
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece) {
          const value = PIECE_VALUES[piece.type as keyof typeof PIECE_VALUES] || 0;
          score += piece.color === 'w' ? value * 100 : -value * 100;
        }
      }
    }
    
    return score;
  }

  // Generate move explanation
  private generateMoveExplanation(move: string, game: Chess): string {
    const gameCopy = new Chess(game.fen());
    const moveResult = gameCopy.move(move);
    
    if (!moveResult) return 'Invalid move';
    
    let explanation = '';
    
    if (moveResult.captured) {
      explanation += `Captures ${moveResult.captured}`;
    }
    
    if (gameCopy.isCheck()) {
      explanation += explanation ? ' with check' : 'Gives check';
    }
    
    if (move.includes('O-O')) {
      explanation = 'Castles kingside';
    } else if (move.includes('O-O-O')) {
      explanation = 'Castles queenside';
    }
    
    return explanation || 'Improves position';
  }
}

// Export singleton instance
export const aiService = new ChessAIService();

// Export getAIService function for backward compatibility
export function getAIService() {
  return aiService;
} 