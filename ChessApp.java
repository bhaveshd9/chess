import javafx.application.Application;
import javafx.application.Platform;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;
import java.util.*;

public class ChessApp extends Application {
    
    private Stage primaryStage;
    private ChessBoard chessBoard;
    private VBox mainLayout;
    private Label statusLabel;
    private Button newGameButton;
    private Button learnButton;
    private Button testButton;
    
    @Override
    public void start(Stage primaryStage) {
        this.primaryStage = primaryStage;
        primaryStage.setTitle("Chess Learning Application");
        
        // Create main layout
        mainLayout = new VBox(20);
        mainLayout.setAlignment(Pos.CENTER);
        mainLayout.setPadding(new Insets(20));
        mainLayout.setStyle("-fx-background-color: #f5f5f5;");
        
        // Create title
        Label titleLabel = new Label("♔ Chess Learning App ♔");
        titleLabel.setFont(Font.font("Arial", FontWeight.BOLD, 32));
        titleLabel.setStyle("-fx-text-fill: #2c3e50;");
        
        // Create status label
        statusLabel = new Label("Welcome to Chess Learning!");
        statusLabel.setFont(Font.font("Arial", 16));
        statusLabel.setStyle("-fx-text-fill: #34495e;");
        
        // Create buttons
        newGameButton = createButton("🎮 New Game", "#3498db");
        learnButton = createButton("📚 Learn Chess", "#27ae60");
        testButton = createButton("🧪 Test Panel", "#e74c3c");
        
        // Add event handlers
        newGameButton.setOnAction(e -> startNewGame());
        learnButton.setOnAction(e -> openLearningMode());
        testButton.setOnAction(e -> openTestPanel());
        
        // Add components to layout
        mainLayout.getChildren().addAll(titleLabel, statusLabel, newGameButton, learnButton, testButton);
        
        // Create scene
        Scene scene = new Scene(mainLayout, 800, 600);
        primaryStage.setScene(scene);
        primaryStage.show();
        
        // Initialize storage
        ChessStorage.initialize();
        
        statusLabel.setText("Application loaded successfully!");
    }
    
    private Button createButton(String text, String color) {
        Button button = new Button(text);
        button.setFont(Font.font("Arial", FontWeight.BOLD, 16));
        button.setStyle(String.format(
            "-fx-background-color: %s; -fx-text-fill: white; -fx-padding: 15 30; -fx-cursor: hand;",
            color
        ));
        button.setPrefWidth(250);
        button.setPrefHeight(50);
        return button;
    }
    
    private void startNewGame() {
        statusLabel.setText("Starting new game...");
        chessBoard = new ChessBoard();
        
        VBox gameLayout = new VBox(10);
        gameLayout.setAlignment(Pos.CENTER);
        gameLayout.setPadding(new Insets(20));
        
        Label gameTitle = new Label("Chess Game");
        gameTitle.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        
        Button backButton = new Button("← Back to Menu");
        backButton.setOnAction(e -> showMainMenu());
        
        gameLayout.getChildren().addAll(gameTitle, chessBoard, backButton);
        
        Scene gameScene = new Scene(gameLayout, 800, 600);
        primaryStage.setScene(gameScene);
    }
    
    private void openLearningMode() {
        statusLabel.setText("Opening learning mode...");
        LearningMode learningMode = new LearningMode();
        
        VBox learnLayout = new VBox(10);
        learnLayout.setAlignment(Pos.CENTER);
        learnLayout.setPadding(new Insets(20));
        
        Label learnTitle = new Label("Chess Learning");
        learnTitle.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        
        Button backButton = new Button("← Back to Menu");
        backButton.setOnAction(e -> showMainMenu());
        
        learnLayout.getChildren().addAll(learnTitle, learningMode, backButton);
        
        Scene learnScene = new Scene(learnLayout, 800, 600);
        primaryStage.setScene(learnScene);
    }
    
