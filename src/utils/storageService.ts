// Local Storage Service for Chess Progress
import { UserProgress, LessonAttempt, ChapterProgress } from '../types/chess';

export interface PlayerProgress {
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  lessonsCompleted: string[];
  puzzlesSolved: number;
  totalPuzzles: number;
  averageMoveTime: number;
  bestRating: number;
  lastGameDate: string;
  // Enhanced progress tracking
  userProgress: UserProgress;
  lessonAttempts: { [lessonId: string]: LessonAttempt };
  chapterProgress: { [chapterId: number]: ChapterProgress };
}

export interface GameHistory {
  id: string;
  date: string;
  mode: string;
  difficulty?: string;
  result: 'win' | 'loss' | 'draw';
  moves: string[];
  aiAnalysis?: string;
  ratingChange: number;
}

export interface LearningProgress {
  openingLessons: { [key: string]: boolean };
  tacticalScenarios: { [key: string]: boolean };
  strategicPrinciples: { [key: string]: boolean };
  practiceSessions: number;
  totalPracticeTime: number;
}

class StorageService {
  private readonly PROGRESS_KEY = 'chess_progress';
  private readonly HISTORY_KEY = 'chess_history';
  private readonly LEARNING_KEY = 'chess_learning';
  private readonly SETTINGS_KEY = 'chess_settings';

