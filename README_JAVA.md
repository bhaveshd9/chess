# Chess Learning Application - Java Version

A desktop chess learning application built with JavaFX that provides chess lessons, game play, and progress tracking.

## Features

- **Chess Game**: Interactive chess board with move validation
- **Learning Mode**: Structured lessons covering chess fundamentals
- **Progress Tracking**: Save and track your learning progress
- **Test Panel**: Built-in testing and debugging tools
- **Modern UI**: Clean, intuitive interface using JavaFX

## Prerequisites

- Java 17 or higher
- Gradle (optional, for build automation)

## Installation & Running

### Option 1: Using Gradle (Recommended)

1. **Clone or download the project**
2. **Open terminal/command prompt in the project directory**
3. **Run the application:**
   ```bash
   # On Windows
   gradlew.bat run
   
   # On macOS/Linux
   ./gradlew run
   ```

### Option 2: Manual Compilation

1. **Compile the Java files:**
   ```bash
   javac --module-path /path/to/javafx-sdk/lib --add-modules javafx.controls,javafx.fxml ChessApp.java
   ```

2. **Run the application:**
   ```bash
   java --module-path /path/to/javafx-sdk/lib --add-modules javafx.controls,javafx.fxml ChessApp
   ```

### Option 3: Using IDE

1. **Open the project in your preferred IDE** (IntelliJ IDEA, Eclipse, VS Code)
2. **Ensure JavaFX is configured** in your IDE
3. **Run the `ChessApp` class**

## How to Use

### Main Menu
- **🎮 New Game**: Start a new chess game
- **📚 Learn Chess**: Access chess lessons
- **🧪 Test Panel**: Run tests and debug features

### Learning Mode
1. Select a lesson from the list
2. Read the lesson content
3. Click "Start Selected Lesson" to mark as completed
4. Track your progress with the progress bar

### Test Panel
- **Run All Tests**: Execute comprehensive tests
- **Reset Progress**: Clear all saved progress
- View test results in the output area

## Project Structure

```
├── ChessApp.java          # Main application class
├── build.gradle           # Gradle build configuration
├── README_JAVA.md         # This file
└── src/                   # Source files (if using standard structure)
    └── main/
        └── java/
            └── ChessApp.java
```

## Features Implemented

### ✅ Completed
- Main application framework
- Chess board visualization
- Learning mode with lessons
- Progress tracking system
- Test panel functionality
- Modern UI with JavaFX

### 🔄 In Progress
- Full chess move validation
- AI opponent
- Advanced lessons
- Persistent storage

### 📋 Planned
- Online multiplayer
- Advanced tactics training
- Opening database
- Game analysis tools

## Troubleshooting

### Common Issues

1. **JavaFX not found**
   - Ensure you have Java 17+ installed
   - Download JavaFX SDK if needed
   - Use Gradle for automatic dependency management

2. **Application won't start**
   - Check Java version: `java -version`
   - Verify JavaFX modules are available
   - Check console for error messages

3. **Gradle build fails**
   - Update Gradle version
   - Clear Gradle cache: `gradlew clean`
   - Check internet connection for dependencies

### System Requirements

- **OS**: Windows 10+, macOS 10.14+, or Linux
- **Java**: Version 17 or higher
- **Memory**: 512MB RAM minimum
- **Storage**: 50MB free space

## Development

### Building from Source

```bash
# Clone the repository
git clone <repository-url>
cd chess-app

# Build the project
./gradlew build

# Run tests
./gradlew test

# Create executable JAR
./gradlew jar
```

### Adding New Features

1. **New Lessons**: Add to `LearningMode` class
2. **Game Logic**: Extend `ChessGame` class
3. **UI Components**: Create new JavaFX components
4. **Storage**: Extend `ChessStorage` class

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Review console output for error messages
- Create an issue in the repository

---

**Note**: This Java version provides the same core functionality as the React version but as a desktop application. Choose the version that best fits your needs and platform requirements. 