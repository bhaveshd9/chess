import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Target, Lightbulb, ChevronRight as ChessKnight } from 'lucide-react';
import { openingLessons, scenarios, strategicPrinciples } from '../data/learningContent';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

export default function Learn() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [game, setGame] = useState(new Chess());

  const renderOpenings = () => (
    <div className="space-y-6">
      {openingLessons.map((lesson, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-3">{lesson.name}</h3>
          <p className="text-gray-600 mb-4">{lesson.explanation}</p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Key Principles:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {lesson.principles.map((principle, i) => (
                <li key={i} className="text-gray-600">{principle}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => {
              const newGame = new Chess();
              lesson.moves.forEach(move => newGame.move(move));
              setGame(newGame);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Practice Opening
          </button>
        </div>
      ))}
    </div>
  );

  const renderScenarios = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-3">{scenarios[currentScenario].title}</h3>
        <p className="text-gray-600 mb-4">{scenarios[currentScenario].description}</p>
        <div className="mb-4">
          <Chessboard
            position={scenarios[currentScenario].position}
            boardWidth={400}
          />
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Hints:</h4>
          <ul className="list-disc pl-5">
            {scenarios[currentScenario].hints.map((hint, i) => (
              <li key={i} className="text-gray-600">{hint}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setCurrentScenario(prev => Math.max(0, prev - 1))}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            disabled={currentScenario === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentScenario(prev => Math.min(scenarios.length - 1, prev + 1))}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            disabled={currentScenario === scenarios.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderStrategy = () => (
    <div className="space-y-6">
      {strategicPrinciples.map((principle, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-3">{principle.title}</h3>
          <ul className="list-disc pl-5 space-y-2">
            {principle.concepts.map((concept, i) => (
              <li key={i} className="text-gray-600">{concept}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Center</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setSelectedTopic('openings')}
            className={`p-6 rounded-lg shadow-md text-left transition-all ${
              selectedTopic === 'openings'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:shadow-lg'
            }`}
          >
            <Book className="w-8 h-8 mb-3" />
            <h2 className="text-xl font-semibold mb-2">Openings</h2>
            <p className={selectedTopic === 'openings' ? 'text-blue-100' : 'text-gray-600'}>
              Learn classic chess openings and their principles
            </p>
          </button>

          <button
            onClick={() => setSelectedTopic('scenarios')}
            className={`p-6 rounded-lg shadow-md text-left transition-all ${
              selectedTopic === 'scenarios'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:shadow-lg'
            }`}
          >
            <Target className="w-8 h-8 mb-3" />
            <h2 className="text-xl font-semibold mb-2">Tactical Scenarios</h2>
            <p className={selectedTopic === 'scenarios' ? 'text-blue-100' : 'text-gray-600'}>
              Practice common tactical patterns
            </p>
          </button>

          <button
            onClick={() => setSelectedTopic('strategy')}
            className={`p-6 rounded-lg shadow-md text-left transition-all ${
              selectedTopic === 'strategy'
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:shadow-lg'
            }`}
          >
            <Lightbulb className="w-8 h-8 mb-3" />
            <h2 className="text-xl font-semibold mb-2">Strategy</h2>
            <p className={selectedTopic === 'strategy' ? 'text-blue-100' : 'text-gray-600'}>
              Master strategic principles and planning
            </p>
          </button>
        </div>

        {selectedTopic === 'openings' && renderOpenings()}
        {selectedTopic === 'scenarios' && renderScenarios()}
        {selectedTopic === 'strategy' && renderStrategy()}
      </div>
    </div>
  );
}