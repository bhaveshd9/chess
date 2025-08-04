import { create } from 'zustand';
import { GameMode, Difficulty, PlayerRating } from '../types/chess';
import { storageService, PlayerProgress } from '../utils/storageService';

interface GameStore {
  mode: GameMode;
  difficulty: Difficulty;
  isAiAssistEnabled: boolean;
  playerProgress: PlayerProgress;
  isLoading: boolean;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setAiAssist: (enabled: boolean) => void;
  updateProgress: (updates: Partial<PlayerProgress>) => void;
  loadProgress: () => void;
  saveGameResult: (result: 'win' | 'loss' | 'draw', moves: string[], aiAnalysis?: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  mode: 'pvp',
  difficulty: 'medium',
  isAiAssistEnabled: false,
  playerProgress: storageService.getProgress(),
  isLoading: false,

  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setAiAssist: (enabled) => set({ isAiAssistEnabled: enabled }),
  
  updateProgress: (updates) => {
    const current = get().playerProgress;
    const updated = { ...current, ...updates };
    
    // Update best rating if current rating is higher
    if (updates.rating && updates.rating > current.bestRating) {
      updated.bestRating = updates.rating;
    }
    
    storageService.updateProgress(updates);
    set({ playerProgress: updated });
  },

  loadProgress: () => {
    set({ isLoading: true });
    const progress = storageService.getProgress();
    set({ playerProgress: progress, isLoading: false });
  },

  saveGameResult: (result, moves, aiAnalysis) => {
    const current = get().playerProgress;
    const ratingChange = result === 'win' ? 10 : result === 'loss' ? -10 : 0;
    const newRating = Math.max(800, current.rating + ratingChange);
    
    const updates: Partial<PlayerProgress> = {
      rating: newRating,
      gamesPlayed: current.gamesPlayed + 1,
      lastGameDate: new Date().toISOString()
    };

    if (result === 'win') updates.wins = current.wins + 1;
    else if (result === 'loss') updates.losses = current.losses + 1;
    else updates.draws = current.draws + 1;

    get().updateProgress(updates);

    // Save game to history
    storageService.saveGame({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mode: get().mode,
      difficulty: get().mode === 'ai' ? get().difficulty : undefined,
      result,
      moves,
      aiAnalysis,
      ratingChange
    });
  },

  resetProgress: () => {
    storageService.resetProgress();
    const progress = storageService.getProgress();
    set({ playerProgress: progress });
  }
}));