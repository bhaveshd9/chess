import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from '../store/gameStore';
import { getBestMove } from '../utils/chessAI';
import { getAIService } from '../utils/aiService';
import { Brain, Lightbulb, RotateCcw, Home, Loader2, Target, TrendingUp } from 'lucide-react';

export default function Game() {
  const navigate = useNavigate();
  const { 
    mode, 
    difficulty, 
    isAiAssistEnabled, 
    playerProgress, 
    saveGameResult,
    setAiAssist 
  } = useGameStore();
  
  const [game] = useState(new Chess());
  const [highlightSquares, setHighlightSquares] = useState<string[]>([]);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [moveExplanation, setMoveExplanation] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAiAssistLoading, setIsAiAssistLoading] = useState(false);
  const [gameMoves, setGameMoves] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{from: string, to: string, move: string} | null>(null);
  const [isNewGame, setIsNewGame] = useState(true);
  const [winningChances, setWinningChances] = useState<{white: number, black: number, draw: number} | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // AI turn effect
  useEffect(() => {
    if (mode === 'ai' && game.turn() === 'b' && !game.isGameOver()) {
      console.log('AI turn - calculating move...', { mode, difficulty, fen: game.fen() });
      
      // Show loading state
      setIsAiThinking(true);
      setAiSuggestion(null);
      setMoveExplanation(null);
      setAiAnalysis(null);
      setWinningChances(null);
      
      const timeoutId = setTimeout(async () => {
        try {
          const aiMove = await getBestMove(game, difficulty);
          console.log('AI calculated move:', aiMove);
        if (aiMove) {
          const move = game.move(aiMove);
            console.log('AI made move:', move);
          setGameMoves(prev => [...prev, aiMove]);
          setHighlightSquares([]);
          setPossibleMoves([]);
            setSelectedSquare(null);
            setAiSuggestion(null);
            setMoveExplanation(null);
            setAiAnalysis(null);
            setWinningChances(null);
          if (game.isGameOver()) {
            handleGameOver();
            }
          } else {
            console.error('AI returned no move');
          }
        } catch (error) {
          console.error('Error in AI move calculation:', error);
        } finally {
          setIsAiThinking(false);
        }
      }, 100); // Reduced from 300ms to 100ms for instant response
      return () => {
        clearTimeout(timeoutId);
        setIsAiThinking(false);
      };
    }
  }, [game.fen(), mode, difficulty]);

  const handleGameOver = () => {
    let result: 'win' | 'loss' | 'draw' = 'draw';
    
    if (game.isCheckmate()) {
      // If it's checkmate, the side that just moved won
      // game.turn() returns whose turn it is now (the loser)
      result = game.turn() === 'w' ? 'loss' : 'win';
    } else if (game.isDraw()) {
      result = 'draw';
    } else if (game.isStalemate()) {
      result = 'draw';
    } else if (game.isThreefoldRepetition()) {
      result = 'draw';
    } else if (game.isInsufficientMaterial()) {
      result = 'draw';
    }
    
    console.log('Game over - Result:', result, 'Turn:', game.turn(), 'Checkmate:', game.isCheckmate(), 'Draw:', game.isDraw());
    saveGameResult(result, gameMoves, '');
  };

  // Calculate winning chances based on position evaluation
  const calculateWinningChances = (evaluation: number) => {
    // Convert evaluation to winning probabilities
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x / 2));
    const whiteWinProb = sigmoid(evaluation);
    const blackWinProb = sigmoid(-evaluation);
    const drawProb = Math.max(0, 1 - whiteWinProb - blackWinProb);
    
    return {
      white: Math.round(whiteWinProb * 100),
      black: Math.round(blackWinProb * 100),
      draw: Math.round(drawProb * 100)
    };
  };

  // Analyze Position - Provides detailed position analysis with winning chances
  const analyzePosition = async () => {
    if (isAnalyzing || isNewGame) return;
    
    console.log('=== analyzePosition START ===');
    console.log('Is analyzing:', isAnalyzing);
    console.log('Is new game:', isNewGame);
    
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setWinningChances(null);
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI analysis timeout')), 5000)
      );
      
      const analysisPromise = (async () => {
        console.log('Getting AI service...');
      const aiService = getAIService();
        console.log('AI service obtained');
        
      const playerLevel = playerProgress.rating < 1000 ? 'beginner' : 
                         playerProgress.rating < 1500 ? 'intermediate' : 'advanced';
        console.log('Player level:', playerLevel);
        console.log('Current FEN:', game.fen());
      
        console.log('Calling AI service analyzePosition...');
              const analysis = await aiService.analyzePosition(game, difficulty);
        console.log('AI analysis received:', analysis);
        
        console.log('Setting AI analysis...');
      setAiAnalysis(analysis);
        
        // Calculate winning chances
        console.log('Calculating winning chances...');
        const chances = calculateWinningChances(0); // Simplified for now
        console.log('Winning chances calculated:', chances);
        setWinningChances(chances);
        
        // Clear any previous AI suggestions when analyzing
        console.log('Clearing previous AI suggestions...');
        setAiSuggestion(null);
        setMoveExplanation(null);
      })();
      
      await Promise.race([analysisPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to analyze position:', error);
      setAiAnalysis(null);
      setWinningChances(null);
    } finally {
      console.log('Setting analyzing to false');
      setIsAnalyzing(false);
      console.log('=== analyzePosition END ===');
    }
  };

  // Get AI Move Suggestion - Provides specific move recommendation
  const getAIMoveSuggestion = async () => {
    if (isAiAssistLoading || isNewGame) return;
    
    console.log('=== getAIMoveSuggestion START ===');
    console.log('AI Assist loading:', isAiAssistLoading);
    console.log('Is new game:', isNewGame);
    
    setIsAiAssistLoading(true);
    setAiSuggestion(null);
    setMoveExplanation(null);
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI analysis timeout')), 3000)
      );
      
      const analysisPromise = (async () => {
        console.log('Getting AI service...');
        const aiService = getAIService();
        console.log('AI service obtained');
        
        const playerLevel = playerProgress.rating < 1000 ? 'beginner' : 
                           playerProgress.rating < 1500 ? 'intermediate' : 'advanced';
        console.log('Player level:', playerLevel);
        console.log('Current FEN:', game.fen());
        
        console.log('Calling AI service analyzePosition...');
        const analysis = await aiService.analyzePosition(game, difficulty);
        console.log('AI analysis received:', analysis);
        
        // Extract the best move from the analysis
        const moveMatch = analysis.match(/Best Move: ([a-h][1-8][a-h][1-8]|[O-O]+|[O-O-O]+)/);
        if (moveMatch) {
          const bestMove = moveMatch[1];
          console.log('Setting move explanation...');
          setMoveExplanation(analysis);
          
          // Parse the suggested move to get coordinates
          console.log('Parsing suggested move...');
          try {
            const move = game.move(bestMove);
            console.log('Move parsed successfully:', move);
            
            if (move) {
              console.log('Setting AI suggestion...');
              setAiSuggestion({ 
                from: move.from, 
                to: move.to, 
                move: bestMove 
              });
              console.log('Undoing move for parsing...');
              game.undo(); // Undo the move since we just wanted to parse it
              console.log('Move undone successfully');
            }
          } catch (parseError) {
            console.error('Failed to parse AI move:', parseError);
            // Try to parse it manually if the move() method fails
            const moveMatch = bestMove.match(/^([a-h][1-8])([a-h][1-8])/);
            if (moveMatch) {
              setAiSuggestion({ 
                from: moveMatch[1], 
                to: moveMatch[2], 
                move: bestMove 
              });
            }
          }
        } else {
          console.log('No move in analysis');
        }
      })();
      
      await Promise.race([analysisPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      setMoveExplanation('AI analysis timed out. Please try again.');
    } finally {
      console.log('Setting AI assist loading to false');
      setIsAiAssistLoading(false);
      console.log('=== getAIMoveSuggestion END ===');
    }
  };

  const onSquareClick = (square: string) => {
    if (mode === 'ai' && game.turn() === 'b') return;

    const moves = game.moves({ square: square as any });
    setPossibleMoves(moves);
    setSelectedSquare(square);
    
    // Always highlight possible moves in easy mode
    if (difficulty === 'easy') {
      setHighlightSquares([square, ...moves]);
    } else {
      setHighlightSquares([square]);
    }

    // Auto-get AI suggestion when AI Assist is enabled and not in easy mode
    if (isAiAssistEnabled && difficulty !== 'easy' && !isNewGame) {
      getAIMoveSuggestion();
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
        setGameMoves(prev => [...prev, move.san]);
        setHighlightSquares([]);
        setPossibleMoves([]);
        setSelectedSquare(null);
        setMoveExplanation(null);
        setAiSuggestion(null);
        setAiAnalysis(null);
        setWinningChances(null);
        setIsNewGame(false);
        
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

  const customSquareStyles = useMemo(() => {
    const styles: { [square: string]: { backgroundColor: string } } = {};
    
    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.6)'
      };
    }
    
    // Highlight possible moves
    possibleMoves.forEach(square => {
      if (square !== selectedSquare) {
        styles[square] = {
          backgroundColor: 'rgba(0, 255, 0, 0.4)'
        };
      }
    });
    
    // Highlight AI suggestion with different color
    if (aiSuggestion) {
      styles[aiSuggestion.from] = {
        backgroundColor: 'rgba(255, 0, 255, 0.6)' // Purple for AI suggestion
      };
      styles[aiSuggestion.to] = {
        backgroundColor: 'rgba(255, 0, 255, 0.6)' // Purple for AI suggestion
      };
    }
    
    return styles;
  }, [selectedSquare, possibleMoves, aiSuggestion]);

  const resetGame = () => {
    game.reset();
    setGameMoves([]);
    setHighlightSquares([]);
    setPossibleMoves([]);
    setSelectedSquare(null);
    setMoveExplanation(null);
    setAiAnalysis(null);
    setAiSuggestion(null);
    setWinningChances(null);
    setIsNewGame(true);
  };

  // Format move history properly
  const formattedMoves = useMemo(() => {
    const moves = [];
    for (let i = 0; i < gameMoves.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = gameMoves[i];
      const blackMove = gameMoves[i + 1];
      
      moves.push({
        number: moveNumber,
        white: whiteMove,
        black: blackMove
      });
    }
    return moves;
  }, [gameMoves]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'pvp' ? 'Player vs Player' : `Playing Against AI (${difficulty})`}
          </h1>
          <div className="flex items-center gap-3">
              <button
                onClick={() => setAiAssist(!isAiAssistEnabled)}
              disabled={isNewGame}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isAiAssistEnabled ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
              <Lightbulb size={18} />
                AI Assist
              </button>
              
              <button
                onClick={analyzePosition}
              disabled={isAnalyzing || isNewGame}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
              
              <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
              <RotateCcw size={18} />
              New Game
              </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <Home size={18} />
              Home
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Chessboard */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
                  customSquareStyles={customSquareStyles}
                  boardWidth={Math.min(window.innerWidth * 0.6, 600)}
            />
          </div>

              {/* AI Suggestion Indicator */}
              {aiSuggestion && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-2 rounded-lg">
                    <Lightbulb size={16} />
                    <span className="text-sm font-medium">
                      AI Suggestion: {aiSuggestion.move}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Loading Indicator */}
              {(isAnalyzing || isAiAssistLoading) && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm font-medium">
                      {isAnalyzing ? 'Analyzing position...' : 'Getting AI suggestion...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Game Status */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Game Status
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Turn:</span> {game.turn() === 'w' ? 'White' : 'Black'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Mode:</span> {mode === 'ai' ? 'vs AI' : 'vs Player'}
                </p>
                {mode === 'ai' && (
                  <p className="text-sm">
                    <span className="font-medium">Difficulty:</span> {difficulty}
                  </p>
                )}
                {isAiThinking && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">AI is thinking...</span>
                  </div>
                )}
                {game.isCheck() && (
                  <p className="text-red-600 font-medium">Check!</p>
                )}
                {game.isCheckmate() && (
                  <p className="text-red-600 font-bold">Checkmate!</p>
                )}
                {game.isDraw() && (
                  <p className="text-yellow-600 font-medium">Draw!</p>
                )}
              </div>
            </div>

            {/* Winning Chances */}
            {winningChances && (
              <div className="bg-green-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Target size={18} />
                  Winning Chances
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">White:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${winningChances.white}%` }}
                        ></div>
                      </div>
                      <span className="text-green-800 font-medium">{winningChances.white}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Black:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${winningChances.black}%` }}
                        ></div>
                      </div>
                      <span className="text-green-800 font-medium">{winningChances.black}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Draw:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${winningChances.draw}%` }}
                        ></div>
                      </div>
                      <span className="text-green-800 font-medium">{winningChances.draw}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over */}
            {game.isGameOver() && (
              <div className="bg-blue-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Game Over!</h3>
                <p className="text-blue-700 text-sm">
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
              </div>
            )}

            {/* AI Move Suggestion */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                  AI Move Suggestion
                </h3>
              <div className="space-y-2">
                {isAiAssistLoading ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Getting AI suggestion...</span>
                  </div>
                ) : aiSuggestion ? (
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Suggested Move: <span className="font-bold">{aiSuggestion.move}</span>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        From {aiSuggestion.from} to {aiSuggestion.to}
                      </p>
                    </div>
                    {moveExplanation && (
                      <p className="text-sm text-gray-700">{moveExplanation}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={getAIMoveSuggestion}
                      disabled={isNewGame}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Get AI Suggestion
                    </button>
                    {isNewGame && (
                      <p className="text-xs text-gray-500 mt-1">Make a move first</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Position Analysis */}
            {aiAnalysis && (
              <div className="bg-blue-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Position Analysis
                </h3>
                <div className="space-y-3">
                  <div className="text-blue-700 text-sm whitespace-pre-line">
                    {aiAnalysis}
                  </div>
                </div>
              </div>
            )}

            {/* Move History */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Move History</h3>
              <div className="max-h-64 overflow-y-auto">
                {formattedMoves.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">No moves yet</p>
                ) : (
                  <div className="space-y-1">
                    {formattedMoves.map((moveData) => (
                      <div key={moveData.number} className="flex items-center text-sm">
                        <span className="w-8 text-gray-500 font-medium">{moveData.number}.</span>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <span className="text-gray-800">{moveData.white}</span>
                          <span className="text-gray-800">{moveData.black || ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}