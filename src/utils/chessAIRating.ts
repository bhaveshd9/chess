import { Chess } from 'chess.js';
import { getBestMove } from './chessAI';

export interface AIRating {
  overall: number;
  opening: number;
  middlegame: number;
  endgame: number;
  tactical: number;
  positional: number;
  speed: number;
  consistency: number;
  details: {
    openingMoves: string[];
    tacticalAccuracy: number;
    positionalUnderstanding: number;
    endgamePlay: number;
    averageMoveTime: number;
    moveQualityDistribution: Record<string, number>;
  };
}

// Rating categories and weights
const RATING_WEIGHTS = {
  opening: 0.15,
  middlegame: 0.25,
  endgame: 0.15,
  tactical: 0.20,
  positional: 0.15,
  speed: 0.05,
  consistency: 0.05
};

// Strong opening moves that indicate good play
const STRONG_OPENING_MOVES = ['e4', 'd4', 'Nf3', 'c4', 'Nc3', 'e3', 'd3', 'Bc4', 'Bf4', 'O-O'];

// Tactical move patterns
const TACTICAL_PATTERNS = {
  checkmate: 100,
  check: 10,
  capture: 8,
  fork: 15,
  pin: 12,
  skewer: 12,
  discovered_attack: 10
};

// Positional move patterns
const POSITIONAL_PATTERNS = {
  center_control: 5,
  development: 4,
  castling: 6,
  pawn_structure: 3,
  king_safety: 5,
  piece_coordination: 4
};

