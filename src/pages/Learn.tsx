import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Target, 
  Lightbulb, 
  Lock, 
  CheckCircle, 
  Play, 
  Star,
  Trophy,
  Clock,
  ArrowRight,
  ArrowLeft,
  Home,
  RotateCcw,
  Key,
  Map
} from 'lucide-react';
import { chapters, openingLessons, scenarios, strategicPrinciples } from '../data/learningContent';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { storageService } from '../utils/storageService';

export default function Learn() {
  const navigate = useNavigate();
  const [view, setView] = useState<'map' | 'chapter'>('map');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'lesson' | 'scenario' | 'principle' | null>(null);
  const [progress, setProgress] = useState(storageService.getProgress());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPracticing, setIsPracticing] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [startTime, setStartTime] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [movesMade, setMovesMade] = useState<string[]>([]);
  const [correctMoves, setCorrectMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialSteps, setTutorialSteps] = useState<any[]>([]);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  useEffect(() => {
    setProgress(storageService.getProgress());
  }, []);

  const currentChapter = chapters.find(c => c.id === selectedChapter);
  const chapterProgress = progress.chapterProgress[selectedChapter];

  const handleChapterSelect = (chapterId: number) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const isUnlocked = progress.userProgress.currentChapter >= chapter.id || 
                      progress.userProgress.chapterPasswords.includes(chapter.password);
    
    if (isUnlocked) {
      setSelectedChapter(chapterId);
      setView('chapter');
      setSelectedContent(null);
      setContentType(null);
    } else {
      setSelectedChapter(chapterId);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordUnlock = async (chapterId: number, password: string) => {
    const success = await storageService.unlockChapter(chapterId, password);
    if (success) {
      setProgress(storageService.getProgress());
      setView('chapter');
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Invalid password');
    }
  };

  const handlePracticeStart = (item: any) => {
    setIsPracticing(true);
    setHintsUsed(0);
    setStartTime(Date.now());
    setCurrentScenario(item);
    setMovesMade([]);
    setCorrectMoves(0);
    setTotalMoves(0);
    setCurrentHint('');
    setShowHint(false);
    
    // Initialize tutorial mode
    setTutorialMode(true);
    setCurrentStep(0);
    const steps = createTutorialSteps(item);
    setTutorialSteps(steps);
    
    if (contentType === 'scenario') {
      setGame(new Chess(item.position));
    } else {
      setGame(new Chess());
    }
  };

  const handleMove = (from: string, to: string) => {
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        setMovesMade(prev => [...prev, move.san]);
        setTotalMoves(prev => prev + 1);
        
        // Check if this is a correct move for scenarios
        if (currentScenario && currentScenario.solution) {
          const currentMoveIndex = movesMade.length;
          if (currentMoveIndex < currentScenario.solution.length) {
            const expectedMove = currentScenario.solution[currentMoveIndex];
            if (move.san === expectedMove) {
              setCorrectMoves(prev => prev + 1);
            }
          }
        }
        
        // Check if scenario is completed
        if (currentScenario && currentScenario.solution) {
          const isCompleted = currentScenario.solution.every((solMove: string, index: number) => 
            movesMade[index] === solMove
          );
          if (isCompleted) {
            handlePracticeComplete();
          }
        }
        return true; // Move was successful
      }
      return false; // Move was invalid
    } catch (error) {
      console.error('Invalid move:', error);
      return false; // Move was invalid
    }
  };

  const handlePracticeComplete = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Always save progress when tutorial is completed
    if (selectedContent) {
      if (contentType === 'lesson') {
        storageService.completeLesson(selectedContent, timeTaken, hintsUsed);
      } else if (contentType === 'scenario') {
        storageService.completeScenario(selectedContent, 100, timeTaken, hintsUsed);
      } else if (contentType === 'principle') {
        storageService.completePrinciple(selectedContent);
      }
      
      // Force update progress immediately
      const updatedProgress = storageService.getProgress();
      setProgress(updatedProgress);
      
      // Force chapter progress update
      storageService.forceUpdateChapterProgress();
    }
    
    setSummaryData({
      timeTaken,
      hintsUsed,
      correctMoves,
      totalMoves,
      completionRate: totalMoves > 0 ? Math.round((correctMoves / totalMoves) * 100) : 100
    });
    setShowSummary(true);
    setIsPracticing(false);
  };

  const getHint = () => {
    if (!currentScenario) return;
    
    const currentMoveIndex = movesMade.length;
    
    if (currentScenario.solution && currentMoveIndex < currentScenario.solution.length) {
      // Show the next correct move as a hint
      const nextMove = currentScenario.solution[currentMoveIndex];
      setCurrentHint(`Try moving to ${nextMove}`);
    } else if (currentScenario.hints && currentScenario.hints.length > 0) {
      // Show a general hint from the scenario
      const hintIndex = Math.min(hintsUsed, currentScenario.hints.length - 1);
      setCurrentHint(currentScenario.hints[hintIndex]);
    } else {
      // Generic hint
      setCurrentHint("Think about controlling the center and developing your pieces.");
    }
    
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
    
    // Hide hint after 5 seconds
    setTimeout(() => {
      setShowHint(false);
    }, 5000);
  };

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed
      handlePracticeComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTutorialMove = (from: string, to: string) => {
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        const currentStepData = tutorialSteps[currentStep];
        
        if (currentStepData.type === 'move') {
          // Check if this is the expected move
          if (move.san === currentStepData.expectedMove) {
            setCorrectMoves(prev => prev + 1);
            // Move to next step after a short delay
            setTimeout(() => {
              handleNextStep();
            }, 1000);
          } else {
            // Wrong move - show feedback
            setCurrentHint(`That's not quite right. Try ${currentStepData.expectedMove}`);
            setShowHint(true);
            setTimeout(() => setShowHint(false), 3000);
          }
        } else if (currentStepData.allowAnyMove) {
          // Any legal move is acceptable
          setCorrectMoves(prev => prev + 1);
          setTimeout(() => {
            handleNextStep();
          }, 1000);
        }
        
        setTotalMoves(prev => prev + 1);
        setMovesMade(prev => [...prev, move.san]);
      }
      return true;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  };

  const createTutorialSteps = (item: any) => {
    if (contentType === 'lesson') {
      return createLessonTutorial(item);
    } else if (contentType === 'scenario') {
      return createScenarioTutorial(item);
    } else if (contentType === 'principle') {
      return createPrincipleTutorial(item);
    }
    return [];
  };

  const createLessonTutorial = (lesson: any) => {
    const steps = [];
    
    // Introduction step
    steps.push({
      type: 'explanation',
      title: 'Welcome to ' + lesson.name,
      content: lesson.explanation,
      action: 'Click "Next" to continue'
    });

    // Principles step
    if (lesson.principles) {
      steps.push({
        type: 'principles',
        title: 'Key Principles',
        content: lesson.principles,
        action: 'Study these principles, then click "Next"'
      });
    }

    // Practice step
    steps.push({
      type: 'practice',
      title: 'Practice Time',
      content: 'Now let\'s practice what you learned. Make a move on the board.',
      action: 'Make any legal move to continue',
      allowAnyMove: true
    });

    return steps;
  };

  const createScenarioTutorial = (scenario: any) => {
    const steps = [];
    
    // Introduction
    steps.push({
      type: 'explanation',
      title: scenario.title,
      content: scenario.description,
      action: 'Click "Next" to start the scenario'
    });

    // Objective
    steps.push({
      type: 'objective',
      title: 'Your Goal',
      content: scenario.objective,
      action: 'Click "Next" to begin'
    });

    // Hints
    if (scenario.hints) {
      steps.push({
        type: 'hints',
        title: 'Helpful Hints',
        content: scenario.hints,
        action: 'Review these hints, then click "Next"'
      });
    }

    // Solution steps
    if (scenario.solution) {
      scenario.solution.forEach((move: string, index: number) => {
        steps.push({
          type: 'move',
          title: `Move ${index + 1}`,
          content: `Make the move: ${move}`,
          action: `Click on the piece and then the target square to make: ${move}`,
          expectedMove: move,
          moveNumber: index + 1
        });
      });
    }

    return steps;
  };

  const createPrincipleTutorial = (principle: any) => {
    const steps = [];
    
    steps.push({
      type: 'explanation',
      title: principle.title,
      content: 'Let\'s learn about this strategic principle.',
      action: 'Click "Next" to continue'
    });

    steps.push({
      type: 'concepts',
      title: 'Key Concepts',
      content: principle.concepts,
      action: 'Study these concepts, then click "Next"'
    });

    if (principle.examples) {
      steps.push({
        type: 'examples',
        title: 'Examples',
        content: principle.examples,
        action: 'Review these examples, then click "Next"'
      });
    }

    steps.push({
      type: 'practice',
      title: 'Practice Application',
      content: 'Now practice applying this principle. Make a move that follows the principle.',
      action: 'Make a move that demonstrates the principle',
      allowAnyMove: true
    });

    return steps;
  };

  const renderChapterMap = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Learning Journey</h2>
        <p className="text-gray-600">Master chess through structured chapters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter, index) => {
          const isUnlocked = progress.userProgress.currentChapter >= chapter.id || 
                            progress.userProgress.chapterPasswords.includes(chapter.password);
          const isCompleted = progress.chapterProgress[chapter.id]?.completed;
          const chapterProg = progress.chapterProgress[chapter.id];
          
          return (
            <div
              key={chapter.id}
              className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-white hover:shadow-xl cursor-pointer' 
                  : 'bg-gray-100 cursor-not-allowed'
              } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
              onClick={() => handleChapterSelect(chapter.id)}
            >
              {/* Chapter Icon */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 ${
                isUnlocked ? chapter.color : 'bg-gray-400'
              }`}>
                {isUnlocked ? chapter.icon : <Lock size={24} />}
              </div>
              
              {/* Chapter Info */}
              <h3 className="text-xl font-semibold mb-2">{chapter.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{chapter.description}</p>
              
              {/* Progress Bar */}
              {isUnlocked && chapterProg && (
          <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((chapterProg.lessonsCompleted + chapterProg.scenariosCompleted + chapterProg.principlesCompleted) / 
                      (chapterProg.totalLessons + chapterProg.totalScenarios + chapterProg.totalPrinciples) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(chapterProg.lessonsCompleted + chapterProg.scenariosCompleted + chapterProg.principlesCompleted) / 
                          (chapterProg.totalLessons + chapterProg.totalScenarios + chapterProg.totalPrinciples) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Requirements */}
              <div className="text-xs text-gray-500">
                {chapter.requiredRating > 0 && (
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={12} />
                    <span>Rating {chapter.requiredRating}+</span>
                  </div>
                )}
                {!isUnlocked && chapter.id > 1 && (
                  <div className="flex items-center gap-1">
                    <Key size={12} />
                    <span>Complete previous chapter to unlock</span>
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="text-green-500" size={20} />
                </div>
              )}
              
              {/* Connection Line */}
              {index < chapters.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="text-gray-300" size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderChapterContent = () => {
    if (!currentChapter) return null;

    const chapterLessons = openingLessons.filter(l => l.chapter === selectedChapter);
    const chapterScenarios = scenarios.filter(s => s.chapter === selectedChapter);
    const chapterPrinciples = strategicPrinciples.filter(p => p.chapter === selectedChapter);

    if (selectedContent && contentType) {
      return renderContentDetail();
    }

    return (
      <div className="space-y-8">
        {/* Chapter Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${currentChapter.color}`}>
              {currentChapter.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{currentChapter.title}</h2>
              <p className="text-blue-100">{currentChapter.description}</p>
            </div>
          </div>
          
          {/* Chapter Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{chapterProgress?.lessonsCompleted || 0}/{chapterProgress?.totalLessons || 0}</div>
              <div className="text-blue-100 text-sm">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{chapterProgress?.scenariosCompleted || 0}/{chapterProgress?.totalScenarios || 0}</div>
              <div className="text-blue-100 text-sm">Scenarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{chapterProgress?.principlesCompleted || 0}/{chapterProgress?.totalPrinciples || 0}</div>
              <div className="text-blue-100 text-sm">Principles</div>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lessons */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Book className="text-blue-600" size={24} />
              <h3 className="text-xl font-semibold">Lessons</h3>
            </div>
            <p className="text-gray-600 mb-4">Learn fundamental concepts and strategies</p>
            <div className="space-y-3 mb-4">
              {chapterLessons.map((lesson) => {
                const isCompleted = progress.userProgress.completedLessons.includes(lesson.id);
                return (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{lesson.name}</span>
                    {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setContentType('lesson');
                setSelectedContent('list');
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </button>
          </div>

          {/* Scenarios */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-purple-600" size={24} />
              <h3 className="text-xl font-semibold">Scenarios</h3>
            </div>
            <p className="text-gray-600 mb-4">Practice tactical and strategic positions</p>
            <div className="space-y-3 mb-4">
              {chapterScenarios.map((scenario) => {
                const isCompleted = progress.userProgress.completedScenarios.includes(scenario.id);
                return (
                  <div key={scenario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{scenario.title}</span>
                    {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setContentType('scenario');
                setSelectedContent('list');
              }}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Start Practice
            </button>
          </div>

          {/* Principles */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-orange-600" size={24} />
              <h3 className="text-xl font-semibold">Principles</h3>
            </div>
            <p className="text-gray-600 mb-4">Master strategic thinking and planning</p>
            <div className="space-y-3 mb-4">
              {chapterPrinciples.map((principle) => {
                const isCompleted = progress.userProgress.completedPrinciples.includes(principle.id);
                return (
                  <div key={principle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{principle.title}</span>
                    {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => {
                setContentType('principle');
                setSelectedContent('list');
              }}
              className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Study Principles
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContentList = () => {
    if (!contentType || selectedContent !== 'list') return null;

    let items: any[] = [];
    let title = '';
    let color = '';

    switch (contentType) {
      case 'lesson':
        items = openingLessons.filter(l => l.chapter === selectedChapter);
        title = 'Lessons';
        color = 'blue';
        break;
      case 'scenario':
        items = scenarios.filter(s => s.chapter === selectedChapter);
        title = 'Scenarios';
        color = 'purple';
        break;
      case 'principle':
        items = strategicPrinciples.filter(p => p.chapter === selectedChapter);
        title = 'Principles';
        color = 'orange';
        break;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setSelectedContent(null);
              setContentType(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back to Chapter
          </button>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isCompleted = contentType === 'lesson' 
              ? progress.userProgress.completedLessons.includes(item.id)
              : contentType === 'scenario'
              ? progress.userProgress.completedScenarios.includes(item.id)
              : progress.userProgress.completedPrinciples.includes(item.id);

            return (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{item.name || item.title}</h3>
                  {isCompleted && <CheckCircle className="text-green-500" size={16} />}
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {item.explanation || item.description}
                </p>
                <button
                  onClick={() => {
                    setSelectedContent(item.id);
                  }}
                  className={`w-full py-2 rounded-md transition-colors ${
                    color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                    color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                    'bg-orange-600 hover:bg-orange-700'
                  } text-white`}
                >
                  {isCompleted ? 'Review' : 'Start'}
                </button>
    </div>
  );
          })}
        </div>
        </div>
    );
  };

  const renderContentDetail = () => {
    if (!selectedContent || !contentType) return null;

    let item: any = null;
    let title = '';
    let color = '';

    switch (contentType) {
      case 'lesson':
        item = openingLessons.find(l => l.id === selectedContent);
        title = 'Lesson';
        color = 'blue';
        break;
      case 'scenario':
        item = scenarios.find(s => s.id === selectedContent);
        title = 'Scenario';
        color = 'purple';
        break;
      case 'principle':
        item = strategicPrinciples.find(p => p.id === selectedContent);
        title = 'Principle';
        color = 'orange';
        break;
    }

    if (!item) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setSelectedContent('list');
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back to {title}s
          </button>
          <h2 className="text-2xl font-bold">{item.name || item.title}</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-6">{item.explanation || item.description}</p>

          {contentType === 'scenario' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Position</h3>
                <Chessboard
                  position={item.position}
                  boardWidth={400}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Objective</h3>
                <p className="text-gray-700 mb-4">{item.objective}</p>
                <h4 className="font-medium mb-2">Hints:</h4>
                <ul className="space-y-2">
                  {item.hints.map((hint: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {(contentType === 'lesson' || contentType === 'principle') && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {contentType === 'lesson' ? 'Key Principles' : 'Key Concepts'}
              </h3>
              <ul className="space-y-2">
                {(item.principles || item.concepts).map((concept: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  color === 'blue' ? 'bg-blue-600' :
                  color === 'purple' ? 'bg-purple-600' :
                  'bg-orange-600'
                }`}></div>
                    <span className="text-gray-700">{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => handlePracticeStart(item)}
            className={`text-white px-6 py-3 rounded-md transition-colors ${
              color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
              color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            <Play className="inline mr-2" size={20} />
            Practice This {title}
          </button>
        </div>
      </div>
    </div>
  );
  };

  const renderPracticeMode = () => {
    if (!isPracticing) return null;

    const currentStepData = tutorialSteps[currentStep];
    const isLastStep = currentStep === tutorialSteps.length - 1;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Interactive Tutorial</h2>
            <button
              onClick={() => setIsPracticing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Chessboard
                position={game.fen()}
                boardWidth={400}
                onPieceDrop={tutorialMode ? handleTutorialMove : handleMove}
                customBoardStyle={{
                  borderRadius: '4px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
            <div className="space-y-4">
              {/* Tutorial Progress */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-blue-800">Step {currentStep + 1} of {tutorialSteps.length}</h3>
                  <div className="text-sm text-blue-600">
                    {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}% Complete
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Step */}
              {currentStepData && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
                  <p className="text-gray-700 mb-4">{currentStepData.content}</p>
                  
                  {/* Render step-specific content */}
                  {currentStepData.type === 'principles' && (
                    <ul className="space-y-2 mb-4">
                      {currentStepData.content.map((principle: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{principle}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {currentStepData.type === 'hints' && (
                    <ul className="space-y-2 mb-4">
                      {currentStepData.content.map((hint: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{hint}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {currentStepData.type === 'concepts' && (
                    <ul className="space-y-2 mb-4">
                      {currentStepData.content.map((concept: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{concept}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {currentStepData.type === 'examples' && (
                    <ul className="space-y-2 mb-4">
                      {currentStepData.content.map((example: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 font-mono">{example}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-800">{currentStepData.action}</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {isLastStep ? 'Complete' : 'Next'}
                </button>
              </div>

              {/* Practice Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{Math.floor((Date.now() - startTime) / 1000)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moves Made:</span>
                    <span>{totalMoves}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!showSummary || !summaryData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="text-center">
            <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-4">Tutorial Complete!</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Time Taken:</span>
                <span className="font-semibold">{summaryData.timeTaken}s</span>
              </div>
              <div className="flex justify-between">
                <span>Moves Made:</span>
                <span className="font-semibold">{summaryData.totalMoves}</span>
              </div>
              <div className="flex justify-between">
                <span>Correct Moves:</span>
                <span className="font-semibold">{summaryData.correctMoves}</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate:</span>
                <span className="font-semibold">{summaryData.completionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Hints Used:</span>
                <span className="font-semibold">{summaryData.hintsUsed}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSummary(false);
                setSummaryData(null);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
          <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <Home size={20} />
                Home
          </button>
              <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
            </div>
            <div className="flex items-center gap-2">
          <button
                onClick={() => setView('map')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800"
                title="Chapter Map"
              >
                <Map size={16} />
                Map
          </button>
          <button
                onClick={() => {
                  storageService.resetProgress();
                  setProgress(storageService.getProgress());
                }}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800"
                title="Reset Progress"
              >
                <RotateCcw size={16} />
                Reset
          </button>
            </div>
          </div>
        </div>
        </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'map' ? renderChapterMap() : renderChapterContent()}
        {renderContentList()}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Enter Chapter Password</h3>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            {passwordError && (
              <p className="text-red-600 text-sm mb-4">{passwordError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => handlePasswordUnlock(selectedChapter, password)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Unlock
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setPasswordError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {renderPracticeMode()}
      {renderSummary()}
    </div>
  );
}