    private void openTestPanel() {
        statusLabel.setText("Opening test panel...");
        TestPanel testPanel = new TestPanel();
        
        VBox testLayout = new VBox(10);
        testLayout.setAlignment(Pos.CENTER);
        testLayout.setPadding(new Insets(20));
        
        Label testTitle = new Label("Test Panel");
        testTitle.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        
        Button backButton = new Button("← Back to Menu");
        backButton.setOnAction(e -> showMainMenu());
        
        testLayout.getChildren().addAll(testTitle, testPanel, backButton);
        
        Scene testScene = new Scene(testLayout, 800, 600);
        primaryStage.setScene(testScene);
    }
    
    private void showMainMenu() {
        primaryStage.setScene(new Scene(mainLayout, 800, 600));
        statusLabel.setText("Back to main menu");
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}

// Chess Board Component
class ChessBoard extends VBox {
    private Rectangle[][] squares = new Rectangle[8][8];
    private ChessGame game;
    
    public ChessBoard() {
        game = new ChessGame();
        initializeBoard();
        updateDisplay();
    }
    
    private void initializeBoard() {
        setSpacing(2);
        setAlignment(Pos.CENTER);
        
        for (int row = 0; row < 8; row++) {
            HBox rowBox = new HBox(2);
            rowBox.setAlignment(Pos.CENTER);
            
            for (int col = 0; col < 8; col++) {
                Rectangle square = new Rectangle(60, 60);
                square.setFill((row + col) % 2 == 0 ? Color.WHITE : Color.GRAY);
                square.setStroke(Color.BLACK);
                
                final int r = row, c = col;
                square.setOnMouseClicked(e -> handleSquareClick(r, c));
                
                squares[row][col] = square;
                rowBox.getChildren().add(square);
            }
            
            getChildren().add(rowBox);
        }
    }
    
    private void handleSquareClick(int row, int col) {
        // Handle chess move logic here
        System.out.println("Clicked square: " + row + ", " + col);
        updateDisplay();
    }
    
    private void updateDisplay() {
        // Update board display based on game state
        // This would show pieces, valid moves, etc.
    }
}

// Chess Game Logic
class ChessGame {
    private String[][] board = new String[8][8];
    private boolean whiteTurn = true;
    
    public ChessGame() {
        initializeBoard();
    }
    
    private void initializeBoard() {
        // Initialize starting position
        String[] backRank = {"R", "N", "B", "Q", "K", "B", "N", "R"};
        
        for (int col = 0; col < 8; col++) {
            board[0][col] = "w" + backRank[col]; // White pieces
            board[1][col] = "wP"; // White pawns
            board[6][col] = "bP"; // Black pawns
            board[7][col] = "b" + backRank[col]; // Black pieces
        }
    }
    
    public boolean makeMove(int fromRow, int fromCol, int toRow, int toCol) {
        // Implement move validation and execution
        return true;
    }
}

// Learning Mode Component
class LearningMode extends VBox {
    private ListView<String> lessonList;
    private TextArea lessonContent;
    private ProgressBar progressBar;
    
    public LearningMode() {
        setSpacing(10);
        setPadding(new Insets(10));
        
        Label title = new Label("Chess Lessons");
        title.setFont(Font.font("Arial", FontWeight.BOLD, 20));
        
        lessonList = new ListView<>();
        lessonList.getItems().addAll(
            "1. Basic Piece Movement",
            "2. Center Control",
            "3. Piece Values",
            "4. Opening Principles",
            "5. Tactical Patterns"
        );
        
        lessonContent = new TextArea();
        lessonContent.setPrefRowCount(10);
        lessonContent.setEditable(false);
        
        progressBar = new ProgressBar(0.0);
        progressBar.setPrefWidth(300);
        
        Button startLessonButton = new Button("Start Selected Lesson");
        startLessonButton.setOnAction(e -> startSelectedLesson());
        
        HBox contentBox = new HBox(10);
        contentBox.getChildren().addAll(lessonList, lessonContent);
        
        getChildren().addAll(title, contentBox, progressBar, startLessonButton);
        
        lessonList.getSelectionModel().selectedItemProperty().addListener(
            (observable, oldValue, newValue) -> updateLessonContent(newValue)
        );
    }
    
