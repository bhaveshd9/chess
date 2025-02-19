export type GameMode = 'pvp' | 'ai' | 'learning';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type LearningTopic = 'openings' | 'middlegame' | 'endgame' | 'tactics';

export interface PlayerRating {
  rating: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface GameState {
  fen: string;
  highlightSquares: string[];
  possibleMoves: string[];
  suggestedMove: string | null;
  moveExplanation: string | null;
}

export interface OpeningLesson {
  name: string;
  moves: string[];
  explanation: string;
  principles: string[];
}

export interface ChessScenario {
  title: string;
  description: string;
  position: string;
  objective: string;
  solution: string[];
  hints: string[];
}