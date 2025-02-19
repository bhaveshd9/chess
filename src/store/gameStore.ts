import { create } from 'zustand';
import { GameMode, Difficulty, PlayerRating } from '../types/chess';

interface GameStore {
  mode: GameMode;
  difficulty: Difficulty;
  isAiAssistEnabled: boolean;
  playerRating: PlayerRating;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setAiAssist: (enabled: boolean) => void;
  updateRating: (newRating: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  mode: 'pvp',
  difficulty: 'medium',
  isAiAssistEnabled: false,
  playerRating: {
    rating: 1200,
    wins: 0,
    losses: 0,
    draws: 0
  },
  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setAiAssist: (enabled) => set({ isAiAssistEnabled: enabled }),
  updateRating: (newRating) => set((state) => ({
    playerRating: {
      ...state.playerRating,
      rating: newRating
    }
  }))
}));