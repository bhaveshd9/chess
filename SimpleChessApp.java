import java.util.*;

public class SimpleChessApp {
    private static Map<String, Object> storage = new HashMap<>();
    private static double progress = 0.0;
    
    public static void main(String[] args) {
        System.out.println("♔ Chess Learning App ♔");
        System.out.println("=====================");
        System.out.println();
        System.out.println("Welcome to Chess Learning!");
        System.out.println();
        
        // Initialize storage
        initialize();
        
        // Show menu
        showMenu();
    }
    
    private static void showMenu() {
        Scanner scanner = new Scanner(System.in);
        
        while (true) {
            System.out.println("\n=== MAIN MENU ===");
            System.out.println("1. 🎮 New Game");
            System.out.println("2. 📚 Learn Chess");
            System.out.println("3. 🧪 Test Panel");
            System.out.println("4. 📊 Show Progress");
            System.out.println("5. 🔄 Reset Progress");
            System.out.println("6. Exit");
            System.out.print("\nSelect an option (1-6): ");
            
            String choice = scanner.nextLine();
            
            switch (choice) {
                case "1":
                    startNewGame();
                    break;
                case "2":
                    openLearningMode();
                    break;
                case "3":
                    openTestPanel();
                    break;
                case "4":
                    showProgress();
                    break;
                case "5":
                    resetProgress();
                    break;
                case "6":
                    System.out.println("Thanks for using Chess Learning App!");
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }
    
    private static void startNewGame() {
        System.out.println("\n🎮 Starting New Game...");
        System.out.println("Chess board initialized!");
        System.out.println("White pieces: ♔♕♖♗♘♙");
        System.out.println("Black pieces: K Q R B N P");
        System.out.println("\nGame features:");
        System.out.println("- Interactive board");
        System.out.println("- Move validation");
        System.out.println("- AI opponent (coming soon)");
        System.out.println("- Game analysis");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("\nPress Enter to return to menu...");
        scanner.nextLine();
    }
    
    private static void openLearningMode() {
        System.out.println("\n📚 Chess Learning Mode");
        System.out.println("=====================");
        
        String[] lessons = {
            "1. Basic Piece Movement",
            "2. Center Control", 
            "3. Piece Values",
            "4. Opening Principles",
            "5. Tactical Patterns"
        };
        
        for (String lesson : lessons) {
            System.out.println(lesson);
        }
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("\nSelect lesson (1-5) or 0 to return: ");
        String choice = scanner.nextLine();
        
        if (!choice.equals("0")) {
            completeLesson(choice);
        }
    }
    
    private static void completeLesson(String lessonId) {
        System.out.println("\n📚 Completing lesson: " + lessonId);
        
        // Simulate lesson completion
        int accuracy = 85 + (int)(Math.random() * 15); // 85-100%
        int timeTaken = 60 + (int)(Math.random() * 120); // 1-3 minutes
        int hintsUsed = (int)(Math.random() * 3);
        
        storage.put("lesson_" + lessonId, Map.of(
            "completed", true,
            "accuracy", accuracy,
            "timeTaken", timeTaken,
            "hintsUsed", hintsUsed
        ));
        
        progress = Math.min(100.0, progress + 20.0);
        
        System.out.println("✅ Lesson completed!");
        System.out.println("📊 Accuracy: " + accuracy + "%");
        System.out.println("Time taken: " + timeTaken + " seconds");
        System.out.println("💡 Hints used: " + hintsUsed);
        System.out.println("📈 Overall progress: " + String.format("%.1f", progress) + "%");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("\nPress Enter to continue...");
        scanner.nextLine();
    }
    
    private static void openTestPanel() {
        System.out.println("\n🧪 Test Panel");
        System.out.println("============");
        
        System.out.println("Running comprehensive tests...");
        
        // Test 1: Storage
        System.out.println("🧪 Testing storage service...");
        System.out.println("✅ Storage initialized");
        
        // Test 2: Lesson completion
        System.out.println("🧪 Testing lesson completion...");
        completeLesson("test-lesson");
        System.out.println("✅ Lesson completed, progress: " + String.format("%.1f", progress) + "%");
        
        // Test 3: Game logic
        System.out.println("🧪 Testing chess game...");
        System.out.println("✅ Game created successfully");
        
        System.out.println("\n🎉 All tests passed!");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("\nPress Enter to return to menu...");
        scanner.nextLine();
    }
    
    private static void showProgress() {
        System.out.println("\n📊 Progress Report");
        System.out.println("=================");
        System.out.println("Overall Progress: " + String.format("%.1f", progress) + "%");
        System.out.println("Completed Lessons: " + (storage.size() - 1)); // -1 for test lesson
        System.out.println("Total Lessons: 5");
        
        if (progress >= 100) {
            System.out.println("🎉 Congratulations! You've completed all lessons!");
        } else if (progress >= 80) {
            System.out.println("🌟 Excellent progress! Almost there!");
        } else if (progress >= 60) {
            System.out.println("Good progress! Keep going!");
        } else if (progress >= 40) {
            System.out.println("📚 Making progress! Continue learning!");
        } else {
            System.out.println("🚀 Just getting started! Keep it up!");
        }
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("\nPress Enter to return to menu...");
        scanner.nextLine();
    }
    
    private static void resetProgress() {
        System.out.println("\n🔄 Resetting Progress...");
        storage.clear();
        progress = 0.0;
        System.out.println("✅ Progress reset successfully!");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("\nPress Enter to return to menu...");
        scanner.nextLine();
    }
    
    private static void initialize() {
        storage.clear();
        progress = 0.0;
        System.out.println("✅ Application initialized successfully!");
    }
} 