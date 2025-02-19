import React from 'react';
import { GameMode, Difficulty } from '../types/chess';
import { Brain, Users, GraduationCap, Lightbulb } from 'lucide-react';

interface GameControlsProps {
  mode: GameMode;
  difficulty: Difficulty;
  isAiAssistEnabled: boolean;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onAiAssistToggle: () => void;
  onReset: () => void;
}

export default function GameControls({
  mode,
  difficulty,
  isAiAssistEnabled,
  onModeChange,
  onDifficultyChange,
  onAiAssistToggle,
  onReset,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange('pvp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            mode === 'pvp' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          <Users size={20} /> PvP
        </button>
        <button
          onClick={() => onModeChange('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            mode === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          <Brain size={20} /> AI
        </button>
        <button
          onClick={() => onModeChange('learning')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            mode === 'learning' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          <GraduationCap size={20} /> Learning
        </button>
      </div>

      {mode === 'ai' && (
        <div className="flex gap-2">
          <button
            onClick={() => onDifficultyChange('easy')}
            className={`px-4 py-2 rounded-md ${
              difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-100'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => onDifficultyChange('medium')}
            className={`px-4 py-2 rounded-md ${
              difficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => onDifficultyChange('hard')}
            className={`px-4 py-2 rounded-md ${
              difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-100'
            }`}
          >
            Hard
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onAiAssistToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isAiAssistEnabled ? 'bg-purple-600 text-white' : 'bg-gray-100'
          }`}
        >
          <Lightbulb size={20} /> AI Assist
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}