export async function rateChessAI(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<AIRating> {
  console.log('🎯 Starting Chess AI Rating Assessment...\n');
  
  const startTime = Date.now();
  const results = {
    openingMoves: [] as string[],
    tacticalMoves: 0,
    positionalMoves: 0,
    totalMoves: 0,
    moveTimes: [] as number[],
    moveQualities: {} as Record<string, number>,
    endgameAccuracy: 0,
    consistencyScore: 0
  };

  // Test 1: Opening Assessment
  console.log('📊 Testing Opening Play...');
  const openingGame = new Chess();
  for (let i = 0; i < 6; i++) {
    const moveStart = Date.now();
    const move = await getBestMove(openingGame, difficulty);
    const moveTime = Date.now() - moveStart;
    
    if (move) {
      results.openingMoves.push(move);
      results.totalMoves++;
      results.moveTimes.push(moveTime);
      
      // Rate opening move quality
      if (STRONG_OPENING_MOVES.includes(move)) {
        results.tacticalMoves += 10;
      }
      
      openingGame.move(move);
    }
  }
  
  // Test 2: Middlegame Assessment
  console.log('📊 Testing Middlegame Play...');
  const middlegameGame = new Chess();
  // Create a typical middlegame position
  middlegameGame.move('e4');
  middlegameGame.move('e5');
  middlegameGame.move('Nf3');
  middlegameGame.move('Nc6');
  middlegameGame.move('Bc4');
  middlegameGame.move('Bc5');
  middlegameGame.move('O-O');
  middlegameGame.move('Nf6');
  middlegameGame.move('d3');
  middlegameGame.move('O-O');
  
  for (let i = 0; i < 10; i++) {
    const moveStart = Date.now();
    const move = await getBestMove(middlegameGame, difficulty);
    const moveTime = Date.now() - moveStart;
    
    if (move) {
      results.totalMoves++;
      results.moveTimes.push(moveTime);
      
      // Analyze move quality
      const moveObj = middlegameGame.move(move);
      if (moveObj) {
        if (middlegameGame.isCheckmate()) {
          results.tacticalMoves += TACTICAL_PATTERNS.checkmate;
        } else if (middlegameGame.isCheck()) {
          results.tacticalMoves += TACTICAL_PATTERNS.check;
        } else if (moveObj.captured) {
          results.tacticalMoves += TACTICAL_PATTERNS.capture;
        } else if (move.includes('O-O')) {
          results.positionalMoves += POSITIONAL_PATTERNS.castling;
        } else if (move.match(/^[a-h][4-5]$/)) {
          results.positionalMoves += POSITIONAL_PATTERNS.center_control;
        } else if (move.match(/^N[a-h][1-8]$/)) {
          results.positionalMoves += POSITIONAL_PATTERNS.development;
        }
      }
    }
  }
  
  // Test 3: Endgame Assessment
  console.log('📊 Testing Endgame Play...');
  const endgameGame = new Chess('8/8/8/8/8/8/4K3/4k3 w - - 0 1');
  for (let i = 0; i < 5; i++) {
    const moveStart = Date.now();
    const move = await getBestMove(endgameGame, difficulty);
    const moveTime = Date.now() - moveStart;
    
    if (move) {
      results.totalMoves++;
      results.moveTimes.push(moveTime);
      results.endgameAccuracy += 20; // Basic endgame moves
      
      endgameGame.move(move);
    }
  }
  
  // Test 4: Tactical Assessment
  console.log('📊 Testing Tactical Awareness...');
  const tacticalTests = [
    // Hanging piece test
    async () => {
      const game = new Chess();
      game.move('e4'); game.move('e5'); game.move('Nf3'); game.move('Nc6');
      game.move('Bc4'); game.move('Nf6'); game.move('Nc3'); game.move('d6');
      game.move('d3'); game.move('Be7'); game.move('O-O'); game.move('O-O');
      game.move('Ng5'); game.move('h6'); game.move('Nxf7');
      return await getBestMove(game, difficulty);
    },
    // Checkmate test
    async () => {
      const game = new Chess('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
      return await getBestMove(game, difficulty);
    }
  ];
  
  for (const test of tacticalTests) {
    const moveStart = Date.now();
    const move = await test();
    const moveTime = Date.now() - moveStart;
    
    if (move) {
      results.totalMoves++;
      results.moveTimes.push(moveTime);
      results.tacticalMoves += 15; // Tactical test bonus
    }
  }
  
  // Calculate ratings
  const averageMoveTime = results.moveTimes.reduce((a, b) => a + b, 0) / results.moveTimes.length;
  const openingScore = Math.min(100, (results.openingMoves.filter(m => STRONG_OPENING_MOVES.includes(m)).length / results.openingMoves.length) * 100);
  const tacticalScore = Math.min(100, (results.tacticalMoves / (results.totalMoves * 10)) * 100);
  const positionalScore = Math.min(100, (results.positionalMoves / (results.totalMoves * 5)) * 100);
  const endgameScore = Math.min(100, results.endgameAccuracy);
  const speedScore = Math.max(0, 100 - (averageMoveTime / 100));
  const consistencyScore = Math.min(100, (results.totalMoves / 25) * 100);
  
  const overallRating = Math.round(
    openingScore * RATING_WEIGHTS.opening +
    (tacticalScore + positionalScore) / 2 * RATING_WEIGHTS.middlegame +
    endgameScore * RATING_WEIGHTS.endgame +
    tacticalScore * RATING_WEIGHTS.tactical +
    positionalScore * RATING_WEIGHTS.positional +
    speedScore * RATING_WEIGHTS.speed +
    consistencyScore * RATING_WEIGHTS.consistency
  );
  
  const totalTime = Date.now() - startTime;
  
  console.log('\n📊 AI Rating Results:');
  console.log('====================');
  console.log(`Overall Rating: ${overallRating}/100`);
  console.log(`Opening: ${Math.round(openingScore)}/100`);
  console.log(`Middlegame: ${Math.round((tacticalScore + positionalScore) / 2)}/100`);
  console.log(`Endgame: ${Math.round(endgameScore)}/100`);
  console.log(`Tactical: ${Math.round(tacticalScore)}/100`);
  console.log(`Positional: ${Math.round(positionalScore)}/100`);
  console.log(`Speed: ${Math.round(speedScore)}/100`);
  console.log(`Consistency: ${Math.round(consistencyScore)}/100`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`Average Move Time: ${Math.round(averageMoveTime)}ms`);
  
  return {
    overall: overallRating,
    opening: Math.round(openingScore),
    middlegame: Math.round((tacticalScore + positionalScore) / 2),
    endgame: Math.round(endgameScore),
    tactical: Math.round(tacticalScore),
    positional: Math.round(positionalScore),
    speed: Math.round(speedScore),
    consistency: Math.round(consistencyScore),
    details: {
      openingMoves: results.openingMoves,
      tacticalAccuracy: Math.round(tacticalScore),
      positionalUnderstanding: Math.round(positionalScore),
      endgamePlay: Math.round(endgameScore),
      averageMoveTime: Math.round(averageMoveTime),
      moveQualityDistribution: {
        tactical: results.tacticalMoves,
        positional: results.positionalMoves,
        total: results.totalMoves
      }
    }
  };
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).rateChessAI = rateChessAI;
  console.log('🎯 Chess AI Rating system loaded!');
  console.log('Run "rateChessAI()" to get a comprehensive rating.');
} 