  // Player Progress
  saveProgress(progress: PlayerProgress): void {
    try {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  getProgress(): PlayerProgress {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }

    // Default progress
    return {
      rating: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
      lessonsCompleted: [],
      puzzlesSolved: 0,
      totalPuzzles: 0,
      averageMoveTime: 0,
      bestRating: 1200,
      lastGameDate: new Date().toISOString(),
                       userProgress: {
           currentChapter: 1,
           completedLessons: [],
           completedScenarios: [],
           completedPrinciples: [],
           chapterPasswords: [], // No passwords needed - first chapter unlocked by default
           totalScore: 0,
           averageTime: 0,
           hintsUsed: 0,
           lastPlayed: new Date().toISOString()
         },
      lessonAttempts: {},
      chapterProgress: {
        1: {
          chapterId: 1,
          completed: false,
          lessonsCompleted: 0,
          totalLessons: 3,
          scenariosCompleted: 0,
          totalScenarios: 2,
          principlesCompleted: 0,
          totalPrinciples: 1,
          averageAccuracy: 0,
          totalTime: 0,
          unlocked: true
        }
      }
    };
  }

  updateProgress(updates: Partial<PlayerProgress>): void {
    const current = this.getProgress();
    const updated = { ...current, ...updates };
    
    // Update best rating if current rating is higher
    if (updates.rating && updates.rating > current.bestRating) {
      updated.bestRating = updates.rating;
    }
    
    this.saveProgress(updated);
  }

  // Game History
  saveGame(game: GameHistory): void {
    try {
      const history = this.getGameHistory();
      history.unshift(game);
      
      // Keep only last 50 games
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  getGameHistory(): GameHistory[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load game history:', error);
      return [];
    }
  }

  // Learning Progress
  saveLearningProgress(progress: LearningProgress): void {
    try {
      localStorage.setItem(this.LEARNING_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save learning progress:', error);
    }
  }

  getLearningProgress(): LearningProgress {
    try {
      const stored = localStorage.getItem(this.LEARNING_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load learning progress:', error);
    }

    return {
      openingLessons: {},
      tacticalScenarios: {},
      strategicPrinciples: {},
      practiceSessions: 0,
      totalPracticeTime: 0
    };
  }

  markLessonCompleted(lessonType: string, lessonId: string): void {
    const progress = this.getLearningProgress();
    
    switch (lessonType) {
      case 'opening':
        progress.openingLessons[lessonId] = true;
        break;
      case 'tactical':
        progress.tacticalScenarios[lessonId] = true;
        break;
      case 'strategic':
        progress.strategicPrinciples[lessonId] = true;
        break;
    }
    
    this.saveLearningProgress(progress);
  }

  // Settings
  saveSettings(settings: any): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  getSettings(): any {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {};
    }
  }

  // Statistics
  getStatistics() {
    const progress = this.getProgress();
    const history = this.getGameHistory();
    const learning = this.getLearningProgress();

    const recentGames = history.slice(0, 10);
    const winRate = progress.gamesPlayed > 0 ? (progress.wins / progress.gamesPlayed) * 100 : 0;
    
    const completedLessons = Object.values(learning.openingLessons).filter(Boolean).length +
                            Object.values(learning.tacticalScenarios).filter(Boolean).length +
                            Object.values(learning.strategicPrinciples).filter(Boolean).length;

    return {
      ...progress,
      winRate: Math.round(winRate * 100) / 100,
      completedLessons,
      recentGames,
      totalPracticeTime: learning.totalPracticeTime
    };
  }

  // Enhanced Learning Progress Methods
  completeLesson(lessonId: string, timeTaken: number, hintsUsed: number): void {
    const progress = this.getProgress();
    
    // Update lesson attempts
    if (!progress.lessonAttempts[lessonId]) {
      progress.lessonAttempts[lessonId] = {
        lessonId,
        completed: false,
        timeTaken: 0,
        hintsUsed: 0,
        attempts: 0,
        lastAttempted: new Date().toISOString()
      };
    }
    
    const attempt = progress.lessonAttempts[lessonId];
    attempt.attempts += 1;
    attempt.timeTaken = timeTaken;
    attempt.hintsUsed = hintsUsed;
    attempt.lastAttempted = new Date().toISOString();
    
    // Simple completion: Complete on first attempt or after 3 attempts
    const shouldComplete = attempt.attempts === 1 || attempt.attempts >= 3;
    
    if (shouldComplete) {
      attempt.completed = true;
      if (!progress.userProgress.completedLessons.includes(lessonId)) {
        progress.userProgress.completedLessons.push(lessonId);
      }
    }
    
    this.saveProgress(progress);
    this.updateChapterProgress();
  }

  completeScenario(scenarioId: string, accuracy: number, timeTaken: number, hintsUsed: number): void {
    const progress = this.getProgress();
    
    if (!progress.userProgress.completedScenarios.includes(scenarioId)) {
      progress.userProgress.completedScenarios.push(scenarioId);
    }
    
    progress.userProgress.totalScore += accuracy;
    progress.userProgress.hintsUsed += hintsUsed;
    progress.userProgress.lastPlayed = new Date().toISOString();
    
    this.saveProgress(progress);
    this.updateChapterProgress();
  }

  completePrinciple(principleId: string): void {
    const progress = this.getProgress();
    
    if (!progress.userProgress.completedPrinciples.includes(principleId)) {
      progress.userProgress.completedPrinciples.push(principleId);
    }
    
    this.saveProgress(progress);
    this.updateChapterProgress();
  }

  async unlockChapter(chapterId: number, password?: string): Promise<boolean> {
    const progress = this.getProgress();
    
    if (password) {
      // Check if password is correct
      try {
        const { chapters } = await import('../data/learningContent');
        const chapter = chapters.find((c: any) => c.id === chapterId);
      
              if (chapter && chapter.password === password) {
          if (!progress.userProgress.chapterPasswords.includes(password)) {
            progress.userProgress.chapterPasswords.push(password);
          }
          progress.userProgress.currentChapter = Math.max(progress.userProgress.currentChapter, chapterId);
          this.saveProgress(progress);
          this.updateChapterProgress();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking chapter password:', error);
        return false;
      }
    } else {
      // Auto-unlock based on rating and previous chapter completion
      if (chapterId <= progress.userProgress.currentChapter + 1) {
        progress.userProgress.currentChapter = Math.max(progress.userProgress.currentChapter, chapterId);
        this.saveProgress(progress);
        this.updateChapterProgress();
        return true;
      }
      return false;
    }
  }

  private updateChapterProgress(): void {
    const progress = this.getProgress();
    
    import('../data/learningContent')
      .then(({ chapters, openingLessons, scenarios, strategicPrinciples }) => {
        try {
          chapters.forEach((chapter: any) => {
            const chapterLessons = openingLessons.filter((l: any) => l.chapter === chapter.id);
            const chapterScenarios = scenarios.filter((s: any) => s.chapter === chapter.id);
            const chapterPrinciples = strategicPrinciples.filter((p: any) => p.chapter === chapter.id);
            
            const completedLessons = chapterLessons.filter((l: any) => 
              progress.userProgress.completedLessons.includes(l.id)
            ).length;
            
            const completedScenarios = chapterScenarios.filter((s: any) => 
              progress.userProgress.completedScenarios.includes(s.id)
            ).length;
            
            const completedPrinciples = chapterPrinciples.filter((p: any) => 
              progress.userProgress.completedPrinciples.includes(p.id)
            ).length;
            
            const totalLessons = chapterLessons.length;
            const totalScenarios = chapterScenarios.length;
            const totalPrinciples = chapterPrinciples.length;
            
                         // Calculate total time from lesson attempts
             let totalTime = 0;
             let attemptCount = 0;
             
             chapterLessons.forEach((lesson: any) => {
               const attempt = progress.lessonAttempts[lesson.id];
               if (attempt) {
                 totalTime += attempt.timeTaken;
                 attemptCount++;
               }
             });
            
            const isCompleted = completedLessons === totalLessons && 
                               completedScenarios === totalScenarios && 
                               completedPrinciples === totalPrinciples &&
                               totalLessons > 0; // Ensure there are actually lessons to complete
            
            const isUnlocked = chapter.id === 1 || 
                              progress.userProgress.currentChapter >= chapter.id ||
                              progress.userProgress.chapterPasswords.includes(chapter.password);
            
                         progress.chapterProgress[chapter.id] = {
               chapterId: chapter.id,
               completed: isCompleted,
               lessonsCompleted: completedLessons,
               totalLessons,
               scenariosCompleted: completedScenarios,
               totalScenarios,
               principlesCompleted: completedPrinciples,
               totalPrinciples,
               totalTime,
               unlocked: isUnlocked
             };
          });
          
          this.saveProgress(progress);
        } catch (error) {
          console.error('Error updating chapter progress:', error);
        }
      })
      .catch((error) => {
        console.error('Error importing learning content:', error);
      });
  }

  resetProgress(): void {
    const progress = this.getProgress();
         progress.userProgress = {
       currentChapter: 1,
       completedLessons: [],
       completedScenarios: [],
       completedPrinciples: [],
       chapterPasswords: [],
       totalScore: 0,
       averageTime: 0,
       hintsUsed: 0,
       lastPlayed: new Date().toISOString()
     };
    progress.lessonAttempts = {};
    progress.chapterProgress = {
      1: {
        chapterId: 1,
        completed: false,
        lessonsCompleted: 0,
        totalLessons: 3,
        scenariosCompleted: 0,
        totalScenarios: 2,
        principlesCompleted: 0,
        totalPrinciples: 1,
        averageAccuracy: 0,
        totalTime: 0,
        unlocked: true
      }
    };
    this.saveProgress(progress);
  }

  // Public method to force update chapter progress
  forceUpdateChapterProgress(): void {
    this.updateChapterProgress();
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    localStorage.removeItem(this.PROGRESS_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
    localStorage.removeItem(this.LEARNING_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

export const storageService = new StorageService(); 