import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from '../store/gameStore';
import { getBestMove, getPossibleMoves, calculateNewRating } from '../utils/chessAI';

export default function Game() {
  const navigate = useNavigate();
  const { mode, difficulty, isAiAssistEnabled, playerRating, updateRating } = useGameStore();
  const [game] = useState(new Chess());
  const [highlightSquares, setHighlightSquares] = useState<string[]>([]);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [moveExplanation, setMoveExplanation] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'ai' && game.turn() === 'b') {
      setTimeout(() => {
        const aiMove = getBestMove(game, difficulty, difficulty === 'hard' ? 4 : 3);
        if (aiMove) {
          game.move(aiMove);
          setHighlightSquares([]);
          setPossibleMoves([]);
          
          if (game.isGameOver()) {
            handleGameOver();
          }
        }
      }, 500);
    }
  }, [game.fen(), mode, difficulty]);

  const handleGameOver = () => {
    if (mode === 'ai') {
      const aiRating = difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 1400 : 1800;
      let result = 0.5; // Draw
      if (game.isCheckmate()) {
        result = game.turn() === 'b' ? 1 : 0; // 1 for win, 0 for loss
      }
      const newRating = calculateNewRating(playerRating.rating, aiRating, result);
      updateRating(newRating);
    }
  };

  const onSquareClick = (square: string) => {
    if (mode === 'ai' && game.turn() === 'b') return;

    const moves = getPossibleMoves(game, square);
    setPossibleMoves(moves);
    
    if (difficulty === 'easy') {
      setHighlightSquares(moves);
    }

    if (isAiAssistEnabled) {
      const bestMove = getBestMove(game, 'hard', 4);
      if (bestMove) {
        const move = game.move(bestMove, { sloppy: true });
        if (move) {
          game.undo(); // Undo the move after getting the information
          const from = move.from;
          const to = move.to;
          setHighlightSquares([from, to]);
          setMoveExplanation(`Suggested move: ${move.piece.toUpperCase()} from ${from} to ${to}. ${move.captured ? `Captures ${move.captured.toUpperCase()}.` : ''} ${move.san.includes('+') ? 'Check!' : ''} ${move.san.includes('#') ? 'Checkmate!' : ''}`);
        }
      }
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move) {
        setHighlightSquares([]);
        setPossibleMoves([]);
        setMoveExplanation(null);
        
        if (game.isGameOver()) {
          handleGameOver();
        }
        
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const customSquareStyles = () => {
    const styles: { [square: string]: { backgroundColor: string } } = {};
    
    [...highlightSquares, ...possibleMoves].forEach(square => {
      styles[square] = {
        backgroundColor: highlightSquares.includes(square) 
          ? 'rgba(255, 255, 0, 0.4)' 
          : 'rgba(0, 255, 0, 0.2)'
      };
    });
    
    return styles;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'pvp' ? 'Player vs Player' : mode === 'ai' ? `Playing Against AI (${difficulty})` : 'Learning Mode'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              customSquareStyles={customSquareStyles()}
              boardWidth={600}
            />
          </div>

          <div className="space-y-6">
            {game.isGameOver() && (
              <div className="bg-blue-100 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-800 mb-2">
                  Game Over!
                </h2>
                <p className="text-blue-700">
                  {game.isCheckmate()
                    ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`
                    : game.isDraw()
                    ? `Draw! ${
                        game.isStalemate()
                          ? 'Stalemate'
                          : game.isThreefoldRepetition()
                          ? 'Threefold Repetition'
                          : game.isInsufficientMaterial()
                          ? 'Insufficient Material'
                          : 'Draw'
                      }`
                    : 'Game Over'}
                </p>
                {mode === 'ai' && (
                  <p className="text-blue-700 mt-2">
                    New Rating: {playerRating.rating}
                  </p>
                )}
              </div>
            )}

            {moveExplanation && (
              <div className="bg-purple-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  Move Suggestion
                </h3>
                <p className="text-purple-700">{moveExplanation}</p>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Game Status</h3>
              <p className="text-gray-700">
                Turn: {game.turn() === 'w' ? 'White' : 'Black'}
              </p>
              <p className="text-gray-700">
                Move Number: {Math.floor((game.moveNumber() - 1) / 2) + 1}
              </p>
              {game.isCheck() && (
                <p className="text-red-600 font-semibold">Check!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}