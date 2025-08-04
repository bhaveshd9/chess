import React from 'react';
import { Lock, CheckCircle, ArrowRight, Key } from 'lucide-react';
import { Chapter } from '../types/chess';
import { PlayerProgress } from '../utils/storageService';

interface ChapterMapProps {
  chapters: Chapter[];
  progress: PlayerProgress;
  onChapterSelect: (chapterId: number) => void;
  onPasswordUnlock: (chapterId: number, password: string) => void;
}

export default function ChapterMap({ 
  chapters, 
  progress, 
  onChapterSelect, 
  onPasswordUnlock 
}: ChapterMapProps) {
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [selectedChapter, setSelectedChapter] = React.useState<number>(0);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const handleChapterClick = (chapter: Chapter) => {
    const isUnlocked = progress.userProgress.currentChapter >= chapter.id || 
                      progress.userProgress.chapterPasswords.includes(chapter.password);
    
    if (isUnlocked) {
      onChapterSelect(chapter.id);
    } else if (chapter.id > 1) {
      // Check if previous chapter is completed
      const previousChapterProgress = progress.chapterProgress[chapter.id - 1];
      
      if (previousChapterProgress?.completed) {
        // Show password modal for manual input
        setSelectedChapter(chapter.id);
        setPassword(''); // Don't pre-fill the password
        setShowPasswordModal(true);
      } else {
        // Show message to complete previous chapter first
        const previousChapter = chapters.find(c => c.id === chapter.id - 1);
        alert(`Please complete ${previousChapter?.title} first to unlock this chapter.`);
      }
    }
  };

  const handlePasswordSubmit = () => {
    const chapter = chapters.find(c => c.id === selectedChapter);
    if (chapter && chapter.password === password) {
      onPasswordUnlock(selectedChapter, password);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Invalid password');
    }
  };

  return (
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
              onClick={() => handleChapterClick(chapter)}
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
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Unlock Chapter</h3>
            <p className="text-gray-600 mb-4">
              Enter the password to unlock this chapter. You should have received this password after completing the previous chapter.
            </p>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter chapter password..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Unlock Chapter
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Don't have the password? Complete the previous chapter to receive it.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 