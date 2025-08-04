// Application initialization
import { storageService } from './storageService';

export const initializeApp = () => {
  // Load initial progress
  const progress = storageService.getProgress();
  console.log('Player progress loaded:', progress);
  
  return {
    hasAI: true, // Local AI is always available
    playerProgress: progress
  };
}; 