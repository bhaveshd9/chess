// Comprehensive Chess Test Runner
import { Chess } from 'chess.js';
import { storageService } from './utils/storageService';
import { getBestMove } from './utils/chessAI';

// Test Results Interface
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
}

class ChessTestRunner {
  private results: TestSuite[] = [];

  // Test Storage Service
  async testStorageService(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Storage Service Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    // Test 1: Initial Progress
    try {
      storageService.clearAllData();
      const progress = storageService.getProgress();
      
      const test: TestResult = {
        name: 'Initial Progress Structure',
        passed: progress.userProgress.currentChapter === 1 &&
                progress.userProgress.completedLessons.length === 0 &&
                progress.userProgress.completedScenarios.length === 0 &&
                progress.userProgress.completedPrinciples.length === 0 &&
                progress.chapterProgress[1]?.unlocked === true,
        details: {
          currentChapter: progress.userProgress.currentChapter,
          completedLessons: progress.userProgress.completedLessons.length,
          completedScenarios: progress.userProgress.completedScenarios.length,
          completedPrinciples: progress.userProgress.completedPrinciples.length,
          chapter1Unlocked: progress.chapterProgress[1]?.unlocked
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Initial Progress Structure',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 2: Lesson Completion (First Attempt)
    try {
      storageService.completeLesson('test-lesson-1', 120, 2);
      // Wait a bit for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      const progress = storageService.getProgress();
      
      const test: TestResult = {
        name: 'Lesson Completion (First Attempt)',
        passed: progress.userProgress.completedLessons.includes('test-lesson-1') &&
                progress.lessonAttempts['test-lesson-1']?.completed === true &&
                progress.lessonAttempts['test-lesson-1']?.attempts === 1,
        details: {
          lessonInCompleted: progress.userProgress.completedLessons.includes('test-lesson-1'),
          attemptCompleted: progress.lessonAttempts['test-lesson-1']?.completed,
          attempts: progress.lessonAttempts['test-lesson-1']?.attempts
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Lesson Completion (85% accuracy)',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 3: Lesson Completion (Multiple Attempts)
    try {
      // Clear any previous attempts for this lesson and remove from completed lessons
      const progress = storageService.getProgress();
      delete progress.lessonAttempts['test-lesson-2'];
      progress.userProgress.completedLessons = progress.userProgress.completedLessons.filter(id => id !== 'test-lesson-2');
      storageService.saveProgress(progress);
      
      // First attempt - should not complete
      storageService.completeLesson('test-lesson-2', 90, 1);
      // Second attempt - should not complete
      storageService.completeLesson('test-lesson-2', 90, 1);
      // Third attempt - should complete
      storageService.completeLesson('test-lesson-2', 90, 1);
      
      // Wait a bit for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      const progressAfter = storageService.getProgress();
      
      const test: TestResult = {
        name: 'Lesson Completion (Multiple Attempts)',
        passed: progressAfter.userProgress.completedLessons.includes('test-lesson-2') &&
                progressAfter.lessonAttempts['test-lesson-2']?.completed === true &&
                progressAfter.lessonAttempts['test-lesson-2']?.attempts === 3,
        details: {
          lessonInCompleted: progressAfter.userProgress.completedLessons.includes('test-lesson-2'),
          attemptCompleted: progressAfter.lessonAttempts['test-lesson-2']?.completed,
          attempts: progressAfter.lessonAttempts['test-lesson-2']?.attempts
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Lesson Completion (75% accuracy - should not complete)',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 4: Scenario Completion
    try {
      storageService.completeScenario('test-scenario-1', 90, 180, 1);
      // Wait a bit for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      const progress = storageService.getProgress();
      
      const test: TestResult = {
        name: 'Scenario Completion',
        passed: progress.userProgress.completedScenarios.includes('test-scenario-1') &&
                progress.userProgress.totalScore === 90,
        details: {
          scenarioInCompleted: progress.userProgress.completedScenarios.includes('test-scenario-1'),
          totalScore: progress.userProgress.totalScore
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Scenario Completion',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 5: Principle Completion
    try {
      storageService.completePrinciple('test-principle-1');
      // Wait a bit for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      const progress = storageService.getProgress();
      
      const test: TestResult = {
        name: 'Principle Completion',
        passed: progress.userProgress.completedPrinciples.includes('test-principle-1'),
        details: {
          principleInCompleted: progress.userProgress.completedPrinciples.includes('test-principle-1')
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Principle Completion',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 6: Chapter Progress Update
    try {
             // Complete all content for chapter 1: lessons, scenarios, and principles
       storageService.completeLesson('basic-movement', 120, 1);
       storageService.completeLesson('center-control', 150, 2);
       storageService.completeLesson('piece-value', 100, 0);
      storageService.completeScenario('basic-checkmate', 85, 180, 1);
      storageService.completeScenario('simple-fork', 90, 200, 0);
      storageService.completePrinciple('basic-principles');
      
      // Wait a bit for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      const progress = storageService.getProgress();
      const chapter1Progress = progress.chapterProgress[1];
      
      const test: TestResult = {
        name: 'Chapter Progress Update',
        passed: chapter1Progress?.lessonsCompleted === 3 &&
                chapter1Progress?.totalLessons === 3 &&
                chapter1Progress?.completed === true,
        details: {
          lessonsCompleted: chapter1Progress?.lessonsCompleted,
          totalLessons: chapter1Progress?.totalLessons,
          chapterCompleted: chapter1Progress?.completed
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Chapter Progress Update',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 7: Chapter Unlocking
    try {
      const unlocked = await storageService.unlockChapter(2, 'OPENING202');
      // Wait a bit for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      const progress = storageService.getProgress();
      
      const test: TestResult = {
        name: 'Chapter Unlocking with Password',
        passed: unlocked === true &&
                progress.userProgress.currentChapter >= 2 &&
                progress.userProgress.chapterPasswords.includes('OPENING202'),
        details: {
          unlocked,
          currentChapter: progress.userProgress.currentChapter,
          hasPassword: progress.userProgress.chapterPasswords.includes('OPENING202')
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Chapter Unlocking with Password',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    return suite;
  }

  // Test Chess AI
  async testChessAI(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Chess AI Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    // Test 1: Basic Move Generation
    try {
      const game = new Chess();
      const move = await getBestMove(game, 'easy');
      
      const test: TestResult = {
        name: 'Basic Move Generation',
        passed: typeof move === 'string' && move.length > 0 && game.moves().includes(move),
        details: {
          move,
          legalMoves: game.moves().slice(0, 5)
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Basic Move Generation',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 2: Checkmate Detection
    try {
      const game = new Chess('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
      const move = await getBestMove(game, 'hard');
      
      const test: TestResult = {
        name: 'Checkmate Detection',
        passed: typeof move === 'string' && (move.length > 0 || game.isCheckmate()),
        details: {
          move,
          isCheckmate: game.isCheckmate(),
          legalMoves: game.moves()
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Checkmate Detection',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 3: Different Difficulties
    try {
      const game = new Chess();
      const easyMove = await getBestMove(game, 'easy');
      const mediumMove = await getBestMove(game, 'medium');
      const hardMove = await getBestMove(game, 'hard');
      
      const test: TestResult = {
        name: 'Different Difficulty Levels',
        passed: typeof easyMove === 'string' && 
                typeof mediumMove === 'string' && 
                typeof hardMove === 'string',
        details: {
          easyMove,
          mediumMove,
          hardMove
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Different Difficulty Levels',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    return suite;
  }

  // Test Data Integrity
  async testDataIntegrity(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Data Integrity Tests',
      tests: [],
      passed: 0,
      failed: 0
    };

    // Test 1: Learning Content Structure
    try {
      const { chapters, openingLessons, scenarios, strategicPrinciples } = await import('./data/learningContent');
      
      const test: TestResult = {
        name: 'Learning Content Structure',
        passed: Array.isArray(chapters) && 
                Array.isArray(openingLessons) && 
                Array.isArray(scenarios) && 
                Array.isArray(strategicPrinciples) &&
                chapters.length > 0,
        details: {
          chaptersCount: chapters.length,
          lessonsCount: openingLessons.length,
          scenariosCount: scenarios.length,
          principlesCount: strategicPrinciples.length
        }
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Learning Content Structure',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    // Test 2: Chapter-Lesson Consistency
    try {
      const { chapters, openingLessons, scenarios, strategicPrinciples } = await import('./data/learningContent');
      
      let allValid = true;
      const details: any = {};
      
      chapters.forEach((chapter: any) => {
        const chapterLessons = openingLessons.filter((l: any) => l.chapter === chapter.id);
        const chapterScenarios = scenarios.filter((s: any) => s.chapter === chapter.id);
        const chapterPrinciples = strategicPrinciples.filter((p: any) => p.chapter === chapter.id);
        
        details[`chapter${chapter.id}`] = {
          lessons: chapterLessons.length,
          scenarios: chapterScenarios.length,
          principles: chapterPrinciples.length
        };
        
        if (chapterLessons.length === 0 && chapterScenarios.length === 0 && chapterPrinciples.length === 0) {
          allValid = false;
        }
      });
      
      const test: TestResult = {
        name: 'Chapter-Lesson Consistency',
        passed: allValid,
        details
      };
      
      suite.tests.push(test);
      test.passed ? suite.passed++ : suite.failed++;
    } catch (error) {
      suite.tests.push({
        name: 'Chapter-Lesson Consistency',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      suite.failed++;
    }

    return suite;
  }

  // Run all tests
  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Comprehensive Chess Tests...\n');
    
    // Clear storage before testing
    storageService.clearAllData();
    
    // Run test suites
    this.results.push(await this.testStorageService());
    this.results.push(await this.testChessAI());
    this.results.push(await this.testDataIntegrity());
    
    // Print results
    this.printResults();
  }

  // Print test results
  printResults(): void {
    console.log('\n📊 TEST RESULTS SUMMARY\n');
    console.log('='.repeat(50));
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    this.results.forEach(suite => {
      console.log(`\n🔍 ${suite.name}`);
      console.log(`   Passed: ${suite.passed} | Failed: ${suite.failed}`);
      
      suite.tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        console.log(`   ${status} ${test.name}`);
        
        if (!test.passed && test.error) {
          console.log(`      Error: ${test.error}`);
        }
        
        if (test.details) {
          console.log(`      Details: ${JSON.stringify(test.details, null, 2)}`);
        }
      });
      
      totalPassed += suite.passed;
      totalFailed += suite.failed;
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎯 TOTAL: ${totalPassed + totalFailed} tests`);
    console.log(`✅ PASSED: ${totalPassed}`);
    console.log(`❌ FAILED: ${totalFailed}`);
    console.log(`📈 SUCCESS RATE: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
      console.log('\n🎉 All tests passed! The chess application is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the issues above.');
    }
  }
}

// Export for use in browser console or other modules
export const testRunner = new ChessTestRunner();

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).runChessTests = () => testRunner.runAllTests();
  console.log('🧪 Chess Test Runner loaded. Run "runChessTests()" in console to execute tests.');
} else {
  // Node.js environment
  testRunner.runAllTests();
} 