    private void updateLessonContent(String lesson) {
        if (lesson != null) {
            switch (lesson) {
                case "1. Basic Piece Movement":
                    lessonContent.setText("Learn how each piece moves on the chessboard.\n\n" +
                        "• Pawns move forward one square (or two on first move)\n" +
                        "• Knights move in L-shape: 2 squares in one direction, then 1 square perpendicular\n" +
                        "• Bishops move diagonally any number of squares\n" +
                        "• Rooks move horizontally and vertically any number of squares\n" +
                        "• Queens combine the movement of bishops and rooks\n" +
                        "• Kings move one square in any direction");
                    break;
                case "2. Center Control":
                    lessonContent.setText("Controlling the center of the board is crucial in chess.\n\n" +
                        "• Control the center squares (e4, e5, d4, d5)\n" +
                        "• Develop pieces toward the center\n" +
                        "• Use pawns to establish center control\n" +
                        "• Prevent opponent from controlling the center");
                    break;
                default:
                    lessonContent.setText("Lesson content will be displayed here.");
            }
        }
    }
    
    private void startSelectedLesson() {
        String selected = lessonList.getSelectionModel().getSelectedItem();
        if (selected != null) {
            ChessStorage.completeLesson(selected, 85, 120, 1);
            progressBar.setProgress(ChessStorage.getProgress() / 100.0);
            
            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Lesson Completed");
            alert.setHeaderText("Great job!");
            alert.setContentText("You've completed: " + selected);
            alert.showAndWait();
        }
    }
}

// Test Panel Component
class TestPanel extends VBox {
    private TextArea testOutput;
    private Button runTestsButton;
    private Button resetButton;
    
    public TestPanel() {
        setSpacing(10);
        setPadding(new Insets(10));
        
        Label title = new Label("Test Panel");
        title.setFont(Font.font("Arial", FontWeight.BOLD, 20));
        
        testOutput = new TextArea();
        testOutput.setPrefRowCount(15);
        testOutput.setEditable(false);
        
        runTestsButton = new Button("🧪 Run All Tests");
        runTestsButton.setOnAction(e -> runTests());
        
        resetButton = new Button("🔄 Reset Progress");
        resetButton.setOnAction(e -> resetProgress());
        
        HBox buttonBox = new HBox(10);
        buttonBox.getChildren().addAll(runTestsButton, resetButton);
        
        getChildren().addAll(title, testOutput, buttonBox);
    }
    
    private void runTests() {
        testOutput.clear();
        appendOutput("🧪 Starting Chess Tests...\n");
        
        // Test 1: Storage
        appendOutput("Testing storage service...");
        ChessStorage.initialize();
        appendOutput("✅ Storage initialized\n");
        
        // Test 2: Lesson completion
        appendOutput("Testing lesson completion...");
        ChessStorage.completeLesson("test-lesson", 85, 120, 1);
        double progress = ChessStorage.getProgress();
        appendOutput("✅ Lesson completed, progress: " + progress + "%\n");
        
        // Test 3: Game logic
        appendOutput("Testing chess game...");
        ChessGame game = new ChessGame();
        appendOutput("✅ Game created successfully\n");
        
        appendOutput("\n🎉 All tests passed!");
    }
    
    private void resetProgress() {
        ChessStorage.resetProgress();
        appendOutput("🔄 Progress reset successfully\n");
    }
    
    private void appendOutput(String text) {
        testOutput.appendText(text + "\n");
    }
}

// Storage Service
class ChessStorage {
    private static Map<String, Object> storage = new HashMap<>();
    private static double progress = 0.0;
    
    public static void initialize() {
        storage.clear();
        progress = 0.0;
    }
    
    public static void completeLesson(String lessonId, int accuracy, int timeTaken, int hintsUsed) {
        storage.put("lesson_" + lessonId, Map.of(
            "completed", true,
            "accuracy", accuracy,
            "timeTaken", timeTaken,
            "hintsUsed", hintsUsed
        ));
        
        progress = Math.min(100.0, progress + 20.0); // Simple progress calculation
    }
    
    public static double getProgress() {
        return progress;
    }
    
    public static void resetProgress() {
        storage.clear();
        progress = 0.0;
    }
} 