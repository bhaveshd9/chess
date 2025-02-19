import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Brain, GraduationCap } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function Home() {
  const navigate = useNavigate();
  const { setMode, setDifficulty, playerRating } = useGameStore();

  const startGame = (mode: 'pvp' | 'ai') => {
    setMode(mode);
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Chess Master</h1>
          <p className="text-xl text-gray-600">Enhance your chess skills and challenge opponents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold">Player vs Player</h2>
            </div>
            <p className="text-gray-600 mb-4">Challenge a friend to a game of chess</p>
            <button
              onClick={() => startGame('pvp')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start PvP Game
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold">Play vs AI</h2>
            </div>
            <p className="text-gray-600 mb-4">Test your skills against the computer</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => {
                  setDifficulty('easy');
                  startGame('ai');
                }}
                className="bg-green-100 text-green-700 py-2 rounded hover:bg-green-200 transition-colors"
              >
                Easy
              </button>
              <button
                onClick={() => {
                  setDifficulty('medium');
                  startGame('ai');
                }}
                className="bg-yellow-100 text-yellow-700 py-2 rounded hover:bg-yellow-200 transition-colors"
              >
                Medium
              </button>
              <button
                onClick={() => {
                  setDifficulty('hard');
                  startGame('ai');
                }}
                className="bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition-colors"
              >
                Hard
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <GraduationCap className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold">Learning Center</h2>
            </div>
            <p className="text-gray-600 mb-4">Master chess principles and strategies</p>
            <button
              onClick={() => navigate('/learn')}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Learning
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-semibold">Your Stats</h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">Rating: <span className="font-semibold text-gray-900">{playerRating.rating}</span></p>
              <p className="text-gray-600">Wins: <span className="font-semibold text-green-600">{playerRating.wins}</span></p>
              <p className="text-gray-600">Losses: <span className="font-semibold text-red-600">{playerRating.losses}</span></p>
              <p className="text-gray-600">Draws: <span className="font-semibold text-gray-600">{playerRating.draws}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}