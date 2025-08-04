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
  id: string;
  name: string;
  moves: string[];
  explanation: string;
  principles: string[];
  chapter: number;
  requiredRating?: number;
}

export interface ChessScenario {
  id: string;
  title: string;
  description: string;
  position: string;
  objective: string;
  solution: string[];
  hints: string[];
  chapter: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredRating?: number;
  timeLimit?: number; // in seconds
}

export interface StrategicPrinciple {
  id: string;
  title: string;
  concepts: string[];
  chapter: number;
  examples: string[];
  requiredRating?: number;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  requiredRating: number;
  lessons: string[];
  scenarios: string[];
  principles: string[];
  password: string; // Universal password for this chapter
}

export interface UserProgress {
  currentChapter: number;
  completedLessons: string[];
  completedScenarios: string[];
  completedPrinciples: string[];
  chapterPasswords: string[];
  totalScore: number;
  averageTime: number;
  hintsUsed: number;
  lastPlayed: string;
}

export interface LessonAttempt {
  lessonId: string;
  completed: boolean;
  timeTaken: number;
  hintsUsed: number;
  attempts: number;
  lastAttempted: string;
}

export interface ChapterProgress {
  chapterId: number;
  completed: boolean;
  lessonsCompleted: number;
  totalLessons: number;
  scenariosCompleted: number;
  totalScenarios: number;
  principlesCompleted: number;
  totalPrinciples: number;
  totalTime: number;
  unlocked: boolean;
}