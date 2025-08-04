import React, { useState } from 'react';
import { storageService } from '../utils/storageService';
import { PlayerProgress } from '../utils/storageService';

export default function TestPanel() {
  const [progress, setProgress] = useState<PlayerProgress>(storageService.getProgress());
  const [testResults, setTestResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = () => {
    setTestResults([]);
    addLog('🧪 Starting lesson completion tests...');

    // Clear all data first
    storageService.clearAllData();
    setProgress(storageService.getProgress());
    addLog('✅ Cleared all data');

    // Test 1: Complete a lesson with high accuracy
    storageService.completeLesson('basic-movement', 95, 120, 1);
    let currentProgress = storageService.getProgress();
    setProgress(currentProgress);
    
    const lesson1Completed = currentProgress.userProgress.completedLessons.includes('basic-movement');
    addLog(`Test 1 - Lesson completion (95%): ${lesson1Completed ? '✅ PASSED' : '❌ FAILED'}`);

    // Test 2: Complete another lesson with medium accuracy
    storageService.completeLesson('center-control', 75, 150, 2);
    currentProgress = storageService.getProgress();
    setProgress(currentProgress);
    
    const lesson2Completed = currentProgress.userProgress.completedLessons.includes('center-control');
    addLog(`Test 2 - Lesson completion (75%): ${lesson2Completed ? '✅ PASSED' : '❌ FAILED'}`);

    // Test 3: Complete a third lesson to finish chapter 1
    storageService.completeLesson('piece-value', 85, 100, 0);
    currentProgress = storageService.getProgress();
    setProgress(currentProgress);
    
    const lesson3Completed = currentProgress.userProgress.completedLessons.includes('piece-value');
    addLog(`Test 3 - Lesson completion (85%): ${lesson3Completed ? '✅ PASSED' : '❌ FAILED'}`);

    // Test 4: Check chapter progress
    const chapter1Progress = currentProgress.chapterProgress[1];
    const chapterCompleted = chapter1Progress?.completed;
    addLog(`Test 4 - Chapter 1 completion: ${chapterCompleted ? '✅ PASSED' : '❌ FAILED'}`);
    addLog(`   Lessons completed: ${chapter1Progress?.lessonsCompleted}/${chapter1Progress?.totalLessons}`);

    // Test 5: Try to unlock chapter 2
    const unlocked = storageService.unlockChapter(2, 'OPENING202');
    currentProgress = storageService.getProgress();
    setProgress(currentProgress);
    
    addLog(`Test 5 - Chapter 2 unlock: ${unlocked ? '✅ PASSED' : '❌ FAILED'}`);

    addLog('🎯 All tests completed!');
  };

  const resetProgress = () => {
    storageService.clearAllData();
    setProgress(storageService.getProgress());
    setTestResults([]);
    addLog('🔄 Progress reset');
  };

  const completeRandomLesson = () => {
    const lessons = ['basic-movement', 'center-control', 'piece-value'];
    const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
    const accuracy = Math.floor(Math.random() * 40) + 60; // 60-100%
    
    storageService.completeLesson(randomLesson, accuracy, Math.floor(Math.random() * 200) + 60, Math.floor(Math.random() * 3));
    setProgress(storageService.getProgress());
    addLog(`📚 Completed ${randomLesson} with ${accuracy}% accuracy`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🧪 Test Panel</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Controls</h3>
          
          <button
            onClick={runTests}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            🧪 Run All Tests
          </button>
          
          <button
            onClick={resetProgress}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            🔄 Reset Progress
          </button>
          
          <button
            onClick={completeRandomLesson}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            📚 Complete Random Lesson
          </button>
        </div>

        {/* Current Progress */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Progress</h3>
          
          <div className="text-sm space-y-2">
            <div>Current Chapter: {progress.userProgress.currentChapter}</div>
            <div>Completed Lessons: {progress.userProgress.completedLessons.length}</div>
            <div>Completed Scenarios: {progress.userProgress.completedScenarios.length}</div>
            <div>Completed Principles: {progress.userProgress.completedPrinciples.length}</div>
            
            <div className="mt-4">
              <h4 className="font-semibold">Chapter Progress:</h4>
              {Object.entries(progress.chapterProgress).map(([chapterId, chapter]) => (
                <div key={chapterId} className="ml-2">
                  Chapter {chapterId}: {chapter.completed ? '✅' : '⏳'} 
                  ({chapter.lessonsCompleted}/{chapter.totalLessons} lessons)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Test Results</h3>
        <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
        <details className="bg-gray-50 p-4 rounded">
          <summary className="cursor-pointer font-semibold">Raw Progress Data</summary>
          <pre className="text-xs mt-2 overflow-x-auto">
            {JSON.stringify(progress, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
} 